"use client";

import React from "react";
import { Zap, Sparkles, TrendingUp, Award, Rocket, CheckCircle2 } from "lucide-react";

export interface FeedItem {
  id: string;
  type: "RELEASE" | "UPDATE" | "MILESTONE" | "HACKATHON";
  title: string;
  time: string;
  icon: any;
  color: string;
}

export default function ShopFeedTicker() {
  const feedItems: FeedItem[] = [
    { id: "1", type: "RELEASE", title: "New AI Autonomous Companion Robot Prototype Released by Rohan S.", time: "2m ago", icon: Sparkles, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { id: "2", type: "UPDATE", title: "Restaurant All-in-One Kit updated to v3.2 with POS UPI Integration", time: "14m ago", icon: Zap, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { id: "3", type: "MILESTONE", title: "Smart AI Edge DashCam reached 500+ production downloads!", time: "45m ago", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { id: "4", type: "HACKATHON", title: "National Hackathon Winner uploaded Healthcare EMR Telemedicine Kit", time: "1h ago", icon: Award, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" }
  ];

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 mb-10 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
          Live Ecosystem Commerce Ticker
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {feedItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`p-3 rounded-xl border ${item.color} flex items-start gap-2.5 text-xs font-semibold`}>
              <Icon className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground leading-snug line-clamp-2">{item.title}</p>
                <span className="text-[10px] text-muted-foreground font-bold mt-1 block">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
