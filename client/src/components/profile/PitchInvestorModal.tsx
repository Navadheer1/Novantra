"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, FileText, X, CheckCircle2, DollarSign } from "lucide-react";

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorName: string;
}

export default function PitchInvestorModal({ isOpen, onClose, investorName }: PitchModalProps) {
  const [startupName, setStartupName] = useState("");
  const [deckUrl, setDeckUrl] = useState("");
  const [amountRequested, setAmountRequested] = useState("$250,000");
  const [pitchNote, setPitchNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 max-w-lg w-full rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/60">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Submit Pitch Deck</h3>
              <p className="text-xs text-slate-500">Direct pitch to {investorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-base text-slate-900">Pitch Submitted!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your deck and request details have been delivered to {investorName}'s primary pipeline.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Startup Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme AI"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Pitch Deck Link (DocSend / PDF)</label>
                <input
                  type="text"
                  required
                  placeholder="https://docsend.com/view/..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  value={deckUrl}
                  onChange={(e) => setDeckUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Requested Check Size</label>
                <input
                  type="text"
                  required
                  placeholder="$100k - $250k"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  value={amountRequested}
                  onChange={(e) => setAmountRequested(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Executive Summary Pitch Note</label>
              <textarea
                rows={3}
                required
                placeholder="Explain what problem your startup solves, your current MRR/Traction, and team highlights..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
                value={pitchNote}
                onChange={(e) => setPitchNote(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-5 flex items-center gap-1.5 shadow-sm">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Pitch</span>
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
