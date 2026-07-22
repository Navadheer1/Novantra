"use client";

import React, { useState } from "react";
import { 
  Video, Plus, LogIn, Users, Briefcase, Code2, 
  ShieldCheck, Layers, Clock, Settings, ChevronDown, ChevronRight, Activity, LayoutGrid
} from "lucide-react";

export type CommTab = 
  | "meetings"
  | "rooms"
  | "workspaces"
  | "pitch_workspace"
  | "canvas_workspace"
  | "diligence_workspace"
  | "code_workspace"
  | "sprint_workspace"
  | "product_workspace"
  | "history"
  | "settings";

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
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);

  const mainNav: Array<{ id: CommTab; label: string; icon: any }> = [
    { id: "meetings", label: "Meetings", icon: Video },
    { id: "rooms", label: "Rooms", icon: Users },
  ];

  const workspacesList: Array<{ id: CommTab; label: string; icon: any }> = [
    { id: "pitch_workspace", label: "Investor Pitch", icon: Briefcase },
    { id: "product_workspace", label: "Product Design", icon: LayoutGrid },
    { id: "canvas_workspace", label: "Whiteboard", icon: Layers },
    { id: "diligence_workspace", label: "Due Diligence", icon: ShieldCheck },
    { id: "sprint_workspace", label: "Sprint Planning", icon: Clock },
    { id: "code_workspace", label: "Code Review", icon: Code2 },
  ];

  const isWorkspaceActive = [
    "workspaces", "pitch_workspace", "canvas_workspace", 
    "diligence_workspace", "code_workspace", "sprint_workspace", "product_workspace"
  ].includes(activeTab);

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs space-y-4 font-sans text-slate-800">
      
      {/* Quick Action CTAs */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onOpenNewMeeting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl p-3 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Meeting</span>
        </button>

        <button
          type="button"
          onClick={onOpenJoinMeeting}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl p-2.5 flex items-center justify-center gap-2 transition-all border border-slate-200/80 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-blue-600" />
          <span>Join a Meeting</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Communications
        </div>

        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}

        {/* Workspaces Group */}
        <div className="space-y-1 pt-1">
          <button
            onClick={() => setWorkspacesExpanded(!workspacesExpanded)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isWorkspaceActive
                ? "bg-blue-50 text-blue-700 font-black border border-blue-100"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              <span>Workspaces</span>
            </div>
            {workspacesExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {workspacesExpanded && (
            <div className="pl-4 space-y-1">
              {workspacesList.map((ws) => {
                const Icon = ws.icon;
                const isActive = activeTab === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => onSelectTab(ws.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span className="truncate">{ws.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        <button
          onClick={() => onSelectTab("history")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>History</span>
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={() => onSelectTab("settings")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </div>
        </button>

      </div>

    </aside>
  );
}
