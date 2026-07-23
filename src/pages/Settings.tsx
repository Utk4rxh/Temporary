// src/pages/Settings.tsx
import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Lock } from 'lucide-react';

export const Settings: React.FC = () => {
  const { userName, role } = useAuth();

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-4xl">
      <div className="gov-panel p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">Account & Privacy Settings</h1>
        <p className="text-xs text-slate-400">Manage user profile settings, security credentials, and FERPA disclosure preferences.</p>
      </div>

      <Card variant="glass" className="p-6 space-y-6 border-blue-900/30">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <User className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-lg text-white font-['Outfit']">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              value={userName}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">System View Role</label>
            <input
              type="text"
              readOnly
              value={role.toUpperCase()}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-blue-400 font-bold"
            />
          </div>
        </div>
      </Card>

      <Card variant="glass" className="p-6 space-y-6 border-blue-900/30">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-lg text-white font-['Outfit']">Security & FERPA Privacy</h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="font-semibold text-white">Enable Anonymized SHAP Audit Profile</div>
              <div className="text-[11px] text-slate-400">Allows demographic parity engines to include your data in anonymized EEOC reports.</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="font-semibold text-white">Application Status Email Notifications</div>
              <div className="text-[11px] text-slate-400">Receive alerts when board members or AI scoring pipelines update status.</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
          </label>
        </div>

        <div className="pt-2">
          <Button variant="glow" size="sm" icon={ShieldCheck}>
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
};
