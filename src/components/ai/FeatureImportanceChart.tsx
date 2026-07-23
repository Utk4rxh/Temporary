// src/components/ai/FeatureImportanceChart.tsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell, ReferenceLine } from 'recharts';
import type { FeatureWeight } from '../../types';

interface FeatureImportanceChartProps {
  features: FeatureWeight[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ features }) => {
  const chartData = features.map((f) => ({
    name: f.featureName,
    shapValue: f.shapValue,
    category: f.category,
    rawVal: f.value,
    impact: f.impactDescription,
  }));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span>Positive Impact (+Points)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-rose-500" />
          <span>Negative / Neutral Impact</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} domain={[-15, 40]} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              width={160}
            />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                      <div className="font-bold text-white">{data.name}</div>
                      <div className="text-slate-300">Raw Value: <span className="text-indigo-400 font-semibold">{data.rawVal}</span></div>
                      <div className={`font-semibold ${data.shapValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        SHAP Contribution: {data.shapValue >= 0 ? `+${data.shapValue}` : data.shapValue} pts
                      </div>
                      <div className="text-[11px] text-slate-400 italic pt-1">{data.impact}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#475569" strokeDasharray="3 3" />
            <Bar dataKey="shapValue" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.shapValue >= 0 ? '#6366f1' : '#f43f5e'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
