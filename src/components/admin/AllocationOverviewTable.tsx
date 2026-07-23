// src/components/admin/AllocationOverviewTable.tsx
import React from 'react';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
import type { Application } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Eye, ShieldAlert, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AllocationOverviewTableProps {
  applications: Application[];
  onTriggerOverride: (app: Application) => void;
}

export const AllocationOverviewTable: React.FC<AllocationOverviewTableProps> = ({
  applications,
  onTriggerOverride,
}) => {
  const navigate = useNavigate();

  const columns: Column<Application>[] = [
    {
      header: 'Applicant',
      accessor: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.student.avatarUrl}
            alt={row.student.fullName}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
          />
          <div>
            <div className="font-bold text-white leading-tight">{row.student.fullName}</div>
            <div className="text-[10px] text-slate-400">
              {row.student.major} • {row.student.university}
            </div>
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'student.fullName',
    },
    {
      header: 'Scholarship Target',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-200 text-xs">{row.scholarshipName}</div>
          <div className="text-[10px] text-slate-400">Submitted: {formatDate(row.submissionDate)}</div>
        </div>
      ),
    },
    {
      header: 'AI Score Index',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <div
            className={`font-extrabold text-sm ${
              row.aiBreakdown.overallScore >= 85
                ? 'text-emerald-400'
                : row.aiBreakdown.overallScore >= 70
                ? 'text-indigo-400'
                : 'text-amber-400'
            }`}
          >
            {row.aiBreakdown.overallScore}/100
          </div>
          <span className="text-[10px] text-slate-500">({(row.aiBreakdown.confidenceScore * 100).toFixed(0)}% conf)</span>
        </div>
      ),
      sortable: true,
      sortKey: 'aiBreakdown.overallScore',
    },
    {
      header: 'Status & Governance',
      accessor: (row) => (
        <div className="flex flex-col space-y-1">
          <Badge status={row.status} />
          {row.isOverridden && (
            <span className="text-[9px] text-purple-300 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-purple-400" /> Overridden
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Award Grant',
      accessor: (row) => (
        <div>
          <div className="font-bold text-white text-xs">
            {row.awardedAmount ? formatCurrency(row.awardedAmount) : '—'}
          </div>
          <div className="text-[10px] text-slate-400">Req: {formatCurrency(row.requestedAmount)}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'awardedAmount',
    },
    {
      header: 'Board Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/student/explainability/${row.id}`)}
            title="Inspect transparent SHAP AI explainability breakdown"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onTriggerOverride(row)}
            title="Execute human board decision override"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-purple-300 border border-slate-700 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Table columns={columns} data={applications} searchPlaceholder="Search by applicant, major, fund..." />
    </div>
  );
};
