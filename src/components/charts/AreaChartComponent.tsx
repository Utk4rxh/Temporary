// src/components/charts/AreaChartComponent.tsx
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export interface AreaChartDataItem {
  cutoff: string;
  studentsFunded: number;
  capitalDisbursedK: number;
}

export interface AreaChartComponentProps {
  data?: AreaChartDataItem[];
  height?: number;
  color1?: string;
  color2?: string;
  showLegend?: boolean;
  className?: string;
}

const defaultAreaData: AreaChartDataItem[] = [
  { cutoff: '50 Score', studentsFunded: 480, capitalDisbursedK: 1440 },
  { cutoff: '60 Score', studentsFunded: 410, capitalDisbursedK: 1230 },
  { cutoff: '70 Score', studentsFunded: 320, capitalDisbursedK: 960 },
  { cutoff: '80 Score', studentsFunded: 210, capitalDisbursedK: 630 },
  { cutoff: '90 Score', studentsFunded: 95, capitalDisbursedK: 285 },
];

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data = defaultAreaData,
  height = 280,
  color1 = '#3b82f6',
  color2 = '#10b981',
  showLegend = true,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 15, right: 25, left: 0, bottom: 15 }}>
          <defs>
            <linearGradient id="areaGradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color1} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color1} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color2} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color2} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} />
          <XAxis dataKey="cutoff" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as AreaChartDataItem;
                return (
                  <div className="bg-slate-900 border border-slate-700 bg-white border-slate-200 p-3 rounded-xl shadow-2xl text-xs space-y-1.5">
                    <div className="font-bold text-slate-100 dark:text-slate-100 text-slate-900">Cutoff: {item.cutoff}</div>
                    <div className="text-blue-400 font-semibold">
                      Students Funded: <span className="font-bold text-slate-100">{item.studentsFunded}</span>
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      Capital Disbursed: <span className="font-bold text-slate-100">${item.capitalDisbursedK}k</span>
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
          <Area
            type="monotone"
            dataKey="studentsFunded"
            name="Students Funded"
            stroke={color1}
            fillOpacity={1}
            fill="url(#areaGradient1)"
          />
          <Area
            type="monotone"
            dataKey="capitalDisbursedK"
            name="Disbursed Capital ($k)"
            stroke={color2}
            fillOpacity={0.6}
            fill="url(#areaGradient2)"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
