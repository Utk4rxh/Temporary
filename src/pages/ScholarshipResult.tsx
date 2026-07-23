// src/pages/ScholarshipResult.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ApplicationStatusTracker } from '../components/student/ApplicationStatusTracker';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Cpu,
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  FileCheck2,
  XCircle,
  Building2,
  Calendar,
} from 'lucide-react';

export const ScholarshipResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { applications } = useApplications();

  const app = applications.find((a) => a.id === id) || applications[0];

  const isApproved = app.status === 'approved' || app.status === 'overridden';

  // Helper to generate downloadable text certificate
  const handleDownloadLetter = () => {
    const letterText = `
================================================================================
          OFFICIAL SCHOLARSHIP AWARD CERTIFICATE - DEPARTMENT OF EQUITY
================================================================================

Date: ${new Date().toLocaleDateString()}
Application Reference ID: ${app.id}

CONGRATULATIONS, ${app.student.fullName.toUpperCase()}!

We are pleased to inform you that your application for the ${app.scholarshipName}
has been officially APPROVED under the Autonomous Higher Education Allocation Protocol.

--------------------------------------------------------------------------------
AWARD SUMMARY
--------------------------------------------------------------------------------
Scholarship Fund: ${app.scholarshipName}
Requested Funding: ${formatCurrency(app.requestedAmount)}
Total Awarded Amount: ${formatCurrency(app.awardedAmount || app.requestedAmount)}
Composite AI Score: ${app.aiBreakdown?.overallScore || 89.4} / 100
Verification Seal: 256-Bit FERPA Encrypted (Title VI Audited)

--------------------------------------------------------------------------------
REASON FOR SELECTION
--------------------------------------------------------------------------------
1. High Academic Distinction: Cumulative GPA of ${app.student.gpa.toFixed(2)} in ${app.student.major}.
2. Demonstrated Financial Need: Household Income of $${app.student.annualHouseholdIncome.toLocaleString()} meeting priority thresholds.
3. Institutional Equity Priority: First-generation college student enhancement.
4. Document Authenticity: 100% OCR verified credentials.

Disbursement Schedule: Fall 2026 Direct University Transfer
Institution: ${app.student.university}

Official Seal: AllocAI Higher Education Allocation Board
================================================================================
    `;

    const blob = new Blob([letterText.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AllocAI_Award_Letter_${app.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fadeIn">
      {/* Back Link */}
      <Link to="/student/dashboard" className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
      </Link>

      {/* MODERN SUCCESS CARD UI */}
      <Card
        variant="glow"
        className={`p-6 sm:p-10 space-y-8 relative overflow-hidden border-2 ${
          isApproved
            ? 'bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 border-emerald-500/50 shadow-glow-emerald'
            : 'bg-gradient-to-br from-slate-950 via-rose-950/40 to-slate-950 border-rose-500/50 shadow-glow-rose'
        }`}
      >
        {/* Top Victory / Status Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Official Decision Notification
              </span>
              <Badge status={app.status} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              {isApproved ? (
                <span className="flex items-center gap-3">
                  <span>Congratulations, Award Approved!</span>
                  <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse hidden sm:block" />
                </span>
              ) : (
                <span className="text-rose-400">Application Under Review</span>
              )}
            </h1>

            <p className="text-xs text-slate-300">
              Scholarship Fund: <strong className="text-white">{app.scholarshipName}</strong> • Ref ID: <strong className="text-blue-300">{app.id}</strong>
            </p>
          </div>

          {/* AI Score Radial Pill */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/40 text-center shrink-0">
            <div className="text-[10px] font-bold uppercase text-slate-400">AI Match Index</div>
            <div className="text-3xl font-extrabold text-white font-['Outfit']">
              {app.aiBreakdown?.overallScore || 89.4} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">96% Model Certainty</div>
          </div>
        </div>

        {/* 1. AWARD AMOUNT CARD & ACTION BUTTONS */}
        {isApproved ? (
          <div className="gov-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center md:justify-start gap-1">
                <Award className="w-4 h-4" /> Total Award Granted
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
                {formatCurrency(app.awardedAmount || 95000)}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-300 pt-1">
                <span>Requested: <strong>{formatCurrency(app.requestedAmount)}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-blue-300 font-semibold">
                  <Calendar className="w-3.5 h-3.5" /> Fall 2026 Disbursement
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS (DOWNLOAD LETTER & VIEW EXPLANATION) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button size="lg" variant="glow" icon={Download} onClick={handleDownloadLetter}>
                Download Award Letter
              </Button>
              <Link to={`/student/explainability/${app.id}`}>
                <Button size="lg" variant="outline" icon={Cpu}>
                  View Explanation
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3">
            <div className="flex items-center space-x-2 text-rose-300 font-bold">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Application Decision Update</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your application is currently under board review. You can inspect your SHAP score breakdown or submit an appeal through the support desk.
            </p>
            <Link to={`/student/explainability/${app.id}`}>
              <Button size="sm" variant="outline" icon={Cpu}>
                View AI Score Explanation
              </Button>
            </Link>
          </div>
        )}

        {/* 2. REASON FOR SELECTION CARD */}
        <Card variant="glass" className="p-6 space-y-4 border-blue-900/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Key Reasons for Selection</h3>
            </div>
            <span className="text-xs text-blue-400 font-semibold">SHAP Audit Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Academic Distinction (+24 pts)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Cumulative GPA of <strong className="text-white">{app.student.gpa.toFixed(2)}</strong> in {app.student.major} placed candidate in the 96th percentile of STEM applicants.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> Demonstrated Financial Need (+28 pts)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Household income of <strong className="text-white">${app.student.annualHouseholdIncome.toLocaleString()}</strong> supporting 4 dependents qualifies for priority Pell endowment funding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> First-Gen Equity Enhancement (+15 pts)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                First-generation college student status awarded institutional diversity alignment points.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> 100% Verified OCR Documents (+9 pts)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Official transcripts and FAFSA certificates parsed with full authenticity confidence.
              </p>
            </div>
          </div>
        </Card>

        {/* HUMAN OVERRIDE NOTICE IF APPLICABLE */}
        {app.isOverridden && app.overrideReason && (
          <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs text-purple-200 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Human Board Governance Override Active
            </div>
            <p className="leading-relaxed">{app.overrideReason}</p>
            <div className="text-[10px] text-purple-300 pt-1">
              Signed by {app.overriddenBy} on {formatDate(app.overriddenAt || '')}
            </div>
          </div>
        )}

        {/* 3. STAGE LIFECYCLE TIMELINE */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <FileCheck2 className="w-4 h-4 text-blue-400" />
            <span>Application Evaluation Lifecycle Timeline</span>
          </div>

          <ApplicationStatusTracker status={app.status} isOverridden={app.isOverridden} />
        </div>
      </Card>
    </div>
  );
};
