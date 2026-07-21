"use client";

import React from "react";
import { 
  Search, Sparkles, SlidersHorizontal, Grid, LayoutGrid, 
  Rocket, Tv, Radio, MapPin, ArrowUpDown, ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewMode } from "./types";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAISearch: () => void;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

export default function ExploreHeroHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenAISearch,
  onToggleFilters,
  activeFilterCount
}: Props) {
  const viewModes: { mode: ViewMode; label: string; icon: any }[] = [
    { mode: "masonry", label: "Masonry Feed", icon: LayoutGrid },
    { mode: "launchpad", label: "Product Launches", icon: Rocket },
    { mode: "radar", label: "AI Radar", icon: Radio },
    { mode: "videos", label: "FounderTV", icon: Tv },
    { mode: "map", label: "World Map", icon: MapPin },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-[28px] p-6 sm:p-10 border border-slate-800/80 shadow-xl">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center sm:text-left">
        
        {/* Title Badge & Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ecosystem Discovery OS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Explore Noventra Core
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-medium mt-2 max-w-2xl">
              Discover founders, venture capital, open source projects, live startup launches, and AI tech trends in real time.
            </p>
          </div>

          <Button
            onClick={onOpenAISearch}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-6 rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 border border-blue-400/30 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ask AI Copilot Search</span>
          </Button>
        </div>

        {/* Live Search Bar Suite */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search founders, startups, VCs, videos, tech stack, jobs..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-900 transition-all shadow-inner"
            />
          </div>

          <Button
            onClick={onToggleFilters}
            variant="outline"
            className="w-full sm:w-auto px-5 py-6 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 text-xs font-bold flex items-center justify-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Discovery View Mode Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2 shrink-0 hidden sm:inline">
            Mode:
          </span>
          {viewModes.map((v) => {
            const Icon = v.icon;
            const isActive = viewMode === v.mode;
            return (
              <button
                key={v.mode}
                onClick={() => onViewModeChange(v.mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
