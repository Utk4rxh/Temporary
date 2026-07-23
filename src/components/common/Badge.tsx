// src/components/common/Badge.tsx
import React from 'react';
import type { ApplicationStatus } from '../../types';

interface BadgeProps {
  status?: ApplicationStatus | string;
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'purple' | 'slate';
  children?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  className = '',
  dot = true,
}) => {
  let resolvedVariant = variant || 'info';
  let label = children;

  if (status) {
    switch (status) {
      case 'approved':
        resolvedVariant = 'success';
        label = label || 'Approved';
        break;
      case 'rejected':
        resolvedVariant = 'danger';
        label = label || 'Rejected';
        break;
      case 'overridden':
        resolvedVariant = 'purple';
        label = label || 'Human Override';
        break;
      case 'ai_evaluated':
        resolvedVariant = 'info';
        label = label || 'AI Evaluated';
        break;
      case 'under_review':
        resolvedVariant = 'warning';
        label = label || 'Under Board Review';
        break;
      case 'submitted':
        resolvedVariant = 'slate';
        label = label || 'Submitted';
        break;
      default:
        label = label || status;
    }
  }

  const styles = {
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    info: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    info: 'bg-indigo-400',
    danger: 'bg-rose-400',
    purple: 'bg-purple-400',
    slate: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${styles[resolvedVariant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[resolvedVariant]}`} />}
      <span>{label}</span>
    </span>
  );
};
