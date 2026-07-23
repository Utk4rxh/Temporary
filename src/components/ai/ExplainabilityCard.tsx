// src/components/ai/ExplainabilityCard.tsx
import React from 'react';
import { Card } from '../common/Card';
import { Sparkles, CheckCircle2, Cpu } from 'lucide-react';
import type { AIScoreBreakdown } from '../../types';

interface ExplainabilityCardProps {
  breakdown: AIScoreBreakdown;
  applicantName: string;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ breakdown, applicantName }) => {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white font-['Outfit']">Natural Language Explanation</h4>
            <p className="text-[11px] text-slate-400">SHAP-based transparent audit log summary</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Model Certainty: {(breakdown.confidenceScore * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3">
        <p>
          <strong className="text-white">Summary for {applicantName}:</strong> {breakdown.generatedExplanation}
        </p>

        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <span className="font-semibold text-indigo-300">Key Contributing Drivers:</span>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            {breakdown.featureWeights
              .filter((f) => f.shapValue > 0)
              .map((f, i) => (
                <li key={i}>
                  <strong className="text-slate-200">{f.featureName}:</strong> {f.impactDescription} (+{f.shapValue} pts)
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span className="flex items-center gap-1 text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" /> Model Architecture: GradientBoostedSHAP-v3.4
        </span>
        <span>Audited for FERPA Compliance</span>
      </div>
    </Card>
  );
};
