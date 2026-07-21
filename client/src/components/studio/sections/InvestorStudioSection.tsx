"use client";

import React from "react";
import { Briefcase, DollarSign, Layers, Compass, CheckCircle2 } from "lucide-react";

interface InvestorSectionProps {
  data: {
    investmentThesis?: string;
    preferredStage?: string;
    checkSize?: string;
    investmentInterests?: string;
    geography?: string;
    openToInvest?: boolean;
  };
  onChange: (field: string, value: any) => void;
}

export default function InvestorStudioSection({ data, onChange }: InvestorSectionProps) {
  return (
    <div className="space-y-6">
      
      <div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-black text-slate-900">VC & Angel Investor Studio</h3>
        </div>
        <p className="text-xs text-slate-500">Configure your investment thesis, check size, stage preferences, and pitch window status.</p>
      </div>

      {/* Pitch Window Status */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-extrabold text-xs text-emerald-950">Pitch Submissions Status</h4>
            <p className="text-[11px] text-emerald-700">Allow founders to submit pitch decks directly to your Noventra pipeline.</p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            checked={data.openToInvest ?? true}
            onChange={(e) => onChange("openToInvest", e.target.checked)}
          />
          <span>Accepting Pitches</span>
        </label>
      </div>

      {/* Investment Thesis Paragraph */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Investment Thesis & Philosophy</label>
        <textarea
          rows={4}
          placeholder="Explain what technology trends, founder profiles, and market dynamics you believe in..."
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none leading-relaxed"
          value={data.investmentThesis || ""}
          onChange={(e) => onChange("investmentThesis", e.target.value)}
        />
      </div>

      {/* Check Size, Stage & Geography */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Typical Check Size</label>
          <input
            type="text"
            placeholder="e.g. $50k - $250k"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.checkSize || "$50k - $250k"}
            onChange={(e) => onChange("checkSize", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Stages</label>
          <input
            type="text"
            placeholder="Pre-Seed, Seed, Series A"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.preferredStage || "Pre-Seed, Seed"}
            onChange={(e) => onChange("preferredStage", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Geography</label>
          <input
            type="text"
            placeholder="North America & Global Remote"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.geography || "North America & Remote"}
            onChange={(e) => onChange("geography", e.target.value)}
          />
        </div>
      </div>

      {/* Target Sectors */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Focus Industries & Sectors (comma separated)</label>
        <input
          type="text"
          placeholder="AI, Developer Tools, SaaS, FinTech, Healthcare"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          value={data.investmentInterests || "AI, DevTools, SaaS"}
          onChange={(e) => onChange("investmentInterests", e.target.value)}
        />
      </div>

    </div>
  );
}
