"use client";

import React from "react";
import { Filter, DollarSign, TrendingUp, ShieldCheck, Award, Zap } from "lucide-react";

export interface InvestorFilterState {
  stage: string;
  minMrr: string;
  maxValuation: string;
  maxBurnRate: string;
  minRunway: string;
  minGrowth: string;
  verifiedOnly: boolean;
  revenueGeneratingOnly: boolean;
  patentFiledOnly: boolean;
  womenLedOnly: boolean;
}

interface InvestorFiltersBarProps {
  filters: InvestorFilterState;
  onChange: (filters: InvestorFilterState) => void;
  onReset: () => void;
}

export default function InvestorFiltersBar({ filters, onChange, onReset }: InvestorFiltersBarProps) {
  const updateFilter = (key: keyof InvestorFilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-emerald-950/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
            Investor Due-Diligence & Dealflow Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-3">
        {/* Stage */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Stage</label>
          <select
            value={filters.stage}
            onChange={(e) => updateFilter("stage", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Stages</option>
            <option value="Idea">Idea Stage</option>
            <option value="MVP">MVP Ready</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A+</option>
          </select>
        </div>

        {/* Minimum MRR */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Min MRR ($)</label>
          <select
            value={filters.minMrr}
            onChange={(e) => updateFilter("minMrr", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any Revenue</option>
            <option value="1000">$1k+ MRR</option>
            <option value="5000">$5k+ MRR</option>
            <option value="10000">$10k+ MRR</option>
            <option value="50000">$50k+ MRR</option>
          </select>
        </div>

        {/* Max Valuation */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Max Valuation ($)</label>
          <select
            value={filters.maxValuation}
            onChange={(e) => updateFilter("maxValuation", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any Valuation</option>
            <option value="2000000">Under $2M</option>
            <option value="5000000">Under $5M</option>
            <option value="10000000">Under $10M</option>
            <option value="25000000">Under $25M</option>
          </select>
        </div>

        {/* Min Runway */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Min Runway</label>
          <select
            value={filters.minRunway}
            onChange={(e) => updateFilter("minRunway", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any Runway</option>
            <option value="6">6+ Months</option>
            <option value="12">12+ Months</option>
            <option value="18">18+ Months</option>
          </select>
        </div>

        {/* Min MoM Growth */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Min MoM Growth</label>
          <select
            value={filters.minGrowth}
            onChange={(e) => updateFilter("minGrowth", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any Growth</option>
            <option value="10">10%+ MoM</option>
            <option value="20">20%+ MoM</option>
            <option value="30">30%+ MoM</option>
          </select>
        </div>

        {/* Burn Rate */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Max Burn / Mo</label>
          <select
            value={filters.maxBurnRate}
            onChange={(e) => updateFilter("maxBurnRate", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any Burn</option>
            <option value="5000">Under $5k/mo</option>
            <option value="15000">Under $15k/mo</option>
            <option value="30000">Under $30k/mo</option>
          </select>
        </div>
      </div>

      {/* Badges & Checkbox Toggles */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-500/10">
        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-950 dark:text-emerald-200 cursor-pointer bg-background px-2.5 py-1 rounded-full border border-border">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Startup
        </label>

        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-950 dark:text-emerald-200 cursor-pointer bg-background px-2.5 py-1 rounded-full border border-border">
          <input
            type="checkbox"
            checked={filters.revenueGeneratingOnly}
            onChange={(e) => updateFilter("revenueGeneratingOnly", e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Revenue Generating
        </label>

        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-950 dark:text-emerald-200 cursor-pointer bg-background px-2.5 py-1 rounded-full border border-border">
          <input
            type="checkbox"
            checked={filters.patentFiledOnly}
            onChange={(e) => updateFilter("patentFiledOnly", e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <Award className="w-3.5 h-3.5 text-emerald-600" /> Patent Filed
        </label>

        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-950 dark:text-emerald-200 cursor-pointer bg-background px-2.5 py-1 rounded-full border border-border">
          <input
            type="checkbox"
            checked={filters.womenLedOnly}
            onChange={(e) => updateFilter("womenLedOnly", e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <Zap className="w-3.5 h-3.5 text-emerald-600" /> Women-Led / Diversity
        </label>
      </div>
    </div>
  );
}
