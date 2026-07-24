"use client";

import { motion } from "framer-motion";
import { Flame, ChevronUp, ArrowRight } from "lucide-react";
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
    { id: "ts3", name: "HyperScale DB", desc: "Distributed vector DB", votes: 295, stage: "Series A" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          <span>Trending Today</span>
        </div>
        <Link
          href="/startups"
          className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-0.5"
        >
          <span>View More</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Startup Items */}
      <div className="space-y-1.5">
        {trendingStartups.map((s) => (
          <div
            key={s.id}
            className="p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-2 group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {s.name}
                </h4>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                  {s.stage}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{s.desc}</p>
            </div>

            <button
              onClick={() => toggleUpvote(s.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold transition-all shrink-0 ${
                upvoted[s.id]
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{s.votes + (upvoted[s.id] ? 1 : 0)}</span>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

