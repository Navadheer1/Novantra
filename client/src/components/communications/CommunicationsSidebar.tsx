"use client";

import React from "react";
import { 
  Video, Plus, LogIn, Calendar, MessageSquare, PhoneCall, 
  Users, Building2, Briefcase, Code2, GraduationCap, Sparkles, 
  Bell, Clock, ShieldCheck, Layers, FileText, Activity
} from "lucide-react";

export type CommTab = 
  | "overview"
  | "meetings"
  | "quick_rooms"
  | "pitch_mode"
  | "startup_canvas"
  | "due_diligence"
  | "code_interview"
  | "product_review"
  | "founder_workspace";

interface CommSidebarProps {
  activeTab: CommTab;
  onSelectTab: (tab: CommTab) => void;
  onOpenNewMeeting: () => void;
  onOpenJoinMeeting: () => void;
  onOpenDiagnostic?: () => void;
}

export default function CommunicationsSidebar({
  activeTab,
  onSelectTab,
  onOpenNewMeeting,
  onOpenJoinMeeting,
  onOpenDiagnostic,
}: CommSidebarProps) {
  const primaryNav: Array<{ id: CommTab; label: string; icon: any; badge?: string }> = [
    { id: "overview", label: "Hub Overview", icon: Sparkles },
    { id: "meetings", label: "Meetings & Calls", icon: Video, badge: "Live" },
    { id: "quick_rooms", label: "Ecosystem Quick Rooms", icon: Users },
  ];

  const startupModes: Array<{ id: CommTab; label: string; icon: any; badge?: string }> = [
    { id: "pitch_mode", label: "Investor Pitch Mode", icon: Briefcase, badge: "Hot" },
    { id: "startup_canvas", label: "Collaborative Canvas", icon: Layers },
    { id: "due_diligence", label: "Due Diligence Room", icon: ShieldCheck, badge: "Secure" },
    { id: "code_interview", label: "Live Code Viewer", icon: Code2 },
    { id: "product_review", label: "Product UI Review", icon: Sparkles },
    { id: "founder_workspace", label: "Founder Sprint Workspace", icon: Building2 },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 rounded-[24px] p-4 shadow-xs space-y-4">
      
      {/* Quick Action CTAs */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onOpenNewMeeting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl p-3 shadow-xs flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Meeting</span>
        </button>

        <button
          type="button"
          onClick={onOpenJoinMeeting}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl p-2.5 flex items-center justify-center gap-2 transition-all border border-slate-200"
        >
          <LogIn className="w-4 h-4 text-blue-600" />
          <span>Join Room</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {primaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                  isActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Startup Specialized Rooms */}
      <div className="space-y-1 pt-2 border-t border-slate-100">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Startup Modes
        </div>

        {startupModes.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                  isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700 border border-blue-100"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Health Diagnostic Drawer Trigger */}
      {onOpenDiagnostic && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onOpenDiagnostic}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-amber-50/60 transition-all border border-transparent hover:border-amber-200/80"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <span>System Health</span>
            </div>
            <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              1 Issue
            </span>
          </button>
        </div>
      )}

    </aside>
  );
}
