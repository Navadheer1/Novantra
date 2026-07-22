"use client";

import React, { useState } from "react";
import { 
  Mic, MicOff, Video, VideoOff, Monitor, Sparkles, 
  MessageSquare, Users, Hand, Smile, Settings, PhoneOff,
  Layers, Code2, ShieldCheck, FileText, Briefcase
} from "lucide-react";
import { WorkspaceMode } from "./ContextualRightPanel";

interface MeetingToolbarProps {
  micOn: boolean;
  camOn: boolean;
  screenSharing: boolean;
  blurOn: boolean;
  handRaised: boolean;
  unreadChatCount: number;
  participantCount: number;
  chatOpen: boolean;
  participantsOpen: boolean;
  activeWorkspace: WorkspaceMode;
  onSelectWorkspace: (mode: WorkspaceMode) => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
  onToggleBlur: () => void;
  onToggleHand: () => void;
  onSendEmoji: (emoji: string) => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onOpenSettings: () => void;
  onLeave: () => void;
}

export default function MeetingToolbar({
  micOn,
  camOn,
  screenSharing,
  blurOn,
  handRaised,
  unreadChatCount,
  participantCount,
  chatOpen,
  participantsOpen,
  activeWorkspace,
  onSelectWorkspace,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
  onToggleBlur,
  onToggleHand,
  onSendEmoji,
  onToggleChat,
  onToggleParticipants,
  onOpenSettings,
  onLeave,
}: MeetingToolbarProps) {
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const emojis = ["❤️", "👏", "🔥", "🎉", "👍", "💡", "🚀"];

  const workspaces: Array<{ mode: WorkspaceMode; label: string; icon: any }> = [
    { mode: "VIDEO", label: "Video", icon: Video },
    { mode: "PITCH", label: "Pitch", icon: Briefcase },
    { mode: "CANVAS", label: "Canvas", icon: Layers },
    { mode: "CODE", label: "Code Review", icon: Code2 },
    { mode: "DILIGENCE", label: "Due Diligence", icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
      
      {/* Premium Glassmorphism macOS Floating Dock Container */}
      <div className="flex items-center gap-2 sm:gap-3 bg-white/72 backdrop-blur-[18px] border border-white/45 p-2 sm:p-2.5 rounded-[20px] shadow-[0_12px_40px_rgba(15,23,42,0.10)] text-slate-800">
        
        {/* GROUP 1: MEDIA CONTROLS */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleMic}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-105 cursor-pointer ${
              micOn
                ? "bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs"
                : "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm"
            }`}
            title={micOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleCam}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-105 cursor-pointer ${
              camOn
                ? "bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs"
                : "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm"
            }`}
            title={camOn ? "Turn Off Camera" : "Turn On Camera"}
          >
            {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleScreenShare}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-105 cursor-pointer ${
              screenSharing
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs"
            }`}
            title="Share Screen"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* DIVIDER 1 */}
        <div className="h-6 w-px bg-slate-200/80 hidden sm:block" />

        {/* GROUP 2: WORKSPACE SEGMENTED CONTROL */}
        <div className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 gap-1">
          {workspaces.map((ws) => {
            const Icon = ws.icon;
            const isActive = activeWorkspace === ws.mode;
            return (
              <button
                key={ws.mode}
                onClick={() => onSelectWorkspace(ws.mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ws.label}</span>
              </button>
            );
          })}
        </div>

        {/* DIVIDER 2 */}
        <div className="h-6 w-px bg-slate-200/80 hidden sm:block" />

        {/* GROUP 3: COLLABORATION & UTILITIES */}
        <div className="flex items-center gap-1">
          
          {/* Reaction menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiMenu(!showEmojiMenu)}
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 transition-all duration-200 hover:scale-105 border border-slate-200/80 shadow-2xs cursor-pointer"
              title="Send Reaction"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Glass Emoji Picker */}
            {showEmojiMenu && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/72 backdrop-blur-[18px] border border-white/45 shadow-[0_12px_40px_rgba(15,23,42,0.10)] rounded-2xl p-2 flex gap-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => {
                      onSendEmoji(e);
                      setShowEmojiMenu(false);
                    }}
                    className="p-1.5 text-base hover:bg-slate-100/80 rounded-lg transition-transform hover:scale-125 cursor-pointer"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Raise hand */}
          <button
            type="button"
            onClick={onToggleHand}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-105 cursor-pointer ${
              handRaised
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs"
            }`}
            title="Raise Hand"
          >
            <Hand className="w-4 h-4" />
          </button>

          {/* Chat toggle */}
          <button
            type="button"
            onClick={onToggleChat}
            className={`relative p-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-105 cursor-pointer ${
              chatOpen
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs"
            }`}
            title="In-Meeting Chat"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadChatCount > 0 && !chatOpen && (
              <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Participants toggle */}
          <button
            type="button"
            onClick={onToggleParticipants}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-105 cursor-pointer ${
              participantsOpen
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs"
            }`}
            title="Participants"
          >
            <Users className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 transition-all duration-200 hover:scale-105 border border-slate-200/80 shadow-2xs hidden sm:block cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Solid Red Leave CTA */}
          <button
            type="button"
            onClick={onLeave}
            className="p-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-extrabold shadow-sm transition-all duration-200 hover:scale-105 ml-1 cursor-pointer"
            title="Leave Call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
