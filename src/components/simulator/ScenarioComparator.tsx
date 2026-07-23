// src/components/simulator/ScenarioComparator.tsx
import React from 'react';
import { Card } from '../common/Card';
import { calculateBudgetScenario } from '../../utils/aiRulesEngine';
import { formatCurrency } from '../../utils/formatters';
import { Scale, CheckCircle2 } from 'lucide-react';

export const ScenarioComparator: React.FC = () => {
  const conservative = calculateBudgetScenario({
    scenarioName: 'Merit-First Elite Strategy',
    totalBudgetPool: 1650000,
    meritWeight: 60,
    needWeight: 25,
    equityWeight: 15,
    minScoreCutoff: 80,
    maxAwardCap: 150000,
  });

  const balanced = calculateBudgetScenario({
    scenarioName: 'Balanced Hybrid Strategy',
    totalBudgetPool: 1650000,
    meritWeight: 40,
    needWeight: 35,
    equityWeight: 25,
    minScoreCutoff: 68,
    maxAwardCap: 100000,
  });

  const aggressive = calculateBudgetScenario({
    scenarioName: 'Broad Need & Equity Strategy',
    totalBudgetPool: 1650000,
    meritWeight: 25,
    needWeight: 50,
    equityWeight: 25,
    minScoreCutoff: 58,
    maxAwardCap: 75000,
  });

  const scenarios = [conservative, balanced, aggressive];

  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <Scale className="w-5 h-5 text-indigo-400" />
        <h4 className="font-bold text-base text-white font-['Outfit']">Policy Strategy Comparison Matrix</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {scenarios.map((sc, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border space-y-3 ${
              idx === 1
                ? 'bg-indigo-950/40 border-indigo-500/50 shadow-glow'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{sc.config.scenarioName}</span>
              {idx === 1 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500 text-white font-extrabold">
                  Recommended
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Students Funded:</span>
                <strong className="text-white">{sc.totalStudentsFunded} candidates</strong>
              </div>
              <div className="flex justify-between">
                <span>Average Award:</span>
                <strong className="text-emerald-400">{formatCurrency(sc.averageAward)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Coverage Ratio:</span>
                <strong className="text-indigo-300">{sc.coveragePercentage}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Demographic Parity:</span>
                <strong className="text-teal-300">{sc.demographicParityScore}/100</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Merit ({sc.config.meritWeight}%) • Need ({sc.config.needWeight}%) • Equity ({sc.config.equityWeight}%)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
