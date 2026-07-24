"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, UserPlus, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";

export default function NoventraAIAssistant() {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const quickActions = [
    { id: "p1", label: "Suggest Investors", desc: "Seed VCs in AI & DevTools" },
    { id: "p2", label: "Find Cofounders", desc: "Technical builders looking for partners" },
    { id: "p3", label: "Optimize Pitch", desc: "Review deck structure & TAM/SOM" },
  ];

  const handleActionClick = (actionId: string) => {
    setActivePrompt(actionId);
    setLoading(true);
    setResponseMsg(null);

    setTimeout(() => {
      setLoading(false);
      if (actionId === "p1") {
        setResponseMsg("Matched 3 VCs: Sarah Chen ($50k angel check), Apex Ventures, Quantum Capital.");
      } else if (actionId === "p2") {
        setResponseMsg("Matched Rohan Varma (Stanford C++ backend) & Elena Rostova (MIT LLMs).");
      } else if (actionId === "p3") {
        setResponseMsg("Pitch feedback: Executive summary score 92%. Add competitor positioning table.");
      }
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4"
    >
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span>AI Copilot</span>
              <span className="text-[9px] font-extrabold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                v2.0
              </span>
            </h3>
          </div>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
      </div>

      {/* 2. Today's Best Match (Single Surface, Clean Line) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Today's Best Match</span>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full">
            98% Match
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div>
            <h4 className="font-bold text-xs text-slate-900">Sarah Chen</h4>
            <p className="text-[11px] text-slate-500 font-medium">Angel Investor • AI & DevTools</p>
          </div>

          <button
            onClick={() => setConnected(true)}
            disabled={connected}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              connected
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            }`}
          >
            {connected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Connected
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" /> Connect
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</div>
        <div className="space-y-1">
          {quickActions.map((qa) => (
            <button
              key={qa.id}
              onClick={() => handleActionClick(qa.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors group ${
                activePrompt === qa.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400 group-hover:text-blue-600 transition-colors">•</span>
                <span>{qa.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. AI Output Response Box */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2.5 rounded-xl bg-slate-50 text-xs text-blue-600 font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing graph...</span>
          </motion.div>
        ) : responseMsg ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 font-medium leading-relaxed"
          >
            <p>{responseMsg}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

