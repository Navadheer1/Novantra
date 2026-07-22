"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Users, FileText, RotateCcw, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingEndSummaryModalProps {
  meetingCode: string;
  title: string;
  durationSeconds: number;
  participants: Array<{ name: string; role?: string }>;
  onRejoin: () => void;
  onBackToHub: () => void;
}

export default function MeetingEndSummaryModal({
  meetingCode,
  title,
  durationSeconds,
  participants,
  onRejoin,
  onBackToHub,
}: MeetingEndSummaryModalProps) {
  const [copied, setCopied] = useState(false);

  const formatDuration = (secs: number) => {
    const mins = Math.max(1, Math.floor(secs / 60));
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `${hours}h ${mins % 60}m`;
    }
    return `${mins} min${mins > 1 ? "s" : ""}`;
  };

  const handleCopySummary = () => {
    const summaryText = `Meeting Summary: ${title} (${meetingCode})\nDuration: ${formatDuration(durationSeconds)}\nParticipants: ${participants.map(p => p.name).join(", ")}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900">
        
        {/* Banner */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                Finished
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{meetingCode}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1 tracking-tight">{title}</h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Duration
            </span>
            <p className="text-base font-black text-slate-900">{formatDuration(durationSeconds)}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-600" /> Participants
            </span>
            <p className="text-base font-black text-slate-900">{Math.max(1, participants.length)} Connected</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> AI Minutes
            </span>
            <p className="text-xs font-bold text-slate-700">Generated & Saved</p>
          </div>
        </div>

        {/* Attendees List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Meeting Attendees</h4>
          <div className="flex flex-wrap gap-2">
            {participants.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Host solo session</span>
            ) : (
              participants.map((p, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-extrabold">
                    {p.name[0] || "U"}
                  </div>
                  <span>{p.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notes & Action Items Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Session Recap & Next Steps</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Meeting transcript and notes have been archived to your Noventra Communications History.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            onClick={handleCopySummary}
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Recap Copied" : "Copy Recap"}</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onRejoin}
              variant="outline"
              className="border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Rejoin Meeting</span>
            </Button>

            <Button
              type="button"
              onClick={onBackToHub}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-10 px-5 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Hub</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
