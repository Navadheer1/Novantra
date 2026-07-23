"use client";

import React from "react";
import { UserCheck, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";

export type MarketplaceRoleView = "FOUNDER" | "INVESTOR" | "USER" | "ADMIN";

interface RoleViewToggleProps {
  currentView: MarketplaceRoleView;
  onViewChange: (view: MarketplaceRoleView) => void;
  isAdmin?: boolean;
}

export default function RoleViewToggle({ currentView, onViewChange, isAdmin = true }: RoleViewToggleProps) {
  const views: { id: MarketplaceRoleView; label: string; tag: string; icon: any; color: string }[] = [
    {
      id: "INVESTOR",
      label: "Investor View",
      tag: "Metrics, Valuation, MRR & Deck",
      icon: TrendingUp,
      color: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
    },
    {
      id: "FOUNDER",
      label: "Founder View",
      tag: "Co-founders, Talent & Hiring",
      icon: UserCheck,
      color: "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30"
    },
    {
      id: "USER",
      label: "User & Talent View",
      tag: "Products, Careers & Beta Access",
      icon: Sparkles,
      color: "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/30"
    },
    ...(isAdmin ? [{
      id: "ADMIN" as MarketplaceRoleView,
      label: "Admin Moderation",
      tag: "Verification, Analytics & Badges",
      icon: ShieldCheck,
      color: "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30"
    }] : [])
  ];

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-sm mb-6">
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Role-Based Marketplace Lens
        </span>
        <span className="text-[11px] font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
          Same Startup • Tailored Experience
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = currentView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={`flex items-start gap-2.5 p-3 rounded-xl text-left border transition-all duration-200 ${
                isActive
                  ? `${v.color} ring-2 ring-primary/20 shadow-sm`
                  : "border-border/60 hover:border-border hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-current" : "text-muted-foreground"}`} />
              <div className="min-w-0">
                <p className={`text-xs font-black leading-tight ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                  {v.label}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-medium">
                  {v.tag}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
