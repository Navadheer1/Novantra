"use client";

import React, { useState } from "react";
import { Briefcase, FileText, TrendingUp, DollarSign, HelpCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PitchModeView() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 10;
  const [investorQuestions, setInvestorQuestions] = useState<string[]>([
    "What is your customer acquisition cost (CAC) payback period?",
    "How does your AI engine handle multi-tenant data privacy?",
  ]);
  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setInvestorQuestions([...investorQuestions, newQuestion.trim()]);
    setNewQuestion("");
  };

  return (
    <div className="flex-1 w-full h-full p-4 flex flex-col lg:flex-row gap-4 max-h-[calc(100vh-140px)] overflow-hidden">
      
      {/* Pitch Deck Main Viewer */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between text-white relative">
        
        {/* Top Pitch Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px] uppercase">
              Live Pitch
            </span>
            <h3 className="font-bold text-sm text-slate-200">Noventra Seed Investor Deck</h3>
          </div>

          <span className="text-xs font-mono font-bold text-slate-400">
            Slide {currentSlide} of {totalSlides}
          </span>
        </div>

        {/* Slide Canvas Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center my-6 text-center space-y-4 p-8 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-2xl">
            S{currentSlide}
          </div>
          
          <h2 className="text-2xl font-black tracking-tight text-white max-w-lg">
            {currentSlide === 1 && "Noventra: The Startup Ecosystem Platform"}
            {currentSlide === 2 && "The Problem: Fragmented Tools for Founders & Investors"}
            {currentSlide === 3 && "The Solution: Unified Real-Time Collaboration"}
            {currentSlide === 4 && "Market Opportunity: $45B Global Startup Software"}
            {currentSlide >= 5 && `Executive Pitch Overview Section ${currentSlide}`}
          </h2>

          <p className="text-xs text-slate-400 max-w-md">
            Connecting founders, angels, VCs, mentors, and engineers in one real-time environment.
          </p>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <Button
            type="button"
            size="sm"
            disabled={currentSlide <= 1}
            onClick={() => setCurrentSlide(currentSlide - 1)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={currentSlide >= totalSlides}
            onClick={() => setCurrentSlide(currentSlide + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Next Slide <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

      </div>

      {/* Investor Metrics & Q&A Panel */}
      <div className="w-full lg:w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 text-white overflow-y-auto">
        
        {/* Traction Metrics Quick Card */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Startup Metrics
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold">ARR / MRR</span>
              <p className="font-extrabold text-emerald-400 text-sm">$42,000</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold">MoM Growth</span>
              <p className="font-extrabold text-blue-400 text-sm">+28.5%</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold">Ask Target</span>
              <p className="font-extrabold text-amber-400 text-sm">$1.5M Seed</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold">Commitments</span>
              <p className="font-extrabold text-purple-400 text-sm">65% Filled</p>
            </div>
          </div>
        </div>

        {/* Live Investor Questions */}
        <div className="space-y-2 flex-1 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-400" /> Investor Q&A Panel
          </h4>

          <form onSubmit={handleAddQuestion} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Ask a question..."
              className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-blue-500"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl px-3">
              Ask
            </Button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {investorQuestions.map((q, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <p className="text-slate-200 font-medium">{q}</p>
                <span className="text-[9px] text-slate-500 font-bold">Investor Question #{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
