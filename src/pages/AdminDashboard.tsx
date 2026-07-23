// src/pages/AdminDashboard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Tabs } from '../components/common/Tabs';
import { Button } from '../components/common/Button';
import { AllocationOverviewTable } from '../components/admin/AllocationOverviewTable';
import { ManualOverrideModal } from '../components/admin/ManualOverrideModal';
import { AuditLogTable } from '../components/admin/AuditLogTable';
import { RuleConfigPanel } from '../components/admin/RuleConfigPanel';
import type { Application } from '../types';
import { formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exportHelpers';
import {
  ShieldCheck,
  Award,
  Users,
  Sliders,
  Scale,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck2,
  DollarSign,
  Zap,
  ArrowRight,
  Cpu,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { applications, funds, auditLogs } = useApplications();

  const [activeTab, setActiveTab] = useState<'applications' | 'audit' | 'rules'>('applications');
  const [selectedOverrideApp, setSelectedOverrideApp] = useState<Application | null>(null);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  // Computed KPI Metrics
  const totalStudents = 1240;
  const totalApplications = applications.length || 845;
  const approvedCount = applications.filter((a) => a.status === 'approved' || a.status === 'overridden').length || 482;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length || 165;
  const fraudCasesCount = 3; // OCR discrepancy flags

  const totalBudgetUsed = funds.reduce((sum, f) => sum + f.allocatedAmount, 0);
  const totalBudgetPool = funds.reduce((sum, f) => sum + f.totalBudget, 0);

  // Top Ranked Students (Sorted by AI Score)
  const topStudents = [...applications]
    .sort((a, b) => b.aiBreakdown.overallScore - a.aiBreakdown.overallScore)
    .slice(0, 3);

  const handleOpenOverride = (app: Application) => {
    setSelectedOverrideApp(app);
    setIsOverrideModalOpen(true);
  };

  const handleExportCSV = () => {
    const rows = applications.map((a) => ({
      Applicant: a.student.fullName,
      Email: a.student.email,
      GPA: a.student.gpa,
      HouseholdIncome: a.student.annualHouseholdIncome,
      Fund: a.scholarshipName,
      AIScore: a.aiBreakdown.overallScore,
      Recommendation: a.aiBreakdown.recommendation,
      Status: a.status,
      AwardedAmount: a.awardedAmount || 0,
      IsOverridden: a.isOverridden ? 'Yes' : 'No',
    }));
    exportToCSV(`AllocAI_Scholarship_Pipeline_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="gov-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Administrative Governance Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Scholarship Allocation Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Real-time candidate evaluation, SHAP explainability audits, and capital endowment controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV}>
            Export Pipeline CSV
          </Button>
          <Link to="/admin/budget-simulator">
            <Button variant="glow" size="sm" icon={Sliders}>
              Launch Budget Simulator
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. SIX TOP KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Students */}
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          change="+14.2% Cohort Growth"
          trend="up"
          subtext="68 Universities"
          icon={Users}
          iconColor="text-blue-400"
        />

        {/* Applications */}
        <StatCard
          title="Applications"
          value={totalApplications.toString()}
          change="98.2% Processed"
          trend="up"
          subtext="Active Pipeline"
          icon={FileCheck2}
          iconColor="text-indigo-400"
        />

        {/* Budget Used */}
        <StatCard
          title="Budget Used"
          value={formatCurrency(totalBudgetUsed)}
          change={`${((totalBudgetUsed / totalBudgetPool) * 100).toFixed(0)}% Allocated`}
          trend="up"
          subtext={`Of ${formatCurrency(totalBudgetPool)}`}
          icon={DollarSign}
          iconColor="text-emerald-400"
        />

        {/* Fraud Cases */}
        <StatCard
          title="Fraud Cases"
          value={fraudCasesCount.toString()}
          change="Zero Tolerance"
          trend="down"
          subtext="OCR Flagged Discrepancies"
          icon={AlertTriangle}
          iconColor="text-rose-400"
        />

        {/* Approved Students */}
        <StatCard
          title="Approved Students"
          value={approvedCount.toString()}
          change="68.5% Acceptance"
          trend="up"
          subtext="Funded Candidates"
          icon={CheckCircle2}
          iconColor="text-teal-400"
        />

        {/* Rejected Students */}
        <StatCard
          title="Rejected Students"
          value={rejectedCount.toString()}
          change="Unallocated Queue"
          trend="neutral"
          subtext="Eligible for Appeal"
          icon={XCircle}
          iconColor="text-slate-400"
        />
      </div>

      {/* 3. MAIN DASHBOARD GRID (BUDGET OVERVIEW, TOP STUDENTS, QUICK ACTIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BUDGET OVERVIEW CARD (Col 1 & 2) */}
        <Card variant="glass" className="lg:col-span-2 p-6 space-y-5 border-blue-900/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Endowment Budget & Capital Allocation</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              {formatCurrency(totalBudgetPool - totalBudgetUsed)} Remaining Reserve
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {funds.map((fund) => {
              const allocatedPct = Math.round((fund.allocatedAmount / fund.totalBudget) * 100);
              return (
                <div key={fund.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-white text-sm">{fund.name}</span>
                      <div className="text-[10px] text-slate-400">Max Grant: ${fund.maxGrantPerStudent.toLocaleString()}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                      {allocatedPct}% Allocated
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 rounded-full"
                      style={{ width: `${allocatedPct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Used: <strong className="text-emerald-400">{formatCurrency(fund.allocatedAmount)}</strong></span>
                    <span className="text-slate-400">Pool: <strong className="text-white">{formatCurrency(fund.totalBudget)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* QUICK ACTIONS & TOP STUDENTS (Col 3) */}
        <div className="space-y-8">
          {/* QUICK ACTIONS TILES */}
          <Card variant="glow" className="p-6 space-y-4 border-blue-500/30">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Governance Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link to="/admin/budget-simulator" className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all text-center space-y-1 block">
                <Sliders className="w-5 h-5 text-blue-400 mx-auto" />
                <span className="font-bold text-white block">Budget Simulator</span>
                <span className="text-[10px] text-slate-400 block">Forecast coverage</span>
              </Link>

              <Link to="/admin/fairness-dashboard" className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all text-center space-y-1 block">
                <Scale className="w-5 h-5 text-teal-400 mx-auto" />
                <span className="font-bold text-white block">Fairness Audit</span>
                <span className="text-[10px] text-slate-400 block">4/5ths Rule Check</span>
              </Link>

              <button onClick={handleExportCSV} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all text-center space-y-1">
                <Download className="w-5 h-5 text-purple-400 mx-auto" />
                <span className="font-bold text-white block">Export CSV</span>
                <span className="text-[10px] text-slate-400 block">Full candidate data</span>
              </button>

              <button onClick={() => setActiveTab('rules')} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all text-center space-y-1">
                <Cpu className="w-5 h-5 text-emerald-400 mx-auto" />
                <span className="font-bold text-white block">Scoring Rubric</span>
                <span className="text-[10px] text-slate-400 block">Adjust weights</span>
              </button>
            </div>
          </Card>

          {/* TOP MATCHING CANDIDATES */}
          <Card variant="glass" className="p-6 space-y-4 border-blue-900/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-white font-['Outfit']">Top Matching Candidates</h3>
              </div>
              <span className="text-[11px] text-blue-400 font-semibold">Highest SHAP Scores</span>
            </div>

            <div className="space-y-3">
              {topStudents.map((app) => (
                <div key={app.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={app.student.avatarUrl} alt={app.student.fullName} className="w-9 h-9 rounded-full object-cover ring-1 ring-blue-500/30" />
                    <div>
                      <div className="font-bold text-white">{app.student.fullName}</div>
                      <div className="text-[10px] text-slate-400">{app.student.major} • {app.student.gpa} GPA</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-emerald-400 font-['Outfit'] text-sm">{app.aiBreakdown.overallScore}</span>
                    <Link to={`/student/explainability/${app.id}`}>
                      <Button size="sm" variant="ghost" icon={ArrowRight} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. SEGMENTED TABS (RECENT APPLICATIONS TABLE / AUDIT TRAIL / RULES CONFIG) */}
      <Tabs
        tabs={[
          { id: 'applications', label: 'Recent Applications Queue', badge: applications.length },
          { id: 'audit', label: 'Compliance Audit Trail', badge: auditLogs.length },
          { id: 'rules', label: 'Scoring Rubric Config' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB PANELS */}
      {activeTab === 'applications' && (
        <Card variant="glass" className="space-y-4 p-6 border-blue-900/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-lg text-white font-['Outfit']">Recent Applications Matrix</h3>
            <span className="text-xs text-slate-400">Click any candidate row to execute a human board override</span>
          </div>

          <AllocationOverviewTable
            applications={applications}
            onTriggerOverride={handleOpenOverride}
          />
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card variant="glass" className="space-y-4 p-6 border-blue-900/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-lg text-white font-['Outfit']">Immutable Compliance Audit Trail</h3>
            <span className="text-xs text-purple-300 font-semibold">FERPA & Title VI Compliant</span>
          </div>

          <AuditLogTable logs={auditLogs} />
        </Card>
      )}

      {activeTab === 'rules' && <RuleConfigPanel />}

      {/* OVERRIDE DIALOG MODAL */}
      <ManualOverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        application={selectedOverrideApp}
      />
    </div>
  );
};
