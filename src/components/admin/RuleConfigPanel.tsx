// src/components/admin/RuleConfigPanel.tsx
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Sliders, Save, RotateCcw } from 'lucide-react';

export const RuleConfigPanel: React.FC = () => {
  const [meritWeight, setMeritWeight] = useState(40);
  const [needWeight, setNeedWeight] = useState(35);
  const [equityWeight, setEquityWeight] = useState(25);
  const [minCutoff, setMinCutoff] = useState(65);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalWeight = meritWeight + needWeight + equityWeight;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <Card variant="glass" className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="font-bold text-base text-white font-['Outfit']">Global Allocation Scoring Rubric</h4>
            <p className="text-xs text-slate-400">Configure global model criteria weights across institutional funds.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              totalWeight === 100
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            Total Weight: {totalWeight}%
          </span>
        </div>
      </div>

      {savedSuccess && (
        <Alert type="success" title="Rules Updated Successfully">
          New global weights have been deployed to the AI scoring pipeline.
        </Alert>
      )}

      {totalWeight !== 100 && (
        <Alert type="warning">
          Total weight sum must equal 100%. Currently at {totalWeight}%.
        </Alert>
      )}

      <div className="space-y-4 text-xs">
        {/* Merit Weight */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300">Academic Merit Weight</span>
            <span className="text-indigo-400 font-bold">{meritWeight}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="70"
            value={meritWeight}
            onChange={(e) => setMeritWeight(parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Need Weight */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300">Financial Need Weight</span>
            <span className="text-teal-400 font-bold">{needWeight}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="70"
            value={needWeight}
            onChange={(e) => setNeedWeight(parseInt(e.target.value))}
            className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Equity Weight */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300">Diversity & First-Gen Weight</span>
            <span className="text-purple-400 font-bold">{equityWeight}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={equityWeight}
            onChange={(e) => setEquityWeight(parseInt(e.target.value))}
            className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Minimum Cutoff */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300">Minimum Award Score Cutoff</span>
            <span className="text-amber-400 font-bold">{minCutoff} / 100</span>
          </div>
          <input
            type="range"
            min="50"
            max="85"
            value={minCutoff}
            onChange={(e) => setMinCutoff(parseInt(e.target.value))}
            className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button variant="secondary" icon={RotateCcw} onClick={() => { setMeritWeight(40); setNeedWeight(35); setEquityWeight(25); setMinCutoff(65); }}>
          Reset Defaults
        </Button>
        <Button variant="glow" icon={Save} disabled={totalWeight !== 100} onClick={handleSave}>
          Deploy Rule Weights
        </Button>
      </div>
    </Card>
  );
};
