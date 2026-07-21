"use client";

import { motion } from "framer-motion";
import {
  CheckSquare,
  Video,
  Users,
  Briefcase,
  MessageSquare,
  Zap,
  Bell,
  Clock,
  ArrowRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FounderProductivityCenter() {
  const productivityWidgets = [
    {
      title: "Today's Focus Tasks",
      icon: CheckSquare,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      items: [
        { label: "Review Seed Pitch Deck revisions with co-founders", done: true },
        { label: "Approve 3 senior AI engineer applications in Inbox", done: false },
        { label: "Conduct WebRTC Demo Room call with Sequoia Capital", done: false }
      ]
    },
    {
      title: "Upcoming Meetings",
      icon: Video,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      items: [
        { label: "Pre-Seed VC Due Diligence Room", time: "2:00 PM Today", link: "/meeting/demo-room-101" },
        { label: "Core Engineering Sprint Planning", time: "4:30 PM Today", link: "/meeting/tech-sync" }
      ]
    },
    {
      title: "Pending Team Requests",
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      items: [
        { label: "Aditya Sharma applied for Co-Founder / Lead Architect", type: "Co-Founder" },
        { label: "Priya Patel applied for Senior Backend Engineer", type: "Full-Time" }
      ]
    },
    {
      title: "Hiring Pipeline Queue",
      icon: Briefcase,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      items: [
        { label: "Staff AI Researcher - 4 Candidates in Final Interview", stage: "Final Round" },
        { label: "Product Marketing Lead - 2 Interviews Scheduled", stage: "Interviewing" }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Productivity Operating Center
        </h2>
        <span className="text-xs font-semibold text-slate-500">Execution Hub</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productivityWidgets.map((widget) => {
          const WIcon = widget.icon;
          return (
            <motion.div
              key={widget.title}
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${widget.color}`}>
                      <WIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{widget.title}</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  {widget.items.map((item: any, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.done !== undefined && (
                          <input
                            type="checkbox"
                            checked={item.done}
                            readOnly
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                          />
                        )}
                        <span className={`font-semibold text-slate-800 truncate ${item.done ? "line-through text-slate-400" : ""}`}>
                          {item.label}
                        </span>
                      </div>

                      {item.time && (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {item.time}
                        </span>
                      )}

                      {item.type && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {item.type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
                <Link href="/inbox">
                  <Button size="sm" variant="ghost" className="text-xs font-bold text-blue-600 hover:text-blue-700 p-0 h-auto flex items-center gap-1">
                    Manage Items <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
