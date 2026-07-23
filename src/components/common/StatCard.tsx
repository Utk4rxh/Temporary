// src/components/common/StatCard.tsx
import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
  icon: React.ElementType;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'up',
  subtext,
  icon: Icon,
  iconColor = 'text-indigo-400',
}) => {
  return (
    <Card variant="glass" hoverEffect className="group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:scale-110 transition-transform ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(change || subtext) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {change && (
            <div
              className={`flex items-center space-x-1 font-medium ${
                trend === 'up'
                  ? 'text-emerald-400'
                  : trend === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </div>
          )}
          {subtext && <span className="text-slate-400">{subtext}</span>}
        </div>
      )}
    </Card>
  );
};
