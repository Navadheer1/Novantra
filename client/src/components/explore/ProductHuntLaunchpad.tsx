"use client";

import React, { useState } from "react";
import { Rocket, ChevronUp, ExternalLink, Sparkles, Trophy, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartupItem } from "./types";

interface Props {
  startups: StartupItem[];
}

export default function ProductHuntLaunchpad({ startups }: Props) {
  const [upvotes, setUpvotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    startups.forEach((s) => {
      initial[s.id] = s.upvotesCount || 100;
    });
    return initial;
  });

  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});

  const handleToggleUpvote = (id: string) => {
    setHasUpvoted((prev) => {
      const isUpvoted = !!prev[id];
      setUpvotes((countPrev) => ({
        ...countPrev,
        [id]: isUpvoted ? countPrev[id] - 1 : countPrev[id] + 1,
      }));
      return { ...prev, [id]: !isUpvoted };
    });
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/5 via-blue-500/5 to-transparent border border-amber-500/20 rounded-[28px] p-6 sm:p-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 font-extrabold text-[11px] uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Launchpad Ranking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Featured Startup Launches Today
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Community upvoted products launching on Noventra Core ecosystem.
          </p>
        </div>

        <Button
          variant="outline"
          className="text-xs font-bold border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl"
        >
          <Rocket className="w-3.5 h-3.5 mr-1.5" />
          <span>Submit Your Launch</span>
        </Button>
      </div>

      {/* Startup Launch Cards List */}
      <div className="space-y-4">
        {startups.map((s, idx) => (
          <div
            key={s.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-lg font-black text-slate-400 w-6 text-center shrink-0">
                #{s.launchRank || idx + 1}
              </span>

              <img
                src={s.logo}
                alt={s.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shrink-0"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {s.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase">
                    {s.stage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                  {s.tagline}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-semibold">
                  <span>By {s.founderName}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-extrabold">{s.mrr || s.raisingStatus}</span>
                </div>
              </div>
            </div>

            {/* Upvote Action Button */}
            <button
              onClick={() => handleToggleUpvote(s.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-2xl border transition-all shrink-0 ${
                hasUpvoted[s.id]
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              }`}
            >
              <ChevronUp className={`w-4 h-4 ${hasUpvoted[s.id] ? "text-white" : "text-blue-600"}`} />
              <span className="text-xs font-black mt-0.5">{upvotes[s.id]}</span>
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
