"use client";

import React from "react";
import { Rocket, Palette, Bot, Briefcase, Sparkles } from "lucide-react";

export type EcosystemCategoryLens = "ALL" | "SAAS_MVPS" | "DESIGN_KITS" | "AI_TOOLS" | "SERVICES";

interface EcosystemViewToggleProps {
  currentLens: EcosystemCategoryLens;
  onLensChange: (lens: EcosystemCategoryLens) => void;
}

export default function EcosystemViewToggle({ currentLens, onLensChange }: EcosystemViewToggleProps) {
  const lenses: { id: EcosystemCategoryLens; label: string; tag: string; icon: any; color: string }[] = [
    {
      id: "ALL",
      label: "All Solutions & Assets",
      tag: "Full Ecosystem Exchange",
      icon: Sparkles,
      color: "border-primary text-primary bg-primary/10"
    },
    {
      id: "SAAS_MVPS",
      label: "SaaS Boilerplates & MVPs",
      tag: "Next.js, Stripe, Prisma Ready",
      icon: Rocket,
      color: "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30"
    },
    {
      id: "DESIGN_KITS",
      label: "UI Kits & Design Systems",
      tag: "Figma Tokens, Tailwind & Auto-Layout",
      icon: Palette,
      color: "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/30"
    },
    {
      id: "AI_TOOLS",
      label: "AI Agents & Dev Tools",
      tag: "Prompt Kits, Chrome Extensions & APIs",
      icon: Bot,
      color: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
    },
    {
      id: "SERVICES",
      label: "Advisory & Tech Audits",
      tag: "Code Reviews & Co-Founder Mentorship",
      icon: Briefcase,
      color: "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30"
    }
  ];

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-sm mb-6">
      <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Ecosystem Solution Exchange Lens
        </span>
        <span className="text-[11px] font-semibold text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full">
          Production-Grade Startup Assets
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {lenses.map((l) => {
          const Icon = l.icon;
          const isActive = currentLens === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onLensChange(l.id)}
              className={`flex items-start gap-2.5 p-3 rounded-xl text-left border transition-all duration-200 ${
                isActive
                  ? `${l.color} ring-2 ring-primary/20 shadow-sm`
                  : "border-border/60 hover:border-border hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-current" : "text-muted-foreground"}`} />
              <div className="min-w-0">
                <p className={`text-xs font-black leading-tight ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                  {l.label}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-medium">
                  {l.tag}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
