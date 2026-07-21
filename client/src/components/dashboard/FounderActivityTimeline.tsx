"use client";

import { motion } from "framer-motion";
import {
  GitCommit,
  Zap,
  Briefcase,
  Users,
  MessageSquare,
  Video,
  Clock,
  Sparkles,
  Award,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function FounderActivityTimeline() {
  const activities = [
    {
      id: 1,
      type: "funding",
      title: "Seed Investment Term Sheet Received",
      desc: "Sequoia Capital partner submitted $500,000 Seed Term Sheet for Noventra Core.",
      time: "10 mins ago",
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-200"
    },
    {
      id: 2,
      type: "hiring",
      title: "Co-Founder / Lead AI Architect Application",
      desc: "Aditya Sharma (ex-Google AI) submitted co-founder application with portfolio.",
      time: "1 hour ago",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      id: 3,
      type: "meeting",
      title: "WebRTC Pitch Room Completed",
      desc: "35-minute live pitch call completed with Lightspeed India partners.",
      time: "3 hours ago",
      icon: Video,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      id: 4,
      type: "comment",
      title: "Comment on Launch Post",
      desc: "TechCrunch editor commented: 'Very impressive latency benchmarks on WebRTC mesh.'",
      time: "5 hours ago",
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-50 border-purple-200"
    },
    {
      id: 5,
      type: "milestone",
      title: "Reached 12,000 Monthly Active Users",
      desc: "Milestone unlocked: Startup workspace scaled past 12k MAU milestone.",
      time: "Yesterday",
      icon: Award,
      color: "text-rose-600 bg-rose-50 border-rose-200"
    }
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-blue-600" />
            GitHub-Style Ecosystem Activity Feed
          </h2>
          <p className="text-xs text-slate-500">Real-time timeline of funding, hiring, meetings, and mentions.</p>
        </div>
        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Realtime Stream
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => {
          const ActIcon = act.icon;
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative flex items-start gap-4 group"
            >
              {/* Timeline Marker Dot */}
              <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border ${act.color} shadow-2xs`}>
                <ActIcon className="w-3 h-3" />
              </div>

              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl w-full hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                    {act.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {act.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
