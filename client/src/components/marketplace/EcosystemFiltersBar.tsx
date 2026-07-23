"use client";

import React from "react";
import { Filter, ShieldCheck, Zap, Code2, Tag, ArrowUpDown } from "lucide-react";

export interface EcosystemFilterState {
  search: string;
  techStack: string;
  priceTier: "ALL" | "FREE" | "PREMIUM";
  verifiedOnly: boolean;
  sortBy: "popular" | "newest" | "rating" | "price_asc";
}

interface EcosystemFiltersBarProps {
  filters: EcosystemFilterState;
  onChange: (filters: EcosystemFilterState) => void;
  onReset: () => void;
}

export default function EcosystemFiltersBar({ filters, onChange, onReset }: EcosystemFiltersBarProps) {
  const updateFilter = (key: keyof EcosystemFilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
            Solution & Tech Stack Filters
          </h3>
        </div>
        <button onClick={onReset} className="text-xs font-bold text-primary hover:underline">
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mb-3">
        {/* Search */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Search Assets</label>
          <input
            type="text"
            placeholder="e.g. Next.js, Stripe, Figma"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Tech Stack</label>
          <select
            value={filters.techStack}
            onChange={(e) => updateFilter("techStack", e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Stacks</option>
            <option value="Next.js">Next.js 16</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Figma">Figma UI Kit</option>
            <option value="Prisma">Prisma ORM</option>
            <option value="Tailwind">Tailwind CSS</option>
            <option value="AI">AI / OpenAI</option>
          </select>
        </div>

        {/* Price Tier */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Price Tier</label>
          <select
            value={filters.priceTier}
            onChange={(e) => updateFilter("priceTier", e.target.value as any)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">All Prices</option>
            <option value="FREE">Free Assets</option>
            <option value="PREMIUM">Premium Production</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value as any)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Releases</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
          </select>
        </div>

        {/* Verified Builder Checkbox */}
        <div className="col-span-2 md:col-span-1 flex items-end">
          <label className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer bg-background px-3 py-1.5 rounded-lg border border-border w-full justify-center">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
              className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
            />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Builders
          </label>
        </div>
      </div>
    </div>
  );
}
