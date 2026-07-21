"use client";

import {
  Inbox,
  Mail,
  Star,
  Bookmark,
  Send,
  FileText,
  Archive,
  Clock,
  Trash2,
  ShieldAlert,
  Briefcase,
  Zap,
  Users,
  Building2,
  Video,
  FileCode,
  Bell,
  Sparkles,
  Settings,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type FolderId =
  | "inbox"
  | "unread"
  | "starred"
  | "important"
  | "sent"
  | "drafts"
  | "archive"
  | "scheduled"
  | "trash"
  | "spam"
  | "bookmarks"
  | "applications"
  | "pitches"
  | "hiring"
  | "founders"
  | "investors"
  | "meetings"
  | "team"
  | "documents"
  | "notifications";

interface Props {
  activeFolder: FolderId;
  onSelectFolder: (f: FolderId) => void;
  unreadCount: number;
  onOpenCompose: () => void;
  onOpenSettings: () => void;
}

export default function MailboxLeftSidebar({
  activeFolder,
  onSelectFolder,
  unreadCount,
  onOpenCompose,
  onOpenSettings
}: Props) {
  const primaryFolders: { id: FolderId; label: string; icon: any; badge?: number }[] = [
    { id: "inbox", label: "Inbox", icon: Inbox, badge: unreadCount },
    { id: "unread", label: "Unread", icon: Mail },
    { id: "starred", label: "Starred", icon: Star },
    { id: "important", label: "Important", icon: Zap },
    { id: "sent", label: "Sent", icon: Send },
    { id: "drafts", label: "Drafts", icon: FileText, badge: 2 },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "scheduled", label: "Scheduled", icon: Clock },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "trash", label: "Trash", icon: Trash2 },
    { id: "spam", label: "Spam", icon: ShieldAlert },
  ];

  const categoryFolders: { id: FolderId; label: string; icon: any }[] = [
    { id: "applications", label: "Applications", icon: Briefcase },
    { id: "pitches", label: "Investment Pitches", icon: Zap },
    { id: "hiring", label: "Hiring Requests", icon: Users },
    { id: "founders", label: "Founder Requests", icon: Building2 },
    { id: "investors", label: "Investor Requests", icon: Zap },
    { id: "meetings", label: "Meeting Invites", icon: Video },
    { id: "team", label: "Team Invitations", icon: Users },
    { id: "documents", label: "Shared Docs", icon: FileCode },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="w-full lg:w-64 shrink-0 bg-white border-r border-slate-200/80 p-4 space-y-6 flex flex-col h-full overflow-y-auto">
      {/* Large Compose Button */}
      <Button
        onClick={onOpenCompose}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
      >
        <Plus className="w-4 h-4" />
        <Sparkles className="w-4 h-4 text-amber-300" />
        Compose Communication
      </Button>

      {/* Primary Mail Folders */}
      <div className="space-y-1">
        <h4 className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Core Folders
        </h4>
        {primaryFolders.map((f) => {
          const FIcon = f.icon;
          const isSel = activeFolder === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFolder(f.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                isSel
                  ? "bg-blue-50 text-blue-600 font-extrabold border border-blue-200/60"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FIcon className={`w-4 h-4 ${isSel ? "text-blue-600" : "text-slate-400"}`} />
                <span>{f.label}</span>
              </div>

              {f.badge !== undefined && f.badge > 0 ? (
                <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {f.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Ecosystem Category Folders */}
      <div className="space-y-1">
        <h4 className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Ecosystem Categories
        </h4>
        {categoryFolders.map((f) => {
          const FIcon = f.icon;
          const isSel = activeFolder === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFolder(f.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                isSel
                  ? "bg-blue-50 text-blue-600 font-extrabold border border-blue-200/60"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FIcon className={`w-4 h-4 ${isSel ? "text-blue-600" : "text-slate-400"}`} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Settings Button */}
      <div className="pt-4 border-t border-slate-100 mt-auto">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
        >
          <Settings className="w-4 h-4 text-slate-500" /> Mailbox Settings
        </button>
      </div>
    </div>
  );
}
