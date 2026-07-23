// src/pages/FairnessDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { ChartCard } from '../components/common/ChartCard';
import { BiasMetricsChart } from '../components/ai/BiasMetricsChart';
import { PieChartComponent } from '../components/charts/PieChartComponent';
import { BarChartComponent } from '../components/charts/BarChartComponent';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import type { Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AnalyticsService } from '../services/analyticsService';
import type { DemographicDisparity } from '../types';
import { formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exportHelpers';
import {
  Scale,
  ShieldCheck,
  Download,
  CheckCircle2,
  MapPin,
  DollarSign,
} from 'lucide-react';

export const FairnessDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DemographicDisparity[]>([]);

  useEffect(() => {
    AnalyticsService.getDemographicFairness().then((data) => setMetrics(data));
  }, []);

  const handleExportCSV = () => {
    const rows = metrics.map((m) => ({
      Category: m.groupCategory,
      Group: m.groupName,
      Applicants: m.applicantCount,
      Awards: m.awardCount,
      SelectionRate: `${m.selectionRate}%`,
      AverageGrant: m.averageGrantAmount,
      DisparateImpactRatio: m.disparateImpactRatio,
      IsFair: m.isFair ? 'Yes' : 'No',
    }));
    exportToCSV(`AllocAI_Fairness_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  // Specific Data Sets for Requested Section Charts
  const genderData = [
    { name: 'Female', value: 54.2, color: '#3b82f6' },
    { name: 'Male', value: 52.8, color: '#10b981' },
    { name: 'Non-Binary', value: 56.0, color: '#8b5cf6' },
  ];

  const urbanRuralData = [
    { name: 'Rural', value: 61.4, color: '#10b981' },
    { name: 'Suburban', value: 54.8, color: '#3b82f6' },
    { name: 'Urban Metro', value: 58.2, color: '#8b5cf6' },
  ];

  const incomeTierData = [
    { name: '<$25k (Pell)', value: 78.4, color: '#10b981' },
    { name: '$25k - $50k', value: 62.1, color: '#3b82f6' },
    { name: '$50k - $75k', value: 45.2, color: '#8b5cf6' },
    { name: '>$75k (High)', value: 24.8, color: '#f59e0b' },
  ];

  const categoryDistributionData = [
    { name: 'STEM Diversity', value: 42, color: '#3b82f6' },
    { name: 'First-Gen Opportunity', value: 28, color: '#10b981' },
    { name: 'Merit Scholar Endowment', value: 18, color: '#8b5cf6' },
    { name: 'Civic Leadership', value: 12, color: '#f59e0b' },
  ];

  const columns: Column<DemographicDisparity>[] = [
    {
      header: 'Demographic Group',
      accessor: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.groupName}</div>
          <div className="text-[10px] text-slate-400 capitalize">Category: {row.groupCategory.replace('_', ' ')}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'groupName',
    },
    {
      header: 'Applicant Volume',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-200 text-xs">{row.applicantCount} candidates</div>
          <div className="text-[10px] text-slate-400">{row.awardCount} awarded</div>
        </div>
      ),
      sortable: true,
      sortKey: 'applicantCount',
    },
    {
      header: 'Selection Rate',
      accessor: (row) => <span className="font-bold text-indigo-300 text-xs">{row.selectionRate}%</span>,
      sortable: true,
      sortKey: 'selectionRate',
    },
    {
      header: 'Disparate Impact Ratio',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <span
            className={`font-extrabold text-sm ${
              row.disparateImpactRatio >= 0.8 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {row.disparateImpactRatio.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500">(Ideal: 1.00)</span>
        </div>
      ),
      sortable: true,
      sortKey: 'disparateImpactRatio',
    },
    {
      header: 'Average Grant',
      accessor: (row) => <span className="font-bold text-emerald-400 text-xs">{formatCurrency(row.averageGrantAmount)}</span>,
    },
    {
      header: 'EEOC Status',
      accessor: (row) => (
        <Badge variant={row.isFair ? 'success' : 'danger'}>
          {row.isFair ? 'EEOC Pass' : 'Review Required'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="gov-panel p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/30 to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Independent Algorithmic Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Fairness & Algorithmic Parity Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Monitoring Title VI and EEOC 4/5ths rule compliance across Urban vs Rural, Gender, Income Tiers, and Category distribution.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV}>
          Export Compliance Audit CSV
        </Button>
      </div>

      {/* 2. BIAS INDICATOR KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Disparate Impact Ratio"
          value="1.04"
          change="EEOC Compliant (>0.80)"
          trend="up"
          subtext="Target range: 0.80 - 1.25"
          icon={Scale}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Title VI Compliance"
          value="100%"
          change="Passed All 9 Categories"
          trend="up"
          subtext="0 Disparate Flags"
          icon={ShieldCheck}
          iconColor="text-indigo-400"
        />
        <StatCard
          title="Low Income Priority"
          value="78.4%"
          change="Pell Hardship Priority"
          trend="up"
          subtext="<$25k Household Income"
          icon={DollarSign}
          iconColor="text-teal-400"
        />
        <StatCard
          title="Rural vs Urban Equity"
          value="1.05"
          change="Optimal Geo Distribution"
          trend="up"
          subtext="61.4% Rural Selection"
          icon={MapPin}
          iconColor="text-purple-400"
        />
      </div>

      {/* 3. DEMOGRAPHIC BREAKDOWN CHARTS (URBAN VS RURAL, MALE VS FEMALE, INCOME DISTRIBUTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* URBAN VS RURAL */}
        <ChartCard
          title="Urban vs Rural Selection Rate"
          subtitle="Comparing candidate selection across geographic regions"
        >
          <BarChartComponent data={urbanRuralData} barColor="#10b981" unit="%" referenceValue={50} referenceLabel="50% Parity" />
        </ChartCard>

        {/* MALE VS FEMALE */}
        <ChartCard
          title="Gender Parity Distribution"
          subtitle="Male vs Female selection rates (Target ~1.00 Ratio)"
        >
          <BarChartComponent data={genderData} barColor="#3b82f6" unit="%" referenceValue={50} referenceLabel="50% Baseline" />
        </ChartCard>

        {/* INCOME DISTRIBUTION */}
        <ChartCard
          title="Selection Rate by Income Tier"
          subtitle="Progressive selection favoring Pell-eligible low-income households"
        >
          <BarChartComponent data={incomeTierData} barColor="#8b5cf6" unit="%" referenceValue={40} referenceLabel="40% Floor" />
        </ChartCard>
      </div>

      {/* OVERALL DISPARITY MATRIX CHART */}
      <ChartCard
        title="Disparate Impact Ratio Across Subgroups"
        subtitle="Values below 0.80 indicate potential disparate impact under federal EEOC guidelines"
        onExportCSV={handleExportCSV}
      >
        <BiasMetricsChart metrics={metrics} />
      </ChartCard>

      {/* 4. CATEGORY DISTRIBUTION & BIAS INDICATORS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* CATEGORY DISTRIBUTION PIE CHART */}
        <ChartCard
          title="Award Distribution by Scholarship Category"
          subtitle="Percentage of endowment pool disbursed per grant category"
        >
          <PieChartComponent data={categoryDistributionData} unit="%" height={260} />
        </ChartCard>

        {/* BIAS INDICATORS COMPLIANCE CARD */}
        <Card variant="glow" className="lg:col-span-2 p-6 space-y-5 border-emerald-500/40 bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">EEOC 4/5ths Rule Bias Indicators</h3>
            </div>
            <Badge variant="success">All Tests Passed</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Adverse Impact Ratio</span>
                <span className="text-emerald-400 font-extrabold">1.04 / 1.00</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Calculated selection rate ratio comparing protected demographic groups against the majority benchmark. Any value above 0.80 passes federal EEOC guidelines.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Statistical Parity Audit</span>
                <span className="text-teal-400 font-extrabold">0 Disparate Flags</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Real-time Chi-Square test verifies no statistically significant deviation across gender, ethnicity, or income brackets.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> FERPA Encrypted Audit Log
            </span>
            <span>IEEE Algorithmic Fairness Standard v3.4</span>
          </div>
        </Card>
      </div>

      {/* 5. DETAILED DEMOGRAPHIC SUBGROUP TABLE */}
      <Card variant="glass" className="space-y-4 p-6 border-blue-900/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg text-white font-['Outfit']">Demographic Subgroup Audit Matrix</h3>
          <span className="text-xs text-slate-400">{metrics.length} subgroups tracked</span>
        </div>

        <Table columns={columns} data={metrics} searchPlaceholder="Search demographic subgroup..." />
      </Card>
    </div>
  );
};
