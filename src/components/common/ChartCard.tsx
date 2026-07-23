// src/components/common/ChartCard.tsx
import React from 'react';
import { Card } from './Card';
import { Download, RefreshCw } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onExportCSV?: () => void;
  onRefresh?: () => void;
  className?: string;
  actionNode?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  onExportCSV,
  onRefresh,
  className = '',
  actionNode,
}) => {
  return (
    <Card variant="glass" className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h4 className="font-bold text-lg text-white font-['Outfit']">{title}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-2">
          {actionNode}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh dataset"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              title="Export chart dataset to CSV"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex-1 min-h-[260px]">{children}</div>
    </Card>
  );
};
