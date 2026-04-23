import { AlertCircle } from 'lucide-react';
import type { ValidationError } from '../types';

interface ValidationBadgeProps {
  errors: ValidationError[];
}

export function ValidationBadge({ errors }: ValidationBadgeProps) {
  if (errors.length === 0) return null;

  const tooltipText = errors.map((e) => e.message).join('\n');

  return (
    <div
      className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 border-2 border-[#1e1e2e] shadow-lg z-10"
      title={tooltipText}
    >
      <AlertCircle className="w-4 h-4 text-white" />
    </div>
  );
}
