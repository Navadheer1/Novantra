"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  LineChart,
  MessageSquare,
  Building2,
  Sparkles,
  Zap,
} from "lucide-react";

export function InteractiveDashboardPreview() {
  const [activeTab, setActiveTab] = useState<"pitch" | "analytics" | "messages" | "radar">("pitch");

  const tabs = [
    { id: "pitch", label: "WebRTC Pitch Room", icon: Video },
    { id: "analytics", label: "Deal-Flow Analytics", icon: LineChart },
    { id: "messages", label: "Founder Inbox", icon: MessageSquare },
    { id: "radar", label: "VC Radar", icon: Building2 },
  ] as const;

  return (
    <section id="dashboard" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Product Interface
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Everything You Need to <span className="text-gradient-hero">Build & Scale</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          An all-in-one command center designed for rapid founder execution, instant investor matchmaking, and seamless team hiring.
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
              $2,500,000 SAFE (78% Closed)
            </span>
          </div>
        </div>

        {/* Tab Content Display Area */}
        <AnimatePresence mode="wait">
          {activeTab === "pitch" && (
            <motion.div
              key="pitch"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left"
            >
              {/* Left 8 Cols: WebRTC Main Stage */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold text-white">Series A Pitching: MedQuick.AI</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    00:14:32
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 aspect-[16/9] bg-slate-950 rounded-xl p-2 relative overflow-hidden">
                  <div className="relative rounded-lg overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop"
                      alt="Founder"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 backdrop-blur px-2 py-0.5 rounded text-white">
                      Sarah (Founder)
                    </span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
                      alt="VC Partner"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 backdrop-blur px-2 py-0.5 rounded text-white">
                      David (Sequoia Partner)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span className="text-slate-300">Groq AI Recommendation: "Focus on Q3 ARR pipeline growth"</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg text-xs">
                    Share Deck Slide 6
                  </button>
                </div>
              </div>

              {/* Right 4 Cols: Live Q&A & Investor Request Feed */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 text-left">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Investor Questions</h4>

                <div className="space-y-3 text-xs">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold text-slate-900">David (Sequoia)</span>
                      <span className="text-[10px]">12:44 PM</span>
                    </div>
                    <p className="text-slate-700">"What is your gross margin profile for the AI API tier?"</p>
                  </div>

                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold text-slate-900">Jessica (a16z)</span>
                      <span className="text-[10px]">12:45 PM</span>
                    </div>
                    <p className="text-slate-700">"Can you share the customer retention cohort data?"</p>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm">
                  Send Term Sheet Link
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
                    msg: "Loved your AI inference benchmarks slide. Are you available for a 15-min call tomorrow at 2 PM PST?",
                    time: "10m ago",
                    unread: true,
                  },
                  {
                    name: "Sarah Jenkins (Lead Engineer @ Ex-OpenAI)",
                    msg: "Hey Elena! Saw your co-founder post for a Principal Systems Architect. I'd love to discuss equity terms.",
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
                { name: "Sequoia Capital", sector: "AI & SaaS", checks: "$1M - $10M" },
                { name: "Andreessen Horowitz", sector: "FinTech & Crypto", checks: "$500K - $15M" },
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
