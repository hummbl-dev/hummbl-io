/**
 * Feedback API Endpoint
 * 
 * Handles quick feedback submissions
 * 
 * @module api/feedback
 * @version 1.0.0
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import type { FeedbackRequest } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateFeedbackRequest = (body: unknown): body is FeedbackRequest => {
  return (
    typeof body === 'object' &&
    body !== null &&
    'feedback' in body &&
    typeof body.feedback === 'string' &&
    body.feedback.trim().length > 0 &&
    (!('email' in body) || typeof body.email === 'string')
  );
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Only POST requests are allowed',
    });
  }

  // Validate request body
  if (!validateFeedbackRequest(req.body)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request',
      message: 'Please provide feedback text',
    });
  }

  const { feedback, email }: FeedbackRequest = req.body;

  // Validate email if provided
  if (email && !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email',
      message: 'Please provide a valid email address',
    });
  }

  try {
    // Send feedback email via Resend
    const { data, error } = await resend.emails.send({
      from: 'HUMMBL Feedback <feedback@hummbl.io>',
      to: 'feedback@hummbl.io', // TODO: Replace with actual feedback email
      replyTo: email || undefined,
      subject: 'User Feedback from HUMMBL Website',
      html: `
        <h2>New Feedback Submission</h2>
        ${email ? `<p><strong>From:</strong> ${email}</p>` : '<p><em>Anonymous feedback</em></p>'}
        <p><strong>Feedback:</strong></p>
        <p>${feedback.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted from HUMMBL website feedback button</em></p>
      `,
      text: `
New Feedback Submission

${email ? `From: ${email}` : 'Anonymous feedback'}

Feedback:
${feedback}

---
Submitted from HUMMBL website feedback button
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        error: 'Email service error',
        message: 'Failed to send feedback. Please try again later.',
      });
    }

    console.log('Feedback submitted:', data?.id, email || 'anonymous');

    return res.status(200).json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    console.error('Feedback endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}
