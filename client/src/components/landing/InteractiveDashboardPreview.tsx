"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  LineChart,
  MessageSquare,
  Building2,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export function InteractiveDashboardPreview() {
  const [activeTab, setActiveTab] = useState<"workspace" | "analytics" | "messages" | "radar">("workspace");

  const tabs = [
    { id: "workspace", label: "Startup Workspace & Feed", icon: Layers },
    { id: "analytics", label: "Deal-Flow Analytics", icon: LineChart },
    { id: "messages", label: "Founder Inbox", icon: MessageSquare },
    { id: "radar", label: "VC Radar", icon: Building2 },
  ] as const;

  return (
    <section id="dashboard" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Product Command Center
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Everything You Need to <span className="text-gradient-hero">Build, Launch & Scale</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          An all-in-one operating system designed for rapid founder execution, instant investor matchmaking, and global team hiring.
        </p>
      </div>

      {/* Dashboard Preview Shell */}
      <div className="glass-panel bg-white/95 border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Top Tab Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 border border-slate-200 p-1.5 rounded-2xl w-full sm:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Metrics Badge */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-medium">Round Target:</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              $4,000,000 SAFE (80% Closed)
            </span>
          </div>
        </div>

        {/* Tab Content Display Area */}
        <AnimatePresence mode="wait">
          {activeTab === "workspace" && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left"
            >
              {/* Left 8 Cols: Startup Product & Feed Stage */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Startup Launch Workspace: MedQuick AI</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    Active Pitch Deck Sync
                  </span>
                </div>

                {/* Main Product Showcase Box */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        MedQuick AI — Slide 4/12 <Award className="w-4 h-4 text-amber-400" />
                      </h3>
                      <span className="text-xs text-slate-400">Financial Traction & Unit Economics</span>
                    </div>
                    <span className="text-xs font-mono text-blue-400 font-bold bg-blue-900/40 border border-blue-700/50 px-2.5 py-1 rounded-lg">
                      ARR: $1.8M • 284% MoM
                    </span>
                  </div>

                  {/* Visual ARR Chart Simulation */}
                  <div className="h-28 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-end justify-between gap-2">
                    {[30, 45, 60, 55, 75, 90, 110, 140, 180].map((h, idx) => (
                      <div key={idx} className="w-full flex flex-col items-center gap-1">
                        <div
                          style={{ height: `${(h / 180) * 100}%` }}
                          className="w-full bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t-sm"
                        />
                        <span className="text-[8px] text-slate-500 font-mono">M{idx + 1}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>LTV/CAC Ratio: <strong className="text-white">4.8x</strong></span>
                    <span>Gross Margin: <strong className="text-emerald-400">84%</strong></span>
                    <span>Net Retention: <strong className="text-white">142%</strong></span>
                  </div>
                </div>

                {/* Groq AI Recommendation Bar */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span className="text-slate-300">Groq AI Recommendation: "Highlight $1.8M ARR growth speed for Sequoia thesis."</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg text-xs">
                    Share Deck Link
                  </button>
                </div>
              </div>

              {/* Right 4 Cols: Live Q&A & Investor Request Feed */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 text-left">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Investor Questions & Terms</h4>

                <div className="space-y-3 text-xs">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold text-slate-900">David (Sequoia Capital)</span>
                      <span className="text-[10px]">12:44 PM</span>
                    </div>
                    <p className="text-slate-700">"Great gross margins. We are preparing a $2.5M lead SAFE offer."</p>
                  </div>

                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold text-slate-900">Jessica (a16z Bio Fund)</span>
                      <span className="text-[10px]">12:45 PM</span>
                    </div>
                    <p className="text-slate-700">"Can you send over the HIPAA compliance verification documents?"</p>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5">
                  <span>Send Term Sheet Agreement</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
            >
              <div className="glass-card bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-xs text-slate-500 font-bold uppercase">Active Pitch Deck Views</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">1,420</span>
                <span className="text-xs text-emerald-600 font-bold mt-1 block">↑ +28% this week</span>
                <div className="mt-4 h-24 bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-end justify-between gap-1">
                  {[40, 65, 45, 80, 95, 70, 100].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-full bg-blue-600 rounded-t-sm opacity-80" />
                  ))}
                </div>
              </div>

              <div className="glass-card bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-xs text-slate-500 font-bold uppercase">Term Sheet Requests</span>
                <span className="text-3xl font-black text-blue-600 block mt-2">4 Verified VCs</span>
                <span className="text-xs text-slate-600 font-bold mt-1 block">Avg Check: $750,000</span>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg">
                    <span className="text-slate-900 font-medium">Sequoia Capital</span>
                    <span className="text-emerald-600 font-bold">$1.5M Lead</span>
                  </div>
                  <div className="flex justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg">
                    <span className="text-slate-900 font-medium">Accel Partners</span>
                    <span className="text-blue-600 font-bold">$500K Follow</span>
                  </div>
                </div>
              </div>

              <div className="glass-card bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-xs text-slate-500 font-bold uppercase">Runway Calculator</span>
                <span className="text-3xl font-black text-emerald-600 block mt-2">22 Months</span>
                <span className="text-xs text-slate-500 mt-1 block">Based on $45k/mo net burn</span>
                <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly ARR Growth:</span>
                    <span className="text-slate-900 font-bold">34%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Target Series A Cap:</span>
                    <span className="text-slate-900 font-bold">$18M</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-sm"
            >
              <h4 className="text-sm font-bold text-slate-900">Direct Investor Messages (Zero Intermediaries)</h4>
              <div className="space-y-3">
                {[
                  {
                    name: "Michael Chang (Partner @ Founders Fund)",
                    msg: "Loved your AI inference benchmarks slide. Are you available to review term sheet terms tomorrow?",
                    time: "10m ago",
                    unread: true,
                  },
                  {
                    name: "Sarah Jenkins (Lead Engineer @ Ex-OpenAI)",
                    msg: "Hey Sarah! Saw your co-founder post for a Principal Systems Architect. I'd love to discuss equity terms.",
                    time: "1h ago",
                    unread: false,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.name}</span>
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                        )}
                      </div>
                      <p className="text-xs text-slate-700 mt-1">{item.msg}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-4">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "radar" && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left"
            >
              {[
                { name: "Sequoia Capital", sector: "AI & HealthTech", checks: "$1M - $10M" },
                { name: "Andreessen Horowitz", sector: "FinTech & SaaS", checks: "$500K - $15M" },
                { name: "Benchmark", sector: "Consumer & Infra", checks: "$2M - $8M" },
                { name: "Lightspeed", sector: "Enterprise AI", checks: "$1M - $5M" },
              ].map((vc) => (
                <div key={vc.name} className="glass-card bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-extrabold text-blue-700 text-xs">
                    {vc.name.charAt(0)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{vc.name}</h4>
                  <span className="text-[10px] text-slate-500 block">{vc.sector}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">{vc.checks}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
