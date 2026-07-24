"use client";

import React, { useState } from "react";
import PitchStatusBadge from "./PitchStatusBadge";
import { Sparkles, DollarSign, Building, ChevronRight, User, Eye, CheckCircle2 } from "lucide-react";

interface PitchKanbanBoardProps {
  pitches: any[];
  onSelectPitch: (pitch: any) => void;
  onStatusChange: (pitchId: string, newStatus: string) => void;
}

const COLUMNS = [
  { id: "SUBMITTED", title: "New Pitches", color: "border-blue-500/40 bg-blue-500/5 text-blue-600" },
  { id: "VIEWED", title: "Viewed", color: "border-indigo-500/40 bg-indigo-500/5 text-indigo-600" },
  { id: "INTERESTED", title: "Interested", color: "border-amber-500/40 bg-amber-500/5 text-amber-600" },
  { id: "MEETING_REQUESTED", title: "Meeting Scheduled", color: "border-purple-500/40 bg-purple-500/5 text-purple-600" },
  { id: "DUE_DILIGENCE", title: "Due Diligence", color: "border-cyan-500/40 bg-cyan-500/5 text-cyan-600" },
  { id: "PARTNER_REVIEW", title: "Partner Review", color: "border-teal-500/40 bg-teal-500/5 text-teal-600" },
  { id: "TERM_SHEET", title: "Term Sheet", color: "border-orange-500/40 bg-orange-500/5 text-orange-600" },
  { id: "INVESTED", title: "Invested ✓", color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-600" }
];

export default function PitchKanbanBoard({ pitches, onSelectPitch, onStatusChange }: PitchKanbanBoardProps) {
  const [draggedPitchId, setDraggedPitchId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedPitchId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedPitchId;
    if (id) {
      onStatusChange(id, statusId);
      setDraggedPitchId(null);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
      {COLUMNS.map((col) => {
        const columnPitches = pitches.filter((p) => {
          const status = (p.status || "SUBMITTED").toUpperCase();
          return status === col.id;
        });

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="w-72 shrink-0 bg-card border border-border/80 rounded-2xl p-3 flex flex-col min-h-[500px] shadow-xs"
          >
            {/* COLUMN HEADER */}
            <div className={`p-3 rounded-xl border mb-3 flex items-center justify-between font-black text-xs ${col.color}`}>
              <span>{col.title}</span>
              <span className="w-5 h-5 rounded-full bg-background flex items-center justify-center font-bold text-[10px]">
                {columnPitches.length}
              </span>
            </div>

            {/* DEAL CARDS LIST */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnPitches.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-border/60 rounded-xl flex items-center justify-center text-[10px] font-bold text-muted-foreground italic">
                  Drag deals here
                </div>
              ) : (
                columnPitches.map((pitch) => {
                  const startup = pitch.startup || { name: "Nova AI Labs", industry: "AI SaaS", stage: "Seed" };
                  const founder = pitch.founder || { name: "Sarah Vance" };
                  const aiMatch = pitch.aiSnapshot?.matchScore || 94;

                  return (
                    <div
                      key={pitch.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, pitch.id)}
                      onClick={() => onSelectPitch(pitch)}
                      className="bg-background border border-border rounded-xl p-4 shadow-xs hover:shadow-md hover:border-primary/50 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 border border-primary/20">
                            {startup.name ? startup.name.slice(0, 2).toUpperCase() : "ST"}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                              {startup.name}
                            </h4>
                            <p className="text-[10px] font-semibold text-muted-foreground">{founder.name}</p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[9px] px-2 py-0.5 rounded-md border border-blue-500/20">
                          <Sparkles className="w-2.5 h-2.5" /> {aiMatch}%
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                        "{pitch.elevatorPitch || "Autonomous Agentic AI infrastructure platform."}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] font-bold">
                        <span className="text-foreground">
                          Target: <strong>${Number(pitch.amountRaising || 500000).toLocaleString()}</strong>
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3 text-primary" /> Details →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
