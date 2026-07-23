"use client";

import React from "react";
import { Code2, Bot, Cpu, FileCode2, Briefcase, Palette, Zap, Megaphone, DollarSign, GraduationCap, Radio, Compass } from "lucide-react";

interface CategoryCard {
  id: string;
  name: string;
  count: number;
  icon: any;
  color: string;
}

interface VisualCategoryGridProps {
  onSelectCategory: (catName: string) => void;
}

export default function VisualCategoryGrid({ onSelectCategory }: VisualCategoryGridProps) {
  const categories: CategoryCard[] = [
    { id: "software", name: "Software & SaaS", count: 84, icon: Code2, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { id: "ai", name: "AI & Machine Learning", count: 62, icon: Bot, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { id: "hardware", name: "Hardware & IoT", count: 28, icon: Cpu, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { id: "templates", name: "Next.js Templates", count: 95, icon: FileCode2, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { id: "business", name: "Business & Pitch Decks", count: 42, icon: Briefcase, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
    { id: "design", name: "Design Systems & UI", count: 76, icon: Palette, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { id: "automation", name: "Automation & Workflows", count: 35, icon: Zap, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
    { id: "marketing", name: "Marketing & SEO Tools", count: 31, icon: Megaphone, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
    { id: "finance", name: "Fintech & Payments", count: 24, icon: DollarSign, color: "text-emerald-600 bg-emerald-600/10 border-emerald-600/20" },
    { id: "education", name: "EdTech & LMS", count: 19, icon: GraduationCap, color: "text-blue-600 bg-blue-600/10 border-blue-600/20" },
    { id: "iot", name: "Robotics & Microcontrollers", count: 14, icon: Radio, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" }
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Explore Ecosystem Categories
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Browse by production category and technical domain.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`p-4 rounded-2xl border ${cat.color} text-left transition-all duration-200 hover:scale-105 hover:shadow-md group`}
            >
              <Icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-black text-foreground line-clamp-1">{cat.name}</h3>
              <span className="text-[10px] font-bold text-muted-foreground mt-0.5 block">
                {cat.count} Assets
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
