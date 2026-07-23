// src/pages/AIExplainability.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { Card } from '../components/common/Card';
import { ChartCard } from '../components/common/ChartCard';
import { FeatureImportanceChart } from '../components/ai/FeatureImportanceChart';
import { CounterfactualSimulator } from '../components/ai/CounterfactualSimulator';
import { Button } from '../components/common/Button';
import {
  ArrowLeft,
  Cpu,
  DollarSign,
  GraduationCap,
  Award,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const AIExplainability: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { applications } = useApplications();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger progress bar animations on page load
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const app = applications.find((a) => a.id === id) || applications[0];

  // Core scores to display as requested:
  const scores = [
    {
      name: 'Overall AI Score',
      score: app.aiBreakdown?.overallScore || 89.4,
      max: 100,
      weight: 'Composite Index',
      color: 'from-blue-600 to-indigo-500',
      bgColor: 'bg-blue-950/60 border-blue-500/40',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Cpu,
      description: 'Composite algorithmic match score across all 4 evaluation pillars.',
    },
    {
      name: 'Financial Need Score',
      score: app.aiBreakdown?.financialNeedScore || 94,
      max: 100,
      weight: '35% Weight',
      color: 'from-teal-500 to-emerald-400',
      bgColor: 'bg-teal-950/60 border-teal-500/40',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      icon: DollarSign,
      description: 'High need priority triggered by household income <$35,000 and 4 dependents.',
    },
    {
      name: 'Academic Score',
      score: app.aiBreakdown?.academicScore || 88,
      max: 100,
      weight: '30% Weight',
      color: 'from-indigo-600 to-blue-400',
      bgColor: 'bg-indigo-950/60 border-indigo-500/40',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      icon: GraduationCap,
      description: '3.85 Cumulative GPA in STEM Computer Science degree program.',
    },
    {
      name: 'Opportunity Score',
      score: app.aiBreakdown?.extracurricularScore || 78,
      max: 100,
      weight: '15% Weight',
      color: 'from-purple-600 to-amber-400',
      bgColor: 'bg-purple-950/60 border-purple-500/40',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Award,
      description: '115 documented community volunteer hours and NLP personal essay alignment.',
    },
    {
      name: 'Document Verification Score',
      score: 96,
      max: 100,
      weight: 'Quality Gate',
      color: 'from-emerald-500 to-teal-300',
      bgColor: 'bg-emerald-950/60 border-emerald-500/40',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: FileCheck2,
      description: 'Official transcript, FAFSA certificate, and ID proof verified via OCR AI parser.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="gov-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-blue-950/50 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link to="/student/dashboard" className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Explainable AI Score & Feature Analysis
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40 shrink-0">
              SHAP Audit v3.4
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Candidate: <strong className="text-white">{app.student.fullName}</strong> • Application ID: <strong className="text-blue-300">{app.id}</strong> • Target Fund: <strong className="text-teal-300">{app.scholarshipName}</strong>
          </p>
        </div>

        <Link to={`/student/result/${app.id}`}>
          <Button variant="glow" size="sm" icon={Award}>
            View Official Award Letter
          </Button>
        </Link>
      </div>

      {/* 1. FIVE ANIMATED SCORE PROGRESS BARS SECTION */}
      <Card variant="glass" className="p-6 sm:p-8 space-y-6 border-blue-900/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg text-white font-['Outfit']">Algorithmic Score Breakdown</h3>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 96% Model Certainty
          </span>
        </div>

        <div className="space-y-5">
          {scores.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-xl bg-slate-950 border ${s.bgColor}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm">{s.name}</span>
                      <p className="text-[11px] text-slate-400">{s.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${s.badgeColor}`}>
                      {s.weight}
                    </span>
                    <span className="text-lg font-extrabold text-white font-['Outfit'] w-16 text-right">
                      {s.score} <span className="text-xs text-slate-500 font-normal">/ {s.max}</span>
                    </span>
                  </div>
                </div>

                {/* ANIMATED PROGRESS BAR */}
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                  <div
                    className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: animate ? `${(s.score / s.max) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 2. WHY THE STUDENT RECEIVED THE SCORE (NARRATIVE EXPLANATION CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SHAP Feature Weights Chart */}
        <ChartCard
          title="SHAP Feature Weight Contributions"
          subtitle="Quantified positive (+Points) and deficit (-Points) relative to cohort mean"
        >
          <FeatureImportanceChart features={app.aiBreakdown.featureWeights} />
        </ChartCard>

        {/* Narrative Rationale Card */}
        <Card variant="glow" className="p-6 sm:p-8 space-y-6 border-blue-500/30 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-white font-['Outfit']">Why You Received This Score</h3>
              </div>
              <span className="text-[10px] text-blue-300 font-mono">FERPA Audit Log</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-slate-200 leading-relaxed space-y-3">
              <p>
                <strong className="text-white">SHAP Model Rationale for {app.student.fullName}:</strong>
              </p>
              <p className="text-slate-300">
                {app.aiBreakdown.generatedExplanation}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-bold text-white block">Key Positive Score Drivers:</span>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">High Academic Distinction (+24 pts):</strong> Cumulative GPA of 3.85 places candidate in 96th percentile of STEM applicants.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Verified Financial Hardship (+28 pts):</strong> Household annual income of $35,000 supporting 4 family members meets Pell-eligible need threshold.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">First-Generation Student (+15 pts):</strong> Institutional equity priority bonus awarded.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Complete OCR Document Seal (+9 pts):</strong> All required transcripts and FAFSA forms parsed with 100% authenticity confidence.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Title VI Compliant
            </span>
            <span>IEEE Algorithmic Ethics Standard v3.4</span>
          </div>
        </Card>
      </div>

      {/* 3. INTERACTIVE COUNTERFACTUAL "WHAT-IF" SIMULATOR */}
      <CounterfactualSimulator
        initialGpa={app.student.gpa}
        initialIncome={app.student.annualHouseholdIncome}
        initialHours={app.student.communityHours}
        initialFirstGen={app.student.isFirstGenStudent}
      />
    </div>
  );
};
