/**
 * ClassName Utility
 * 
 * Utility function for merging Tailwind CSS classes.
 * Uses clsx for conditional class application.
 * 
 * @module utils/cn
 * @version 1.0.0
 */

import clsx, { type ClassValue } from 'clsx';

/**
 * Merges multiple className values into a single string
 * 
 * @param inputs - Class values to merge
 * @returns Merged className string
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', { 'active': isActive })
 */
export const cn = (...inputs: ClassValue[]): string => {
  return clsx(inputs);
};
