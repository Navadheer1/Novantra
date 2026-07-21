"use client";

import React from "react";
import { Building2, DollarSign, Users, Target, FileText, Video, Globe, TrendingUp } from "lucide-react";

interface FounderSectionProps {
  data: {
    startupName?: string;
    startupLogo?: string;
    industry?: string;
    startupStage?: string;
    fundingStage?: string;
    lookingFor?: string;
    startupWebsite?: string;
    pitchDeckUrl?: string;
    demoVideoUrl?: string;
    currentUsers?: string;
    mrr?: string;
    teamSize?: number;
    hiringStatus?: boolean;
    mission?: string;
  };
  onChange: (field: string, value: any) => void;
}

export default function FounderStudioSection({ data, onChange }: FounderSectionProps) {
  return (
    <div className="space-y-6">
      
      <div>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-black text-slate-900">Founder & Startup Configuration</h3>
        </div>
        <p className="text-xs text-slate-500">Configure your startup showcase, pitch deck link, traction, and hiring requirements.</p>
      </div>

      {/* Startup Name & Logo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Startup Name</label>
          <input
            type="text"
            placeholder="e.g. Noventra, Acme AI"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.startupName || ""}
            onChange={(e) => onChange("startupName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Startup Logo URL</label>
          <input
            type="text"
            placeholder="https://example.com/logo.png"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.startupLogo || ""}
            onChange={(e) => onChange("startupLogo", e.target.value)}
          />
        </div>
      </div>

      {/* Stage, Industry & Funding */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Industry / Category</label>
          <input
            type="text"
            placeholder="AI & DevTools, FinTech"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.industry || ""}
            onChange={(e) => onChange("industry", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Startup Stage</label>
          <select
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.startupStage || "Seed Stage"}
            onChange={(e) => onChange("startupStage", e.target.value)}
          >
            <option>Idea Stage</option>
            <option>Pre-Seed</option>
            <option>Seed Stage</option>
            <option>Series A</option>
            <option>Series B+</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Capital Raised</label>
          <input
            type="text"
            placeholder="e.g. $1.4M Seed Raised"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.fundingStage || ""}
            onChange={(e) => onChange("fundingStage", e.target.value)}
          />
        </div>
      </div>

      {/* Traction Metrics */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Traction & Performance
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Monthly Recurring Revenue (MRR)</label>
            <input
              type="text"
              placeholder="$18,000 MRR"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold"
              value={data.mrr || ""}
              onChange={(e) => onChange("mrr", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Active Users / Customers</label>
            <input
              type="text"
              placeholder="12,400 MAU"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold"
              value={data.currentUsers || ""}
              onChange={(e) => onChange("currentUsers", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Team Size</label>
            <input
              type="number"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold"
              value={data.teamSize ?? 8}
              onChange={(e) => onChange("teamSize", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Pitch Deck & Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">DocSend / Pitch Deck Link</label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="https://docsend.com/view/..."
              className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={data.pitchDeckUrl || ""}
              onChange={(e) => onChange("pitchDeckUrl", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Demo Video Link (Loom / YouTube)</label>
          <div className="relative">
            <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="https://loom.com/share/..."
              className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={data.demoVideoUrl || ""}
              onChange={(e) => onChange("demoVideoUrl", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Looking For & Hiring */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">What is your startup currently seeking?</label>
        <input
          type="text"
          placeholder="e.g. Lead Investor ($1.5M Series A) & Staff AI Engineer"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          value={data.lookingFor || ""}
          onChange={(e) => onChange("lookingFor", e.target.value)}
        />
      </div>

    </div>
  );
}
