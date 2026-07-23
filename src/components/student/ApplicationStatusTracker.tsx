// src/components/student/ApplicationStatusTracker.tsx
import React from 'react';
import type { ApplicationStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ApplicationStatusTrackerProps {
  status: ApplicationStatus;
  isOverridden?: boolean;
}

export const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({
  status,
  isOverridden = false,
}) => {
  const steps = [
    { key: 'submitted', label: 'Submitted', desc: 'Encrypted payload received' },
    { key: 'ai_evaluated', label: 'AI Evaluated', desc: 'SHAP weights calculated' },
    { key: 'under_review', label: 'Board Review', desc: 'Human verification' },
    { key: 'awarded', label: 'Decision Finalized', desc: 'Disbursement lock' },
  ];

  const getStepIndex = (st: ApplicationStatus) => {
    switch (st) {
      case 'submitted':
        return 0;
      case 'ai_evaluated':
        return 1;
      case 'under_review':
        return 2;
      case 'approved':
      case 'rejected':
      case 'overridden':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>Application Lifecycle Stage</span>
        {isOverridden && (
          <span className="text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            Human Board Override Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {steps.map((stepItem, idx) => {
          const isDone = idx < currentIndex || (idx === currentIndex && (status === 'approved' || status === 'overridden'));
          const isCurrent = idx === currentIndex && status !== 'approved' && status !== 'overridden' && status !== 'rejected';
          const isRejected = idx === 3 && status === 'rejected';

          return (
            <div
              key={stepItem.key}
              className={`p-3.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-indigo-950/50 border-indigo-500/50 text-indigo-200 shadow-glow'
                  : isRejected
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                ) : isRejected ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className="font-bold text-xs">{stepItem.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-6">{stepItem.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
