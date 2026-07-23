// src/components/ai/BiasMetricsChart.tsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ReferenceLine, Cell } from 'recharts';
import type { DemographicDisparity } from '../../types';

interface BiasMetricsChartProps {
  metrics: DemographicDisparity[];
}

export const BiasMetricsChart: React.FC<BiasMetricsChartProps> = ({ metrics }) => {
  const chartData = metrics.map((m) => ({
    name: m.groupName,
    ratio: m.disparateImpactRatio,
    selectionRate: m.selectionRate,
    isFair: m.isFair,
    avgGrant: m.averageGrantAmount,
  }));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span>Fair & Balanced (&gt;= 0.80 Disparity Ratio)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Potential Disparate Impact (&lt; 0.80)</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 1.5]} />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5">
                      <div className="font-bold text-white">{data.name}</div>
                      <div className="text-slate-300">
                        Disparate Impact Ratio:{' '}
                        <span className={`font-bold ${data.ratio >= 0.8 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {data.ratio.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        Selection Rate: <span className="text-white font-semibold">{data.selectionRate}%</span>
                      </div>
                      <div className="text-slate-400">
                        Avg Grant: <span className="text-indigo-300 font-semibold">${data.avgGrant.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* 4/5ths Rule Benchmark Line (0.80) */}
            <ReferenceLine y={0.8} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: '80% Fairness Floor', fill: '#f43f5e', fontSize: 10, position: 'top' }} />
            <ReferenceLine y={1.0} stroke="#6366f1" strokeDasharray="2 2" />
            <Bar dataKey="ratio" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.ratio >= 0.8 ? '#10b981' : '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
