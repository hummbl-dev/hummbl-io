/**
 * Beta Banner Component
 * 
 * Displays prominent beta messaging to set user expectations.
 * Used during content development phase.
 * 
 * @module components/BetaBanner
 * @version 1.0.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface BetaBannerProps {
  className?: string;
}

// Using CO7 (Clear Communication) to set accurate expectations
export const BetaBanner: React.FC<BetaBannerProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-6',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <span>🚧 HUMMBL Base120 - Beta Preview</span>
          </h3>
          <div className="text-gray-700 space-y-2">
            <p className="font-medium">
              Framework structure complete. Detailed content being added progressively.
            </p>
            <p className="text-sm">
              Starting with <span className="font-semibold text-amber-700">Base42 core models</span>.
              All 120 models are browsable with placeholder descriptions.
              Real-world examples and relationships coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
