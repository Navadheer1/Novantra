"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Building2, Users, ArrowUpRight, Award, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  spotlight: any;
}

export default function WeeklySpotlight({ spotlight }: Props) {
  if (!spotlight) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-card to-card border border-primary/30 p-6 sm:p-8 shadow-md">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Startup & Founder Info */}
        <div className="flex items-start gap-5 flex-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted overflow-hidden shrink-0 border border-primary/40 shadow-sm flex items-center justify-center">
            {spotlight.logo ? (
              <img src={spotlight.logo} alt={spotlight.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-9 h-9 text-primary" />
            )}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-0.5 rounded-full border border-primary/30">
                <Sparkles className="w-3 h-3" /> {spotlight.highlightBadge || "Weekly Startup Champion"}
              </span>
              <span className="text-xs font-bold text-muted-foreground">• {spotlight.stage} Stage</span>
              <span className="text-xs font-bold text-muted-foreground">• {spotlight.industry}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-tight">
              {spotlight.name}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
              {spotlight.description}
            </p>

            {/* Founder details */}
            {spotlight.founder && (
              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-muted overflow-hidden">
                  {spotlight.founder.avatarUrl ? (
                    <img src={spotlight.founder.avatarUrl} alt={spotlight.founder.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-primary">
                      {spotlight.founder.name[0]}
                    </div>
                  )}
                </div>
                <span>Founded by <strong className="text-foreground">{spotlight.founder.name}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Growth Stats & CTA Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border">
          <div className="bg-background/80 backdrop-blur-sm border border-border px-4 py-2.5 rounded-xl text-center w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Growth & Traction</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{spotlight.growthMetric || "+140% Monthly Growth"}</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link href={`/startups/${spotlight.id}`} className="flex-1 md:flex-none">
              <Button size="sm" className="w-full font-bold text-xs flex items-center justify-center gap-1.5 h-10 px-5">
                <span>Explore Startup</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
