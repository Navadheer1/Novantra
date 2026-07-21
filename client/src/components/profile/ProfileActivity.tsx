"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, MessageSquare, Heart, Image as ImageIcon, 
  Award, Sparkles, HeartHandshake, Eye, ArrowUpRight 
} from "lucide-react";
import EmptyState from "./EmptyState";

interface Post {
  id: string;
  content: string;
  postType: string;
  mediaUrl?: string | null;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
}

interface ProfileActivityProps {
  posts: Post[];
  userName: string;
}

export default function ProfileActivity({ posts, userName }: ProfileActivityProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "articles" | "media" | "comments" | "likes" | "achievements">("posts");

  const tabs = [
    { id: "posts", label: "Posts", count: posts.length, icon: FileText },
    { id: "articles", label: "Articles", count: 2, icon: Sparkles },
    { id: "media", label: "Media", count: posts.filter(p => p.mediaUrl).length, icon: ImageIcon },
    { id: "comments", label: "Comments", count: 14, icon: MessageSquare },
    { id: "likes", label: "Likes", count: 38, icon: Heart },
    { id: "achievements", label: "Achievements", count: 4, icon: Award },
  ] as const;

  const mediaPosts = posts.filter((p) => p.mediaUrl);

  const sampleArticles = [
    {
      id: "a1",
      title: "Why AI Native Infrastructure Will Replace Legacy SaaS Middleware in 2026",
      snippet: "An architectural deep-dive into autonomous agent pipelines, vector indexing, and real-time inference routing.",
      date: "Jan 14, 2026",
      readTime: "6 min read"
    },
    {
      id: "a2",
      title: "The Seed Fundraising Playbook for Engineering Founders",
      snippet: "How to craft a compelling narrative, structure your pitch deck, and run a tight 2-week investor process.",
      date: "Dec 02, 2025",
      readTime: "8 min read"
    }
  ];

  const sampleAchievements = [
    { title: "Top 1% Ecosystem Contributor", desc: "Awarded for high community engagement and startup mentorship.", icon: Award, color: "text-amber-500 bg-amber-50" },
    { title: "YC Alum & Verified Founder", desc: "Successfully launched & funded on Noventra.", icon: Sparkles, color: "text-blue-600 bg-blue-50" },
    { title: "25+ Seed Syndicate Investments", desc: "Active deal participant across AI & Cloud.", icon: HeartHandshake, color: "text-emerald-600 bg-emerald-50" }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[20px] p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header & Tabs Navigation */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900">Activity & Contributions</h3>

        {/* Tab Buttons Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive ? "text-blue-600 font-extrabold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {tab.count}
                </span>

                {/* Animated Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeProfileTab"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panel with Smooth Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="pt-2"
        >
          {activeTab === "posts" && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <EmptyState
                  icon="posts"
                  title="No Posts Shared Yet"
                  description={`${userName} hasn't published updates to the ecosystem feed.`}
                />
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3 hover:border-slate-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {post.postType}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.mediaUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200/60 max-h-72 bg-slate-100">
                        <img src={post.mediaUrl} alt="Media post" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "articles" && (
            <div className="space-y-4">
              {sampleArticles.map((art) => (
                <div key={art.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      Long-form Article
                    </span>
                    <span className="text-[11px] text-slate-400">{art.date} • {art.readTime}</span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 hover:text-blue-600 cursor-pointer transition-colors flex items-center justify-between">
                    <span>{art.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{art.snippet}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "media" && (
            <div>
              {mediaPosts.length === 0 ? (
                <EmptyState
                  icon="posts"
                  title="No Media Attachments"
                  description="Images and media attachments will be indexed here."
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaPosts.map((p) => (
                    <div key={p.id} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-2xs group relative">
                      <img src={p.mediaUrl!} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
              <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
              <h5 className="font-extrabold text-xs text-slate-800">Recent Comments Activity</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Showing recent discussions, replies, and community interactions on startup updates.
              </p>
            </div>
          )}

          {activeTab === "likes" && (
            <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20 mx-auto" />
              <h5 className="font-extrabold text-xs text-slate-800">Appreciated Posts</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Posts and updates bookmarked or liked by {userName}.
              </p>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sampleAchievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${ach.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900">{ach.title}</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
