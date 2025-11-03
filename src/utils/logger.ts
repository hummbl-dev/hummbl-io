/**
 * Client-side logging utility for HUMMBL-IO
 * Provides structured logging with environment-aware behavior
 * 
 * In development: Logs to console with detailed information
 * In production: Logs to Sentry for errors/warnings, silences debug/info
 */

import * as Sentry from '@sentry/react';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  /**
   * Format log message with timestamp and context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }
    
    return `${prefix} ${message}`;
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('debug', message, context);
      console.debug(formatted);
    }
  }

  /**
   * Log info message (development only)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('info', message, context);
      console.info(formatted);
    }
  }

  /**
   * Log warning message
   * In production: Sends to Sentry
   */
  warn(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('warn', message, context);
    
    if (this.isDevelopment) {
      console.warn(formatted);
    } else {
      // In production, send warnings to Sentry
      Sentry.captureMessage(message, {
        level: 'warning',
        contexts: context ? { context } : undefined,
      });
    }
  }

  /**
   * Log error message
   * Always sends to Sentry in production
   */
  error(message: string, error?: Error | LogContext, context?: LogContext): void {
    const formatted = this.formatMessage('error', message, context);
    
    if (this.isDevelopment) {
      console.error(formatted);
      if (error instanceof Error) {
        console.error('Error details:', error);
      }
    }

    // Always send errors to Sentry
    if (this.isProduction) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          contexts: context ? { context } : undefined,
          tags: { source: 'logger' },
        });
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          contexts: {
            ...(error && typeof error === 'object' ? { error } : {}),
            ...(context ? { context } : {}),
          },
        });
      }
    }
  }

  /**
   * Log API request
   */
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.debug(`API ${method} ${path}`, context);
  }

  /**
   * Log component lifecycle event
   */
  componentLifecycle(component: string, event: string, context?: LogContext): void {
    this.debug(`[${component}] ${event}`, context);
  }

  /**
   * Log user interaction
   */
  userInteraction(action: string, context?: LogContext): void {
    this.debug(`User interaction: ${action}`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for convenience
export type { LogLevel, LogContext };

