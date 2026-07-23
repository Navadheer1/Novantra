"use client";

import React from "react";
import { UserCheck, TrendingUp, Code2, GraduationCap, Sparkles } from "lucide-react";

export type ShopRoleLens = "FOUNDER" | "INVESTOR" | "DEVELOPER" | "STUDENT";

interface ShopRoleToggleProps {
  currentRole: ShopRoleLens;
  onRoleChange: (role: ShopRoleLens) => void;
}

export default function ShopRoleToggle({ currentRole, onRoleChange }: ShopRoleToggleProps) {
  const roles: { id: ShopRoleLens; label: string; tag: string; icon: any; color: string }[] = [
    {
      id: "FOUNDER",
      label: "Founder Lens",
      tag: "Buy Kits, Hire Creators & Customize",
      icon: UserCheck,
      color: "border-primary text-primary bg-primary/10"
    },
    {
      id: "INVESTOR",
      label: "Investor & LP Lens",
      tag: "Discover Investable Products & Creators",
      icon: TrendingUp,
      color: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
    },
    {
      id: "DEVELOPER",
      label: "Developer & Builder",
      tag: "Monetize Software, Sell Kits & Analytics",
      icon: Code2,
      color: "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30"
    },
    {
      id: "STUDENT",
      label: "Student & Hacker",
      tag: "College Projects, Earn & Build Portfolio",
      icon: GraduationCap,
      color: "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/30"
    }
  ];

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-sm mb-8">
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Ecosystem Role Lens
        </span>
        <span className="text-[11px] font-semibold text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full">
          The App Store for Startups
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onRoleChange(r.id)}
              className={`flex items-start gap-2.5 p-3 rounded-xl text-left border transition-all duration-200 ${
                isActive
                  ? `${r.color} ring-2 ring-primary/20 shadow-sm`
                  : "border-border/60 hover:border-border hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-current" : "text-muted-foreground"}`} />
              <div className="min-w-0">
                <p className={`text-xs font-black leading-tight ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                  {r.label}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-medium">
                  {r.tag}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
