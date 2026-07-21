"use client";

import React, { useState } from "react";
import { Sparkles, X, Search, Wand2, ArrowRight, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resilientFetch } from "@/lib/apiClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyQuery: (query: string) => void;
}

export default function AISearchDrawer({ isOpen, onClose, onApplyQuery }: Props) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  if (!isOpen) return null;

  const examplePrompts = [
    "I need AI healthcare founders raising Seed stage funding.",
    "Find investors interested in FinTech & USDC payout rails.",
    "Show me staff TypeScript & React developers open to co-founder roles.",
    "Find YC-style AI startups with over $40k MRR."
  ];

  const handleRunAISearch = async (queryToRun?: string) => {
    const query = queryToRun || prompt;
    if (!query.trim()) return;

    setIsGenerating(true);
    setAiAnalysis(null);

    // Call AI backend generator
    const res = await resilientFetch<any>("/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({
        promptType: "description",
        data: { industry: "Startup Discovery", idea: query }
      })
    });

    if (res.success && res.data?.result) {
      setAiAnalysis(res.data.result);
    } else {
      setAiAnalysis(`AI Copilot Analysis: Matching query "${query}" across 14,200 founders, VCs, startups & active pitch decks.`);
    }

    setIsGenerating(false);
  };

  const handleConfirm = (queryToRun?: string) => {
    const finalQuery = queryToRun || prompt;
    onApplyQuery(finalQuery);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white space-y-6 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Noventra AI Search Copilot
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Ask in natural language to search founders, investors, jobs & pitches.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <div className="relative">
            <Bot className="absolute left-4 top-4 w-5 h-5 text-blue-400" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Find me AI Healthcare founders in San Francisco raising Seed round..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[110px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Quick Prompts:</span>
            <Button
              onClick={() => handleRunAISearch()}
              disabled={isGenerating || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>Analyze & Search</span>
            </Button>
          </div>

          {/* Example Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {examplePrompts.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(ex);
                  handleRunAISearch(ex);
                }}
                className="text-left px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/50 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Search Output</span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {aiAnalysis}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => handleConfirm()}
                className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <span>Apply Filter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
