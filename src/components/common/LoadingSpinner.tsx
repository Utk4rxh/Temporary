// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Evaluating AI scoring model...',
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <Loader2 className={`${sizes[size]} text-indigo-500 animate-spin`} />
        <Sparkles className="w-4 h-4 text-teal-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      {label && <p className="text-xs font-semibold text-slate-400 tracking-wide">{label}</p>}
    </div>
  );
};
