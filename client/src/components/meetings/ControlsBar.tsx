"use client";

import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Users } from "lucide-react";

interface ControlsBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  participantCount: number;
  waitingCount: number;
  isHost: boolean;
  sidebarOpen: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  toggleSidebar: () => void;
  onLeave: () => void;
}

export default function ControlsBar({
  audioEnabled,
  videoEnabled,
  isScreenSharing,
  participantCount,
  waitingCount,
  isHost,
  sidebarOpen,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  toggleSidebar,
  onLeave
}: ControlsBarProps) {
  return (
    <div className="h-20 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between px-6 md:px-12 backdrop-blur-md relative z-10">
      
      {/* Left side: Participant status or meeting info */}
      <div className="hidden md:flex items-center gap-2 text-zinc-400 text-sm">
        <span className="font-semibold text-white">Noventra Meet</span>
        <span className="text-zinc-600">|</span>
        <span>Active participants: {participantCount}</span>
      </div>

      {/* Middle: Media Controls */}
      <div className="flex items-center gap-4 mx-auto md:mx-0">
        {/* Toggle Audio */}
        <button
          onClick={toggleAudio}
          className={`p-3.5 rounded-full transition-all ${
            audioEnabled
              ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
          title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
        >
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Toggle Video */}
        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-full transition-all ${
            videoEnabled
              ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
          title={videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
        >
          {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`p-3.5 rounded-full transition-all ${
            isScreenSharing
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          }`}
          title={isScreenSharing ? "Stop Sharing Screen" : "Share Your Screen"}
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        {/* End Meeting */}
        <button
          onClick={onLeave}
          className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-105"
          title="Leave Meeting"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Sidebar Toggle & Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={`relative p-3 rounded-xl transition-all ${
            sidebarOpen
              ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
              : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800"
          }`}
          title="Show Participant List"
        >
          <Users className="w-5 h-5" />
          {/* Badge count */}
          {participantCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {participantCount}
            </span>
          )}
          {/* Waiting notification dot for Host */}
          {isHost && waitingCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          )}
        </button>
      </div>
    </div>
  );
}
