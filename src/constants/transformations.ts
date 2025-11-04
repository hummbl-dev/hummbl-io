/**
 * Transformation Constants
 * 
 * Defines the 6 core transformations of HUMMBL Base120 framework.
 * Each transformation represents a fundamental mental model pattern.
 * 
 * @module constants/transformations
 * @version 1.0.0
 */

import type { Transformation } from '../types/models';

export const TRANSFORMATIONS: Transformation[] = [
  {
    code: 'P',
    name: 'Perspective',
    shortName: 'Perspective',
    description: 'Frame, name, shift point of view',
    icon: 'Eye',
    color: '#3b82f6',
    modelCount: 20,
  },
  {
    code: 'IN',
    name: 'Inversion',
    shortName: 'Inversion',
    description: 'Reverse assumptions, work backward',
    icon: 'FlipHorizontal',
    color: '#8b5cf6',
    modelCount: 20,
  },
  {
    code: 'CO',
    name: 'Composition',
    shortName: 'Composition',
    description: 'Build up, combine, integrate parts',
    icon: 'Plus',
    color: '#10b981',
    modelCount: 20,
  },
  {
    code: 'DE',
    name: 'Decomposition',
    shortName: 'Decomposition',
    description: 'Break down, modularize, separate',
    icon: 'Minus',
    color: '#f59e0b',
    modelCount: 20,
  },
  {
    code: 'RE',
    name: 'Recursion',
    shortName: 'Recursion',
    description: 'Self-reference, repetition, iteration',
    icon: 'Repeat',
    color: '#ef4444',
    modelCount: 20,
  },
  {
    code: 'SY',
    name: 'Systems',
    shortName: 'Systems',
    description: 'Meta-systems, patterns, emergence',
    icon: 'Network',
    color: '#06b6d4',
    modelCount: 20,
  },
];

export const TRANSFORMATION_MAP = TRANSFORMATIONS.reduce((acc, t) => {
  acc[t.code] = t;
  return acc;
}, {} as Record<string, Transformation>);

export const TOTAL_MODELS = 120;
export const FRAMEWORK_VERSION = '1.0-beta';
