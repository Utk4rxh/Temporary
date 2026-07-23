// src/components/simulator/BudgetSliderControls.tsx
import React from 'react';
import { Card } from '../common/Card';
import type { BudgetScenarioConfig } from '../../types';
import { Sliders, DollarSign, Target, Award } from 'lucide-react';

interface BudgetSliderControlsProps {
  config: BudgetScenarioConfig;
  onChange: (newConfig: BudgetScenarioConfig) => void;
}

export const BudgetSliderControls: React.FC<BudgetSliderControlsProps> = ({ config, onChange }) => {
  const updateField = <K extends keyof BudgetScenarioConfig>(field: K, val: BudgetScenarioConfig[K]) => {
    onChange({ ...config, [field]: val });
  };

  return (
    <Card variant="glass" className="space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-base text-white font-['Outfit']">Financial Budget Controls</h4>
          <p className="text-xs text-slate-400">Modify available capital pool and award caps to forecast coverage.</p>
        </div>
      </div>

      <div className="space-y-5 text-xs">
        {/* Total Budget Pool */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex justify-between items-center font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Total Endowment Capital Pool
            </span>
            <span className="text-emerald-400 font-extrabold text-sm">${config.totalBudgetPool.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="500000"
            max="5000000"
            step="100000"
            value={config.totalBudgetPool}
            onChange={(e) => updateField('totalBudgetPool', parseInt(e.target.value))}
            className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$500k</span>
            <span>$2.5M</span>
            <span>$5.0M</span>
          </div>
        </div>

        {/* Max Grant Cap */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex justify-between items-center font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" /> Max Grant Cap per Student
            </span>
            <span className="text-indigo-400 font-bold text-sm">${config.maxAwardCap.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="25000"
            max="200000"
            step="5000"
            value={config.maxAwardCap}
            onChange={(e) => updateField('maxAwardCap', parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$25k</span>
            <span>$100k</span>
            <span>$200k</span>
          </div>
        </div>

        {/* Minimum Score Cutoff */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex justify-between items-center font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" /> Qualification Cutoff Score
            </span>
            <span className="text-amber-400 font-bold text-sm">{config.minScoreCutoff} / 100</span>
          </div>
          <input
            type="range"
            min="50"
            max="90"
            step="1"
            value={config.minScoreCutoff}
            onChange={(e) => updateField('minScoreCutoff', parseInt(e.target.value))}
            className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>50 (Inclusive)</span>
            <span>70 (Balanced)</span>
            <span>90 (Highly Selective)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
