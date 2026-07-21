"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Paperclip, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <aside className="w-full sm:w-80 h-full bg-white border-l border-slate-200 shadow-xl flex flex-col z-30">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black text-slate-900">In-Meeting Chat</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 opacity-40 text-blue-600" />
            <p className="text-xs font-semibold">No messages yet.</p>
            <p className="text-[10px]">Chat is visible to everyone in this call.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="text-slate-800">{m.senderName}</span>
                <span>{m.timestamp}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-800 leading-relaxed break-words">
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Send a message..."
            className="flex-1 p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-3.5 h-10 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

    </aside>
  );
}
