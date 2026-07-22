"use client";

import React, { useState } from "react";
import { Video, Users, Wifi, Circle, Share2, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingHeaderProps {
  title: string;
  meetingCode: string;
  participantCount: number;
  isRecording?: boolean;
  onOpenSettings?: () => void;
}

export default function MeetingHeader({
  title,
  meetingCode,
  participantCount,
  isRecording = false,
  onOpenSettings,
}: MeetingHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const link = `${window.location.origin}/meet/${meetingCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-2xs text-slate-900">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Meeting Title & Code */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4 text-blue-600" />
          </div>

          <div className="truncate flex items-center gap-2.5">
            <h1 className="text-sm font-black text-slate-900 truncate tracking-tight">
              {title || `Meeting ${meetingCode}`}
            </h1>
            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {meetingCode}
            </span>
          </div>
        </div>

        {/* Center/Right Actions: Participant Count, Recording Status, Connection Quality, Share, Settings */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Recording Badge (only if recording) */}
          {isRecording && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold animate-pulse">
              <Circle className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
              <span>REC</span>
            </div>
          )}

          {/* Participant Count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{participantCount} in Call</span>
          </div>

          {/* Connection Quality */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span>HD</span>
          </div>

          {/* Share Link Button */}
          <Button
            type="button"
            onClick={handleShare}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-8 px-3 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? "Copied" : "Share"}</span>
          </Button>

          {/* Settings Button */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 cursor-pointer"
              title="Meeting Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
