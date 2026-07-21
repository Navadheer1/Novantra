"use client";

import React from "react";
import { UserPlus, Briefcase, Building2, Users, Sparkles, DollarSign, Award, Trophy } from "lucide-react";

export interface GoalOption {
  id: string;
  label: string;
  description: string;
  icon: any;
  badge?: string;
}

const GOALS: GoalOption[] = [
  { id: "co-founder", label: "Find Co-Founder", description: "Connect with tech & business founders", icon: UserPlus },
  { id: "investors", label: "Find Investors", description: "Pitch active VCs & angel investors", icon: Briefcase, badge: "Popular" },
  { id: "join-startup", label: "Join a Startup", description: "Apply to high-growth engineering & design roles", icon: Building2 },
  { id: "hire-talent", label: "Hire Talent", description: "Recruit top ecosystem talent", icon: Users },
  { id: "ai-startups", label: "Discover AI Startups", description: "Explore LLM, agentic & infra ventures", icon: Sparkles, badge: "Hot" },
  { id: "explore-funding", label: "Explore Funding", description: "Track SAFEs, grants & seed rounds", icon: DollarSign },
  { id: "find-mentors", label: "Find Mentors", description: "Get guidance from veteran founders", icon: Award },
  { id: "join-hackathons", label: "Join Hackathons", description: "Compete & pitch in live build events", icon: Trophy }
];

interface Props {
  selectedGoal: string;
  onSelectGoal: (goalId: string) => void;
}

export default function DiscoverByGoal({ selectedGoal, onSelectGoal }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-lg text-foreground flex items-center gap-2">
          <span>What are you looking for today?</span>
        </h2>
        {selectedGoal !== "all" && (
          <button
            onClick={() => onSelectGoal("all")}
            className="text-xs font-bold text-primary hover:underline"
          >
            Clear Goal Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GOALS.map((g) => {
          const Icon = g.icon;
          const isSelected = selectedGoal === g.id;
          return (
            <div
              key={g.id}
              onClick={() => onSelectGoal(isSelected ? "all" : g.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                  : "bg-card border-border/80 hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              {g.badge && (
                <span className={`absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}>
                  {g.badge}
                </span>
              )}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs leading-tight">{g.label}</h4>
                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                  {g.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
