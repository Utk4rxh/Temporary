// src/components/student/EligibilityChecker.tsx
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { calculateCandidateScore } from '../../utils/aiRulesEngine';
import { Sparkles, CheckCircle } from 'lucide-react';

export const EligibilityChecker: React.FC = () => {
  const [gpa, setGpa] = useState<number>(3.8);
  const [income, setIncome] = useState<number>(35000);
  const [evaluated, setEvaluated] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<ReturnType<typeof calculateCandidateScore> | null>(null);

  const handleCheck = () => {
    const res = calculateCandidateScore({
      gpa,
      income,
      familySize: 4,
      firstGen: true,
      underrepresented: true,
      communityHours: 100,
      essayScore: 90,
    });
    setScoreResult(res);
    setEvaluated(true);
  };

  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h4 className="font-bold text-white text-sm font-['Outfit']">Instant AI Eligibility Assessment</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Your GPA</label>
          <input
            type="number"
            step="0.05"
            value={gpa}
            onChange={(e) => setGpa(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold text-indigo-400"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Household Income ($)</label>
          <input
            type="number"
            step="5000"
            value={income}
            onChange={(e) => setIncome(parseInt(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold text-teal-400"
          />
        </div>
      </div>

      <Button size="sm" variant="glow" onClick={handleCheck} className="w-full">
        Calculate Eligibility Index
      </Button>

      {evaluated && scoreResult && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Estimated Match Index:</span>
            <span className="text-lg font-extrabold text-white font-['Outfit']">{scoreResult.overallScore}/100</span>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Eligible for Full STEM & First-Gen Grants</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Estimated grant projection: <strong className="text-white">${scoreResult.recommendedGrantAmount.toLocaleString()}</strong>
          </p>
        </div>
      )}
    </Card>
  );
};
