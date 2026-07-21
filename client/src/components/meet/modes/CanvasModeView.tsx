"use client";

import React, { useState } from "react";
import { Layers, Plus, Save, Sparkles, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CanvasModeView() {
  const [problemNotes, setProblemNotes] = useState<string[]>([
    "Founders waste 20+ hours on disconnected tools.",
    "Investors lack real-time visibility into startup milestones."
  ]);
  const [solutionNotes, setSolutionNotes] = useState<string[]>([
    "Unified Noventra workspace with WebRTC, pitch rooms, and due diligence."
  ]);
  const [newProblem, setNewProblem] = useState("");
  const [newSolution, setNewSolution] = useState("");

  return (
    <div className="flex-1 w-full h-full p-4 flex flex-col bg-slate-950 text-white rounded-2xl overflow-y-auto space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="font-extrabold text-sm text-white">Collaborative Lean Canvas</h3>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded border border-purple-800">
          Realtime Shared Whiteboard
        </span>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Problem Column */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-extrabold text-xs text-rose-400 uppercase tracking-wider">1. Problem</h4>
          <div className="space-y-2">
            {problemNotes.map((p, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                {p}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newProblem.trim()) {
                setProblemNotes([...problemNotes, newProblem.trim()]);
                setNewProblem("");
              }
            }}
            className="flex gap-1.5"
          >
            <input
              type="text"
              placeholder="Add problem point..."
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              value={newProblem}
              onChange={(e) => setNewProblem(e.target.value)}
            />
            <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700 text-xs font-bold px-2.5">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

        {/* Solution Column */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider">2. Solution</h4>
          <div className="space-y-2">
            {solutionNotes.map((s, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                {s}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newSolution.trim()) {
                setSolutionNotes([...solutionNotes, newSolution.trim()]);
                setNewSolution("");
              }
            }}
            className="flex gap-1.5"
          >
            <input
              type="text"
              placeholder="Add solution point..."
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
            />
            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold px-2.5">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

        {/* Unique Value Prop */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider">3. Unique Value Proposition</h4>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 leading-relaxed font-semibold">
            All-in-one ecosystem workspace uniting WebRTC video rooms, due diligence data rooms, and technical code collaboration.
          </div>
        </div>

      </div>

    </div>
  );
}
