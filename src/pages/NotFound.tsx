// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white font-['Outfit']">404 - Page Not Found</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          The requested page route could not be found in the scholarship allocation system network.
        </p>
      </div>
      <Link to="/">
        <Button variant="glow" icon={ArrowLeft}>
          Return to Overview
        </Button>
      </Link>
    </div>
  );
};
