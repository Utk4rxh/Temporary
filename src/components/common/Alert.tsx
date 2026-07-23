// src/components/common/Alert.tsx
import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) => {
  const configs = {
    info: {
      border: 'border-indigo-500/40 bg-indigo-950/40 text-indigo-200',
      icon: Info,
      iconColor: 'text-indigo-400',
    },
    warning: {
      border: 'border-amber-500/40 bg-amber-950/40 text-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    success: {
      border: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
    },
    error: {
      border: 'border-rose-500/40 bg-rose-950/40 text-rose-200',
      icon: XCircle,
      iconColor: 'text-rose-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`flex items-start justify-between p-4 rounded-xl border backdrop-blur-md text-xs ${config.border} ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
        <div>
          {title && <h5 className="font-bold text-white mb-0.5">{title}</h5>}
          <div className="leading-relaxed">{children}</div>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
