// src/components/common/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Seal Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-700 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <span className="font-extrabold text-base text-white font-['Outfit']">AllocAI System</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official Autonomous Higher Education Scholarship Allocation System. Audited under Federal FERPA & Title VI algorithmic transparency standards.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 pt-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Department of Higher Education Equity</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">System Directory</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home Overview</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">AI Ethics Statement</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Support & Decision Appeals</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-blue-400 transition-colors">Student Portal</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-blue-400 transition-colors">Admin Governance Board</Link></li>
            </ul>
          </div>

          {/* AI Explainability & Audits */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Governance & Audits</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/admin/fairness-dashboard" className="hover:text-blue-400 transition-colors">Demographic Parity Audit</Link></li>
              <li><Link to="/admin/budget-simulator" className="hover:text-blue-400 transition-colors">Budget Simulator Engine</Link></li>
              <li><Link to="/student/explainability/app-001" className="hover:text-blue-400 transition-colors">SHAP Feature Weights Matrix</Link></li>
              <li><span className="text-slate-500">IEEE Ethics Certification v3.4</span></li>
            </ul>
          </div>

          {/* System Security & Verification Status */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Security & Compliance</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI Scoring Pipeline: Active</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Encrypted payload processing with real-time demographic parity verification.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-slate-500">
              <Lock className="w-3 h-3 text-blue-400" />
              <span>AES-256 Data Encryption Standard</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>© 2026 AllocAI Scholarship Allocation System. Official Government & Higher Education Release.</div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-300">Terms of Governance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
