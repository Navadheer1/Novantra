"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Brain,
  Building2,
  ArrowRight,
  Award,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

export function AIMatchingSection() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: "ai-infra",
      label: "AI & Infrastructure",
      icon: "🤖",
      startupName: "Synapse AI",
      stage: "Series A Target",
      roundInfo: "$3.0M at $25M Valuation",
      arr: "$1.8M ARR (+310% YoY)",
      score: 98,
      matches: [
        { name: "a16z AI Infrastructure Fund", fit: "99%", check: "$2.5M – $5.0M", logo: "a16z", color: "bg-blue-600" },
        { name: "Lightspeed Venture Partners", fit: "97%", check: "$1.5M – $4.0M", logo: "LS", color: "bg-indigo-600" },
        { name: "Scale Venture Partners", fit: "94%", check: "$2.0M – $5.0M", logo: "SV", color: "bg-purple-600" },
      ],
      copilotTip: "Investors are focusing heavily on inference efficiency. Emphasize your 4x GPU cost reduction benchmark in Slide 4.",
    },
    {
      id: "fintech",
      label: "FinTech & Payments",
      icon: "💳",
      startupName: "NovaPay",
      stage: "Seed Target",
      roundInfo: "$1.8M at $18M Valuation",
      arr: "$950K ARR (4x MoM)",
      score: 95,
      matches: [
        { name: "Y Combinator W26", fit: "98%", check: "$500K SAFE", logo: "YC", color: "bg-orange-600" },
        { name: "FinTech Collective", fit: "95%", check: "$500K – $1.5M", logo: "FC", color: "bg-emerald-600" },
        { name: "Better Tomorrow Ventures", fit: "93%", check: "$300K – $1.0M", logo: "BT", color: "bg-teal-600" },
      ],
      copilotTip: "Highlight regulatory milestone achievements (SOC2 Type II & MSB licensing) in your traction overview.",
    },
    {
      id: "healthtech",
      label: "HealthTech & Bio",
      icon: "🧬",
      startupName: "MedQuick AI",
      stage: "Seed Target",
      roundInfo: "$4.0M at $22M Valuation",
      arr: "$2.4M ARR (+284% YoY)",
      score: 99,
      matches: [
        { name: "Sequoia Capital", fit: "99%", check: "$1.5M – $4.0M", logo: "SQ", color: "bg-emerald-700" },
        { name: "a16z Bio Fund", fit: "97%", check: "$2.0M – $5.0M", logo: "a16z", color: "bg-blue-600" },
        { name: "Khosla Ventures", fit: "96%", check: "$1.0M – $3.5M", logo: "KV", color: "bg-sky-600" },
      ],
      copilotTip: "Your $2.4M ARR with 84% gross margins places MedQuick in the top 1% of digital health seed applicants.",
    },
    {
      id: "saas",
      label: "SaaS & Enterprise",
      icon: "🚀",
      startupName: "Workflow AI",
      stage: "Pre-Seed Target",
      roundInfo: "$1.2M at $12M Valuation",
      arr: "$420K ARR (+140% NRR)",
      score: 94,
      matches: [
        { name: "Index Ventures", fit: "96%", check: "$500K – $2.0M", logo: "IV", color: "bg-slate-800" },
        { name: "Founders Fund", fit: "94%", check: "$1.0M – $3.0M", logo: "FF", color: "bg-blue-700" },
        { name: "Accel Partners", fit: "92%", check: "$500K – $1.5M", logo: "AP", color: "bg-rose-600" },
      ],
      copilotTip: "Emphasize enterprise contract pipeline ($680k qualified pipeline) to lock lead investor terms faster.",
    },
  ];

  const current = categories[activeCategory];

  return (
    <section id="ai-matching" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5 text-indigo-600" /> Smart AI Match Engine
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Instant VC Thesis Match & <span className="text-gradient-cyan">Pitch Deck Insights</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          Trained on over 10,000 successful term sheets. Select a sector below to see how our AI matches startup metrics directly with venture capital funds.
        </p>
      </div>

      {/* Industry Sector Pills Selector Bar */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 mb-10">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === idx;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(idx)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300"
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Unified AI Match Showcase Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="glass-panel bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Top Bar Status */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-8 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Groq AI Match Analysis: {current.startupName}</span>
                  <ShieldCheck className="w-4 h-4 text-blue-600 fill-blue-50" />
                </h3>
                <span className="text-xs text-slate-500 font-medium">{current.stage} • {current.roundInfo}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI Health Score: {current.score}/100</span>
              </span>
              <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold px-3 py-1 rounded-full">
                ⚡ 0.18s Speed
              </span>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
            
            {/* Left 5 Cols: Startup Profile Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400 font-mono">Target Startup Profile</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded font-bold">
                  Verified Data
                </span>
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">{current.startupName}</h4>
                <span className="text-xs text-emerald-400 font-bold block mt-1">{current.arr}</span>
              </div>

              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Target Round:</span>
                  <span className="text-white font-bold">{current.roundInfo}</span>
                </div>
                <div className="flex justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Match Precision:</span>
                  <span className="text-emerald-400 font-bold">Top 1% Alignment</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">
                  AI Evaluated Metrics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["MoM Growth", "Cap Table", "LTV/CAC", "Thesis Fit"].map((tag) => (
                    <span key={tag} className="text-[9px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Top Matched Investor Partners */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Top Recommended Venture Capital Partners
                </h4>
                <span className="text-xs text-blue-600 font-bold">3 Funds Matched</span>
              </div>

              {/* Matched VC List */}
              <div className="space-y-3">
                {current.matches.map((match) => (
                  <div
                    key={match.name}
                    className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${match.color} text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0`}
                      >
                        {match.logo}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{match.name}</h5>
                        <span className="text-xs text-slate-500">Typical Check: <strong className="text-slate-800">{match.check}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        {match.fit} Thesis Match
                      </span>
                      <button className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-600 transition-all flex items-center gap-1 group/btn">
                        <span>Intro</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Copilot Advice Pill Banner */}
              <div className="bg-blue-50/90 border border-blue-200 p-4 rounded-2xl flex items-start gap-3 text-xs shadow-xs">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 fill-amber-400/20" />
                <div>
                  <span className="text-blue-900 font-bold block mb-0.5">Real-time Pitch Recommendation:</span>
                  <p className="text-slate-700 font-normal leading-relaxed">{current.copilotTip}</p>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Summary Bar */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="glass-panel bg-white/80 border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-2xl font-black text-slate-900 block">0.18s</span>
          <span className="text-xs text-slate-500 font-medium">Sub-Second Pitch & Thesis Matching</span>
        </div>
        <div className="glass-panel bg-white/80 border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-2xl font-black text-emerald-600 block">98.4%</span>
          <span className="text-xs text-slate-500 font-medium">VC Thesis Recommendation Precision</span>
        </div>
        <div className="glass-panel bg-white/80 border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-2xl font-black text-blue-600 block">10,000+</span>
          <span className="text-xs text-slate-500 font-medium">Term Sheet Datasets Trained</span>
        </div>
      </div>
    </section>
  );
}
