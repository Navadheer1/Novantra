"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Building2, ExternalLink, FileText, TrendingUp, Users, 
  Briefcase, CheckCircle2, DollarSign, Target, Award, Rocket, ArrowRight, Globe 
} from "lucide-react";
import EmptyState from "./EmptyState";

interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
}

interface Milestone {
  quarter: string;
  title: string;
  completed: boolean;
}

interface Backer {
  name: string;
  type: string;
}

interface FounderViewProps {
  profile: {
    bio: string | null;
    startup?: {
      id: string;
      name: string;
      logo?: string;
      tagline?: string;
      stage: string;
      raised?: string;
      lookingFor?: string;
      openRoles?: string[];
      pitchDeckUrl?: string;
      websiteUrl?: string;
      story?: string;
      traction?: {
        mrr: string;
        users: string;
        momGrowth: string;
      };
      products?: Array<{ title: string; desc: string }>;
      team?: TeamMember[];
      roadmap?: Milestone[];
      backers?: Backer[];
    };
  };
  isOwnProfile?: boolean;
}

export default function ProfileFounderView({ profile, isOwnProfile }: FounderViewProps) {
  const startup = profile.startup || {
    id: "s1",
    name: "Noventra Core",
    logo: "",
    tagline: "The next-generation unified platform for founders, investors & top talent.",
    stage: "Seed Stage",
    raised: "$1.4M Seed Raised",
    lookingFor: "Lead Investor ($2M Series A) & Staff AI Engineer",
    openRoles: ["Senior Full-Stack Developer", "Growth Lead", "Product Designer"],
    pitchDeckUrl: "#",
    websiteUrl: "https://noventra.io",
    story: "Founded in 2024 to end fragmentation in the startup ecosystem. We empower founders to fundraise, manage equity, and hire top engineering talent in one seamless operating system.",
    traction: {
      mrr: "$42,000 MRR",
      users: "12,400 Monthly Active Users",
      momGrowth: "+28% MoM Growth"
    },
    products: [
      { title: "Omnibox Search Engine", desc: "AI-indexed unified search across startups, investors, and ecosystem deals." },
      { title: "DealFlow Pipeline", desc: "Seamless pitch submission and direct warm connection protocol." }
    ],
    team: [
      { name: "Sarah Lin", role: "Co-Founder & CTO" },
      { name: "David Chen", role: "Head of Product" },
      { name: "Marcus Vance", role: "Lead Engineer" }
    ],
    roadmap: [
      { quarter: "Q1 2026", title: "Automated Investor Matchmaking V2", completed: true },
      { quarter: "Q2 2026", title: "Cap Table & Equity Management Suite", completed: false },
      { quarter: "Q3 2026", title: "Global Demo Day Acceleration Program", completed: false }
    ],
    backers: [
      { name: "Y Combinator", type: "Accelerator" },
      { name: "Founders Fund", type: "Lead VC" },
      { name: "Navadheer Ventures", type: "Angel Syndicate" }
    ]
  };

  return (
    <div className="space-y-6">

      {/* Startup Hero Card */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-[20px] p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-blue-600 font-black text-2xl flex items-center justify-center shadow-md shrink-0 border border-white/20">
              {startup.logo ? (
                <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                startup.name[0]
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black">{startup.name}</h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                  {startup.stage}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                  {startup.raised}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {startup.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {startup.websiteUrl && (
              <a href={startup.websiteUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 h-9">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </Button>
              </a>
            )}
            {startup.pitchDeckUrl && (
              <a href={startup.pitchDeckUrl} target="_blank" rel="noreferrer">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 h-9 shadow-sm">
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Pitch Deck</span>
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Looking For Highlight */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-slate-200">
              <strong className="text-white">Currently Seeking:</strong> {startup.lookingFor}
            </span>
          </div>

          {startup.openRoles && startup.openRoles.length > 0 && (
            <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/30 shrink-0">
              🔥 {startup.openRoles.length} Open Roles Available
            </span>
          )}
        </div>
      </div>

      {/* Traction Metrics */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" /> Key Traction & Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Monthly Recurring Revenue</span>
            <p className="text-lg font-black text-slate-900">{startup.traction?.mrr}</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Active Ecosystem Users</span>
            <p className="text-lg font-black text-slate-900">{startup.traction?.users}</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">Growth Momentum</span>
            <p className="text-lg font-black text-slate-900">{startup.traction?.momGrowth}</p>
          </div>
        </div>
      </div>

      {/* Story & About */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900">Startup Story & Vision</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {startup.story}
        </p>
      </div>

      {/* Products Showcase */}
      {startup.products && startup.products.length > 0 && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Products & Core Offerings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {startup.products.map((prod, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-blue-600" /> {prod.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{prod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members & Open Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Team */}
        <div className="bg-white border border-slate-100 p-6 rounded-[20px] shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" /> Leadership Team
          </h3>

          <div className="space-y-3">
            {startup.team?.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  {member.name[0]}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">{member.name}</h5>
                  <p className="text-[11px] text-slate-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Backers */}
        <div className="bg-white border border-slate-100 p-6 rounded-[20px] shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Backers & Investors
          </h3>

          <div className="space-y-3">
            {startup.backers?.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-extrabold text-slate-900">{b.name}</span>
                <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {b.type}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Roadmap Milestones */}
      {startup.roadmap && startup.roadmap.length > 0 && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Milestone Roadmap</h3>
          <div className="space-y-3">
            {startup.roadmap.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 ${m.completed ? "text-emerald-500" : "text-slate-300"}`} />
                  <span className={`text-xs font-bold ${m.completed ? "text-slate-900 line-through opacity-70" : "text-slate-900"}`}>
                    {m.title}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white border text-slate-500">
                  {m.quarter}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
