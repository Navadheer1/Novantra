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
    <aside className="w-full sm:w-80 h-full bg-white/72 backdrop-blur-[18px] border-l border-white/45 shadow-[0_12px_40px_rgba(15,23,42,0.10)] flex flex-col z-30 font-sans text-slate-900">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-xs font-black text-slate-900">
            Participants ({all.length})
          </h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Invite CTA */}
      <div className="p-3 border-b border-slate-200/60 bg-blue-50/40">
        <Button
          type="button"
          onClick={handleCopyLink}
          variant="outline"
          className="w-full bg-white/90 hover:bg-white text-blue-600 font-extrabold text-xs rounded-xl h-8 flex items-center justify-center gap-2 border border-blue-200/80 shadow-2xs cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <UserPlus className="w-3.5 h-3.5" />}
          <span>{copied ? "Invite Link Copied!" : "Invite Teammates"}</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-200/60">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search participants..."
          className="w-full p-2 border border-slate-200/80 rounded-xl bg-white/90 text-xs font-medium outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      {/* Waiting Room Requests (Host Only) */}
      {isHost && waitingUsers.length > 0 && (
        <div className="p-3 bg-amber-50/60 border-b border-amber-200/60 space-y-2">
          <h4 className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
            Waiting Room ({waitingUsers.length})
          </h4>

          <div className="space-y-1.5">
            {waitingUsers.map((w) => (
              <div key={w.socketId} className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200/80 text-xs">
                <span className="font-bold text-slate-800 truncate">{w.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onAdmit(w.socketId)}
                    className="px-2 py-1 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Admit
                  </button>
                  <button
                    onClick={() => onReject(w.socketId)}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Participants List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        {all.map((p) => (
          <div
            key={p.socketId}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/60 transition-all text-xs shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] font-black flex items-center justify-center border border-blue-200 text-xs shrink-0">
                {p.name[0] || "U"}
              </div>
              <div className="truncate">
                <p className="font-bold text-slate-900 truncate">
                  {p.name} {p.socketId === localParticipant.socketId && "(You)"}
                </p>
                {p.isHost && (
                  <span className="text-[9px] font-extrabold uppercase text-[#2563EB] flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Host
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {p.audioEnabled ? (
                <span className="p-1 rounded-md bg-emerald-50 text-[#10B981] border border-emerald-200">
                  <Mic className="w-3 h-3" />
                </span>
              ) : (
                <span className="p-1 rounded-md bg-rose-50 text-[#EF4444] border border-rose-200">
                  <MicOff className="w-3 h-3" />
                </span>
              )}

              {p.videoEnabled ? (
                <span className="p-1 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                  <Video className="w-3 h-3" />
                </span>
              ) : (
                <span className="p-1 rounded-md bg-slate-100 text-slate-400 border border-slate-200">
                  <VideoOff className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </aside>
  );
}
