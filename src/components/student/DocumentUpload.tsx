// src/components/student/DocumentUpload.tsx
import React, { useState } from 'react';
import { UploadCloud, FileCheck2, Trash2, ShieldCheck } from 'lucide-react';

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  verified: boolean;
}

export const DocumentUpload: React.FC = () => {
  const [docs, setDocs] = useState<UploadedDoc[]>([
    { id: 'doc-1', name: 'Official_Transcript_2026.pdf', size: '2.4 MB', verified: true },
    { id: 'doc-2', name: 'FAFSA_Income_Verification_TaxReturn.pdf', size: '1.8 MB', verified: true },
  ]);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        verified: true,
      };
      setDocs([...docs, newDoc]);
    }
  };

  const removeDoc = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <label className="block text-slate-300 font-semibold">Supporting Documents (FAFSA, Transcripts, Recommendations)</label>
        <span className="text-emerald-400 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> FERPA Encrypted
        </span>
      </div>

      {/* Drag and Drop Zone */}
      <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/80 group">
        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all mb-2" />
        <span className="text-xs font-semibold text-slate-200">Click to upload or drag files here</span>
        <span className="text-[10px] text-slate-500 mt-1">Supports PDF, DOCX, PNG (Max 10MB per file)</span>
        <input type="file" onChange={handleSimulatedUpload} className="hidden" />
      </label>

      {/* Uploaded File List */}
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
          >
            <div className="flex items-center space-x-3">
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">{doc.name}</div>
                <div className="text-[10px] text-slate-400">{doc.size} • AI OCR Verified</div>
              </div>
            </div>

            <button
              onClick={() => removeDoc(doc.id)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
