// src/components/charts/PieChartComponent.tsx
import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

export interface PieChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartComponentProps {
  data?: PieChartDataItem[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  showLegend?: boolean;
  unit?: string;
  className?: string;
}

const defaultPieData: PieChartDataItem[] = [
  { name: 'STEM Excellence', value: 45, color: '#3b82f6' },
  { name: 'First-Gen Opportunity', value: 30, color: '#10b981' },
  { name: 'Merit Scholar', value: 15, color: '#8b5cf6' },
  { name: 'Civic Leadership', value: 10, color: '#f59e0b' },
];

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data = defaultPieData,
  innerRadius = 60,
  outerRadius = 90,
  height = 280,
  showLegend = true,
  unit = '%',
  className = '',
}) => {
  const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4'];

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as PieChartDataItem;
                return (
                  <div className="bg-slate-900 border border-slate-700 dark:bg-slate-900 dark:border-slate-700 bg-white border-slate-200 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                    <div className="font-bold text-slate-100 dark:text-slate-100 text-slate-900 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color || '#3b82f6' }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="text-slate-300 dark:text-slate-300 text-slate-600 font-semibold">
                      Value: <span className="text-blue-400 font-bold">{item.value}{unit}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            />
          )}
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
