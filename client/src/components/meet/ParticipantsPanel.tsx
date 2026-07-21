"use client";

import React, { useState } from "react";
import { X, Users, Mic, MicOff, Video, VideoOff, ShieldCheck, Copy, Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticipantMediaState } from "@/hooks/useNoventraMeet";

interface ParticipantsPanelProps {
  meetingCode: string;
  localParticipant: ParticipantMediaState;
  remoteParticipants: ParticipantMediaState[];
  waitingUsers: any[];
  isHost: boolean;
  onAdmit: (socketId: string) => void;
  onReject: (socketId: string) => void;
  onClose: () => void;
}

export default function ParticipantsPanel({
  meetingCode,
  localParticipant,
  remoteParticipants,
  waitingUsers,
  isHost,
  onAdmit,
  onReject,
  onClose,
}: ParticipantsPanelProps) {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");

  const all = [localParticipant, ...remoteParticipants].filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyLink = () => {
    const link = `${window.location.origin}/meet/${meetingCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-full sm:w-80 h-full bg-white border-l border-slate-200 shadow-xl flex flex-col z-30">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black text-slate-900">
            Participants ({all.length})
          </h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Invite CTA */}
      <div className="p-3 border-b border-slate-100 bg-blue-50/50">
        <Button
          type="button"
          onClick={handleCopyLink}
          variant="outline"
          className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl h-9 flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <UserPlus className="w-4 h-4" />}
          <span>{copied ? "Meeting Link Copied!" : "Invite Participants"}</span>
        </Button>
      </div>

      {/* Waiting Room Section (Host view) */}
      {isHost && waitingUsers.length > 0 && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 space-y-2">
          <h4 className="text-[11px] font-extrabold uppercase text-amber-900 tracking-wider">
            Waiting Room ({waitingUsers.length})
          </h4>
          <div className="space-y-1.5">
            {waitingUsers.map((w) => (
              <div key={w.socketId} className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-800 truncate">{w.name}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onAdmit(w.socketId)}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black"
                  >
                    Admit
                  </button>
                  <button
                    onClick={() => onReject(w.socketId)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="p-3 border-b border-slate-100">
        <input
          type="text"
          placeholder="Search participants..."
          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* In-Call Participant List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        {all.map((p) => (
          <div
            key={p.socketId}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-100">
                {p.name[0]}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {p.name} {p.socketId === localParticipant.socketId && "(You)"}
                  </span>
                  {p.isHost && (
                    <span title="Host">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{p.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400 shrink-0">
              {p.audioEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-500" /> : <MicOff className="w-3.5 h-3.5 text-rose-500" />}
              {p.videoEnabled ? <Video className="w-3.5 h-3.5 text-emerald-500" /> : <VideoOff className="w-3.5 h-3.5 text-rose-500" />}
            </div>
          </div>
        ))}
      </div>

    </aside>
  );
}
