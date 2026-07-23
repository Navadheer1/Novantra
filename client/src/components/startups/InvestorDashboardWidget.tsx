"use client";

import React from "react";
import { TrendingUp, ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, Zap, ArrowUpRight } from "lucide-react";

interface InvestorDashboardWidgetProps {
  startupName: string;
  stage: string;
  fundingNeeded?: string;
  valuation?: string;
  mrr?: string;
  runwayMonths?: number;
}

export default function InvestorDashboardWidget({
  startupName,
  stage,
  fundingNeeded = "$500,000",
  valuation = "$4,200,000",
  mrr = "$14,500",
  runwayMonths = 14
}: InvestorDashboardWidgetProps) {
  const readinessScore = 88;
  const financialHealth = 78;
  const founderStrength = 92;
  const marketOpportunity = 87;

  return (
    <div className="bg-gradient-to-br from-emerald-950/20 via-card to-emerald-950/10 border-2 border-emerald-500/30 rounded-2xl p-6 shadow-md mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
              AI Investment Readiness Suite
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Institutional Grade Verified
            </span>
          </div>
          <h2 className="text-xl font-black text-foreground">
            {startupName} — Investor Intelligence Snapshot
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automated due-diligence scorecard powered by Noventra Engine.
          </p>
        </div>

        {/* Big Overall Score Ring */}
        <div className="flex items-center gap-3 bg-background border border-emerald-500/30 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="text-center">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
              Readiness Score
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              {readinessScore}<span className="text-xs text-muted-foreground font-bold">/100</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SCORE CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-5">
        {/* Financial Health */}
        <div className="bg-background border border-border rounded-xl p-3">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
            Financial Health
          </span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-foreground">{financialHealth}%</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">Good</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${financialHealth}%` }} />
          </div>
        </div>

        {/* Founder Strength */}
        <div className="bg-background border border-border rounded-xl p-3">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
            Founder Strength
          </span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-foreground">{founderStrength}%</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded">Top 5%</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${founderStrength}%` }} />
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="bg-background border border-border rounded-xl p-3">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
            Market Opportunity
          </span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-foreground">{marketOpportunity}%</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 px-1.5 py-0.5 rounded">Huge TAM</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${marketOpportunity}%` }} />
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-background border border-border rounded-xl p-3">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
            Risk Profile
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">Medium</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Pre-Series A Market Risk</p>
        </div>

        {/* Exit Potential */}
        <div className="bg-background border border-border rounded-xl p-3 col-span-2 md:col-span-1">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
            Exit Potential
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">High (M&A / IPO)</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Acquirer interest high</p>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center bg-background/60 p-3 rounded-xl border border-border/50">
        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Seeking Round</span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{fundingNeeded}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Post Valuation</span>
          <span className="text-sm font-black text-foreground">{valuation}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Monthly Revenue</span>
          <span className="text-sm font-black text-foreground">{mrr}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Current Runway</span>
          <span className="text-sm font-black text-foreground">{runwayMonths} Months</span>
        </div>
      </div>
    </div>
  );
}
