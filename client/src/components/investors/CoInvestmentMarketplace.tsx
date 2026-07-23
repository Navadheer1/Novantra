"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Clock, Users, ShieldCheck, Sparkles, Plus, MessageSquare, Bookmark } from "lucide-react";

export interface CoInvestDeal {
  id: string;
  startupName: string;
  sector: string;
  round: string;
  committedAmount: string;
  remainingAmount: string;
  minTicket: string;
  closingDate: string;
  leadInvestorName: string;
  leadInvestorFirm: string;
  leadAvatar?: string;
  verified: boolean;
}

interface CoInvestmentMarketplaceProps {
  onActionSuccess: (msg: string) => void;
}

export default function CoInvestmentMarketplace({ onActionSuccess }: CoInvestmentMarketplaceProps) {
  const [deals, setDeals] = useState<CoInvestDeal[]>([
    {
      id: "deal-1",
      startupName: "Nova AI",
      sector: "Artificial Intelligence",
      round: "Seed Round",
      committedAmount: "$220,000 (₹1.8 Cr)",
      remainingAmount: "$85,000 (₹70 L)",
      minTicket: "$12,000 (₹10 L)",
      closingDate: "July 30, 2026",
      leadInvestorName: "Jari Vance",
      leadInvestorFirm: "Apex Ventures",
      verified: true
    },
    {
      id: "deal-2",
      startupName: "SyncFlow Robotics",
      sector: "Automation & Hardware",
      round: "Pre-Seed",
      committedAmount: "$400,000",
      remainingAmount: "$100,000",
      minTicket: "$25,000",
      closingDate: "August 15, 2026",
      leadInvestorName: "Sarah Chen",
      leadInvestorFirm: "Horizon Capital",
      verified: true
    },
    {
      id: "deal-3",
      startupName: "CleanGrid Systems",
      sector: "ClimateTech",
      round: "Series A",
      committedAmount: "$1,800,000",
      remainingAmount: "$350,000",
      minTicket: "$50,000",
      closingDate: "August 5, 2026",
      leadInvestorName: "Patrick Collison",
      leadInvestorFirm: "Stripe Syndicate",
      verified: true
    }
  ]);

  const [savedDeals, setSavedDeals] = useState<Record<string, boolean>>({});

  const toggleSave = (dealId: string) => {
    setSavedDeals(prev => ({ ...prev, [dealId]: !prev[dealId] }));
    onActionSuccess("Deal saved to your co-investment tracking portfolio!");
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/20 via-card to-background p-6 rounded-2xl border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Co-Investment Marketplace
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">Live Syndicated Deal Flow</span>
          </div>
          <h2 className="text-xl font-black text-foreground">Co-Invest Alongside Lead VCs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified leads publishing allocation pools for syndicate members & co-investors.
          </p>
        </div>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
          onClick={() => onActionSuccess("Co-investment publishing portal opened.")}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Publish Allocation Opportunity
        </Button>
      </div>

      {/* DEALS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 relative">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                  {deal.round}
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Closes {deal.closingDate}
                </span>
              </div>

              <h3 className="text-lg font-black text-foreground tracking-tight">{deal.startupName}</h3>
              <p className="text-xs font-semibold text-muted-foreground">{deal.sector}</p>

              {/* COMMITTED & REMAINING BAR */}
              <div className="mt-4 p-3 bg-muted/40 rounded-xl border border-border/60 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Already Committed</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{deal.committedAmount}</span>
                </div>

                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Remaining Pool</span>
                  <span className="text-foreground">{deal.remainingAmount}</span>
                </div>

                <div className="flex justify-between text-xs font-bold pt-1 border-t border-border/40">
                  <span className="text-muted-foreground">Min Ticket</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-extrabold">{deal.minTicket}</span>
                </div>
              </div>
            </div>

            {/* LEAD INVESTOR INFO & ACTIONS */}
            <div className="pt-3 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-600">
                    {deal.leadInvestorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-black text-foreground block leading-tight">{deal.leadInvestorName}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Lead @ {deal.leadInvestorFirm}</span>
                  </div>
                </div>
                {deal.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onActionSuccess(`Participation request logged for ${deal.startupName} round!`)}
                >
                  Join Deal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold border-emerald-500/30"
                  onClick={() => onActionSuccess(`Direct message thread opened with lead investor ${deal.leadInvestorName}`)}
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1" /> Lead
                </Button>
              </div>

              <button
                onClick={() => toggleSave(deal.id)}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 w-full pt-1"
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedDeals[deal.id] ? "fill-emerald-600 text-emerald-600" : ""}`} />
                {savedDeals[deal.id] ? "Saved to Deal Tracker" : "Save Deal"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
