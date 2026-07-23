// src/components/charts/BarChartComponent.tsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';

export interface BarChartDataItem {
  name: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

export interface BarChartComponentProps {
  data?: BarChartDataItem[];
  height?: number;
  barColor?: string;
  horizontal?: boolean;
  referenceValue?: number;
  referenceLabel?: string;
  unit?: string;
  className?: string;
}

const defaultBarData: BarChartDataItem[] = [
  { name: 'Female', value: 0.98, color: '#10b981' },
  { name: 'Male', value: 1.02, color: '#10b981' },
  { name: 'Hispanic', value: 0.95, color: '#10b981' },
  { name: 'African Amer.', value: 0.91, color: '#10b981' },
  { name: 'Low-Income', value: 1.12, color: '#3b82f6' },
  { name: 'First-Gen', value: 1.08, color: '#3b82f6' },
];

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data = defaultBarData,
  height = 280,
  barColor = '#3b82f6',
  horizontal = false,
  referenceValue = 0.8,
  referenceLabel = 'Fairness Benchmark (0.80)',
  unit = '',
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          layout={horizontal ? 'vertical' : 'horizontal'}
          data={data}
          margin={{ top: 20, right: 25, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />

          {horizontal ? (
            <>
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} width={90} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            </>
          )}

          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as BarChartDataItem;
                return (
                  <div className="bg-slate-900 border border-slate-700 bg-white border-slate-200 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                    <div className="font-bold text-slate-100 dark:text-slate-100 text-slate-900">{item.name}</div>
                    <div className="text-slate-300 dark:text-slate-300 text-slate-600 font-semibold">
                      Value: <span className="text-blue-400 font-bold">{item.value}{unit}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {referenceValue !== undefined && (
            <ReferenceLine
              y={horizontal ? undefined : referenceValue}
              x={horizontal ? referenceValue : undefined}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: referenceLabel, fill: '#ef4444', fontSize: 10, position: 'top' }}
            />
          )}

          <Bar dataKey="value" radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || barColor} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
