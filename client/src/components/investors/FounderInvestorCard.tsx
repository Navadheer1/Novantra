"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Sparkles,
  MapPin,
  Briefcase,
  DollarSign,
  Send,
  Calendar,
  UserPlus,
  Bookmark,
  Share2,
  Clock,
  Building,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";

import PitchComposerModal from "@/components/pitches/PitchComposerModal";
import RequestIntroModal from "@/components/pitches/RequestIntroModal";

export interface InvestorCardData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
  firmName?: string;
  investorType?: "VC" | "Angel" | "Syndicate Lead" | "Family Office";
  location?: string;
  ticketSize?: string;
  portfolioCount?: number;
  totalInvestments?: number;
  recentInvestments?: string[];
  investmentInterests?: string[];
  preferredStages?: string[];
  avgResponseTimeHours?: number;
  verified?: boolean;
  lastActive?: string;
  matchScore?: number;
  matchReasons?: string[];
  coInvestScore?: number;
  syndicationFriendly?: boolean;
  successfulExits?: number;
  thesisSummary?: string;
}

interface FounderInvestorCardProps {
  investor: InvestorCardData;
  onSendPitch?: (investor: InvestorCardData) => void;
  onRequestMeeting?: (investor: InvestorCardData) => void;
  onRequestWarmIntro?: (investor: InvestorCardData) => void;
  onActionSuccess: (msg: string) => void;
}

export default function FounderInvestorCard({
  investor,
  onSendPitch,
  onRequestMeeting,
  onRequestWarmIntro,
  onActionSuccess
}: FounderInvestorCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Modals state
  const [isPitchComposerOpen, setIsPitchComposerOpen] = useState(false);
  const [isRequestIntroOpen, setIsRequestIntroOpen] = useState(false);

  const matchScore = investor.matchScore || 96;
  const matchReasons = investor.matchReasons || [
    "AI & SaaS Alignment",
    "Pre-Seed & Seed Focus",
    "Ticket Fits Round Size",
    "Portfolio Synergies"
  ];

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* CARD TOP HEADER */}
        <div className="p-5 pb-3 bg-gradient-to-r from-primary/10 via-background to-blue-500/5 border-b border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${investor.id}`} className="w-14 h-14 rounded-2xl border-2 border-primary/20 bg-background shadow-md overflow-hidden shrink-0 flex items-center justify-center font-black text-xl text-primary hover:border-primary hover:scale-105 transition-all">
                {investor.avatarUrl ? (
                  <img src={investor.avatarUrl} alt={investor.name} className="w-full h-full object-cover" />
                ) : (
                  investor.name.slice(0, 2).toUpperCase()
                )}
              </Link>
              <div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/profile/${investor.id}`}>
                    <h3 className="text-base font-black text-foreground group-hover:text-primary hover:underline transition-colors cursor-pointer">
                      {investor.name}
                    </h3>
                  </Link>
                  {investor.verified !== false && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Building className="w-3 h-3 text-primary" /> {investor.firmName || "Partner @ Noventra Capital"}
                </p>
                <span className="inline-block text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md mt-1">
                  {investor.investorType || "VC Partner"}
                </span>
              </div>
            </div>

            {/* AI MATCH BADGE CARD */}
            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-xl font-black text-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                {matchScore}% Match
              </div>
            </div>
          </div>
        </div>

        {/* AI REASONS CHECKLIST */}
        <div className="px-5 py-2.5 bg-blue-500/5 dark:bg-blue-950/20 border-b border-border/60">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400 block mb-1">
            Why AI Recommends This Investor
          </span>
          <div className="flex flex-wrap gap-1.5">
            {matchReasons.map((reason, i) => (
              <span key={i} className="text-[10px] font-bold text-foreground bg-background px-2 py-0.5 rounded border border-border/60 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> {reason}
              </span>
            ))}
          </div>
        </div>

        {/* METRICS & DETAILS */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center bg-muted/40 p-2.5 rounded-xl border border-border/50 text-xs">
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Ticket Size</span>
              <strong className="text-foreground">{investor.ticketSize || "$50k - $250k"}</strong>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Portfolio</span>
              <strong className="text-foreground">{investor.portfolioCount || 18} Startups</strong>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Response Time</span>
              <strong className="text-emerald-600 dark:text-emerald-400">{investor.avgResponseTimeHours || 4}h Avg</strong>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-muted-foreground font-semibold">
            <p><strong>Thesis:</strong> {investor.thesisSummary || "Investing in high-conviction AI & developer software."}</p>
            <p><strong>Stages:</strong> {investor.preferredStages?.join(", ") || "Pre-Seed, Seed"}</p>
          </div>
        </div>
      </div>

      {/* ACTIONS FOOTER */}
      <div className="p-4 bg-muted/30 border-t border-border/60 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            className="w-full text-xs font-bold bg-primary hover:bg-primary/90"
            onClick={() => setIsPitchComposerOpen(true)}
          >
            <Send className="w-3.5 h-3.5 mr-1" /> Send Pitch
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold border-blue-500/30 text-blue-700 dark:text-blue-300"
            onClick={() => setIsRequestIntroOpen(true)}
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Request Intro
          </Button>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-muted-foreground">
          <button
            onClick={() => setIsRequestIntroOpen(true)}
            className="text-primary hover:underline font-bold flex items-center gap-1"
          >
            <UserPlus className="w-3 h-3" /> Warm Intro
          </button>
          <button
            onClick={() => {
              setIsSaved(!isSaved);
              onActionSuccess(isSaved ? `Removed ${investor.name} from saved` : `Saved ${investor.name}`);
            }}
            className="hover:text-foreground flex items-center gap-1"
          >
            <Bookmark className={`w-3 h-3 ${isSaved ? "fill-primary text-primary" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* MODALS */}
      <PitchComposerModal
        isOpen={isPitchComposerOpen}
        onClose={() => setIsPitchComposerOpen(false)}
        investorId={investor.id}
        investorName={investor.name}
        investorFirm={investor.firmName}
        onSuccess={onActionSuccess}
      />

      <RequestIntroModal
        isOpen={isRequestIntroOpen}
        onClose={() => setIsRequestIntroOpen(false)}
        investorName={investor.name}
        investorFirm={investor.firmName}
        onSuccess={onActionSuccess}
      />
    </div>
  );
}
