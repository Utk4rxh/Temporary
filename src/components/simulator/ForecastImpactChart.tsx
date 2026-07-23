// src/components/simulator/ForecastImpactChart.tsx
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import type { BudgetScenarioResult } from '../../types';

interface ForecastImpactChartProps {
  result: BudgetScenarioResult;
}

export const ForecastImpactChart: React.FC<ForecastImpactChartProps> = ({ result }) => {
  // Generate projection trend across score cutoffs from 50 to 90
  const projectionData = [50, 55, 60, 65, 70, 75, 80, 85, 90].map((cutoff) => {
    const coverage = Math.max(10, Math.min(95, (100 - cutoff) * 1.4));
    const funded = Math.round(500 * (coverage / 100));
    const totalDisbursed = Math.min(result.config.totalBudgetPool, funded * result.averageAward);
    return {
      cutoff: `${cutoff}`,
      studentsFunded: funded,
      disbursedK: Math.round(totalDisbursed / 1000),
      coverage,
    };
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Projected Student Coverage vs Disbursed Funds</span>
        <span className="text-indigo-400 font-bold">Active Cutoff: {result.config.minScoreCutoff}</span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFunded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="cutoff" stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: 'Score Cutoff Threshold', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                      <div className="font-bold text-white">Score Cutoff: {data.cutoff}</div>
                      <div className="text-indigo-300 font-semibold">Students Funded: {data.studentsFunded} candidates</div>
                      <div className="text-emerald-400 font-semibold">Capital Disbursed: ${data.disbursedK}k</div>
                      <div className="text-slate-400 text-[10px]">Coverage Rate: {data.coverage.toFixed(1)}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="studentsFunded" stroke="#6366f1" fillOpacity={1} fill="url(#colorFunded)" name="Students Funded" />
            <Area type="monotone" dataKey="disbursedK" stroke="#10b981" fillOpacity={0.5} fill="url(#colorDisbursed)" name="Disbursed ($k)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
