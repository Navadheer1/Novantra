"use client";

import React from "react";
import { Flame, Calendar, Sparkles, Bookmark, UserPlus, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockFounders, mockEvents, mockInvestors } from "./mockExploreData";
import Link from "next/link";

export default function ExploreRightSidebar() {
  return (
    <div className="space-y-6">
      
      {/* 1. Trending Founders */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500 fill-current" />
            <span>Trending Founders</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Weekly</span>
        </div>

        <div className="space-y-3">
          {mockFounders.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={f.avatarUrl} alt={f.name} className="w-9 h-9 rounded-full object-cover shrink-0 border" />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                    {f.name}
                    {f.verified && <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{f.startupName}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-[11px] font-bold h-7 px-2.5 rounded-lg shrink-0">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Personalized AI Recommendations */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-[24px] p-5 border border-blue-800/60 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Recommended For You</span>
        </div>
        <h4 className="font-extrabold text-sm text-white">
          Marcus Vance • Angel Investor
        </h4>
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          Matches your tech stack (Next.js, TypeScript). Invests $50k - $250k in AI Infrastructure & DevTools.
        </p>
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs h-8 rounded-xl flex items-center justify-center gap-1">
          <span>Connect & Pitch</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 3. Upcoming Hackathons & Events */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Upcoming Events</span>
          </h3>
          <Link href="/meet" className="text-xs text-blue-600 font-bold hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {mockEvents.map((evt) => (
            <div key={evt.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                {evt.date}
              </span>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                {evt.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1">
                <span>{evt.attendeesCount} Attending</span>
                <span className="text-blue-600 font-bold">Register</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
