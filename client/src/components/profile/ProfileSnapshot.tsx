"use client";

import React from "react";
import { 
  DollarSign, Briefcase, Layers, Clock, Building2, 
  Users, TrendingUp, CheckCircle, Code, Award, Target, MessageSquare 
} from "lucide-react";

interface SnapshotProps {
  role: string;
  data: {
    // Investor fields
    investmentStage?: string;
    checkSize?: string;
    industriesCount?: number;
    portfolioCount?: number;
    openToInvest?: boolean;
    responseTime?: string;
    location?: string;

    // Founder fields
    startupName?: string;
    startupStage?: string;
    teamSize?: number;
    fundingStage?: string;
    lookingFor?: string;
    hiringStatus?: string;
    revenue?: string;

    // Developer fields
    primaryStack?: string;
    experienceLevel?: string;
    githubRepos?: number;
    workPreference?: string;

    // Mentor fields
    mentorshipFocus?: string;
    sessionRate?: string;
    menteesHelped?: number;
    rating?: string;
  };
}

export default function ProfileSnapshot({ role, data }: SnapshotProps) {
  const normalizedRole = role.toUpperCase();

  return (
    <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Executive Snapshot ({role})
        </h3>
      </div>

      {normalizedRole === "INVESTOR" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Stage Focus
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.investmentStage || "Pre-Seed & Seed"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Check Size
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.checkSize || "$50k - $250k"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-sky-500" /> Portfolio Count
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.portfolioCount ?? 12} Companies</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Pitch Status
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
              <CheckCircle className="w-3 h-3" />
              <span>{data.openToInvest !== false ? "Accepting Pitches" : "Closed"}</span>
            </span>
          </div>
        </div>
      )}

      {normalizedRole === "FOUNDER" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Startup Stage
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.startupStage || "Seed Stage"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Team Size
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.teamSize ?? 8} Members</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Traction / MRR
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.revenue || "$18k MRR (+24% MoM)"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-500" /> Looking For
            </span>
            <p className="text-sm font-extrabold text-slate-900 truncate">{data.lookingFor || "Lead Investor ($1.2M)"}</p>
          </div>
        </div>
      )}

      {normalizedRole === "DEVELOPER" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-sky-500" /> Primary Stack
            </span>
            <p className="text-sm font-extrabold text-slate-900 truncate">{data.primaryStack || "TypeScript, React, Next.js, Node"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-500" /> Experience Level
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.experienceLevel || "Senior Full-Stack (6+ yrs)"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" /> GitHub Repos
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.githubRepos ?? 34} Repositories</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Open To
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.workPreference || "Technical Co-Founder"}</p>
          </div>
        </div>
      )}

      {normalizedRole === "MENTOR" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-purple-600" /> Expertise
            </span>
            <p className="text-sm font-extrabold text-slate-900 truncate">{data.mentorshipFocus || "Go-To-Market & Pitching"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Session Rate
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.sessionRate || "Pro-Bono (Free 30m)"}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-600" /> Mentees Guided
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.menteesHelped ?? 45}+ Founders</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Rating
            </span>
            <p className="text-sm font-extrabold text-slate-900">{data.rating || "⭐ 4.98 / 5.0 (38 reviews)"}</p>
          </div>
        </div>
      )}

      {/* Fallback for General Users */}
      {normalizedRole === "USER" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Ecosystem Status</span>
            <p className="text-sm font-extrabold text-slate-900">Active Enthusiast</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Interests</span>
            <p className="text-sm font-extrabold text-slate-900">AI & Web3</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Connections</span>
            <p className="text-sm font-extrabold text-slate-900">120 Ecosystem Members</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Community Rank</span>
            <p className="text-sm font-extrabold text-slate-900">Top Contributor</p>
          </div>
        </div>
      )}
    </div>
  );
}
