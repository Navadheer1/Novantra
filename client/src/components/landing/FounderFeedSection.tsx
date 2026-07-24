"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Briefcase,
  Rocket,
  Award,
} from "lucide-react";

export function FounderFeedSection() {
  const [feedPosts, setFeedPosts] = useState([
    {
      id: "post-1",
      author: "Sarah Chen",
      role: "Founder @ MedQuick AI",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
      badge: "YC W26",
      time: "12m ago",
      type: "launch",
      content:
        "🚀 Major milestone! MedQuick AI just crossed $1.8M ARR with 284% MoM growth. We're opening 2 allocations for lead Seed investors on Noventra. Huge thanks to Sequoia for joining our cap table!",
      metrics: { likes: 342, comments: 48, shares: 19 },
      liked: false,
      tag: "Product Launch & Milestone",
      highlightCard: {
        title: "MedQuick AI Seed Allocation",
        metric: "$3.2M / $4.0M Raised",
        sub: "HealthTech • 48 VCs Interested",
      },
    },
    {
      id: "post-2",
      author: "Marcus Thorne",
      role: "CEO @ Payload Security",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
      badge: "Ex-Stripe",
      time: "45m ago",
      type: "hiring",
      content:
        "We are hiring a Principal Systems Architect (Go/Rust/Distributed Systems) for Payload Security. Target equity 8-12%. Connect on Noventra Co-Founder Marketplace!",
      metrics: { likes: 189, comments: 24, shares: 12 },
      liked: true,
      tag: "Co-Founder & Talent Hiring",
      highlightCard: {
        title: "Principal Systems Architect",
        metric: "8% - 12% Equity SAFE",
        sub: "Location: SF / Remote",
      },
    },
    {
      id: "post-3",
      author: "Elena Vance",
      role: "Partner @ Sequoia Capital",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
      badge: "Verified Investor",
      time: "2h ago",
      type: "investor",
      content:
        "Excited to partner with 3 new AI Infrastructure startups matched on Noventra this week. The Groq thesis matcher precision is incredible.",
      metrics: { likes: 512, comments: 64, shares: 38 },
      liked: false,
      tag: "Venture Deal-Flow Update",
    },
  ]);

  const handleLike = (id: string) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              metrics: {
                ...post.metrics,
                likes: post.liked ? post.metrics.likes - 1 : post.metrics.likes + 1,
              },
            }
          : post
      )
    );
  };

  return (
    <section id="community-feed" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Live Founder Social Network
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Real-Time Ecosystem <span className="text-gradient-primary">Activity Feed</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          Follow live product launches, founder updates, hiring calls, and investor deal-flow notes across the world's startup network.
        </p>
      </div>

      {/* Feed Stream Box */}
      <div className="space-y-4 text-left">
        {feedPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="glass-panel bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-lg hover:border-blue-300 transition-all space-y-4"
          >
            {/* Header: Author, Role, Time, Tag */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{post.author}</h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                      {post.badge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium block">{post.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                  {post.tag}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{post.time}</span>
              </div>
            </div>

            {/* Post Main Body */}
            <p className="text-slate-800 text-sm leading-relaxed font-normal">
              {post.content}
            </p>

            {/* Embedded Highlight Card (if any) */}
            {post.highlightCard && (
              <div className="bg-slate-50 border border-slate-200/90 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{post.highlightCard.title}</h4>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{post.highlightCard.sub}</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  {post.highlightCard.metric}
                </span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.liked ? "text-rose-600 font-bold" : "hover:text-slate-900"
                }`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? "fill-rose-600" : ""}`} />
                <span>{post.metrics.likes}</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>{post.metrics.comments} Comments</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>{post.metrics.shares} Shares</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
