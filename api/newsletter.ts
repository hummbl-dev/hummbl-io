/**
 * Newsletter API Endpoint
 * 
 * Handles newsletter subscription requests
 * 
 * @module api/newsletter
 * @version 1.0.0
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import type { NewsletterRequest } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateNewsletterRequest = (body: unknown): body is NewsletterRequest => {
  return (
    typeof body === 'object' &&
    body !== null &&
    'email' in body &&
    typeof body.email === 'string' &&
    validateEmail(body.email)
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
  if (!validateNewsletterRequest(req.body)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request',
      message: 'Please provide a valid email address',
    });
  }

  const { email }: NewsletterRequest = req.body;

  try {
    // Send welcome email via Resend
    // TODO: In production, integrate with newsletter service (Mailchimp, ConvertKit, etc.)
    const { data, error } = await resend.emails.send({
      from: 'HUMMBL Newsletter <newsletter@hummbl.io>',
      to: email,
      subject: 'Welcome to HUMMBL Updates',
      html: `
        <h2>Welcome to HUMMBL!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll receive updates about:</p>
        <ul>
          <li>New mental models and framework expansions</li>
          <li>Practical application examples and case studies</li>
          <li>Framework updates and improvements</li>
          <li>Community insights and contributions</li>
        </ul>
        <p>We're excited to have you on this journey of better thinking!</p>
        <hr>
        <p><small>HUMMBL Systems - 120 mental models for better thinking</small></p>
      `,
      text: `
Welcome to HUMMBL!

Thank you for subscribing to our newsletter.

You'll receive updates about:
- New mental models and framework expansions
- Practical application examples and case studies
- Framework updates and improvements
- Community insights and contributions

We're excited to have you on this journey of better thinking!

---
HUMMBL Systems - 120 mental models for better thinking
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        error: 'Email service error',
        message: 'Failed to subscribe. Please try again later.',
      });
    }

    // Also send notification to team
    await resend.emails.send({
      from: 'HUMMBL Newsletter <newsletter@hummbl.io>',
      to: 'contact@hummbl.io', // TODO: Replace with actual team email
      subject: 'New Newsletter Subscription',
      html: `<p>New subscriber: ${email}</p>`,
      text: `New subscriber: ${email}`,
    });

    console.log('Newsletter subscription:', data?.id, email);

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
    });
  } catch (error) {
    console.error('Newsletter endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}
