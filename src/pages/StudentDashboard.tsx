// src/pages/StudentDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ScoreBreakdownGauge } from '../components/ai/ScoreBreakdownGauge';
import { ApplicationStatusTracker } from '../components/student/ApplicationStatusTracker';
import { useApplications } from '../context/ApplicationContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  Award,
  FileText,
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  ShieldCheck,
  Building2,
  FileCheck2,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { applications } = useApplications();
  const { userName, userAvatar } = useAuth();

  const currentApp = applications[0] || {
    id: 'app-001',
    student: {
      fullName: userName,
      major: 'Computer Science',
      university: 'University of California',
      gpa: 3.85,
      annualHouseholdIncome: 35000,
    },
    scholarshipName: 'Global STEM Excellence Fund',
    requestedAmount: 100000,
    awardedAmount: 95000,
    status: 'approved' as const,
    submittedAt: '2026-07-15T10:30:00Z',
    aiBreakdown: {
      overallScore: 89.4,
      academicScore: 88,
      financialNeedScore: 94,
      equityDiversityScore: 85,
      extracurricularScore: 78,
      confidenceScore: 0.96,
      recommendation: 'strong_award' as const,
      recommendedGrantAmount: 95000,
      generatedExplanation:
        'High Academic GPA (3.85) combined with significant financial hardship (<$35k household income) places candidate in 98th percentile for STEM endowment eligibility.',
      featureWeights: [
        { featureName: 'Cumulative GPA', shapValue: 24, category: 'academic' as const, value: '3.85', impactDescription: '+24 pts academic weight' },
        { featureName: 'Household Income', shapValue: 28, category: 'financial' as const, value: '$35,000', impactDescription: '+28 pts need threshold' },
        { featureName: 'First-Gen Status', shapValue: 15, category: 'equity' as const, value: 'Yes', impactDescription: '+15 pts equity bonus' },
      ],
    },
    documents: [
      { name: 'Official_Transcript_2026.pdf', type: 'PDF', verified: true, url: '#' },
      { name: 'FAFSA_Income_Verification.pdf', type: 'PDF', verified: true, url: '#' },
      { name: 'Faculty_Recommendation_Letter.pdf', type: 'PDF', verified: true, url: '#' },
      { name: 'Civic_Leadership_Resume.pdf', type: 'PDF', verified: true, url: '#' },
    ],
  };

  const activities = [
    { id: 1, text: 'AI Pipeline score calculation completed', time: '2 hours ago', icon: Cpu, color: 'text-blue-400' },
    { id: 2, text: 'FAFSA Financial Verification document verified', time: '1 day ago', icon: FileCheck2, color: 'text-emerald-400' },
    { id: 3, text: 'Application APP-001 submitted to STEM Fund', time: '3 days ago', icon: Award, color: 'text-purple-400' },
    { id: 4, text: 'Student Profile Created & FERPA Verified', time: '5 days ago', icon: ShieldCheck, color: 'text-teal-400' },
  ];

  const docs = currentApp.documents || [];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* 1. WELCOME CARD */}
      <div className="gov-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={userAvatar}
            alt={userName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Student Portal</span>
              <Badge status={currentApp.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Welcome back, {userName}!
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentApp.student.university} • {currentApp.student.major}</span>
              <span className="text-blue-400 font-semibold">• {currentApp.student.gpa} GPA</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link to="/student/apply">
            <Button size="sm" variant="glow" icon={Award}>
              New Application
            </Button>
          </Link>
          <Link to={`/student/explainability/${currentApp.id}`}>
            <Button size="sm" variant="outline" icon={Cpu}>
              View AI Score Breakdown
            </Button>
          </Link>
        </div>
      </div>

      {/* GRID LAYOUT FOR CORE DASHBOARD CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT & CENTER COLS (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. APPLICATION STATUS & LIFECYCLE TRACKER */}
          <Card variant="glass" className="space-y-4 p-6 border-blue-900/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-white font-['Outfit'] flex items-center gap-2">
                  <span>Application Lifecycle Status</span>
                  <span className="text-[10px] text-blue-400 font-mono">ID: {currentApp.id}</span>
                </h3>
                <p className="text-xs text-slate-400">Target Fund: {currentApp.scholarshipName}</p>
              </div>
              <Badge status={currentApp.status} />
            </div>

            <ApplicationStatusTracker status={currentApp.status} />
          </Card>

          {/* 3. SCHOLARSHIP STATUS CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card variant="glass" className="space-y-3 p-6 border-blue-900/30">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Target Scholarship Fund</span>
                <Award className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-extrabold text-white font-['Outfit']">{currentApp.scholarshipName}</div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                <span className="text-slate-400">Requested:</span>
                <span className="font-bold text-slate-200">{formatCurrency(currentApp.requestedAmount || 100000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">AI Recommended:</span>
                <span className="font-extrabold text-emerald-400">{formatCurrency(currentApp.awardedAmount || 95000)}</span>
              </div>
            </Card>

            <Card variant="glass" className="space-y-3 p-6 border-blue-900/30">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Grant Disbursement</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-extrabold text-emerald-400 font-['Outfit']">
                {formatCurrency(currentApp.awardedAmount || 95000)}
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                <span className="text-slate-400">Disbursement Status:</span>
                <span className="font-bold text-blue-400">Scheduled for Fall 2026</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Verification Seal:</span>
                <span className="font-semibold text-teal-300">FERPA Compliant</span>
              </div>
            </Card>
          </div>

          {/* 5. UPLOADED DOCUMENTS WIDGET */}
          <Card variant="glass" className="space-y-4 p-6 border-blue-900/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-white font-['Outfit']">Uploaded Verification Documents</h3>
              </div>
              <Link to="/student/documents">
                <Button size="sm" variant="ghost" icon={Upload}>
                  Upload File
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {docs.map((doc, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-blue-950 text-blue-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">{doc.type} • AI Verified</div>
                    </div>
                  </div>
                  <Badge variant="success" dot={false} className="shrink-0 text-[10px]">
                    Verified
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (1 Col) */}
        <div className="space-y-8">
          {/* 4. AI SCORE CARD */}
          <Card variant="glow" className="space-y-4 p-6 border-blue-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-white font-['Outfit']">AI Match Score</h3>
              </div>
              <span className="text-xs text-blue-400 font-bold">SHAP v3.4</span>
            </div>

            {/* Score Radial Breakdown Gauge Component */}
            <ScoreBreakdownGauge
              overallScore={currentApp.aiBreakdown?.overallScore || 89}
              academicScore={currentApp.aiBreakdown?.academicScore || 88}
              financialNeedScore={currentApp.aiBreakdown?.financialNeedScore || 94}
              equityDiversityScore={currentApp.aiBreakdown?.equityDiversityScore || 85}
              extracurricularScore={currentApp.aiBreakdown?.extracurricularScore || 78}
            />

            <div className="pt-3">
              <Link to={`/student/explainability/${currentApp.id}`}>
                <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight} iconPosition="right">
                  Inspect SHAP Feature Drivers
                </Button>
              </Link>
            </div>
          </Card>

          {/* 6. RECENT ACTIVITY TIMELINE */}
          <Card variant="glass" className="space-y-4 p-6 border-blue-900/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-white font-['Outfit']">Recent Activity</h3>
              </div>
              <span className="text-[11px] text-slate-400">Real-time</span>
            </div>

            <div className="space-y-4">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start space-x-3 text-xs">
                    <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 ${act.color} shrink-0 mt-0.5`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-200 font-medium leading-tight">{act.text}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{act.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
