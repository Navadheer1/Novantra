"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Plus, ShieldCheck, DollarSign, ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface Syndicate {
  id: string;
  name: string;
  leadName: string;
  membersCount: number;
  avgTicket: string;
  sectors: string[];
  totalDeals: number;
  verified: boolean;
}

interface SyndicatesBoardProps {
  onActionSuccess: (msg: string) => void;
}

export default function SyndicatesBoard({ onActionSuccess }: SyndicatesBoardProps) {
  const syndicates: Syndicate[] = [
    {
      id: "syn-1",
      name: "AI India Syndicate",
      leadName: "Nayud Nayudu",
      membersCount: 48,
      avgTicket: "$35,000 (₹35 L)",
      sectors: ["AI", "SaaS", "Enterprise"],
      totalDeals: 14,
      verified: true
    },
    {
      id: "syn-2",
      name: "SaaS Frontier Syndicate",
      leadName: "Sarah Chen",
      membersCount: 84,
      avgTicket: "$50,000",
      sectors: ["B2B SaaS", "DevTools", "Cloud Infrastructure"],
      totalDeals: 28,
      verified: true
    },
    {
      id: "syn-3",
      name: "DeepTech & Climate Collective",
      leadName: "Jari Vance",
      membersCount: 32,
      avgTicket: "$100,000",
      sectors: ["ClimateTech", "Robotics", "Clean Energy"],
      totalDeals: 9,
      verified: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/20 via-card to-background p-6 rounded-2xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Syndicates & Angel Clubs
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">Pooled Investment Vehicles</span>
          </div>
          <h2 className="text-xl font-black text-foreground">Active Investment Syndicates</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Join accredited angel syndicates led by experienced GP leads.
          </p>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0"
          onClick={() => onActionSuccess("Syndicate creation wizard initialized.")}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Launch Syndicate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {syndicates.map((syn) => (
          <div key={syn.id} className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-black text-foreground">{syn.name}</h3>
                {syn.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-3">Lead: <strong className="text-foreground">{syn.leadName}</strong></p>

              <div className="grid grid-cols-2 gap-2 text-center bg-muted/40 p-2.5 rounded-xl border border-border/50 text-xs mb-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block">Members</span>
                  <strong className="text-foreground">{syn.membersCount} Angels</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block">Avg Ticket</span>
                  <strong className="text-blue-600 dark:text-blue-400">{syn.avgTicket}</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {syn.sectors.map((sec, i) => (
                  <span key={i} className="text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onActionSuccess(`Membership request sent to ${syn.name}!`)}
              >
                Join Syndicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-blue-500/30"
                onClick={() => onActionSuccess(`Viewing deals for ${syn.name}`)}
              >
                View Deals
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
