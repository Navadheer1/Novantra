"use client";

import React from "react";
import { Filter, ShieldCheck, Zap, Users, DollarSign, Award } from "lucide-react";

export interface NetworkFilterState {
  stage: string;
  industry: string;
  location: string;
  ticketSize: string;
  fundSize: string;
  syndicationFriendlyOnly: boolean;
  recentlyActiveOnly: boolean;
  verifiedOnly: boolean;
}

interface InvestorFiltersBarProps {
  filters: NetworkFilterState;
  onChange: (filters: NetworkFilterState) => void;
  onReset: () => void;
}

export default function InvestorFiltersBar({ filters, onChange, onReset }: InvestorFiltersBarProps) {
  const updateFilter = (key: keyof NetworkFilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
            Investor Network & Thesis Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-primary hover:underline"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-3">
        {/* Stage */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Stage Preference</label>
          <select
            value={filters.stage}
            onChange={(e) => updateFilter("stage", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Stages</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B+</option>
          </select>
        </div>

        {/* Industry */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Industry Focus</label>
          <input
            type="text"
            placeholder="e.g. AI, SaaS, Fintech"
            value={filters.industry}
            onChange={(e) => updateFilter("industry", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Geography / City</label>
          <input
            type="text"
            placeholder="e.g. SF, India, London"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Ticket Size */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Typical Ticket</label>
          <select
            value={filters.ticketSize}
            onChange={(e) => updateFilter("ticketSize", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Any Ticket Size</option>
            <option value="25k">$25k - $100k</option>
            <option value="250k">$250k - $500k</option>
            <option value="1m">$1M - $5M</option>
          </select>
        </div>

        {/* Fund Size */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Fund Size</label>
          <select
            value={filters.fundSize}
            onChange={(e) => updateFilter("fundSize", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Any Fund Size</option>
            <option value="10m">&lt; $10M Micro VC</option>
            <option value="50m">$10M - $50M</option>
            <option value="100m">$50M+ Fund</option>
          </select>
        </div>
      </div>

      {/* Badges / Checkboxes */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer bg-background px-2.5 py-1 rounded-full border border-border">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
            className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
          />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Investors Only
        </label>

        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer bg-background px-2.5 py-1 rounded-full border border-border">
          <input
            type="checkbox"
            checked={filters.syndicationFriendlyOnly}
            onChange={(e) => updateFilter("syndicationFriendlyOnly", e.target.checked)}
            className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
          />
          <Users className="w-3.5 h-3.5 text-blue-500" /> Syndication Friendly
        </label>

        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer bg-background px-2.5 py-1 rounded-full border border-border">
          <input
            type="checkbox"
            checked={filters.recentlyActiveOnly}
            onChange={(e) => updateFilter("recentlyActiveOnly", e.target.checked)}
            className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
          />
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Actively Investing (24h)
        </label>
      </div>
    </div>
  );
}
