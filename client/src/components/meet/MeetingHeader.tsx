"use client";

import React, { useState, useEffect } from "react";
import { Video, Users, Clock, ShieldCheck, Wifi, Circle } from "lucide-react";

interface MeetingHeaderProps {
  title: string;
  meetingCode: string;
  participantCount: number;
}

export default function MeetingHeader({ title, meetingCode, participantCount }: MeetingHeaderProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 shadow-2xs">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* Title & Code */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0 border border-blue-100">
            <Video className="w-5 h-5 text-blue-600" />
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-900 truncate tracking-tight">
                {title || `Meeting ${meetingCode}`}
              </h1>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {meetingCode}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Encrypted P2P Media Stream</span>
            </p>
          </div>
        </div>

        {/* Center: Live Timer & Recording Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold animate-pulse">
            <Circle className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
            <span>REC</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>

        {/* Right Status Badges */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{participantCount} In Call</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hidden sm:flex">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span>HD 60fps</span>
          </div>
        </div>

      </div>
    </header>
  );
}
