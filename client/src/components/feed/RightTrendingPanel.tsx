"use client";

import { motion } from "framer-motion";
import { Flame, DollarSign, Rocket, Calendar, Radio, GraduationCap, Trophy, ArrowUpRight, Plus, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RightTrendingPanel() {
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});

  const toggleUpvote = (id: string) => {
    setUpvoted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const trendingStartups = [
    { id: "ts1", name: "DevMatrix AI", desc: "Autonomous DevOps agents", votes: 412, stage: "Seed" },
    { id: "ts2", name: "PayPulse", desc: "Stablecoin payout rails", votes: 328, stage: "Pre-Seed" },
    { id: "ts3", name: "HyperScale DB", desc: "Distributed vector database", votes: 295, stage: "Series A" },
  ];

  const fundingRounds = [
    { id: "fr1", startup: "CodeCraft AI", amount: "$4.5M Seed", lead: "Sequoia Capital" },
    { id: "fr2", startup: "BioSynth Labs", amount: "$12.0M Series A", lead: "Andreessen Horowitz" },
  ];

  const upcomingEvents = [
    { id: "ev1", title: "Noventra Pitch Night #14", date: "Tomorrow, 6:00 PM", attendees: 140 },
    { id: "ev2", title: "YC Application Q&A Workshop", date: "Jul 25, 8:00 PM", attendees: 280 },
  ];

  const topBuilders = [
    { id: "tb1", name: "Rohan Varma", uni: "Stanford", project: "VectorEngine" },
    { id: "tb2", name: "Elena Rostova", uni: "MIT", project: "OpenAgent UI" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Trending Startups Widget */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Trending Startups</span>
          </div>
          <Link href="/startups" className="text-[11px] font-bold text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-2.5">
          {trendingStartups.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-slate-300 hover:bg-white transition-all flex items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-slate-900">{s.name}</h4>
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                    {s.stage}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">{s.desc}</p>
              </div>

              <button
                onClick={() => toggleUpvote(s.id)}
                className={`flex flex-col items-center px-2 py-1 rounded-lg border text-xs font-black transition-all ${
                  upvoted[s.id]
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <ChevronUp className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110" />
                <span>{s.votes + (upvoted[s.id] ? 1 : 0)}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Active Funding Rounds Widget */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Active Funding Deals</span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Live
          </span>
        </div>

        <div className="space-y-2.5">
          {fundingRounds.map((fr) => (
            <div key={fr.id} className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/60 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-900">{fr.startup}</span>
                <span className="font-extrabold text-emerald-700">{fr.amount}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Led by {fr.lead}</p>
            </div>
          ))}
        </div>

        <Link href="/investors">
          <button className="w-full py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1">
            <span>Explore Investor Syndicates</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* 3. Upcoming Events & Founder Live */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>Upcoming Events</span>
          </div>
          <Link href="/meet" className="text-[11px] font-bold text-blue-600 hover:underline">
            Schedule
          </Link>
        </div>

        <div className="space-y-2.5">
          {upcomingEvents.map((ev) => (
            <div key={ev.id} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900">{ev.title}</h4>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span>{ev.date}</span>
                <span className="text-purple-600 font-bold">{ev.attendees} attending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Top Student Builders Leaderboard */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top Student Builders</span>
          </div>
          <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Weekly
          </span>
        </div>

        <div className="space-y-2.5">
          {topBuilders.map((b, idx) => (
            <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-extrabold text-[10px] flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900">{b.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{b.uni} • {b.project}</p>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-slate-200 text-blue-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
