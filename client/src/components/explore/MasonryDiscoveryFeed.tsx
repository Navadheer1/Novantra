"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, User, DollarSign, Code, Play, BookOpen, 
  Briefcase, Calendar, Rocket, Bookmark, Heart, Share2, 
  ExternalLink, MessageSquare, Star, Eye, Sparkles, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExploreCard } from "./types";
import Link from "next/link";

interface Props {
  cards: ExploreCard[];
}

export default function MasonryDiscoveryFeed({ cards }: Props) {
  const [bookmarkedCards, setBookmarkedCards] = useState<Record<string, boolean>>({});
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarkedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id: string) => {
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: idx * 0.04 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          {/* Card Body by Type */}
          {card.type === "startup" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={card.data.logo}
                    alt={card.data.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {card.data.name}
                    </h3>
                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {card.data.stage} Stage
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  {card.data.mrr || card.data.raisingStatus}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {card.data.tagline}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
                <span>By {card.data.founderName}</span>
                <span>{card.data.followersCount} Followers</span>
              </div>
            </div>
          )}

          {card.type === "founder" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={card.data.avatarUrl}
                  alt={card.data.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    {card.data.name}
                    {card.data.verified && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold">{card.data.startupName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {card.data.headline}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800 pt-3">
                <span>{card.data.mutualCount} Mutual Connections</span>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-8 px-4">
                  Connect
                </Button>
              </div>
            </div>
          )}

          {card.type === "investor" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={card.data.avatarUrl}
                  alt={card.data.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {card.data.name}
                  </h3>
                  <p className="text-xs text-emerald-600 font-bold">{card.data.firmName}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Thesis & Ticket Size</span>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">{card.data.thesis}</p>
                <span className="inline-block text-xs font-extrabold text-emerald-600 mt-1">{card.data.ticketSize} Ticket</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {card.data.industries.map((ind: string) => (
                  <span key={ind} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}

          {card.type === "video" && (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden group/vid cursor-pointer">
                <img src={card.data.thumbnail} alt={card.data.title} className="w-full h-44 object-cover group-hover/vid:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-blue-600 shadow-lg group-hover/vid:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                  {card.data.duration}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {card.data.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-1">
                <span>By {card.data.creatorName}</span>
                <span>{(card.data.views / 1000).toFixed(1)}k views</span>
              </div>
            </div>
          )}

          {card.type === "project" && (
            <div className="space-y-3">
              <img src={card.data.thumbnail} alt={card.data.title} className="w-full h-36 object-cover rounded-2xl border border-slate-200/80" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {card.data.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-2">
                {card.data.description}
              </p>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" /> {card.data.stars} Stars
                </span>
                <Link href={card.data.demoUrl} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {card.type === "article" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Article</span>
                <span>{card.data.readTime}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                {card.data.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-3">
                {card.data.summary}
              </p>
              <div className="flex items-center gap-2 pt-2">
                {card.data.tags.map((tg: string) => (
                  <span key={tg} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 text-[10px] font-bold">
                    #{tg}
                  </span>
                ))}
              </div>
            </div>
          )}

          {card.type === "job" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={card.data.companyLogo} alt={card.data.companyName} className="w-10 h-10 rounded-xl object-cover border shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{card.data.roleTitle}</h3>
                  <p className="text-xs text-blue-600 font-bold">{card.data.companyName}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-200 flex justify-between">
                <span>{card.data.salaryRange}</span>
                <span className="text-emerald-600">{card.data.location}</span>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2 rounded-xl">
                Quick Apply
              </Button>
            </div>
          )}

          {card.type === "event" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">
                <span>{card.data.date}</span>
                <span>{card.data.attendeesCount} Attending</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{card.data.title}</h3>
              <p className="text-xs text-slate-500 font-medium">Hosted by {card.data.organizer}</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl">
                Register Free
              </Button>
            </div>
          )}

          {card.type === "build_in_public" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={card.data.founderAvatar} alt={card.data.founderName} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">{card.data.founderName}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{card.data.metricBadge}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{card.data.milestoneTitle}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{card.data.updateText}</p>
            </div>
          )}

          {/* Action Bar Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-4">
            <div className="flex items-center gap-3 text-slate-400">
              <button
                onClick={() => toggleLike(card.id)}
                className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                  likedCards[card.id] ? "text-rose-500" : "hover:text-slate-700"
                }`}
              >
                <Heart className={`w-4 h-4 ${likedCards[card.id] ? "fill-current text-rose-500" : ""}`} />
              </button>

              <button className="flex items-center gap-1 text-xs font-bold hover:text-slate-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>

              <button className="flex items-center gap-1 text-xs font-bold hover:text-slate-700 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => toggleBookmark(card.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                bookmarkedCards[card.id] ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedCards[card.id] ? "fill-current text-blue-600" : ""}`} />
            </button>
          </div>

        </motion.div>
      ))}
    </div>
  );
}
