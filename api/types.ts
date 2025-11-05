/**
 * API Types
 * 
 * Type definitions for API requests and responses
 * 
 * @module api/types
 * @version 1.0.0
 */

// Contact Form
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Newsletter
export interface NewsletterRequest {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Feedback
export interface FeedbackRequest {
  feedback: string;
  email?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Generic error response
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}
