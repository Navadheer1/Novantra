"use client";

import React, { useState } from "react";
import { TrendingUp, DollarSign, Building2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FundingExplorer() {
  const [selectedStage, setSelectedStage] = useState<string>("all");

  const stages = [
    { id: "all", label: "All Rounds" },
    { id: "pre_seed", label: "Pre-Seed" },
    { id: "seed", label: "Seed" },
    { id: "series_a", label: "Series A" },
    { id: "series_b", label: "Series B+" },
  ];

  const fundingDeals = [
    {
      id: "f-1",
      startupName: "CodeCraft AI",
      stage: "Seed",
      amount: "$4.5M",
      leadInvestor: "Sequoia Capital",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      time: "2h ago"
    },
    {
      id: "f-2",
      startupName: "BioSynth Labs",
      stage: "Series A",
      amount: "$12.0M",
      leadInvestor: "Andreessen Horowitz",
      logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=80",
      time: "5h ago"
    },
    {
      id: "f-3",
      startupName: "PayPulse Rails",
      stage: "Pre-Seed",
      amount: "$750K",
      leadInvestor: "Y Combinator",
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&auto=format&fit=crop&q=80",
      time: "1d ago"
    }
  ];

  const filteredDeals = selectedStage === "all"
    ? fundingDeals
    : fundingDeals.filter((d) => d.stage.toLowerCase().replace("-", "_").includes(selectedStage));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Realtime Capital Flow</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Funding Deal Explorer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track recent investments, lead venture partners, and capital velocity.
          </p>
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedStage === st.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3 hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={deal.logo} alt={deal.startupName} className="w-9 h-9 rounded-xl object-cover border shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {deal.startupName}
                  </h3>
                  <span className="text-[10px] font-black uppercase text-slate-400">{deal.stage}</span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl">
                {deal.amount}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-t border-slate-200/60 dark:border-slate-700/60 pt-2.5">
              <span>Led by {deal.leadInvestor}</span>
              <span className="text-[10px] text-slate-400">{deal.time}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
