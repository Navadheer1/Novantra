"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  UserPlus,
  MessageSquare,
  Award,
  Zap,
  Bookmark,
  Share2,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { InvestorCardData } from "./FounderInvestorCard";

interface InvestorCoInvestorCardProps {
  investor: InvestorCardData;
  onInviteSyndicate: (investor: InvestorCardData) => void;
  onInviteDeal: (investor: InvestorCardData) => void;
  onStartConversation: (investor: InvestorCardData) => void;
  onActionSuccess: (msg: string) => void;
}

export default function InvestorCoInvestorCard({
  investor,
  onInviteSyndicate,
  onInviteDeal,
  onStartConversation,
  onActionSuccess
}: InvestorCoInvestorCardProps) {
  const [isConnected, setIsConnected] = useState(false);
  const coInvestScore = investor.coInvestScore || 94;

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* TOP CO-INVESTOR HEADER */}
        <div className="p-5 pb-3 bg-gradient-to-r from-emerald-500/10 via-background to-emerald-500/5 border-b border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${investor.id}`} className="w-14 h-14 rounded-2xl border-2 border-emerald-500/20 bg-background shadow-md overflow-hidden shrink-0 flex items-center justify-center font-black text-xl text-emerald-600 hover:border-emerald-500 hover:scale-105 transition-all">
                {investor.avatarUrl ? (
                  <img src={investor.avatarUrl} alt={investor.name} className="w-full h-full object-cover" />
                ) : (
                  investor.name.slice(0, 2).toUpperCase()
                )}
              </Link>
              <div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/profile/${investor.id}`}>
                    <h3 className="text-base font-black text-foreground group-hover:text-emerald-600 hover:underline transition-colors cursor-pointer">
                      {investor.name}
                    </h3>
                  </Link>
                  {investor.verified !== false && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs font-bold text-muted-foreground">{investor.firmName || "Noventra Capital"}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                    Syndication Friendly
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> {investor.successfulExits || 4} Exits
                  </span>
                </div>
              </div>
            </div>

            {/* CO-INVEST SCORE BADGE */}
            <div className="text-right shrink-0">
              <span className="text-[9px] font-bold text-muted-foreground block uppercase">Co-Invest Score</span>
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-xl font-black text-xs">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                {coInvestScore}%
              </div>
            </div>
          </div>
        </div>

        {/* METRICS & SYNDICATE SPECS */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center bg-emerald-950/5 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20 text-xs">
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Ticket Range</span>
              <strong className="text-emerald-700 dark:text-emerald-300">{investor.ticketSize || "$100k - $500k"}</strong>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Exits</span>
              <strong className="text-foreground">{investor.successfulExits || 4} IPO / M&A</strong>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Co-Deals</span>
              <strong className="text-foreground">{investor.totalInvestments || 22} Deals</strong>
            </div>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground font-semibold">
            <p><strong>Investment Focus:</strong> {investor.investmentInterests?.join(", ") || "AI, Enterprise SaaS, FinTech"}</p>
            <p><strong>Geography:</strong> {investor.location || "North America / Global"}</p>
          </div>
        </div>
      </div>

      {/* INVESTOR NETWORK ACTIONS FOOTER */}
      <div className="p-4 bg-muted/30 border-t border-border/60 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => onInviteDeal(investor)}
          >
            Invite to Deal
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
            onClick={() => onInviteSyndicate(investor)}
          >
            Add to Syndicate
          </Button>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-muted-foreground">
          <button
            onClick={() => {
              setIsConnected(!isConnected);
              onActionSuccess(isConnected ? `Disconnected from ${investor.name}` : `Connection request sent to ${investor.name}!`);
            }}
            className="text-emerald-600 hover:underline font-bold flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {isConnected ? "Connected ✓" : "Connect"}
          </button>

          <button
            onClick={() => onStartConversation(investor)}
            className="hover:text-foreground flex items-center gap-1 font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" /> Direct Message
          </button>
        </div>
      </div>
    </div>
  );
}
