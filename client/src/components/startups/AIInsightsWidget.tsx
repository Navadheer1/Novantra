"use client";

import React from "react";
import { Sparkles, ShieldAlert, BarChart3, Users2, Target, CheckCircle2 } from "lucide-react";

interface AIInsightsWidgetProps {
  startupName: string;
  industry: string;
}

export default function AIInsightsWidget({ startupName, industry }: AIInsightsWidgetProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">
              Noventra AI Investment & Risk Intelligence
            </h3>
            <p className="text-xs text-muted-foreground">
              Synthesized live telemetry for {startupName} in {industry}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
          AI Copilot Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Risk Analysis */}
        <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" /> Risk Analysis & Mitigation
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            <strong>Primary Risk:</strong> High market competition in {industry}. 
            <strong>Mitigation:</strong> Strong proprietary algorithm & patent pending status gives a 12-month competitive moat.
          </p>
        </div>

        {/* 2. Market Size Estimate */}
        <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <BarChart3 className="w-4 h-4" /> Market Size Estimate (TAM/SAM/SOM)
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold">TAM: <strong className="text-foreground">$14.2 Billion</strong></span>
            <span className="text-muted-foreground font-semibold">SAM: <strong className="text-foreground">$2.8 Billion</strong></span>
            <span className="text-muted-foreground font-semibold">SOM: <strong className="text-foreground">$150 Million</strong></span>
          </div>
        </div>

        {/* 3. Competitor Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
            <Target className="w-4 h-4" /> Competitor Landscape Summary
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Directly competes with legacy software. {startupName} offers 3x faster onboarding, lower pricing model, and native AI automation.
          </p>
        </div>

        {/* 4. Traction Prediction */}
        <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <Users2 className="w-4 h-4" /> Founder & Traction Prediction
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Founder has prior exit background. Projecting <strong>+35% MoM ARR growth</strong> over the next 3 quarters based on pipeline conversion rates.
          </p>
        </div>
      </div>
    </div>
  );
}
