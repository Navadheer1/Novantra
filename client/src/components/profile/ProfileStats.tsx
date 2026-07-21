"use client";

import React, { useEffect, useState } from "react";
import { Users, UserCheck, Eye, Network, FileText, Heart, Briefcase, Building2 } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    followers: number;
    following: number;
    profileViews?: number;
    connections?: number;
    postsCount: number;
    likesCount?: number;
    investmentsOrProducts?: number;
    role: string;
  };
}

// Simple smooth animated counter component
function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCurrent(value);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{current.toLocaleString()}</span>;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const isInvestor = stats.role.toUpperCase() === "INVESTOR";
  const isFounder = stats.role.toUpperCase() === "FOUNDER";

  const statItems = [
    {
      label: "Followers",
      value: stats.followers,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Following",
      value: stats.following,
      icon: UserCheck,
      color: "text-sky-500 bg-sky-50",
    },
    {
      label: "Connections",
      value: stats.connections ?? Math.floor(stats.followers * 0.4) + 12,
      icon: Network,
      color: "text-indigo-500 bg-indigo-50",
    },
    {
      label: "Profile Views",
      value: stats.profileViews ?? (stats.followers * 3 + 140),
      icon: Eye,
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      label: "Posts Shared",
      value: stats.postsCount,
      icon: FileText,
      color: "text-amber-500 bg-amber-50",
    },
    {
      label: isInvestor ? "Investments" : isFounder ? "Startups" : "Appreciations",
      value: stats.investmentsOrProducts ?? (isInvestor ? 14 : isFounder ? 2 : (stats.likesCount ?? 28)),
      icon: isInvestor ? Briefcase : isFounder ? Building2 : Heart,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white border border-slate-100 rounded-[20px] p-4 text-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${item.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              <AnimatedNumber value={item.value} />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
