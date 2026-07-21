"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Users, Building2, Calendar, UserPlus, 
  Sparkles, TrendingUp, ArrowRight, ShieldCheck 
} from "lucide-react";

interface ProfileSidebarProps {
  role: string;
}

export default function ProfileSidebar({ role }: ProfileSidebarProps) {
  const suggestedPeople = [
    { id: "u1", name: "Elena Rostova", role: "INVESTOR", sub: "General Partner @ Apex VC", avatar: null },
    { id: "u2", name: "Marcus Vance", role: "FOUNDER", sub: "Building HyperScale (Seed)", avatar: null },
    { id: "u3", name: "Dr. Aris Thorne", role: "MENTOR", sub: "Ex-VP Product @ Stripe", avatar: null },
  ];

  const trendingStartups = [
    { id: "s1", name: "Acme AI", stage: "Seed", industry: "AI / DevTools" },
    { id: "s2", name: "FinFlow", stage: "Series A", industry: "FinTech" },
    { id: "s3", name: "PulseHealth", stage: "Pre-Seed", industry: "HealthTech" },
  ];

  const demoDays = [
    { name: "Noventra Spring Demo Day 2026", date: "April 15, 2026", slots: "12 Pitching Startups" },
    { name: "AI Founders Showcase", date: "May 02, 2026", slots: "VC & Angel Only" },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Suggested Connections */}
      <div className="bg-white border border-slate-100 p-5 rounded-[20px] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" /> Suggested Connections
          </h4>
          <span className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">View All</span>
        </div>

        <div className="space-y-3">
          {suggestedPeople.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                  {p.name[0]}
                </div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-xs text-slate-900 truncate leading-tight">{p.name}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{p.sub}</p>
                </div>
              </div>

              <button
                title="Connect"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shrink-0 shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Trending Startups */}
      <div className="bg-white border border-slate-100 p-5 rounded-[20px] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Trending Startups
          </h4>
          <Link href="/startups" className="text-[10px] text-blue-600 font-bold hover:underline">
            Directory
          </Link>
        </div>

        <div className="space-y-2.5">
          {trendingStartups.map((st) => (
            <div key={st.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2">
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">{st.name}</h5>
                <p className="text-[10px] text-slate-400">{st.industry}</p>
              </div>
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {st.stage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Upcoming Demo Days */}
      <div className="bg-white border border-slate-100 p-5 rounded-[20px] shadow-sm space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-purple-600" /> Upcoming Demo Days
        </h4>

        <div className="space-y-3">
          {demoDays.map((d, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
              <h5 className="font-extrabold text-xs text-purple-950">{d.name}</h5>
              <div className="flex justify-between items-center text-[10px] text-purple-700 font-semibold pt-1">
                <span>📅 {d.date}</span>
                <span className="bg-white px-2 py-0.5 rounded border border-purple-200">{d.slots}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
