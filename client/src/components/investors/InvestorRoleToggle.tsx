"use client";

import React from "react";
import { UserCheck, TrendingUp, Sparkles, ShieldCheck, Users, Briefcase } from "lucide-react";

export type InvestorNetworkRole = "FOUNDER" | "INVESTOR" | "USER" | "ADMIN";

interface InvestorRoleToggleProps {
  currentRole: InvestorNetworkRole;
  onRoleChange: (role: InvestorNetworkRole) => void;
  isAdmin?: boolean;
}

export default function InvestorRoleToggle({ currentRole, onRoleChange, isAdmin = true }: InvestorRoleToggleProps) {
  const roles: { id: InvestorNetworkRole; label: string; tag: string; icon: any; color: string }[] = [
    {
      id: "FOUNDER",
      label: "Founder Perspective",
      tag: "AI Match Score, Pitching & Warm Intros",
      icon: UserCheck,
      color: "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30"
    },
    {
      id: "INVESTOR",
      label: "Investor & LP Network",
      tag: "Co-Investing, Syndicates & Deal Flow",
      icon: TrendingUp,
      color: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
    },
    {
      id: "USER",
      label: "Learner & Public View",
      tag: "Public Talks, Articles & Office Hours",
      icon: Sparkles,
      color: "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/30"
    },
    ...(isAdmin ? [{
      id: "ADMIN" as InvestorNetworkRole,
      label: "Admin Moderation",
      tag: "Verification, Syndicates & Analytics",
      icon: ShieldCheck,
      color: "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30"
    }] : [])
  ];

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-sm mb-6">
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Role-Aware Investor Network Lens
        </span>
        <span className="text-[11px] font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
          One Network • Tailored Experiences
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
