/**
 * NewsletterSignup Component
 * 
 * Newsletter subscription form with email validation.
 * Lightweight component for footer and inline placements.
 * 
 * @module components/NewsletterSignup
 * @version 1.0.0
 */

import React from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'inline' | 'compact';
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  className,
  variant = 'inline' 
}) => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      setIsSuccess(true);
      setEmail('');
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Newsletter signup error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (isSuccess) {
    return (
      <div className={cn('flex items-center space-x-2 text-green-600', className)}>
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={cn('w-full', className)}>
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Your email"
              disabled={isSubmitting}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-lg border text-sm',
                'focus:outline-none focus:ring-2 focus:ring-hummbl-primary focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error ? 'border-red-500' : 'border-gray-300'
              )}
            />
          </div>
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full px-4 py-2 bg-hummbl-primary text-white rounded-lg text-sm font-medium',
              'hover:bg-hummbl-secondary transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'inline-flex items-center justify-center space-x-2'
            )}
          >
            <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isSubmitting}
              className={cn(
                'w-full pl-11 pr-4 py-3 rounded-lg border',
                'focus:outline-none focus:ring-2 focus:ring-hummbl-primary focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error ? 'border-red-500' : 'border-gray-300'
              )}
            />
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'px-6 py-3 bg-hummbl-primary text-white rounded-lg font-semibold whitespace-nowrap',
            'hover:bg-hummbl-secondary transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'inline-flex items-center justify-center space-x-2'
          )}
        >
          <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
