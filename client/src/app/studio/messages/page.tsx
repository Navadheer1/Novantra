"use client";

import React, { useState } from "react";
import StudioLayout from "@/components/studio/StudioLayout";
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  Send,
  Filter,
  CheckCircle2,
  Briefcase,
  Users,
} from "lucide-react";

export default function StudioMessagesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const [comments, setComments] = useState([
    {
      id: "c-1",
      author: "Alex Morgan",
      role: "Partner at Benchmark",
      type: "investor",
      videoTitle: "Noventra Healthcare AI & Real-time Sync Demo",
      text: "The sub-10ms latency benchmark is impressive. How does your WebSocket gateway scale across multi-region clusters?",
      timestamp: "3 hours ago",
      likes: 14,
      pinned: true,
    },
    {
      id: "c-2",
      author: "David Kim",
      role: "Founder at SyncFlow",
      type: "founder",
      videoTitle: "Noventra Healthcare AI & Real-time Sync Demo",
      text: "Great walkthrough! What database are you using behind the edge nodes?",
      timestamp: "5 hours ago",
      likes: 8,
      pinned: false,
    },
    {
      id: "c-3",
      author: "Priya Sharma",
      role: "Lead Engineer at HealthTech",
      type: "customer",
      videoTitle: "Real-Time Edge Infrastructure Architecture",
      text: "Is there a trial account available for our engineering team to benchmark?",
      timestamp: "1 day ago",
      likes: 5,
      pinned: false,
    },
  ]);

  const handleTogglePin = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleLikeComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const filteredComments = comments.filter((c) => {
    if (activeFilter === "all") return true;
    return c.type === activeFilter;
  });

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Engagement & Comments Inbox</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage viewer feedback, technical questions, and investor inquiries across your FounderTV videos.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
          {[
            { id: "all", label: "All Comments" },
            { id: "investor", label: "Investors" },
            { id: "founder", label: "Founders" },
            { id: "customer", label: "Customers" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeFilter === f.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* COMMENTS LIST */}
        <div className="space-y-4">
          {filteredComments.map((c) => (
            <div key={c.id} className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{c.author}</h4>
                  <span className="text-[10px] font-bold text-slate-500">• {c.role}</span>
                  {c.pinned && (
                    <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" /> Pinned
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{c.timestamp}</span>
              </div>

              <p className="text-xs text-slate-500 font-medium">Video: <strong className="text-slate-800">{c.videoTitle}</strong></p>

              <p className="text-xs text-slate-800 font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-200/60 leading-relaxed">
                "{c.text}"
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLikeComment(c.id)}
                    className="flex items-center gap-1 text-slate-600 font-bold hover:text-blue-600"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> {c.likes} Likes
                  </button>
                  <button
                    onClick={() => handleTogglePin(c.id)}
                    className="flex items-center gap-1 text-slate-600 font-bold hover:text-amber-600"
                  >
                    <Pin className="w-3.5 h-3.5" /> {c.pinned ? "Unpin" : "Pin"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText[c.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [c.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && replyText[c.id]) {
                        alert(`Reply sent to ${c.author}: "${replyText[c.id]}"`);
                        setReplyText({ ...replyText, [c.id]: "" });
                      }
                    }}
                    className="w-48 sm:w-64 p-1.5 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                  <button
                    onClick={() => {
                      if (replyText[c.id]) {
                        alert(`Reply sent to ${c.author}: "${replyText[c.id]}"`);
                        setReplyText({ ...replyText, [c.id]: "" });
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </StudioLayout>
  );
}
