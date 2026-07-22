"use client";

import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Pin, Hand, ShieldCheck, User } from "lucide-react";
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
      className={`relative w-full h-full rounded-2xl bg-white overflow-hidden shadow-xs border transition-all duration-200 group flex flex-col justify-between ${
        participant.isSpeaking
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-slate-200/80"
      }`}
    >
      {/* Video stream or Light Theme Avatar Fallback */}
      {participant.videoEnabled && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? "-scale-x-100" : ""}`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/80 border border-slate-100 p-6 space-y-2.5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center font-black text-2xl text-blue-600 shadow-xs">
            {participant.name?.[0] || "U"}
          </div>
          <div className="text-center space-y-0.5">
            <h4 className="text-xs font-black text-slate-800">
              {participant.name} {isLocal && "(You)"}
            </h4>
            <p className="text-[11px] font-semibold text-slate-400">Camera Off</p>
          </div>
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        {participant.isHost && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-600" /> Host
          </span>
        )}
        {participant.isHandRaised && (
          <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shadow-xs animate-bounce flex items-center gap-1">
            <Hand className="w-3 h-3 text-amber-600" /> Hand Raised
          </span>
        )}
      </div>

      {/* Pin Spotlight Button */}
      {onPin && (
        <button
          type="button"
          onClick={onPin}
          className={`absolute top-3 right-3 p-1.5 rounded-lg text-xs font-bold transition-all z-10 border shadow-xs ${
            isPinned
              ? "bg-blue-600 text-white border-blue-600 opacity-100"
              : "bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50 opacity-0 group-hover:opacity-100"
          }`}
          title={isPinned ? "Unpin Spotlight" : "Pin Spotlight"}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Clean Light Theme Nameplate Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-white/95 border border-slate-200/80 text-slate-900 shadow-xs z-10">
        <span className="text-xs font-bold truncate">
          {participant.name} {isLocal && "(You)"}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {!participant.audioEnabled ? (
            <span className="p-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200" title="Muted">
              <MicOff className="w-3 h-3" />
            </span>
          ) : (
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200" title="Mic On">
              <Mic className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
