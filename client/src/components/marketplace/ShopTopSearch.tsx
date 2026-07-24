"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, X, ArrowRight, Bot } from "lucide-react";

interface ShopTopSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTag: (tag: string) => void;
}

export default function ShopTopSearch({
  searchQuery,
  onSearchChange,
  onSelectTag,
}: ShopTopSearchProps) {
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const trendingTags = [
    "Restaurant POS",
    "Healthcare AI",
    "CRM",
    "Marketplace",
    "FinTech",
    "Hospital Management",
  ];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setAiInsight(null);
      return;
    }

    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      if (q.includes("hospital") || q.includes("health") || q.includes("clinic")) {
        setAiInsight("AI Engine Matched HospitalOS & MediFlow: Pre-configured for HIPAA compliance, EHR sync & clinical scheduling.");
      } else if (q.includes("crm") || q.includes("sales") || q.includes("lead")) {
        setAiInsight("AI Engine Matched Nova CRM & LeadPulse: Autonomous pipeline scoring and Stripe revenue attribution.");
      } else if (q.includes("restaurant") || q.includes("pos") || q.includes("food")) {
        setAiInsight("AI Engine Matched ChefPOS & TableSync: Real-time kitchen display & order routing APIs.");
      } else if (q.includes("ai") || q.includes("agent") || q.includes("gpt")) {
        setAiInsight("AI Engine Matched Agentic Suite: Multi-agent orchestration for code review & pitch decks.");
      } else {
        setAiInsight(`AI Engine scanning startup graph for "${searchQuery}"... Top verified matches ranked below.`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-3">
      {/* 1. App Store Intelligent Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Describe what you're building... (e.g. 'I need an AI CRM for hospitals')"
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-[0_2px_12px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Intelligent AI Natural Language Explanation */}
      {aiInsight && (
        <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100/80 text-xs text-slate-700 font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
          <Bot className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-blue-800 block text-[11px] uppercase tracking-wider mb-0.5">
              AI Intelligent Search
            </span>
            <p className="text-slate-600 text-xs leading-relaxed">{aiInsight}</p>
          </div>
        </div>
      )}

      {/* 3. Trending Search Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Trending:
        </span>
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/70 text-slate-600 hover:text-blue-600 hover:border-blue-200 text-[11px] font-bold transition-all shrink-0 shadow-2xs"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
