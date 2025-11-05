/**
 * FeedbackButton Component
 * 
 * Floating feedback button with modal for quick user feedback.
 * Allows users to submit feedback without navigating away.
 * 
 * @module components/FeedbackButton
 * @version 1.0.0
 */

import React from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '../utils/cn';

interface FeedbackButtonProps {
  className?: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!feedback.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback, email: email || undefined }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send feedback');
      }
      
      setIsSuccess(true);
      setFeedback('');
      setEmail('');
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-24 right-8 z-40 p-4 bg-hummbl-primary text-white rounded-full shadow-lg',
          'hover:bg-hummbl-secondary transition-all duration-300 hover:scale-110',
          'group',
          className
        )}
        aria-label="Send feedback"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Send Feedback
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  Your feedback helps us improve.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Send Feedback
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Help us improve HUMMBL. Share your thoughts, report issues, or suggest features.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="feedback-text" className="sr-only">
                      Your feedback
                    </label>
                    <textarea
                      id="feedback-text"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hummbl-primary focus:border-transparent resize-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="feedback-email" className="sr-only">
                      Your email (optional)
                    </label>
                    <input
                      type="email"
                      id="feedback-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email (optional)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hummbl-primary focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !feedback.trim()}
                      className="flex-1 px-4 py-2 bg-hummbl-primary text-white rounded-lg hover:bg-hummbl-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
