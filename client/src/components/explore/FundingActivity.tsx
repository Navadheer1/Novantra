"use client";

import React from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, Building2, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  fundingActivity: {
    recentDeals?: any[];
    raisingStartups?: any[];
  };
}

export default function FundingActivity({ fundingActivity }: Props) {
  const deals = fundingActivity?.recentDeals || [];
  const raising = fundingActivity?.raisingStartups || [];

  return (
    <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" /> Funding Activity & SAFEs
        </h3>
        <span className="text-xs font-semibold text-muted-foreground">Ecosystem Deals</span>
      </div>

      {deals.length > 0 ? (
        <div className="divide-y divide-border/60">
          {deals.slice(0, 4).map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-muted overflow-hidden shrink-0 border border-border flex items-center justify-center">
                  {d.startupLogo ? (
                    <img src={d.startupLogo} alt={d.startupName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-foreground truncate">{d.startupName}</h4>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      {d.stage}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Invested by <strong className="text-foreground">{d.investorName}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-sm text-emerald-600">{d.amount}</span>
                <span className="text-[10px] text-muted-foreground block">
                  {new Date(d.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {raising.slice(0, 3).map((r) => (
            <div key={r.id} className="p-3 bg-muted/40 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-foreground truncate">{r.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">Seeking {r.fundingNeeded || "$250k"} SAFE</p>
              </div>
              <Link href={`/startups/${r.id}`}>
                <Button size="sm" variant="outline" className="h-7 text-[11px] font-bold px-2.5">
                  View Pitch
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
