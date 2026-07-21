"use client";

import React from "react";
import { Radio, Flame, Sparkles, TrendingUp, Cpu, Zap, Activity } from "lucide-react";

export default function InnovationRadar() {
  const emergingTech = [
    { name: "Autonomous Kubernetes Agents", growth: "+340%", category: "DevOps" },
    { name: "Sub-millisecond Vector DBs", growth: "+280%", category: "AI Infra" },
    { name: "USDC Fiat Off-Ramp Rails", growth: "+210%", category: "FinTech" },
    { name: "Synthetic Bio Workflows", growth: "+190%", category: "BioTech" },
  ];

  const investorHeatIndex = [
    { sector: "AI Infrastructure & Agents", momentum: 98 },
    { sector: "B2B SaaS DevTools", momentum: 89 },
    { sector: "FinTech & Crypto Payments", momentum: 84 },
    { sector: "Climate & Clean Tech", momentum: 76 }
  ];

  return (
    <div className="bg-slate-900 text-white border border-slate-800 rounded-[28px] p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Background Radial Wave Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Noventra AI Innovation Radar
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Real-time market signal detection across ecosystem transactions & discussions.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Activity className="w-3 h-3 animate-spin" /> Live Radar Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Emerging Tech Trends */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" /> Fast-Growing Tech Signals
          </h3>

          <div className="space-y-2.5">
            {emergingTech.map((tech) => (
              <div
                key={tech.name}
                className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between hover:bg-slate-800 transition-colors"
              >
                <div>
                  <h4 className="font-extrabold text-xs text-white">{tech.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{tech.category}</span>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  {tech.growth}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Investor Heat Index */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> VC Capital Heat Index
          </h3>

          <div className="space-y-3 pt-1">
            {investorHeatIndex.map((heat) => (
              <div key={heat.sector} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-200">{heat.sector}</span>
                  <span className="text-blue-400 font-black">{heat.momentum}% Heat</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${heat.momentum}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
