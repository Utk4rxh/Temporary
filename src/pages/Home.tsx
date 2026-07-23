// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { EligibilityChecker } from '../components/student/EligibilityChecker';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Scale,
  Award,
  DollarSign,
  Users,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Cpu,
  FileCheck2,
  UserCheck,
  Lock,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { setRole } = useAuth();

  return (
    <div className="space-y-20 pb-16 animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Subtle Blue Grid & Glow Background Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a0f_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-700/20 via-sky-600/10 to-indigo-800/10 blur-[130px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Government + AI Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-xs font-bold text-blue-300 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Autonomous & Explainable AI Scholarship Allocation Protocol</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
            Fair, Transparent AI for <br />
            <span className="blue-gradient-text">Higher Education Equity</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating administrative friction, bias, and delays in student grant allocation. Powered by transparent SHAP feature weights, demographic parity auditing, and human-in-the-loop board governance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/student/apply">
              <Button size="lg" variant="glow" icon={Award}>
                Apply for Scholarships
              </Button>
            </Link>
            <Link to="/admin/dashboard" onClick={() => setRole('admin')}>
              <Button size="lg" variant="outline" icon={ShieldCheck}>
                Admin Governance Board
              </Button>
            </Link>
          </div>

          {/* Key Compliance Tags */}
          <div className="flex items-center justify-center space-x-6 pt-6 text-[11px] text-slate-400 border-t border-slate-800/80 max-w-xl mx-auto">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Title VI Audited
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> FERPA Compliant
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-teal-400" /> 4/5ths Rule Verified
            </span>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Institutional Impact</span>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Live System Metrics & Performance</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Endowment Capital Pool"
            value="$1,650,000"
            change="+12.4% vs 2025"
            trend="up"
            subtext="Across 4 active funds"
            icon={DollarSign}
            iconColor="text-emerald-400"
          />
          <StatCard
            title="Students Funded"
            value="482"
            change="94.2% Match Rate"
            trend="up"
            subtext="68 Universities Nationwide"
            icon={Users}
            iconColor="text-blue-400"
          />
          <StatCard
            title="Demographic Parity Ratio"
            value="1.04"
            change="EEOC Compliant"
            trend="up"
            subtext="Target range: 0.80 - 1.25"
            icon={Scale}
            iconColor="text-teal-400"
          />
          <StatCard
            title="Human Override Rate"
            value="3.2%"
            change="High Model Certainty"
            trend="neutral"
            subtext="15 Audit Logs Signed"
            icon={ShieldCheck}
            iconColor="text-purple-400"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">System Capabilities</span>
          <h2 className="text-3xl font-extrabold text-white font-['Outfit']">Architected for Trust & Complete Transparency</h2>
          <p className="text-xs text-slate-400">
            Engineered using machine learning explainability standards to ensure no decision is a black box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="glass" hoverEffect className="space-y-3 p-6 border-blue-900/30">
            <div className="p-3 w-fit rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white font-['Outfit']">SHAP Score Explainability</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Decomposes final evaluation scores into transparent positive (+Points) and negative (-Points) feature weights for student clarity.
            </p>
          </Card>

          <Card variant="glass" hoverEffect className="space-y-3 p-6 border-blue-900/30">
            <div className="p-3 w-fit rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white font-['Outfit']">4/5ths Rule Bias Auditing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Monitors demographic parity across gender, ethnicity, and income tiers to flag potential disparate impact automatically.
            </p>
          </Card>

          <Card variant="glass" hoverEffect className="space-y-3 p-6 border-blue-900/30">
            <div className="p-3 w-fit rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white font-['Outfit']">Human Board Governance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Allows administrators to override AI recommendations with mandatory written ethics justifications stored in an immutable log.
            </p>
          </Card>

          <Card variant="glass" hoverEffect className="space-y-3 p-6 border-blue-900/30">
            <div className="p-3 w-fit rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white font-['Outfit']">Interactive Budget Simulator</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provides real-time financial controls to tweak score cutoffs, max grant caps, and policy weights to forecast student coverage.
            </p>
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Process Workflow</span>
          <h2 className="text-3xl font-extrabold text-white font-['Outfit']">How AllocAI Allocates Grants</h2>
          <p className="text-xs text-slate-400">
            A seamless 4-step pipeline bridging student submissions with transparent board governance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Student Submission',
              desc: 'Candidates submit academic credentials, financial FAFSA disclosures, and essay responses through our encrypted wizard.',
              icon: FileCheck2,
            },
            {
              step: '02',
              title: 'SHAP AI Evaluation',
              desc: 'The model calculates academic merit (30%), financial need (35%), equity (20%), and leadership (15%) weights.',
              icon: Cpu,
            },
            {
              step: '03',
              title: 'Board Audit Review',
              desc: 'Scholarship board members inspect SHAP feature breakdowns and execute manual overrides if unquantified hardship exists.',
              icon: ShieldCheck,
            },
            {
              step: '04',
              title: 'Grant Disbursement',
              desc: 'Approved funding is locked and disbursed directly to candidate university financial accounts.',
              icon: Award,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} variant="glass" className="space-y-4 p-6 relative border-blue-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-blue-400/40 font-['Outfit']">{item.step}</span>
                  <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-bold text-base text-white font-['Outfit']">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE PREVIEW & ELIGIBILITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-semibold">Self-Assessment</span>
            <h2 className="text-3xl font-extrabold text-white font-['Outfit']">Estimate Your Scholarship Match Index</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test our SHAP AI scoring algorithm in real time before submitting your official application.
            </p>
          </div>

          <Card variant="glass" className="p-6 space-y-4 border-blue-900/30">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
              <span className="font-bold text-white">Active Scholarship Funds Open for 2026</span>
              <span className="text-emerald-400 font-semibold">4 Funds Recruiting</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="font-bold text-white">Global STEM Excellence Fund</div>
                <div className="text-emerald-400 font-semibold">Max Grant: $120,000</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="font-bold text-white">First-Gen Opportunity Grant</div>
                <div className="text-emerald-400 font-semibold">Max Grant: $100,000</div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <EligibilityChecker />
        </div>
      </section>

      {/* CALL TO ACTION (CTA) SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gov-panel p-8 sm:p-12 rounded-3xl border border-blue-500/40 bg-gradient-to-r from-slate-950 via-blue-950/50 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Official Portal Access</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Ready to experience transparent scholarship allocation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Submit your application in 4 simple steps or access the administrative governance board.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/student/apply">
              <Button size="lg" variant="glow" icon={ArrowRight} iconPosition="right">
                Apply for Scholarships
              </Button>
            </Link>
            <Link to="/admin/dashboard" onClick={() => setRole('admin')}>
              <Button size="lg" variant="outline" icon={ShieldCheck}>
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
