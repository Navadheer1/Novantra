"use client";

import { motion } from "framer-motion";
import { Rocket, Send, Calendar, Video, DollarSign, Briefcase, Users, Search, GraduationCap, ArrowRight } from "lucide-react";
import { useEffect } from "react";

interface QuickActionsGridProps {
  onActionSelect: (actionType: string) => void;
}

export default function QuickActionsGrid({ onActionSelect }: QuickActionsGridProps) {
  const actions = [
    {
      id: "launch_startup",
      title: "Launch Startup",
      desc: "Publish product launch & get instant community upvotes",
      shortcut: "L",
      icon: Rocket,
      gradient: "from-blue-500/10 via-indigo-500/5 to-transparent border-blue-200 hover:border-blue-400 text-blue-600",
      iconBg: "bg-blue-600 text-white shadow-sm shadow-blue-500/30",
    },
    {
      id: "share_update",
      title: "Share Update",
      desc: "Post metrics, milestones, or technical changelogs",
      shortcut: "U",
      icon: Send,
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-200 hover:border-emerald-400 text-emerald-600",
      iconBg: "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30",
    },
    {
      id: "schedule_meeting",
      title: "Schedule Meeting",
      desc: "Book pitch calls or office hours with VCs",
      shortcut: "M",
      icon: Calendar,
      gradient: "from-purple-500/10 via-violet-500/5 to-transparent border-purple-200 hover:border-purple-400 text-purple-600",
      iconBg: "bg-purple-600 text-white shadow-sm shadow-purple-500/30",
    },
    {
      id: "create_event",
      title: "Create Event",
      desc: "Host pitch nights, hackathons, or AMAs",
      shortcut: "E",
      icon: Video,
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent border-amber-200 hover:border-amber-400 text-amber-600",
      iconBg: "bg-amber-600 text-white shadow-sm shadow-amber-500/30",
    },
    {
      id: "raise_funding",
      title: "Raise Funding",
      desc: "Submit deck & valuation info to active investors",
      shortcut: "F",
      icon: DollarSign,
      gradient: "from-emerald-500/10 via-green-500/5 to-transparent border-emerald-200 hover:border-emerald-400 text-emerald-600",
      iconBg: "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30",
    },
    {
      id: "hire_talent",
      title: "Hire Talent",
      desc: "Post job openings for founding engineers & designers",
      shortcut: "H",
      icon: Briefcase,
      gradient: "from-sky-500/10 via-blue-500/5 to-transparent border-sky-200 hover:border-sky-400 text-sky-600",
      iconBg: "bg-sky-600 text-white shadow-sm shadow-sky-500/30",
    },
    {
      id: "find_cofounder",
      title: "Find Co-Founder",
      desc: "Connect with matched technical or business co-founders",
      shortcut: "C",
      icon: Users,
      gradient: "from-rose-500/10 via-pink-500/5 to-transparent border-rose-200 hover:border-rose-400 text-rose-600",
      iconBg: "bg-rose-600 text-white shadow-sm shadow-rose-500/30",
    },
    {
      id: "browse_investors",
      title: "Browse Investors",
      desc: "Explore 500+ verified angel investors & VC funds",
      shortcut: "I",
      icon: Search,
      gradient: "from-indigo-500/10 via-blue-500/5 to-transparent border-indigo-200 hover:border-indigo-400 text-indigo-600",
      iconBg: "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30",
    },
    {
      id: "browse_students",
      title: "Browse Students",
      desc: "Discover student builders from top universities",
      shortcut: "S",
      icon: GraduationCap,
      gradient: "from-purple-500/10 via-indigo-500/5 to-transparent border-purple-200 hover:border-purple-400 text-purple-600",
      iconBg: "bg-purple-600 text-white shadow-sm shadow-purple-500/30",
    },
  ];

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const matched = actions.find((a) => a.shortcut === key);
      if (matched && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onActionSelect(matched.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onActionSelect]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Quick Execution Center</h2>
        <span className="text-xs text-slate-400 font-semibold hidden sm:inline-block">
          Press keyboard keys <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-600">[L]</kbd> <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-600">[U]</kbd> <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-600">[F]</kbd> to quick-trigger
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              onClick={() => onActionSelect(action.id)}
              className={`group text-left p-4 rounded-[20px] bg-gradient-to-br bg-white border ${action.gradient} hover:shadow-md transition-all relative flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                  [{action.shortcut}]
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  <span>{action.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                  {action.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
