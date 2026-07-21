"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  FileText,
  Send,
  Bot,
  Inbox,
  Video,
  Calendar as CalendarIcon,
  Bell,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Building2,
  Users,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NoventraAICopilotModal, { AIActionType } from "./NoventraAICopilotModal";

interface Props {
  meetings: any[];
  onStartMeeting?: () => void;
  startupName?: string;
  industry?: string;
}

type NotifCategory = "all" | "funding" | "hiring" | "investors" | "messages" | "meetings";

export default function FounderRightSidebar({
  meetings,
  onStartMeeting,
  startupName = "Noventra Core",
  industry = "AI & Software"
}: Props) {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAction, setAiAction] = useState<AIActionType>("pitch");
  const [notifCategory, setNotifCategory] = useState<NotifCategory>("all");

  const triggerAI = (action: AIActionType) => {
    setAiAction(action);
    setAiModalOpen(true);
  };

  const notifications = [
    {
      id: "n1",
      category: "funding",
      title: "New VC Interest",
      desc: "Accel Partners expressed interest in Seed round.",
      time: "15m ago",
      read: false
    },
    {
      id: "n2",
      category: "hiring",
      title: "Application Submitted",
      desc: "Senior Frontend Lead applied for Noventra Core.",
      time: "1h ago",
      read: false
    },
    {
      id: "n3",
      category: "meetings",
      title: "Meeting Room Ready",
      desc: "WebRTC pitch room with Peak XV is active.",
      time: "2h ago",
      read: true
    }
  ];

  const filteredNotifs = notifications.filter(
    (n) => notifCategory === "all" || n.category === notifCategory
  );

  return (
    <div className="w-full lg:w-80 shrink-0 space-y-6">
      {/* 1. Noventra AI Copilot Widget */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[20px] p-5 shadow-lg border border-indigo-950/50 space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-800/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                Noventra AI Copilot
              </h3>
              <p className="text-[10px] text-blue-300">Autonomous Assistant</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
            Online
          </span>
        </div>

        {/* Today's Recommendation Box */}
        <div className="p-3.5 bg-indigo-900/40 border border-indigo-700/40 rounded-xl space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Recommendation of the Day
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            "Target 4 Seed-stage AI VCs based in SF who recently backed LLM infrastructure."
          </p>
        </div>

        {/* Quick AI Action Launchers */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Quick AI Actions</span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => triggerAI("pitch")}
              className="p-2.5 bg-slate-800/80 hover:bg-blue-600 rounded-xl text-left font-bold transition-all border border-slate-700/60 flex items-center gap-1.5 truncate group"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Improve Pitch</span>
            </button>

            <button
              onClick={() => triggerAI("hiring")}
              className="p-2.5 bg-slate-800/80 hover:bg-blue-600 rounded-xl text-left font-bold transition-all border border-slate-700/60 flex items-center gap-1.5 truncate group"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Hiring Post</span>
            </button>

            <button
              onClick={() => triggerAI("update")}
              className="p-2.5 bg-slate-800/80 hover:bg-blue-600 rounded-xl text-left font-bold transition-all border border-slate-700/60 flex items-center gap-1.5 truncate group"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">Startup Update</span>
            </button>

            <button
              onClick={() => triggerAI("investor_email")}
              className="p-2.5 bg-slate-800/80 hover:bg-blue-600 rounded-xl text-left font-bold transition-all border border-slate-700/60 flex items-center gap-1.5 truncate group"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Investor Email</span>
            </button>

            <button
              onClick={() => triggerAI("product_launch")}
              className="p-2.5 bg-slate-800/80 hover:bg-blue-600 rounded-xl text-left font-bold transition-all border border-slate-700/60 flex items-center gap-1.5 truncate group"
            >
              <Bot className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">Launch Post</span>
            </button>

            <button
              onClick={() => triggerAI("linkedin")}
              className="p-2.5 bg-slate-800/80 hover:bg-blue-600 rounded-xl text-left font-bold transition-all border border-slate-700/60 flex items-center gap-1.5 truncate group"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">LinkedIn Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Inbox & Requests Widget */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blue-600" /> Inbox & Requests
          </h3>
          <Link href="/inbox">
            <span className="text-xs font-bold text-blue-600 hover:underline">View All</span>
          </Link>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100/80 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">3 Pending Candidate Requests</p>
              <p className="text-[10px] text-slate-500">Co-founder & Full-stack roles</p>
            </div>
            <Link href="/inbox">
              <Button size="sm" className="h-7 text-[11px] font-bold bg-blue-600 text-white">Review</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. WebRTC Meetings Widget */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" /> Active Pitch Calls
          </h3>
          {onStartMeeting && (
            <Button size="sm" onClick={onStartMeeting} className="h-7 text-[10px] font-bold bg-blue-600 text-white">
              <Plus className="w-3 h-3 mr-1" /> New Room
            </Button>
          )}
        </div>

        {meetings.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400">
            No live video calls active. Use <strong className="text-slate-700">Pitch Room</strong> to start a WebRTC room.
          </div>
        ) : (
          <div className="space-y-2">
            {meetings.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 truncate">{m.startup?.name || "Startup"} Room</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Code: {m.meetingCode}</span>
                </div>
                <Link href={`/meeting/${m.meetingCode}`}>
                  <Button size="sm" className="h-7 text-[11px] font-bold bg-blue-600 text-white">Join</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Calendar Widget */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" /> Founder Calendar
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase">July 2026</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate">Pitch Deck Demo to Y Combinator</p>
              <p className="text-[10px] text-slate-500">2:30 PM • WebRTC Room</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Notification Center */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" /> Notifications
          </h3>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            2 New
          </span>
        </div>

        <div className="flex gap-1 overflow-x-auto text-[10px] font-bold pb-1">
          {(["all", "funding", "hiring", "meetings"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setNotifCategory(cat)}
              className={`px-2 py-1 rounded-md capitalize transition-all ${
                notifCategory === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2 text-xs">
          {filteredNotifs.map((n) => (
            <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{n.title}</span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-slate-600 text-[11px]">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Noventra AI Modal */}
      <NoventraAICopilotModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialAction={aiAction}
        startupName={startupName}
        industry={industry}
      />
    </div>
  );
}
