"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { ChatMessage } from "@/hooks/useNoventraMeet";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, fileUrl?: string) => void;
  onClose: () => void;
}

export default function ChatPanel({ messages, onSendMessage, onClose }: ChatPanelProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <aside className="w-full sm:w-80 h-full bg-white/72 backdrop-blur-[18px] border-l border-white/45 shadow-[0_12px_40px_rgba(15,23,42,0.10)] flex flex-col z-30 font-sans text-slate-900">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-xs font-black text-slate-900">In-Meeting Chat</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 opacity-40 text-[#2563EB]" />
            <p className="text-xs font-semibold text-slate-600">No messages yet.</p>
            <p className="text-[10px] text-slate-500">Chat is visible to everyone in this call.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="text-slate-800">{m.senderName}</span>
                <span>{m.timestamp}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 text-xs font-medium text-slate-800 leading-relaxed break-words shadow-2xs">
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200/60 bg-white/40 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/90 border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
        <button
          type="submit"
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </aside>
  );
}
