// src/pages/BudgetSimulator.tsx
import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { ChartCard } from '../components/common/ChartCard';
import { ScenarioComparator } from '../components/simulator/ScenarioComparator';
import { AreaChartComponent } from '../components/charts/AreaChartComponent';
import { useApplications } from '../context/ApplicationContext';
import { formatCurrency } from '../utils/formatters';
import {
  Sliders,
  DollarSign,
  Target,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const BudgetSimulator: React.FC = () => {
  const { applications } = useApplications();

  // Admin Interactive State
  const [totalBudget, setTotalBudget] = useState<number>(2000000); // $2,000,000
  const [minScoreCutoff, setMinScoreCutoff] = useState<number>(70); // 70 AI Score Cutoff
  const [maxGrantAmount, setMaxGrantAmount] = useState<number>(50000); // $50,000 per student cap

  // Total Applicant Pool (real from context or realistic 845 cohort)
  const totalPoolCount = Math.max(applications.length, 845);

  // REAL-TIME DYNAMIC CALCULATION ENGINE
  // Estimate candidate count based on score cutoff relative to pool
  const scorePercentile = Math.max(0.1, (100 - minScoreCutoff) / 50);
  const estimatedEligibleCount = Math.round(totalPoolCount * Math.min(0.9, scorePercentile));

  // Determine how many students can be funded within maxGrantAmount & totalBudget
  const maxPossibleFundedByBudget = Math.floor(totalBudget / maxGrantAmount);

  const selectedStudentsCount = Math.min(estimatedEligibleCount, maxPossibleFundedByBudget);
  const rejectedStudentsCount = Math.max(0, totalPoolCount - selectedStudentsCount);

  const totalDisbursedCapital = selectedStudentsCount * Math.min(maxGrantAmount, 42000);
  const remainingBudget = Math.max(0, totalBudget - totalDisbursedCapital);
  const averageAward = selectedStudentsCount > 0 ? Math.round(totalDisbursedCapital / selectedStudentsCount) : 0;
  const coverageRate = ((selectedStudentsCount / totalPoolCount) * 100).toFixed(1);

  const handleResetDefaults = () => {
    setTotalBudget(2000000);
    setMinScoreCutoff(70);
    setMaxGrantAmount(50000);
  };

  // Generate real-time area projection curve across cutoffs from 50 to 90
  const forecastTrendData = [50, 60, 70, 80, 90].map((cutoff) => {
    const p = Math.max(0.1, (100 - cutoff) / 50);
    const count = Math.min(Math.round(totalPoolCount * p), Math.floor(totalBudget / maxGrantAmount));
    const disbursedK = Math.round((count * Math.min(maxGrantAmount, 42000)) / 1000);
    return {
      cutoff: `${cutoff} Cutoff`,
      studentsFunded: count,
      capitalDisbursedK: disbursedK,
    };
  });

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP TITLE BANNER */}
      <div className="gov-panel p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-slate-950 via-teal-950/40 to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Financial Modeling Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Real-Time Budget Allocation Simulator
          </h1>
          <p className="text-xs text-slate-400">
            Adjust endowment capital, score cutoffs, and grant caps to project student coverage and remaining reserves in real time.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={handleResetDefaults}>
          Reset Baseline Defaults
        </Button>
      </div>

      {/* 2. REAL-TIME DISPLAY METRICS (REMAINING BUDGET, SELECTED STUDENTS, REJECTED STUDENTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* REMAINING BUDGET CARD */}
        <Card variant="glow" className="p-6 space-y-2 border-emerald-500/40 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Remaining Budget Reserve
            </span>
            <span className="text-emerald-400 font-bold">
              {((remainingBudget / totalBudget) * 100).toFixed(0)}% Unallocated
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            {formatCurrency(remainingBudget)}
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
            <span>Disbursed Capital:</span>
            <strong className="text-emerald-400">{formatCurrency(totalDisbursedCapital)}</strong>
          </div>
        </Card>

        {/* SELECTED STUDENTS CARD */}
        <Card variant="glow" className="p-6 space-y-2 border-blue-500/40 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" /> Selected Students
            </span>
            <span className="text-blue-300 font-bold">{coverageRate}% Coverage</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-200 font-['Outfit']">
            {selectedStudentsCount} <span className="text-sm font-normal text-slate-400">Candidates</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
            <span>Avg Award Size:</span>
            <strong className="text-blue-300">{formatCurrency(averageAward)}</strong>
          </div>
        </Card>

        {/* REJECTED STUDENTS CARD */}
        <Card variant="glass" className="p-6 space-y-2 border-rose-900/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" /> Unallocated / Rejected
            </span>
            <span className="text-slate-400 font-semibold">Below Cutoff or Cap</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-300 font-['Outfit']">
            {rejectedStudentsCount} <span className="text-sm font-normal text-slate-500">Candidates</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
            <span>Total Pool Size:</span>
            <strong className="text-white">{totalPoolCount} Applicants</strong>
          </div>
        </Card>
      </div>

      {/* 3. INTERACTIVE SLIDER CONTROLS & REAL-TIME FORECAST CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* INTERACTIVE CONTROLS PANEL */}
        <Card variant="glass" className="p-6 space-y-6 border-blue-900/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Simulator Controls</h3>
            </div>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>

          <div className="space-y-6 text-xs">
            {/* CONTROL 1: TOTAL BUDGET */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Total Endowment Budget
                </label>
                <span className="text-emerald-400 font-extrabold text-sm">{formatCurrency(totalBudget)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="50000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseInt(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$500k</span>
                <span>$2.5M</span>
                <span>$5.0M</span>
              </div>
            </div>

            {/* CONTROL 2: MINIMUM AI SCORE CUTOFF */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-400" /> Minimum AI Score Cutoff
                </label>
                <span className="text-indigo-400 font-extrabold text-sm">{minScoreCutoff} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="1"
                value={minScoreCutoff}
                onChange={(e) => setMinScoreCutoff(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>50 (High Yield)</span>
                <span>70 (Balanced)</span>
                <span>95 (Selective)</span>
              </div>
            </div>

            {/* CONTROL 3: SCHOLARSHIP MAX AMOUNT PER STUDENT */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" /> Scholarship Amount Cap per Student
                </label>
                <span className="text-purple-400 font-extrabold text-sm">{formatCurrency(maxGrantAmount)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={maxGrantAmount}
                onChange={(e) => setMaxGrantAmount(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$10k</span>
                <span>$75k</span>
                <span>$150k</span>
              </div>
            </div>
          </div>
        </Card>

        {/* FORECAST IMPACT AREA CHART */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Real-Time Student Coverage vs Disbursed Capital Projection"
            subtitle="Simulating changes in candidate yield as AI score cutoff shifts from 50 to 90"
          >
            <AreaChartComponent
              data={forecastTrendData}
              color1="#3b82f6"
              color2="#10b981"
              height={320}
            />
          </ChartCard>
        </div>
      </div>

      {/* 4. SIDE-BY-SIDE POLICY STRATEGY COMPARATOR */}
      <ScenarioComparator />
    </div>
  );
};
