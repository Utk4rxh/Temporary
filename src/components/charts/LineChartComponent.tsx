// src/components/charts/LineChartComponent.tsx
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export interface LineChartDataItem {
  month: string;
  applications: number;
  approved: number;
  disbursedK: number;
}

export interface LineChartComponentProps {
  data?: LineChartDataItem[];
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  showLegend?: boolean;
  className?: string;
}

const defaultLineData: LineChartDataItem[] = [
  { month: 'Jan', applications: 120, approved: 80, disbursedK: 240 },
  { month: 'Feb', applications: 180, approved: 130, disbursedK: 390 },
  { month: 'Mar', applications: 240, approved: 175, disbursedK: 520 },
  { month: 'Apr', applications: 310, approved: 220, disbursedK: 660 },
  { month: 'May', applications: 450, approved: 340, disbursedK: 980 },
  { month: 'Jun', applications: 620, approved: 482, disbursedK: 1420 },
];

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data = defaultLineData,
  height = 280,
  primaryColor = '#3b82f6',
  secondaryColor = '#10b981',
  showLegend = true,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 15, right: 25, left: 0, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} />
          <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as LineChartDataItem;
                return (
                  <div className="bg-slate-900 border border-slate-700 bg-white border-slate-200 p-3 rounded-xl shadow-2xl text-xs space-y-1.5">
                    <div className="font-bold text-slate-100 dark:text-slate-100 text-slate-900">{item.month} Pipeline</div>
                    <div className="text-blue-400 font-semibold">
                      Applications: <span className="font-bold text-slate-100">{item.applications}</span>
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      Approved: <span className="font-bold text-slate-100">{item.approved} candidates</span>
                    </div>
                    <div className="text-purple-400 font-semibold">
                      Disbursed: <span className="font-bold text-slate-100">${item.disbursedK}k</span>
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
              height={30}
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="applications"
            name="Applications Submitted"
            stroke={primaryColor}
            strokeWidth={3}
            dot={{ r: 4, fill: primaryColor }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="approved"
            name="Approved Candidates"
            stroke={secondaryColor}
            strokeWidth={3}
            dot={{ r: 4, fill: secondaryColor }}
            activeDot={{ r: 7 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
