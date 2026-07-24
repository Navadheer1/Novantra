"use client";

import React, { useState } from "react";
import StudioLayout from "@/components/studio/StudioLayout";
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Users,
  Eye,
  Clock,
  Briefcase,
  CheckCircle2,
  Send,
  Zap,
  Lightbulb,
} from "lucide-react";

export default function StudioAnalyticsPage() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiHistory, setAiHistory] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    {
      role: "ai",
      text: "Hello Founder! I am your AI Founder Growth Assistant. Ask me to optimize your video titles, generate high-converting startup pitch summaries, suggest SEO tags, or analyze VC retention patterns.",
    },
  ]);

  const handleSendAiPrompt = () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt.trim();
    setAiHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiPrompt("");

    setTimeout(() => {
      let reply = "✨ AI Founder Insight: Optimized content strategy to maximize investor click-through rates!";
      if (userMsg.toLowerCase().includes("title")) {
        reply = "✨ Suggested Title: 'How We Built Real-Time Edge Synchronization for Healthcare AI (Live Demo)'";
      } else if (userMsg.toLowerCase().includes("description") || userMsg.toLowerCase().includes("pitch")) {
        reply = "✨ VC Pitch Summary: 'Noventra solves multi-region state synchronization with sub-10ms latency. High gross margin SaaS architecture built for scale.'";
      } else if (userMsg.toLowerCase().includes("tag") || userMsg.toLowerCase().includes("seo")) {
        reply = "✨ SEO Tags: #HealthcareAI #RealtimeSync #SaaS #PreSeed #YCombinator #StartupDemo";
      }
      setAiHistory((prev) => [...prev, { role: "ai", text: reply }]);
    }, 550);
  };

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Analytics & AI Growth Engine</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track channel performance benchmarks, audience velocity, and leverage Founder Growth AI.
          </p>
        </div>

        {/* AI FOUNDER GROWTH ASSISTANT CONTAINER */}
        <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-md space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Founder Growth AI</h3>
              <p className="text-xs text-slate-400 font-medium">AI positioning, title optimization, & investor pitch recommendations</p>
            </div>
          </div>

          {/* Quick AI Presets */}
          <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
            {[
              "✨ Generate Better Title",
              "✨ Improve Description",
              "✨ SEO Tags & Keywords",
              "✨ VC Pitch Summary",
              "✨ Video Improvement Suggestions",
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiPrompt(preset.replace("✨ ", ""));
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 transition"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Chat History Box */}
          <div className="max-h-56 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            {aiHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-12 font-bold shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-800 font-medium"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Prompt Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI: 'Suggest titles', 'Optimize VC pitch'..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendAiPrompt()}
              className="flex-1 p-3 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={handleSendAiPrompt}
              className="px-5 py-3 bg-blue-600 text-white rounded-2xl font-extrabold text-xs hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Ask AI
            </button>
          </div>
        </div>

        {/* GROWTH CHARTS & PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" /> Channel Growth Velocity
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">30-day view count & watch duration trend</p>
            </div>

            <div className="space-y-3 font-semibold text-xs">
              {[
                { month: "Week 1", views: "240,000 views", pct: 60 },
                { month: "Week 2", views: "380,000 views", pct: 75 },
                { month: "Week 3", views: "490,000 views", pct: 88 },
                { month: "Week 4", views: "620,000 views", pct: 100 },
              ].map((w, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-700">{w.month}</span>
                    <span className="font-bold text-blue-600">{w.views}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${w.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Investor Interest Pipeline
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">VC profile views & meeting requests</p>
            </div>

            <div className="space-y-3 font-semibold text-xs">
              {[
                { label: "Pre-Seed & Seed VCs", count: "142 VC views", pct: 85 },
                { label: "Series A Partners", count: "84 VC views", pct: 55 },
                { label: "Angel Investors", count: "124 views", pct: 70 },
              ].map((v, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-700">{v.label}</span>
                    <span className="font-bold text-indigo-600">{v.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${v.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </StudioLayout>
  );
}
