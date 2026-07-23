// src/pages/Contact.tsx
import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('appeal');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-fadeIn">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Support & Appeals</span>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">Algorithmic Support & Appeal Desk</h1>
        <p className="text-xs text-slate-400">
          Have questions about your AI score, want to submit an appeal, or report a discrepancy? Reach out directly to our board.
        </p>
      </div>

      {submitted ? (
        <Card variant="glow" className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">Inquiry Submitted Successfully</h3>
          <p className="text-xs text-slate-300">
            Your ticket has been logged into the board queue. An Ethics Committee member will respond within 48 business hours.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Submit Another Request
          </Button>
        </Card>
      ) : (
        <Card variant="glass">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aria Chen"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Inquiry Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="appeal">Decision Appeal / Special Hardship Evidence</option>
                <option value="discrepancy">Document Verification Discrepancy</option>
                <option value="technical">Technical Support / Application Bug</option>
                <option value="ethics">Algorithmic Bias / Ethics Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Message & Context</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details or reference numbers regarding your scholarship evaluation..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            <Button type="submit" variant="glow" size="lg" icon={Send} className="w-full">
              Submit Ticket to Governance Board
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
