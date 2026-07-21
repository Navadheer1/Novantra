"use client";

import React from "react";
import { 
  Flame, Rocket, Code, DollarSign, Tv, Briefcase, 
  BookOpen, Bot, Mic, Trophy, Newspaper, TrendingUp, 
  Globe, Heart, Bookmark 
} from "lucide-react";
import { CategoryType } from "./types";

interface Props {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

export default function ExploreCategorySelector({
  selectedCategory,
  onSelectCategory
}: Props) {
  const categories: { id: CategoryType; label: string; icon: any }[] = [
    { id: "trending", label: "Trending", icon: Flame },
    { id: "startups", label: "Startups", icon: Rocket },
    { id: "developers", label: "Developers", icon: Code },
    { id: "investors", label: "Investors", icon: DollarSign },
    { id: "foundertv", label: "FounderTV", icon: Tv },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "learning", label: "Learning", icon: BookOpen },
    { id: "ai", label: "AI", icon: Bot },
    { id: "podcasts", label: "Podcasts", icon: Mic },
    { id: "hackathons", label: "Hackathons", icon: Trophy },
    { id: "news", label: "News", icon: Newspaper },
    { id: "fundraising", label: "Fundraising", icon: TrendingUp },
    { id: "global", label: "Global", icon: Globe },
    { id: "following", label: "Following", icon: Heart },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
