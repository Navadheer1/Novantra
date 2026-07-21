"use client";

import React, { useState } from "react";
import { 
  Mic, MicOff, Video, VideoOff, Monitor, Sparkles, 
  MessageSquare, Users, Hand, Smile, Settings, PhoneOff 
} from "lucide-react";

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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md border border-white/15 p-2 sm:p-2.5 rounded-2xl shadow-2xl">
        
        {/* Mic Toggle */}
        <button
          type="button"
          onClick={onToggleMic}
          className={`p-3 rounded-xl font-bold text-xs transition-all ${
            micOn
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-rose-600 hover:bg-rose-700 text-white"
          }`}
          title={micOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Camera Toggle */}
        <button
          type="button"
          onClick={onToggleCam}
          className={`p-3 rounded-xl font-bold text-xs transition-all ${
            camOn
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-rose-600 hover:bg-rose-700 text-white"
          }`}
          title={camOn ? "Turn Off Camera" : "Turn On Camera"}
        >
          {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          type="button"
          onClick={onToggleScreenShare}
          className={`p-3 rounded-xl font-bold text-xs transition-all ${
            screenSharing
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Share Screen"
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Background Blur */}
        <button
          type="button"
          onClick={onToggleBlur}
          className={`p-3 rounded-xl font-bold text-xs transition-all ${
            blurOn
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Background Effects & Blur"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-white/15 hidden sm:block" />

        {/* Emoji Reactions Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiMenu(!showEmojiMenu)}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Reactions"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiMenu && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/20 rounded-2xl shadow-xl p-2 flex gap-1 animate-in fade-in zoom-in-95 duration-150">
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    onSendEmoji(e);
                    setShowEmojiMenu(false);
                  }}
                  className="p-2 text-lg hover:bg-white/10 rounded-xl transition-transform hover:scale-125"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Raise Hand */}
        <button
          type="button"
          onClick={onToggleHand}
          className={`p-3 rounded-xl font-bold text-xs transition-all ${
            handRaised
              ? "bg-amber-500 text-slate-950 font-bold"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Raise Hand"
        >
          <Hand className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-white/15 hidden sm:block" />

        {/* Chat Toggle */}
        <button
          type="button"
          onClick={onToggleChat}
          className={`relative p-3 rounded-xl font-bold text-xs transition-all ${
            chatOpen
              ? "bg-blue-600 text-white"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="In-Meeting Chat"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadChatCount > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* Participants Toggle */}
        <button
          type="button"
          onClick={onToggleParticipants}
          className={`p-3 rounded-xl font-bold text-xs transition-all ${
            participantsOpen
              ? "bg-blue-600 text-white"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Participants List"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          title="Audio & Video Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Red Leave CTA */}
        <button
          type="button"
          onClick={onLeave}
          className="p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md transition-all ml-1"
          title="Leave Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
