"use client";

import React, { useState, memo } from "react";
import {
  Search,
  Star,
  Bookmark,
  Paperclip,
  ShieldCheck,
  Archive,
  Trash2,
  CheckSquare,
  Square
} from "lucide-react";
import { FolderId } from "./MailboxLeftSidebar";

export interface MailItem {
  id: string;
  type: "request" | "message" | "meeting" | "notification";
  senderName: string;
  senderEmail: string;
  senderRole: string;
  senderAvatar: string | null;
  startupName?: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  bookmarked: boolean;
  priority?: "URGENT" | "HIGH" | "MEDIUM" | "NORMAL";
  category: "Primary" | "Investors" | "Founders" | "Hiring" | "Funding" | "Meetings" | "Updates";
  hasAttachment?: boolean;
  rawPayload: any;
}

interface MailRowProps {
  mail: MailItem;
  isSelected: boolean;
  isChecked: boolean;
  onSelectMail: (mail: MailItem) => void;
  onHoverPrefetch?: (mail: MailItem) => void;
  onToggleSelectOne: (id: string, e: React.MouseEvent) => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

// Memoized Single Mail Row Item with mouseenter hover prefetching
const MailRowItem = memo(function MailRowItem({
  mail,
  isSelected,
  isChecked,
  onSelectMail,
  onHoverPrefetch,
  onToggleSelectOne,
  onToggleStar,
  onToggleBookmark
}: MailRowProps) {
  return (
    <div
      onClick={() => onSelectMail(mail)}
      onMouseEnter={() => onHoverPrefetch && onHoverPrefetch(mail)}
      className={`p-4 cursor-pointer transition-all flex items-start gap-3 relative group ${
        isSelected
          ? "bg-blue-50/70 border-l-4 border-l-blue-600"
          : mail.unread
          ? "bg-white font-semibold"
          : "bg-slate-50/40 text-slate-600 hover:bg-slate-100/60"
      }`}
    >
      {/* Select Checkbox */}
      <button
        onClick={(e) => onToggleSelectOne(mail.id, e)}
        className="mt-1 text-slate-300 hover:text-slate-600 transition-colors shrink-0"
      >
        {isChecked ? (
          <CheckSquare className="w-4 h-4 text-blue-600" />
        ) : (
          <Square className="w-4 h-4" />
        )}
      </button>

      {/* Sender Avatar */}
      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-slate-200 overflow-hidden shrink-0 relative">
        {mail.senderAvatar ? (
          <img src={mail.senderAvatar} alt={mail.senderName} className="w-full h-full object-cover" />
        ) : (
          mail.senderName[0]
        )}
        {mail.unread && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Mail Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-xs truncate ${mail.unread ? "font-black text-slate-900" : "font-bold text-slate-800"}`}>
              {mail.senderName}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/50 shrink-0">
              {mail.senderRole}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold shrink-0">{mail.timestamp}</span>
        </div>

        {mail.startupName && (
          <p className="text-[10px] font-bold text-slate-500 truncate">
            Startup: {mail.startupName}
          </p>
        )}

        <h5 className={`text-xs truncate ${mail.unread ? "font-bold text-slate-900" : "text-slate-700"}`}>
          {mail.subject}
        </h5>

        <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
          {mail.preview}
        </p>

        {/* Actions & Tag Row */}
        <div className="flex items-center justify-between pt-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {mail.category}
            </span>
            {mail.priority === "URGENT" && (
              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                Urgent
              </span>
            )}
            {mail.hasAttachment && <Paperclip className="w-3 h-3 text-slate-400" />}
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => onToggleStar(mail.id, e)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <Star className={`w-3.5 h-3.5 ${mail.starred ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
            </button>
            <button
              onClick={(e) => onToggleBookmark(mail.id, e)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <Bookmark className={`w-3.5 h-3.5 ${mail.bookmarked ? "fill-blue-600 text-blue-600" : "text-slate-400"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Single Skeleton Row Component
function MailRowSkeleton() {
  return (
    <div className="p-4 flex items-start gap-3 border-b border-slate-100 animate-pulse">
      <div className="w-4 h-4 bg-slate-200 rounded mt-1 shrink-0" />
      <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <div className="w-24 h-3 bg-slate-200 rounded" />
          <div className="w-12 h-3 bg-slate-200 rounded" />
        </div>
        <div className="w-36 h-3 bg-slate-200 rounded" />
        <div className="w-full h-3 bg-slate-150 rounded" />
      </div>
    </div>
  );
}

interface Props {
  mails: MailItem[];
  selectedMailId: string | null;
  onSelectMail: (mail: MailItem) => void;
  onHoverPrefetch?: (mail: MailItem) => void;
  activeFolder: FolderId;
  isLoaded: boolean;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onBulkArchive: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
}

export default function MailboxList({
  mails,
  selectedMailId,
  onSelectMail,
  onHoverPrefetch,
  activeFolder,
  isLoaded,
  onToggleStar,
  onToggleBookmark,
  onBulkArchive,
  onBulkDelete
}: Props) {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const categoryTabs = ["All", "Primary", "Investors", "Founders", "Hiring", "Funding", "Meetings"];

  const filteredMails = mails.filter((m) => {
    if (activeCategoryTab !== "All" && m.category !== activeCategoryTab) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.senderName.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchPreview = m.preview.toLowerCase().includes(q);
      const matchStartup = m.startupName ? m.startupName.toLowerCase().includes(q) : false;
      if (!matchName && !matchSubject && !matchPreview && !matchStartup) return false;
    }

    if (activeFolder === "unread") return m.unread;
    if (activeFolder === "starred") return m.starred;
    if (activeFolder === "bookmarks") return m.bookmarked;
    if (activeFolder === "applications" || activeFolder === "hiring") return m.category === "Hiring";
    if (activeFolder === "pitches" || activeFolder === "investors") return m.category === "Funding" || m.category === "Investors";
    if (activeFolder === "meetings") return m.category === "Meetings";

    return true;
  });

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full lg:w-96 shrink-0 bg-white border-r border-slate-200/80 flex flex-col h-full overflow-hidden">
      {/* Search & Header */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communications by name, startup, subject..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoryTabs.map((ct) => (
            <button
              key={ct}
              onClick={() => setActiveCategoryTab(ct)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                activeCategoryTab === ct
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {ct}
            </button>
          ))}
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in-50">
            <span className="font-extrabold text-blue-900 text-[11px]">{selectedIds.length} Selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onBulkArchive(selectedIds)}
                className="p-1 text-slate-700 hover:text-blue-600 font-bold flex items-center gap-1 text-[11px]"
              >
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
              <button
                onClick={() => onBulkDelete(selectedIds)}
                className="p-1 text-red-600 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mail Rows List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {!isLoaded ? (
          <>
            <MailRowSkeleton />
            <MailRowSkeleton />
            <MailRowSkeleton />
            <MailRowSkeleton />
            <MailRowSkeleton />
          </>
        ) : filteredMails.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No communications found in this folder.
          </div>
        ) : (
          filteredMails.map((mail) => (
            <MailRowItem
              key={mail.id}
              mail={mail}
              isSelected={selectedMailId === mail.id}
              isChecked={selectedIds.includes(mail.id)}
              onSelectMail={onSelectMail}
              onHoverPrefetch={onHoverPrefetch}
              onToggleSelectOne={toggleSelectOne}
              onToggleStar={onToggleStar}
              onToggleBookmark={onToggleBookmark}
            />
          ))
        )}
      </div>
    </div>
  );
}
