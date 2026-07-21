"use client";

import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, Pin, Hand, ShieldCheck } from "lucide-react";
import { ParticipantMediaState } from "@/hooks/useNoventraMeet";

interface ParticipantTileProps {
  participant: ParticipantMediaState;
  isLocal?: boolean;
  isPinned?: boolean;
  onPin?: () => void;
}

export default function ParticipantTile({
  participant,
  isLocal = false,
  isPinned = false,
  onPin,
}: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <div
      className={`relative w-full h-full rounded-2xl bg-slate-900 overflow-hidden shadow-md border transition-all duration-200 group ${
        participant.isSpeaking
          ? "border-emerald-500 ring-4 ring-emerald-500/20"
          : "border-slate-800"
      }`}
    >
      {/* Video element */}
      {participant.videoEnabled && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? "-scale-x-100" : ""}`}
        />
      ) : (
        /* Avatar Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-3xl text-blue-400 shadow-lg">
            {participant.name?.[0] || "U"}
          </div>
          <p className="text-xs font-bold text-slate-400 mt-2">Camera Off</p>
        </div>
      )}

      {/* Floating Badges & Controls */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        {participant.isHost && (
          <span className="text-[10px] font-black uppercase tracking-wider text-white bg-blue-600 px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Host
          </span>
        )}
        {participant.isHandRaised && (
          <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-400 px-2 py-0.5 rounded-md shadow-xs animate-bounce flex items-center gap-1">
            <Hand className="w-3 h-3" /> Raised Hand
          </span>
        )}
      </div>

      {/* Pin Spotlight Button */}
      {onPin && (
        <button
          type="button"
          onClick={onPin}
          className={`absolute top-3 right-3 p-1.5 rounded-lg text-xs font-bold transition-all z-10 opacity-0 group-hover:opacity-100 ${
            isPinned ? "bg-blue-600 text-white opacity-100" : "bg-black/40 text-white hover:bg-black/60"
          }`}
          title={isPinned ? "Unpin Spotlight" : "Pin Spotlight"}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Nameplate & Mic status */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white z-10">
        <span className="text-xs font-bold truncate">
          {participant.name} {isLocal && "(You)"}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {!participant.audioEnabled ? (
            <span className="p-1 rounded-md bg-rose-500/80 text-white" title="Muted">
              <MicOff className="w-3 h-3" />
            </span>
          ) : (
            <span className="p-1 rounded-md bg-emerald-500/80 text-white" title="Mic On">
              <Mic className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
