"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Award, Star, UserPlus, Code2, Cpu, Palette, Bot } from "lucide-react";

export interface CreatorProfile {
  id: string;
  name: string;
  roleTitle: string;
  category: "Developer" | "Designer" | "Hardware" | "AI Engineer" | "Hackathon Winner";
  avatar: string;
  verified: boolean;
  salesCount: number;
  rating: number;
  badge: string;
}

interface CreatorSpotlightSectionProps {
  onHireCreator: (creator: CreatorProfile) => void;
}

export default function CreatorSpotlightSection({ onHireCreator }: CreatorSpotlightSectionProps) {
  const creators: CreatorProfile[] = [
    {
      id: "cr-1",
      name: "Marcus Vance",
      roleTitle: "Full-Stack Next.js 16 Lead",
      category: "Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
      verified: true,
      salesCount: 420,
      rating: 4.9,
      badge: "Top 1% Seller"
    },
    {
      id: "cr-2",
      name: "Elena Rostova",
      roleTitle: "Figma Design System Specialist",
      category: "Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
      verified: true,
      salesCount: 310,
      rating: 5.0,
      badge: "Best UI Award"
    },
    {
      id: "cr-3",
      name: "Rohan Sharma",
      roleTitle: "IoT & Robotics Hardware Engineer",
      category: "Hardware",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
      verified: true,
      salesCount: 140,
      rating: 4.8,
      badge: "Hackathon Winner"
    },
    {
      id: "cr-4",
      name: "Dr. Aisha Khan",
      roleTitle: "AI & LLM Pipeline Architect",
      category: "AI Engineer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
      verified: true,
      salesCount: 280,
      rating: 4.9,
      badge: "AI Innovator"
    }
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Creator & Builder Network
            </span>
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Creator Spotlight & Top Builders
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Hire top-rated software engineers, UI/UX designers, and hardware inventors directly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {creators.map((c) => (
          <div key={c.id} className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-center space-y-4">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden mx-auto mb-3 border-2 border-primary/20 shadow-md">
                <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-center gap-1">
                <h3 className="text-base font-black text-foreground">{c.name}</h3>
                {c.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
              </div>

              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{c.roleTitle}</p>

              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[10px] font-black uppercase bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                  {c.badge}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {c.rating}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60">
              <Button
                size="sm"
                className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => onHireCreator(c)}
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" /> Hire {c.name.split(" ")[0]}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
