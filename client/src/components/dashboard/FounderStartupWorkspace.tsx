"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Video,
  BarChart2,
  FileText,
  Users,
  Settings,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Briefcase,
  Layers,
  Sparkles,
  Zap,
  Target,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StartupItem {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  industry: string;
  stage: string;
  fundingNeeded: string | null;
  teamMembers: any[];
  requests: any[];
  requiredRoles: string[];
}

interface Props {
  startups: StartupItem[];
  onStartMeeting: (startupId: string) => void;
  startingMeetingId: string | null;
}

type TabType = "activity" | "requests" | "hiring" | "funding" | "roadmap" | "documents";

export default function FounderStartupWorkspace({
  startups,
  onStartMeeting,
  startingMeetingId
}: Props) {
  const [activeTabs, setActiveTabs] = useState<Record<string, TabType>>({});

  const setTab = (startupId: string, tab: TabType) => {
    setActiveTabs((prev) => ({ ...prev, [startupId]: tab }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Startup Workspace Command
          </h2>
          <p className="text-xs text-slate-500">Manage operations, WebRTC pitch rooms, team rosters, and documents.</p>
        </div>

        <Link href="/dashboard/founder/startup/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Register Startup
          </Button>
        </Link>
      </div>

      {startups.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-[20px] p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">No Startup Workspace Created</h3>
            <p className="text-xs text-slate-500">
              Launch your startup workspace to manage pitch rooms, accept investor requests, and build your core team.
            </p>
          </div>
          <Link href="/dashboard/founder/startup/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl">
              Create Startup Profile
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {startups.map((startup) => {
            const currentTab = activeTabs[startup.id] || "activity";
            const teamSize = (startup.teamMembers?.length || 0) + 1;
            const pendingReqs = startup.requests?.length || 0;

            return (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200/80 rounded-[20px] shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Startup Header Banner */}
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-slate-50/50 via-white to-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                      {startup.logo ? (
                        <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-extrabold text-slate-900">{startup.name}</h3>
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                          {startup.stage} STAGE
                        </span>
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                          {startup.industry}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">{startup.description}</p>
                    </div>
                  </div>

                  {/* 6 Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <Link href={`/dashboard/founder/startup/${startup.id}`}>
                      <Button size="sm" variant="outline" className="font-bold text-xs rounded-xl flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Open Workspace
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      disabled={startingMeetingId === startup.id}
                      onClick={() => onStartMeeting(startup.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      {startingMeetingId === startup.id ? "Launching..." : "Pitch Room"}
                    </Button>

                    <Link href={`/dashboard/founder/startup/${startup.id}#analytics`}>
                      <Button size="sm" variant="ghost" className="font-bold text-xs rounded-xl flex items-center gap-1">
                        <BarChart2 className="w-3.5 h-3.5 text-slate-500" /> Analytics
                      </Button>
                    </Link>

                    <Link href={`/dashboard/founder/startup/${startup.id}#documents`}>
                      <Button size="sm" variant="ghost" className="font-bold text-xs rounded-xl flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-500" /> Docs
                      </Button>
                    </Link>

                    <Link href={`/dashboard/founder/startup/${startup.id}#team`}>
                      <Button size="sm" variant="ghost" className="font-bold text-xs rounded-xl flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" /> Team ({teamSize})
                      </Button>
                    </Link>

                    <Link href={`/dashboard/founder/startup/${startup.id}`}>
                      <Button size="sm" variant="secondary" className="font-bold text-xs rounded-xl flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800">
                        <Settings className="w-3.5 h-3.5" /> Manage Startup
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Key Metrics Quick Ribbon */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100 bg-slate-50/50 text-xs">
                  <div className="p-4 border-r border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Funding Target</span>
                    <span className="font-black text-slate-900 text-sm">{startup.fundingNeeded || "$500,000"}</span>
                  </div>
                  <div className="p-4 border-r border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Team Members</span>
                    <span className="font-black text-slate-900 text-sm">{teamSize} Active</span>
                  </div>
                  <div className="p-4 border-r border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Applications</span>
                    <span className="font-black text-blue-600 text-sm">{pendingReqs} Requests</span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Open Positions</span>
                    <span className="font-black text-emerald-600 text-sm">
                      {startup.requiredRoles?.length ? startup.requiredRoles.length : "2 Roles"}
                    </span>
                  </div>
                </div>

                {/* Startup Sub-Tabs */}
                <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex gap-2 overflow-x-auto">
                  {(
                    [
                      { id: "activity", label: "Recent Activity", icon: Clock },
                      { id: "requests", label: `Pending Requests (${pendingReqs})`, icon: Inbox },
                      { id: "hiring", label: "Hiring Queue", icon: Briefcase },
                      { id: "funding", label: "Funding Status", icon: Zap },
                      { id: "roadmap", label: "Roadmap Progress", icon: Layers },
                      { id: "documents", label: "Recent Documents", icon: FileText }
                    ] as const
                  ).map((tb) => {
                    const TbIcon = tb.icon;
                    const isActive = currentTab === tb.id;
                    return (
                      <button
                        key={tb.id}
                        onClick={() => setTab(startup.id, tb.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        <TbIcon className="w-3.5 h-3.5" />
                        {tb.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-Tab Content View */}
                <div className="p-6 bg-slate-50/30">
                  {currentTab === "activity" && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-slate-800">Pitch room WebRTC session initiated</span>
                        </div>
                        <span className="text-[10px] text-slate-400">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-slate-800">New team member application received</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Yesterday</span>
                      </div>
                    </div>
                  )}

                  {currentTab === "requests" && (
                    <div className="space-y-3 text-xs">
                      {pendingReqs === 0 ? (
                        <p className="text-slate-400 italic text-center py-4">No pending request applications right now.</p>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                          <span className="font-bold text-blue-900">You have {pendingReqs} pending requests in your Mailbox.</span>
                          <Link href="/inbox">
                            <Button size="sm" className="bg-blue-600 text-white text-xs font-bold">Review in Inbox</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {currentTab === "hiring" && (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-slate-700">Actively Recruiting Roles:</p>
                      <div className="flex flex-wrap gap-2">
                        {(startup.requiredRoles?.length ? startup.requiredRoles : ["Staff AI Engineer", "Full Stack Lead", "Product Designer"]).map(role => (
                          <span key={role} className="bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-800 shadow-2xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentTab === "funding" && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Funding Round: Seed ($1.4M target)</span>
                        <span className="text-blue-600">65% Committed</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[65%]" />
                      </div>
                    </div>
                  )}

                  {currentTab === "roadmap" && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-800">Q3 2026: Multi-Tenant Enterprise Workspace Launch</span>
                      </div>
                    </div>
                  )}

                  {currentTab === "documents" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-slate-800">Investor Pitch Deck 2026.pdf</span>
                        </div>
                        <span className="text-[10px] text-blue-600 font-bold">View PDF</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
