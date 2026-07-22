"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  BrainCircuit,
  Bot,
  Flame,
} from "lucide-react";

export function AIMatchingSection() {
  const [activePreset, setActivePreset] = useState(0);

  const presets = [
    {
      title: "AI Infrastructure Series A",
      prompt: "Generated pitch strategy for $3M Series A at $25M valuation",
      matches: [
        { name: "A16Z AI Fund", thesisFit: "99%", chequeSize: "$2.5M - $5M" },
        { name: "Lightspeed Venture Partners", thesisFit: "97%", chequeSize: "$1.5M - $4M" },
        { name: "Scale Venture Partners", thesisFit: "94%", chequeSize: "$2M - $5M" },
      ],
      aiCopilotTip: "Investors are looking closely at GPU utilization efficiency. Emphasize your 4x inference speedup benchmark.",
    },
    {
      title: "FinTech Pre-Seed",
      prompt: "Generated pitch deck for cross-border payment API",
      matches: [
        { name: "Y Combinator W26", thesisFit: "98%", chequeSize: "$500K" },
        { name: "FinTech Collective", thesisFit: "95%", chequeSize: "$250K - $750K" },
        { name: "Better Tomorrow Ventures", thesisFit: "92%", chequeSize: "$300K - $1M" },
      ],
      aiCopilotTip: "Highlight regulatory compliance milestones (SOC2 Type II & MSB license) in Slide 3.",
    },
    {
      title: "SaaS Enterprise Seed",
      prompt: "AI Autonomous Support Workflow for Fortune 500",
      matches: [
        { name: "Sequoia Capital", thesisFit: "99%", chequeSize: "$1M - $3M" },
        { name: "Index Ventures", thesisFit: "96%", chequeSize: "$1.5M - $3.5M" },
        { name: "Founders Fund", thesisFit: "93%", chequeSize: "$2M - $4M" },
      ],
      aiCopilotTip: "Your $420k ARR with 140% Net Revenue Retention is in the top 1% of Seed applicants.",
    },
  ];

  const currentPreset = presets[activePreset];

  return (
    <section id="ai-matching" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5 text-indigo-600" /> Groq Llama 3 AI Engine
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Sub-Second Pitch Generation & <span className="text-gradient-cyan">VC Matching</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          Trained on over 10,000 successful term sheets. Our AI matches your startup metrics directly with venture partners whose investment thesis aligns with your round.
        </p>
      </div>

      {/* Main Interactive AI Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Preset Selector & Features */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel bg-white/90 border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-blue-600" /> Choose Interactive Preset
            </h3>

            <div className="space-y-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={preset.title}
                  onClick={() => setActivePreset(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    activePreset === idx
                      ? "bg-blue-50/80 border-blue-300 shadow-sm text-slate-900"
                      : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold block text-slate-900">{preset.title}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{preset.prompt}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                      activePreset === idx ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Metrics Callouts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card bg-white/80 border border-slate-200 p-4 rounded-2xl text-left shadow-sm">
              <span className="text-2xl font-black text-slate-900 block">0.18s</span>
              <span className="text-xs text-slate-500">Average Groq Pitch Generation Time</span>
            </div>
            <div className="glass-card bg-white/80 border border-slate-200 p-4 rounded-2xl text-left shadow-sm">
              <span className="text-2xl font-black text-emerald-600 block">98.4%</span>
              <span className="text-xs text-slate-500">VC Match Recommendation Precision</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Live Terminal Simulation */}
        <div className="lg:col-span-7">
          <div className="glass-panel bg-white/95 border border-slate-200/90 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-slate-500">groq-llama3-vc-matcher.v2</span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono">
                Latency: 142ms
              </span>
            </div>

            {/* Content Output */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePreset}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                {/* AI Input Simulation Bar */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Bot className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-800 font-mono font-medium">{currentPreset.prompt}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Processed
                  </span>
                </div>

                {/* Target VC Matches */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                    Target Venture Thesis Matches
                  </span>
                  <div className="space-y-2.5">
                    {currentPreset.matches.map((match, idx) => (
                      <div
                        key={match.name}
                        className="bg-white border border-slate-200/90 hover:border-blue-400 p-3.5 rounded-2xl flex items-center justify-between transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs">
                            0{idx + 1}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">{match.name}</span>
                            <span className="text-[10px] text-slate-500">Typical Check: {match.chequeSize}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg block">
                            {match.thesisFit} Thesis Match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Copilot Advice Pill */}
                <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl flex items-start gap-3 text-xs">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-blue-900 font-bold block mb-0.5">Real-time Pitch Recommendation:</span>
                    <p className="text-slate-700 font-normal leading-relaxed">{currentPreset.aiCopilotTip}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
