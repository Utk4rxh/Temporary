// src/pages/Documents.tsx
import React from 'react';
import { Card } from '../components/common/Card';
import { DocumentUpload } from '../components/student/DocumentUpload';
import { FileText, CheckCircle2, Download } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Documents: React.FC = () => {
  const documents = [
    { id: 'doc-1', name: 'Official_Academic_Transcript_2026.pdf', type: 'PDF Transcript', size: '2.4 MB', status: 'AI Verified', date: '2026-07-15' },
    { id: 'doc-2', name: 'FAFSA_Tax_Return_Verification.pdf', type: 'Income Verification', size: '1.8 MB', status: 'AI Verified', date: '2026-07-15' },
    { id: 'doc-3', name: 'Faculty_Recommendation_Letter.pdf', type: 'Recommendation', size: '890 KB', status: 'AI Verified', date: '2026-07-16' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      <div className="gov-panel p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">Document Vault & Verification</h1>
        <p className="text-xs text-slate-400">All uploaded credentials are FERPA encrypted and scanned via OCR AI parser.</p>
      </div>

      <Card variant="glass" className="p-6 space-y-4 border-blue-900/30">
        <h3 className="font-bold text-lg text-white font-['Outfit']">Upload Additional Credentials</h3>
        <DocumentUpload />
      </Card>

      <Card variant="glass" className="p-6 space-y-4 border-blue-900/30">
        <h3 className="font-bold text-lg text-white font-['Outfit']">Verified Document Repository</h3>
        <div className="space-y-3 text-xs">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{doc.name}</div>
                  <div className="text-slate-400 text-[11px]">{doc.type} • {doc.size} • Uploaded {doc.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
                <Button size="sm" variant="ghost" icon={Download} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
