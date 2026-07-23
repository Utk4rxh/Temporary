// src/components/admin/ManualOverrideModal.tsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import type { Application } from '../../types';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, UserCheck } from 'lucide-react';

interface ManualOverrideModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ManualOverrideModal: React.FC<ManualOverrideModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const { overrideApplication } = useApplications();
  const { userName } = useAuth();

  const [status, setStatus] = useState<'approved' | 'rejected'>('approved');
  const [grantAmount, setGrantAmount] = useState<number>(application?.requestedAmount || 100000);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  if (!application) return null;

  const handleConfirmOverride = async () => {
    if (!reason || reason.trim().length < 15) {
      setErrorText('Ethics Compliance Requirement: Manual overrides require a detailed rationale of at least 15 characters.');
      return;
    }

    setErrorText(null);
    setIsSubmitting(true);

    try {
      await overrideApplication(
        application.id,
        status,
        grantAmount,
        reason,
        userName || 'Dr. Elena Rostova'
      );
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Human Board Decision Override"
      subtitle={`Overriding AI Recommendation for candidate ${application.student.fullName}`}
    >
      <div className="space-y-4 text-xs">
        <Alert type="warning" title="Audit Compliance Protocol">
          This action bypasses the automated SHAP AI recommendation. An immutable audit log entry will record your identity, timestamp, and justification.
        </Alert>

        {errorText && <Alert type="error">{errorText}</Alert>}

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="font-semibold text-slate-300">Automated AI Score: {application.aiBreakdown.overallScore}/100</div>
          <div className="text-slate-400">
            Initial AI Recommendation:{' '}
            <span className="text-indigo-400 font-bold uppercase">{application.aiBreakdown.recommendation.replace('_', ' ')}</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">New Board Decision</label>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setStatus('approved')}
              className={`p-3 rounded-xl font-bold border transition-all flex items-center justify-center space-x-2 ${
                status === 'approved'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-glow'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Approve Award</span>
            </button>

            <button
              onClick={() => setStatus('rejected')}
              className={`p-3 rounded-xl font-bold border transition-all flex items-center justify-center space-x-2 ${
                status === 'rejected'
                  ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-glow-rose'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Reject Award</span>
            </button>
          </div>
        </div>

        {status === 'approved' && (
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Award Grant Amount ($)</label>
            <input
              type="number"
              step="5000"
              value={grantAmount}
              onChange={(e) => setGrantAmount(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-emerald-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Required Ethics Justification & Reason <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why the automated AI score is being overridden (e.g. Unquantified medical hardship, athletic distinction, verified interview recommendation)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" loading={isSubmitting} onClick={handleConfirmOverride}>
            Sign & Commit Override Log
          </Button>
        </div>
      </div>
    </Modal>
  );
};
