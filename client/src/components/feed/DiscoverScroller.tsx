"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  Users,
  GraduationCap,
  Code2,
  Trophy,
  Flame,
  CreditCard,
  Brain,
  Zap,
  Building2,
  UserCheck,
  Palette,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DiscoverScroller() {
  const [activeTab, setActiveTab] = useState("startups");
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "startups", label: "Featured Startups", icon: Rocket },
    { id: "investors", label: "Featured Investors", icon: Users },
    { id: "students", label: "Student Builders", icon: GraduationCap },
    { id: "opensource", label: "Open Source Projects", icon: Code2 },
    { id: "hackathons", label: "Hackathons & Bounties", icon: Trophy },
    { id: "accelerators", label: "Accelerators & YC", icon: Flame },
  ];

  const items: Record<string, any[]> = {
    startups: [
      {
        id: "s1",
        name: "DevMatrix AI",
        tag: "Seed • $2.5M Raised",
        desc: "Autonomous AI agents for cloud infrastructure deployment & security compliance.",
        icon: Rocket,
        iconBg: "bg-blue-50 text-blue-600",
        upvotes: 412,
        category: "DevTools",
        href: "/startups",
      },
      {
        id: "s2",
        name: "PayPulse",
        tag: "Pre-Seed • YC S25",
        desc: "Instant cross-border stablecoin payout rails for global tech startups.",
        icon: CreditCard,
        iconBg: "bg-emerald-50 text-emerald-600",
        upvotes: 328,
        category: "FinTech",
        href: "/startups",
      },
      {
        id: "s3",
        name: "NeuroFlow",
        tag: "Series A • $8M",
        desc: "Brain-computer interface analytics platform for medical researchers.",
        icon: Brain,
        iconBg: "bg-purple-50 text-purple-600",
        upvotes: 560,
        category: "BioTech",
        href: "/startups",
      },
      {
        id: "s4",
        name: "Solaris Power",
        tag: "Seed • $3.2M",
        desc: "Next-gen solid-state batteries for commercial UAVs and satellites.",
        icon: Zap,
        iconBg: "bg-amber-50 text-amber-600",
        upvotes: 289,
        category: "CleanTech",
        href: "/startups",
      },
    ],
    investors: [
      {
        id: "i1",
        name: "Apex Ventures",
        tag: "VC Fund • $150M AUM",
        desc: "Focusing on B2B SaaS, Developer Tools, and AI infrastructure.",
        icon: Building2,
        iconBg: "bg-indigo-50 text-indigo-600",
        upvotes: "45 Checkouts",
        category: "Seed / Series A",
        href: "/investors",
      },
      {
        id: "i2",
        name: "Sarah Chen",
        tag: "Angel Investor • Ex-Stripe",
        desc: "Writer of $25k-$100k first checks in early-stage fintech & dev tools.",
        icon: UserCheck,
        iconBg: "bg-emerald-50 text-emerald-600",
        upvotes: "80+ Portfolio",
        category: "Pre-Seed",
        href: "/investors",
      },
    ],
    students: [
      {
        id: "st1",
        name: "Rohan Varma",
        tag: "Stanford University",
        desc: "Building low-latency inference engine in C++. Looking for co-founder.",
        icon: GraduationCap,
        iconBg: "bg-purple-50 text-purple-600",
        upvotes: "Top 1% Builder",
        category: "AI / Systems",
        href: "/discover",
      },
    ],
    opensource: [
      {
        id: "o1",
        name: "FastVector-DB",
        tag: "Rust • MIT License",
        desc: "Ultra fast vector indexing engine running directly in WebAssembly.",
        icon: Code2,
        iconBg: "bg-slate-100 text-slate-800",
        upvotes: "5.2k Stars",
        category: "Database",
        href: "/explore",
      },
      {
        id: "o2",
        name: "React-Flow-3D",
        tag: "TypeScript • Apache 2.0",
        desc: "Interactive 3D node editor components for React 19.",
        icon: Palette,
        iconBg: "bg-rose-50 text-rose-600",
        upvotes: "2.8k Stars",
        category: "Frontend UI",
        href: "/explore",
      },
    ],
    hackathons: [
      {
        id: "h1",
        name: "Noventra Global AI Hackathon",
        tag: "$50,000 Cash Prize Pool",
        desc: "Build AI-powered startup tools in 48 hours. Judged by top VCs.",
        icon: Trophy,
        iconBg: "bg-amber-50 text-amber-600",
        upvotes: "1,200 Hackers",
        category: "Global • Virtual",
        href: "/explore",
      },
    ],
    accelerators: [
      {
        id: "a1",
        name: "Y Combinator S26 Batch",
        tag: "$500,000 Investment",
        desc: "3-month intensive startup accelerator in San Francisco.",
        icon: Flame,
        iconBg: "bg-orange-50 text-orange-600",
        upvotes: "Applications Open",
        category: "Accelerator",
        href: "/explore",
      },
    ],
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const currentCards = items[activeTab] || [];

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Ecosystem Spotlight & Discover</h2>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
            Curated
          </span>
        </div>

        {/* Scroll Control Arrows */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-105" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Scroller Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
      >
        {currentCards.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              className="min-w-[280px] max-w-[320px] shrink-0 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-400/60 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200/60 ${card.iconBg}`}>
                    <CardIcon className="w-4.5 h-4.5 transition-transform duration-150 group-hover:scale-110" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md">
                    {card.category}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 truncate">{card.name}</h3>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">{card.tag}</p>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 line-clamp-2">
                  {card.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  {card.upvotes}
                </span>
                <Link
                  href={card.href}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Explore</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
