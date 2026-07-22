"use client";

import React, { useState } from "react";
import ParticipantTile from "./ParticipantTile";
import { ParticipantMediaState } from "@/hooks/useNoventraMeet";
import { Copy, Check, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParticipantGridProps {
  localParticipant: ParticipantMediaState;
  remoteParticipants: ParticipantMediaState[];
  pinnedSocketId: string | null;
  meetingCode?: string;
  onPin: (socketId: string | null) => void;
}

export default function ParticipantGrid({
  localParticipant,
  remoteParticipants,
  pinnedSocketId,
  meetingCode = "",
  onPin,
}: ParticipantGridProps) {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const allParticipants = [localParticipant, ...remoteParticipants];
  const pinnedParticipant = allParticipants.find((p) => p.socketId === pinnedSocketId);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/meet/${meetingCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setInviteEmail("");
    }, 2500);
  };

  // Case A: Spotlight or Screen Sharing
  if (pinnedParticipant || allParticipants.some((p) => p.isScreenSharing)) {
    const spotlight = pinnedParticipant || allParticipants.find((p) => p.isScreenSharing) || localParticipant;
    const sideGrid = allParticipants.filter((p) => p.socketId !== spotlight.socketId);

    return (
      <div className="flex-1 w-full h-full flex flex-col lg:flex-row gap-4 p-4 min-h-[500px]">
        {/* Spotlight Main Tile */}
        <div className="flex-1 w-full h-full min-h-[360px]">
          <ParticipantTile
            participant={spotlight}
            isLocal={spotlight.socketId === localParticipant.socketId}
            isPinned={true}
            onPin={() => onPin(null)}
          />
        </div>

        {/* Side Strip */}
        <div className="w-full lg:w-72 shrink-0 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[650px]">
          {sideGrid.map((p) => (
            <div key={p.socketId} className="w-48 lg:w-full aspect-video shrink-0">
              <ParticipantTile
                participant={p}
                isLocal={p.socketId === localParticipant.socketId}
                isPinned={false}
                onPin={() => onPin(p.socketId)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Case B: 1 Participant (Solo Host Waiting Room Card)
  if (allParticipants.length === 1) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Centered Video Tile */}
          <div className="lg:col-span-7 aspect-video w-full max-h-[520px] rounded-3xl overflow-hidden shadow-xs border border-slate-200/80">
            <ParticipantTile
              participant={localParticipant}
              isLocal={true}
              isPinned={false}
            />
          </div>

          {/* Clean White Noventra Invitation & Waiting Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5 text-slate-900">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Waiting for Participants
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-900">You are the only one in this room</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Share this room link or invite teammates directly to start collaborating in real-time.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5">
              <Button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-11 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Invite Link Copied!" : "Copy Invite Link"}</span>
              </Button>

              <form onSubmit={handleSendEmailInvite} className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@startup.com"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl px-4 shrink-0 cursor-pointer"
                >
                  {emailSent ? "Sent!" : "Invite"}
                </Button>
              </form>
            </div>

            {/* Recent Collaborators Quick List */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Recent Collaborators
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {["Alex Rivera (Lead VC)", "Elena Rostova (Co-Founder)", "Marcus Chen (Eng Lead)"].map((name, i) => (
                  <button
                    key={i}
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[11px] text-slate-700 hover:text-blue-700 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3 text-blue-600" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Case C: 2 Participants (50/50 Side-by-Side Split)
  if (allParticipants.length === 2) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full min-h-[480px]">
          {allParticipants.map((p) => (
            <div key={p.socketId} className="w-full h-full min-h-[300px]">
              <ParticipantTile
                participant={p}
                isLocal={p.socketId === localParticipant.socketId}
                isPinned={false}
                onPin={() => onPin(p.socketId)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Case D: 3 to 6 Participants (Responsive Equal Grid)
  if (allParticipants.length <= 6) {
    const cols = allParticipants.length <= 4 ? "grid-cols-1 sm:grid-cols-2 max-w-6xl" : "grid-cols-2 lg:grid-cols-3 max-w-[1400px]";
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center p-4">
        <div className={`grid ${cols} gap-4 w-full h-full min-h-[500px] mx-auto`}>
          {allParticipants.map((p) => (
            <div key={p.socketId} className="w-full h-full min-h-[220px]">
              <ParticipantTile
                participant={p}
                isLocal={p.socketId === localParticipant.socketId}
                isPinned={false}
                onPin={() => onPin(p.socketId)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Case E: 7+ Participants (Compact Grid)
  return (
    <div className="flex-1 w-full h-full flex items-center justify-center p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full h-full max-w-[1600px] mx-auto">
        {allParticipants.map((p) => (
          <div key={p.socketId} className="w-full aspect-video">
            <ParticipantTile
              participant={p}
              isLocal={p.socketId === localParticipant.socketId}
              isPinned={false}
              onPin={() => onPin(p.socketId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
