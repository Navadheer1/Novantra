"use client";

import React from "react";
import { Filter, X, Check, Globe, ShieldCheck, Briefcase, DollarSign } from "lucide-react";

export interface FilterState {
  industry: string;
  stage: string;
  location: string;
  hiringOnly: boolean;
  openToInvestOnly: boolean;
  remoteOnly: boolean;
  verifiedOnly: boolean;
}

interface Props {
  filters: FilterState;
  onChangeFilters: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export default function ExploreFilters({ filters, onChangeFilters, onClearFilters }: Props) {
  const hasActiveFilters = Object.values(filters).some((val) => val === true || (typeof val === "string" && val.trim() !== ""));

  return (
    <div className="sticky top-16 z-30 bg-card/95 backdrop-blur-md border border-border/80 p-3.5 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap flex-1">
        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground mr-1">
          <Filter className="w-3.5 h-3.5 text-primary" /> Filters
        </span>

        {/* Industry Select */}
        <select
          value={filters.industry}
          onChange={(e) => onChangeFilters({ industry: e.target.value })}
          className="px-3 py-1.5 border border-border rounded-xl bg-background text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Industries</option>
          <option value="AI">AI & Machine Learning</option>
          <option value="SaaS">SaaS & Enterprise</option>
          <option value="FinTech">FinTech & Payments</option>
          <option value="HealthTech">HealthTech & Bio</option>
          <option value="Web3">Web3 & Crypto</option>
          <option value="Robotics">Robotics & Infra</option>
        </select>

        {/* Funding Stage Select */}
        <select
          value={filters.stage}
          onChange={(e) => onChangeFilters({ stage: e.target.value })}
          className="px-3 py-1.5 border border-border rounded-xl bg-background text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Stages</option>
          <option value="Idea">Idea / Concept</option>
          <option value="Pre-Seed">Pre-Seed</option>
          <option value="Seed">Seed Stage</option>
          <option value="Series A">Series A</option>
        </select>

        {/* Location Input */}
        <input
          type="text"
          placeholder="Location (e.g. SF, Remote)"
          value={filters.location}
          onChange={(e) => onChangeFilters({ location: e.target.value })}
          className="px-3 py-1.5 border border-border rounded-xl bg-background text-xs font-semibold outline-none focus:ring-1 focus:ring-primary w-36"
        />

        {/* Hiring Only Toggle */}
        <button
          onClick={() => onChangeFilters({ hiringOnly: !filters.hiringOnly })}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.hiringOnly
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Hiring Now</span>
        </button>

        {/* Open to Investment Toggle */}
        <button
          onClick={() => onChangeFilters({ openToInvestOnly: !filters.openToInvestOnly })}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.openToInvestOnly
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-background border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Open to Pitch</span>
        </button>

        {/* Remote Toggle */}
        <button
          onClick={() => onChangeFilters({ remoteOnly: !filters.remoteOnly })}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.remoteOnly
              ? "bg-sky-600 text-white border-sky-600"
              : "bg-background border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Remote</span>
        </button>

        {/* Verified Toggle */}
        <button
          onClick={() => onChangeFilters({ verifiedOnly: !filters.verifiedOnly })}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.verifiedOnly
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-background border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified</span>
        </button>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-xs font-bold text-destructive hover:underline flex items-center gap-1 shrink-0"
        >
          <X className="w-3.5 h-3.5" /> Reset
        </button>
      )}
    </div>
  );
}
