"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Building2,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  FileText,
  Calendar,
  MessageSquare,
  Bookmark,
  Share2,
  Sparkles,
  Users,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Star,
  Zap,
  Lock,
  PieChart
} from "lucide-react";
import { MarketplaceRoleView } from "./RoleViewToggle";

export interface StartupCardProps {
  startup: {
    id: string;
    name: string;
    description: string;
    industry: string;
    stage: string;
    logo?: string | null;
    banner?: string | null;
    founderId: string;
    founder: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string | null;
    };
    fundingNeeded?: string | null;
    requiredRoles?: string[];
    website?: string | null;
    // Enhanced Role-based fields (with realistic fallbacks if mock data is partial)
    mrr?: string;
    valuation?: string;
    runwayMonths?: number;
    momGrowth?: string;
    investmentScore?: number;
    teamSize?: number;
    verified?: boolean;
    founderRating?: number;
    openJobsCount?: number;
    betaStatus?: string;
    buildProgress?: number;
    lookingForRoles?: string[];
  };
  roleView: MarketplaceRoleView;
  onOpenDeck?: (startup: any) => void;
  onRequestMeeting?: (startup: any) => void;
  onApplyJob?: (startup: any) => void;
  onActionSuccess?: (msg: string) => void;
}

export default function StartupCard({
  startup,
  roleView,
  onOpenDeck,
  onRequestMeeting,
  onApplyJob,
  onActionSuccess
}: StartupCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  // Derived metrics with fallback formatting
  const seekingFormatted = startup.fundingNeeded
    ? Number(startup.fundingNeeded) >= 1000000
      ? `$${(Number(startup.fundingNeeded) / 1000000).toFixed(1)}M`
      : `$${(Number(startup.fundingNeeded) / 1000).toFixed(0)}k`
    : "$500k";

  const mrrVal = startup.mrr || "$14,500";
  const valuationVal = startup.valuation || "$4.2M";
  const growthVal = startup.momGrowth || "+24%";
  const runwayVal = startup.runwayMonths || 14;
  const scoreVal = startup.investmentScore || 88;
  const teamSizeVal = startup.teamSize || 6;
  const ratingVal = startup.founderRating || 4.9;
  const rolesVal = startup.lookingForRoles || startup.requiredRoles || ["Co-Founder", "Full-Stack Dev", "UI Designer"];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/startups/${startup.id}`);
      if (onActionSuccess) onActionSuccess(`Startup link for ${startup.name} copied!`);
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group relative">
      {/* CARD TOP BANNER & BADGES */}
      <div>
        <div className="h-20 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/20 relative overflow-hidden">
          {startup.banner && (
            <img src={startup.banner} alt={startup.name} className="w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            {startup.verified !== false && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wide bg-emerald-500/90 text-white px-2 py-0.5 rounded-full shadow-sm">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
            )}
            <span className="text-[10px] font-extrabold uppercase bg-background/90 text-foreground px-2 py-0.5 rounded-full border border-border/60 shadow-sm backdrop-blur-sm">
              {startup.stage || "Pre-Seed"}
            </span>
          </div>
        </div>

        {/* LOGO & BASIC HEADER */}
        <div className="px-5 pt-0 pb-3 -mt-8 flex items-end justify-between relative z-20">
          <div className="flex items-end gap-3">
            <div className="w-14 h-14 rounded-2xl border-2 border-card bg-background shadow-md overflow-hidden shrink-0 flex items-center justify-center font-black text-xl text-primary">
              {startup.logo ? (
                <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
              ) : (
                startup.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <Link href={`/startups/${startup.id}`}>
                <h3 className="text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {startup.name}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </Link>
              <p className="text-xs font-semibold text-muted-foreground">{startup.industry}</p>
            </div>
          </div>

          {/* AI Score Badge in Investor View */}
          {roleView === "INVESTOR" && (
            <div className="text-right">
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
                AI Readiness
              </span>
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-xs font-black">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {scoreVal}/100
              </div>
            </div>
          )}
        </div>

        {/* DESCRIPTION SUMMARY */}
        <div className="px-5 mb-3">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
            {startup.description}
          </p>
        </div>

        {/* ========================================================= */}
        {/* ROLE 1: INVESTOR VIEW METRICS GRID                        */}
        {/* ========================================================= */}
        {roleView === "INVESTOR" && (
          <div className="px-5 mb-4">
            <div className="bg-emerald-950/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Seeking</span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">{seekingFormatted}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Valuation</span>
                <span className="text-xs font-black text-foreground">{valuationVal}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">MRR</span>
                <span className="text-xs font-black text-foreground">{mrrVal}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">MoM Growth</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{growthVal}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Runway</span>
                <span className="text-xs font-black text-foreground">{runwayVal} mo</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Founder Score</span>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {ratingVal}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROLE 2: FOUNDER VIEW RECRUITMENT & PROGRESS               */}
        {/* ========================================================= */}
        {roleView === "FOUNDER" && (
          <div className="px-5 mb-4 space-y-2.5">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-blue-600 dark:text-blue-400 block mb-1">
                Actively Looking For
              </span>
              <div className="flex flex-wrap gap-1">
                {rolesVal.map((r, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-md"
                  >
                    + {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-1 border-t border-border/50">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" /> Team Size: <strong className="text-foreground">{teamSizeVal} members</strong>
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> Funding: <strong className="text-foreground">{seekingFormatted}</strong>
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROLE 3: USER & TALENT VIEW                                */}
        {/* ========================================================= */}
        {roleView === "USER" && (
          <div className="px-5 mb-4 space-y-2">
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-purple-600 dark:text-purple-400 block">
                  Talent Opportunities
                </span>
                <p className="text-xs font-bold text-foreground">
                  {startup.openJobsCount || 3} Open Internships & Roles
                </p>
              </div>
              <span className="text-[10px] font-extrabold bg-purple-500 text-white px-2 py-1 rounded-lg">
                Hiring Now
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span>Beta Access: <strong className="text-emerald-600">Open to Testers</strong></span>
              <span>Founder: <strong className="text-foreground">{startup.founder.name}</strong></span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROLE 4: ADMIN MODERATION VIEW                             */}
        {/* ========================================================= */}
        {roleView === "ADMIN" && (
          <div className="px-5 mb-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-800 dark:text-amber-300">Platform ID: {startup.id.slice(0, 8)}...</span>
                <span className="text-emerald-600">Status: Approved</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Founder Email: <span className="font-mono text-foreground">{startup.founder.email}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CARD FOOTER & ROLE-SPECIFIC BUTTONS */}
      <div className="p-4 bg-muted/30 border-t border-border/60">
        {/* INVESTOR ACTIONS */}
        {roleView === "INVESTOR" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                onClick={() => onOpenDeck && onOpenDeck(startup)}
              >
                <FileText className="w-3.5 h-3.5 mr-1" /> View Deck
              </Button>
              <Button
                size="sm"
                className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onRequestMeeting && onRequestMeeting(startup)}
              >
                <Calendar className="w-3.5 h-3.5 mr-1" /> Book Pitch
              </Button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  isSaved ? "text-emerald-600 font-extrabold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-emerald-600 text-emerald-600" : ""}`} />
                {isSaved ? "Saved to Dealflow" : "Save Startup"}
              </button>
              <Link href={`/startups/${startup.id}`} className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5">
                Due Diligence <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* FOUNDER ACTIONS */}
        {roleView === "FOUNDER" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/startups/${startup.id}`}>
                <Button size="sm" className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white">
                  Join Team / Apply
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => onActionSuccess && onActionSuccess(`Collaboration invite sent to ${startup.founder.name}`)}
              >
                Collaborate
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <button onClick={() => setIsFollowed(!isFollowed)} className="hover:text-foreground font-semibold">
                {isFollowed ? "Following ✓" : "+ Follow Startup"}
              </button>
              <button onClick={handleShare} className="hover:text-foreground flex items-center gap-1">
                <Share2 className="w-3 h-3" /> Share
              </button>
            </div>
          </div>
        )}

        {/* USER & TALENT ACTIONS */}
        {roleView === "USER" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => onApplyJob && onApplyJob(startup)}
              >
                Apply for Job
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-purple-500/30 text-purple-700 dark:text-purple-300"
                onClick={() => onActionSuccess && onActionSuccess(`Registered for ${startup.name} Beta Program!`)}
              >
                Join Beta
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <Link href={`/startups/${startup.id}`} className="font-bold text-purple-600 hover:underline">
                Explore Product Screenshots →
              </Link>
            </div>
          </div>
        )}

        {/* ADMIN ACTIONS */}
        {roleView === "ADMIN" && (
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="text-[10px] font-bold text-emerald-600 border-emerald-500/30"
              onClick={() => onActionSuccess && onActionSuccess(`Verified badge granted to ${startup.name}`)}
            >
              Verify
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-[10px] font-bold text-blue-600 border-blue-500/30"
              onClick={() => onActionSuccess && onActionSuccess(`${startup.name} featured on homepage!`)}
            >
              Feature
            </Button>
            <Link href={`/startups/${startup.id}`}>
              <Button size="sm" variant="secondary" className="w-full text-[10px] font-bold">
                Analytics
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
