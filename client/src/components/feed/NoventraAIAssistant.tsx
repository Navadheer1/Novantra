"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, ArrowRight, UserPlus, Send, RefreshCw, CheckCircle } from "lucide-react";

export default function NoventraAIAssistant() {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const prompts = [
    { id: "p1", label: "Suggest Investors", action: "Finding active seed VCs in AI & DevTools..." },
    { id: "p2", label: "Recommend Co-Founders", action: "Scanning technical builders looking for founders..." },
    { id: "p3", label: "Optimize Pitch", action: "Reviewing your deck structure and value prop..." },
    { id: "p4", label: "Find Bounties", action: "Listing active hackathons with cash bounties..." },
  ];

  const handlePromptClick = (prompt: typeof prompts[0]) => {
    setActivePrompt(prompt.id);
    setLoading(true);
    setResponseMsg(null);

    setTimeout(() => {
      setLoading(false);
      if (prompt.id === "p1") {
        setResponseMsg("Matched 3 VCs: Sarah Chen (Angel, $50k check), Apex Ventures (Seed), Quantum Capital. Pitch link ready!");
      } else if (prompt.id === "p2") {
        setResponseMsg("Matched Rohan Varma (Stanford CS, C++ backend specialist) & Elena Rostova (MIT LLMs).");
      } else if (prompt.id === "p3") {
        setResponseMsg("Pitch analysis: Market size slide needs TAM vs SOM breakdown. Executive summary clarity score: 92%.");
      } else {
        setResponseMsg("2 Bounties active: Noventra AI Hackathon ($50k) & Solana Builder Grants ($20k).");
      }
    }, 800);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white border border-blue-200/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <span>Noventra AI Co-Pilot</span>
              <span className="text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.2 rounded-md">
                v2.0
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Smart ecosystem suggestions for your startup</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
      </div>

      {/* Suggested Connection Card */}
      <div className="p-3 rounded-xl bg-white border border-blue-200/60 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Match of the Day
          </span>
          <span className="text-[10px] text-slate-400 font-bold">98% Fit</span>
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-slate-900">Sarah Chen • Angel Investor</h4>
          <p className="text-[11px] text-slate-500 font-medium">Ex-Stripe • Invests $25k-$100k in AI Infrastructure & SaaS.</p>
        </div>
        <button className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm">
          <UserPlus className="w-3.5 h-3.5" /> Connect & Pitch
        </button>
      </div>

      {/* Interactive Quick Prompts */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ask AI Co-Pilot:</div>
        <div className="grid grid-cols-2 gap-2">
          {prompts.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePromptClick(p)}
              className={`p-2 rounded-xl text-left border text-xs font-bold transition-all ${
                activePrompt === p.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-blue-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Response Box */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-xl bg-white border border-blue-100 flex items-center gap-2 text-xs text-blue-600 font-bold"
          >
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Analyzing startup graph...</span>
          </motion.div>
        ) : responseMsg ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-white border border-emerald-200 text-xs text-slate-700 font-medium leading-relaxed space-y-1.5"
          >
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <CheckCircle className="w-4 h-4" /> AI Recommendation Result:
            </div>
            <p>{responseMsg}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
