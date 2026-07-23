// src/components/admin/AuditLogTable.tsx
import React from 'react';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
import type { AuditLogEntry } from '../../types';
import { User, Cpu } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLogEntry[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  const columns: Column<AuditLogEntry>[] = [
    {
      header: 'Timestamp & Actor',
      accessor: (row) => (
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-lg ${row.actorRole === 'admin' ? 'bg-purple-900/40 text-purple-300' : 'bg-indigo-900/40 text-indigo-300'}`}>
            {row.actorRole === 'admin' ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-bold text-white text-xs">{row.actorName}</div>
            <div className="text-[10px] text-slate-400">{new Date(row.timestamp).toLocaleString()}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'timestamp',
    },
    {
      header: 'System Action',
      accessor: (row) => (
        <Badge
          variant={
            row.action === 'MANUAL_OVERRIDE'
              ? 'purple'
              : row.action === 'AI_SCORING_RUN'
              ? 'info'
              : 'warning'
          }
        >
          {row.action.replace(/_/g, ' ')}
        </Badge>
      ),
      sortable: true,
      sortKey: 'action',
    },
    {
      header: 'Target Applicant',
      accessor: (row) => (
        <div className="font-semibold text-slate-200 text-xs">
          {row.applicantName || 'Global Config'}
        </div>
      ),
    },
    {
      header: 'Value Change & Justification',
      accessor: (row) => (
        <div className="space-y-0.5">
          <div className="text-xs text-slate-300">
            <span className="line-through text-slate-500 mr-1">{row.previousValue}</span> →{' '}
            <span className="text-emerald-400 font-bold">{row.newValue}</span>
          </div>
          {row.justification && (
            <p className="text-[10px] text-slate-400 italic line-clamp-1">{row.justification}</p>
          )}
        </div>
      ),
    },
    {
      header: 'IP Address',
      accessor: (row) => <span className="font-mono text-[10px] text-slate-500">{row.ipAddress}</span>,
    },
  ];

  return <Table columns={columns} data={logs} searchPlaceholder="Search audit trail by actor, candidate, or action..." />;
};
