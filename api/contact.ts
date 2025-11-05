/**
 * Contact API Endpoint
 * 
 * Handles contact form submissions and sends emails via Resend
 * 
 * @module api/contact
 * @version 1.0.0
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import type { ContactRequest } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateContactRequest = (body: unknown): body is ContactRequest => {
  return (
    typeof body === 'object' &&
    body !== null &&
    'name' in body &&
    'email' in body &&
    'message' in body &&
    typeof body.name === 'string' &&
    body.name.trim().length > 0 &&
    typeof body.email === 'string' &&
    validateEmail(body.email) &&
    typeof body.message === 'string' &&
    body.message.trim().length >= 10
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
  if (!validateContactRequest(req.body)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request',
      message: 'Please provide valid name, email, and message (minimum 10 characters)',
    });
  }

  const { name, email, message }: ContactRequest = req.body;

  try {
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'HUMMBL Contact <contact@hummbl.io>',
      to: 'contact@hummbl.io', // TODO: Replace with actual contact email
      replyTo: email,
      subject: `Contact Form: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This message was sent from the HUMMBL website contact form.</em></p>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the HUMMBL website contact form.
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        error: 'Email service error',
        message: 'Failed to send message. Please try again later.',
      });
    }

    console.log('Contact email sent:', data?.id);

    return res.status(200).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
    });
  } catch (error) {
    console.error('Contact endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}
