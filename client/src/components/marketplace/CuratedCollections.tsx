"use client";

import React from "react";
import { Sparkles, DollarSign, Bot, Rocket, Award, GraduationCap, Star, Flag, Heart } from "lucide-react";

export interface CollectionItem {
  id: string;
  name: string;
  count: number;
  icon: any;
  color: string;
  description: string;
}

interface CuratedCollectionsProps {
  onSelectCollection: (collectionId: string) => void;
}

export default function CuratedCollections({ onSelectCollection }: CuratedCollectionsProps) {
  const collections: CollectionItem[] = [
    { id: "under-50", name: "Under ₹5,000 / $50", count: 48, icon: DollarSign, color: "from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-500/20", description: "Budget-friendly production starters for indie hackers." },
    { id: "ai-essentials", name: "AI Essentials", count: 32, icon: Bot, color: "from-purple-500/10 to-purple-500/5 text-purple-600 border-purple-500/20", description: "Must-have OpenAI & LLM API wrappers and prompt kits." },
    { id: "new-startups", name: "For New Startups", count: 54, icon: Rocket, color: "from-blue-500/10 to-blue-500/5 text-blue-600 border-blue-500/20", description: "Curated MVP stacks for early-stage founders." },
    { id: "best-ui", name: "Best UI & Figma Tokens", count: 40, icon: Award, color: "from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-500/20", description: "Top-rated design systems and high-converting landing kits." },
    { id: "student-creations", name: "Student Creations", count: 29, icon: GraduationCap, color: "from-indigo-500/10 to-indigo-500/5 text-indigo-600 border-indigo-500/20", description: "Projects built by university hackers & hackathon winners." },
    { id: "investor-favorites", name: "Investor Favorites", count: 18, icon: Star, color: "from-yellow-500/10 to-yellow-500/5 text-yellow-600 border-yellow-500/20", description: "Acquisition-ready micro-SaaS with verified revenue." },
    { id: "made-in-india", name: "Made in India", count: 36, icon: Flag, color: "from-orange-500/10 to-orange-500/5 text-orange-600 border-orange-500/20", description: "High-impact tech assets built by Indian ecosystem founders." }
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Curated Ecosystem Collections
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Hand-picked solution bundles tailored for every startup stage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {collections.map((col) => {
          const Icon = col.icon;
          return (
            <button
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`bg-gradient-to-br ${col.color} border p-5 rounded-2xl text-left transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-background/80 shadow-sm">
                    <Icon className="w-5 h-5 text-current" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-background/80 text-foreground px-2 py-0.5 rounded-full border border-border">
                    {col.count} Items
                  </span>
                </div>

                <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{col.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-medium">{col.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
