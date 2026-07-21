"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Hash, MessageSquare, Heart, Sparkles, User, FileText } from "lucide-react";

interface Props {
  trendingPosts: any[];
  trendingHashtags: any[];
  trendingTopics: any[];
}

export default function TrendingModule({ trendingPosts = [], trendingHashtags = [], trendingTopics = [] }: Props) {
  return (
    <div className="space-y-6">
      
      {/* Trending Topics & Hashtags (X style) */}
      <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-500" /> Trending in Ecosystem
        </h3>

        {/* Topics List */}
        <div className="space-y-3">
          {trendingTopics.map((topic, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all cursor-pointer">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">{topic.category}</span>
              <h4 className="font-extrabold text-xs text-foreground mt-0.5 leading-snug">{topic.title}</h4>
              <span className="text-[10px] text-amber-600 font-semibold mt-1 block">{topic.volume}</span>
            </div>
          ))}
        </div>

        {/* Hashtags Chips */}
        <div className="pt-2 border-t border-border/60">
          <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground block mb-2">
            Popular Hashtags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {trendingHashtags.map((h) => (
              <Link
                key={h.tag}
                href={`/search?q=${encodeURIComponent(h.tag)}&type=posts`}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1"
              >
                <Hash className="w-3 h-3 text-amber-600" />
                <span>{h.tag.replace('#', '')}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Community Discussions / Feed Posts */}
      {trendingPosts.length > 0 && (
        <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Top Discussions
          </h3>

          <div className="divide-y divide-border/60">
            {trendingPosts.slice(0, 3).map((p) => (
              <div key={p.id} className="py-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-muted overflow-hidden shrink-0">
                    {p.author?.avatarUrl ? (
                      <img src={p.author.avatarUrl} alt={p.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <span className="font-extrabold text-xs text-foreground">{p.author?.name || "Member"}</span>
                  <span className="text-[10px] text-muted-foreground">• {new Date(p.createdAt).toLocaleDateString()}</span>
                </div>

                <p className="text-xs text-foreground/90 line-clamp-2 leading-relaxed">
                  {p.content}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1 font-semibold">
                  <span className="flex items-center gap-1 hover:text-primary cursor-pointer">
                    <Heart className="w-3.5 h-3.5" /> {p.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1 hover:text-primary cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5" /> {p.commentsCount || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
