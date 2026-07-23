"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Award, BarChart3, CheckCircle2 } from "lucide-react";
import { InvestorCardData } from "./FounderInvestorCard";

interface AdminInvestorCardProps {
  investor: InvestorCardData;
  onActionSuccess: (msg: string) => void;
}

export default function AdminInvestorCard({ investor, onActionSuccess }: AdminInvestorCardProps) {
  return (
    <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center font-bold text-amber-600">
            {investor.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">{investor.name}</h3>
            <p className="text-[10px] text-muted-foreground font-mono">{investor.email}</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
          Active Investor
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center bg-background p-2 rounded-xl border border-border text-[10px]">
        <div>
          <span className="text-muted-foreground block font-bold">Ticket</span>
          <strong className="text-foreground">{investor.ticketSize || "$100k"}</strong>
        </div>
        <div>
          <span className="text-muted-foreground block font-bold">Exits</span>
          <strong className="text-foreground">{investor.successfulExits || 4}</strong>
        </div>
        <div>
          <span className="text-muted-foreground block font-bold">Deals</span>
          <strong className="text-foreground">{investor.totalInvestments || 18}</strong>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border">
        <Button
          size="sm"
          variant="outline"
          className="text-[10px] font-bold text-emerald-600 border-emerald-500/30"
          onClick={() => onActionSuccess(`Verified badge granted to ${investor.name}`)}
        >
          <ShieldCheck className="w-3 h-3 mr-1" /> Verify
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-[10px] font-bold text-blue-600 border-blue-500/30"
          onClick={() => onActionSuccess(`${investor.name} featured on investor network!`)}
        >
          <Award className="w-3 h-3 mr-1" /> Feature
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="text-[10px] font-bold"
          onClick={() => onActionSuccess(`Analytics report generated for ${investor.name}`)}
        >
          <BarChart3 className="w-3 h-3 mr-1" /> Analytics
        </Button>
      </div>
    </div>
  );
}
