// src/pages/About.tsx
import React from 'react';
import { Card } from '../components/common/Card';
import { ShieldCheck, Scale, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 animate-fadeIn">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Governance Framework</span>
        <h1 className="text-4xl font-extrabold text-white font-['Outfit']">Algorithmic Ethics & Transparency Statement</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          How AllocAI ensures equal opportunity, prevents systemic bias, and maintains total human oversight over financial distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white font-['Outfit']">1. Explainability First (SHAP)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike "black box" machine learning models, every score produced by AllocAI decomposes into intuitive Shapley Additive Explanations (SHAP). Students and board members can explicitly see how much each variable contributed.
          </p>
        </Card>

        <Card variant="glass" className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white font-['Outfit']">2. Disparate Impact Auditing</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The platform enforces the EEOC 4/5ths rule benchmark. If selection rates for any protected demographic group drop below 80% relative to the highest group, the system triggers an alert and prompts model recalibration.
          </p>
        </Card>

        <Card variant="glass" className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white font-['Outfit']">3. Mandatory Override Justification</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Human administrators have complete authority to override AI awards. However, to prevent nepotism or arbitrary edits, the system mandates a written justification recorded in an immutable audit trail.
          </p>
        </Card>

        <Card variant="glass" className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white font-['Outfit']">4. Right to Appeal & Re-Evaluation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every candidate who receives a borderline or non-award recommendation has an automated option to submit updated documentation or appeal for human board review.
          </p>
        </Card>
      </div>

      <Card variant="glow" className="p-8 space-y-4 text-xs">
        <h3 className="text-xl font-bold text-white font-['Outfit']">Technical Model Architecture</h3>
        <p className="text-slate-300 leading-relaxed">
          AllocAI employs a hybrid architecture combining Gradient Boosted Trees with constraints derived from linear programming. Academic merit (30%), Financial Need (35%), Equity/Diversity (20%), and Extracurricular Impact (15%) are normalized across regional economic indexes to eliminate geographical disparity.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-slate-400">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> FERPA Compliant</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Title VI Audited</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AES-256 Storage</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> IEEE Ethics Standard</div>
        </div>
      </Card>
    </div>
  );
};
