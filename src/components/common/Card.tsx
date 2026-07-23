// src/components/common/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'flat' | 'glow' | 'gradient';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  hoverEffect = false,
  onClick,
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden';

  const variants = {
    glass: 'glass-panel',
    flat: 'bg-slate-900/90 border border-slate-800',
    glow: 'glass-panel border-indigo-500/30 shadow-glow',
    gradient: 'bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90 border border-indigo-500/20',
  };

  const hoverStyle = hoverEffect ? 'glass-panel-hover cursor-pointer' : '';

  return (
    <div onClick={onClick} className={`${baseStyles} ${variants[variant]} ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
};
