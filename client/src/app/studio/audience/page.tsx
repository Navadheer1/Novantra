"use client";

import React from "react";
import StudioLayout from "@/components/studio/StudioLayout";
import {
  Users,
  Briefcase,
  TrendingUp,
  UserCheck,
  Bookmark,
  Building,
  Eye,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function StudioAudiencePage() {
  const highValueViewers = [
    { name: "Sequoia Capital (Sarah Chen)", activity: "Watched 5 product demos & requested meeting", time: "1 hour ago", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
    { name: "Accel Partners (Michael Vance)", activity: "Saved 'Noventra Real-Time Edge' to VC Watchlist", time: "3 hours ago", icon: Bookmark, color: "text-blue-600 bg-blue-50" },
    { name: "Y Combinator (Elena Rostova)", activity: "Shared product demo with W27 admissions team", time: "1 day ago", icon: Eye, color: "text-emerald-600 bg-emerald-50" },
    { name: "Stripe VP Eng (Rohan Gupta)", activity: "Liked video & left high-value technical comment", time: "2 days ago", icon: UserCheck, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Audience & Investor Insights</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Follower demographics, high-value investor activity logs, and viewer engagement.
          </p>
        </div>

        {/* FOLLOWER STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Channel Followers</span>
            <div className="text-2xl font-black text-slate-900">12,450</div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +1,240 this month
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Investors & VCs</span>
            <div className="text-2xl font-black text-indigo-600">350 Verified</div>
            <p className="text-[11px] text-slate-400 font-medium">18% of total viewership</p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Startup Founder Viewers</span>
            <div className="text-2xl font-black text-blue-600">3,984 Founders</div>
            <p className="text-[11px] text-slate-400 font-medium">32% of total viewership</p>
          </div>
        </div>

        {/* HIGH-VALUE VIEWERS LOG */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" /> High-Value Investor & Partner Activity
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Key ecosystem stakeholders viewing your content</p>
          </div>

          <div className="space-y-3">
            {highValueViewers.map((viewer, idx) => {
              const Icon = viewer.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${viewer.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900">{viewer.name}</h4>
                      <p className="text-slate-600 font-medium mt-0.5">{viewer.activity}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">{viewer.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </StudioLayout>
  );
}
