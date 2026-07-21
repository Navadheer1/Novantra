"use client";

import { motion } from "framer-motion";
import { Rocket, DollarSign, Briefcase, Users, Trophy, TrendingUp, Newspaper, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DailySnapshot() {
  const highlights = [
    {
      id: "startups",
      title: "New Startups",
      metric: "+14 Today",
      detail: "AI, FinTech & Web3",
      icon: Rocket,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      href: "/startups",
    },
    {
      id: "funding",
      title: "Funding Announced",
      metric: "$12.4M",
      detail: "3 rounds closed today",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      href: "/investors",
    },
    {
      id: "hiring",
      title: "Hiring Startups",
      metric: "38 Open Roles",
      detail: "Founding Engineers & PMs",
      icon: Briefcase,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      href: "/explore",
    },
    {
      id: "investors",
      title: "Active VCs Online",
      metric: "48 VCs",
      detail: "Actively reviewing pitches",
      icon: Users,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      href: "/investors",
    },
    {
      id: "builder",
      title: "Featured Builder",
      metric: "Alex Rivera",
      detail: "Built AutoDeFi (Seed)",
      icon: Trophy,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      href: "/discover",
    },
    {
      id: "tech",
      title: "Trending Tech",
      metric: "Next.js 16 • Rust",
      detail: "+45% project adoption",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      href: "/explore",
    },
    {
      id: "news",
      title: "Ecosystem News",
      metric: "YC S26 Open",
      detail: "Applications close in 14d",
      icon: Newspaper,
      color: "text-sky-600 bg-sky-50 border-sky-200",
      href: "/explore",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Daily Startup Snapshot</h2>
          <span className="text-xs text-slate-500 font-medium">Updated live</span>
        </div>
        <Link href="/explore" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
          View full briefing <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
            >
              <Link
                href={item.href}
                className="group block p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 truncate">{item.title}</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {item.metric}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{item.detail}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
