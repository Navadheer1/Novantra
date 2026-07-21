"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Reply,
  ReplyAll,
  Forward,
  Star,
  Bookmark,
  Archive,
  Trash2,
  Mail,
  Printer,
  Sparkles,
  CheckCircle2,
  XCircle,
  Video,
  FileText,
  Building2,
  Users,
  Briefcase,
  Zap,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MailItem } from "./MailboxList";

interface Props {
  mail: MailItem | null;
  onActionRequest?: (requestId: string, status: "ACCEPTED" | "REJECTED") => void;
  onOpenComposeReply?: (mail: MailItem) => void;
  onToggleStar?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function MailboxReadingPanel({
  mail,
  onActionRequest,
  onOpenComposeReply,
  onToggleStar,
  onToggleBookmark,
  onDelete
}: Props) {
  const [actionLoading, setActionLoading] = useState(false);

  if (!mail) {
    return (
      <div className="flex-1 bg-white p-12 flex flex-col items-center justify-center text-center space-y-4 h-full">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
          <Mail className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-extrabold text-slate-900">Select a Communication</h3>
          <p className="text-xs text-slate-500">
            Choose a message, job application, or investment pitch from the center list to view full details and interactive smart cards.
          </p>
        </div>
      </div>
    );
  }

  const raw = mail.rawPayload || {};
  const isRequest = mail.type === "request";
  const reqType = raw.requestType || "";
  const isJob = reqType === "JOB" || reqType === "INTERN" || reqType === "CO_FOUNDER";
  const isInvestment = reqType === "INVESTMENT";

  const handleSmartAction = async (status: "ACCEPTED" | "REJECTED") => {
    if (!onActionRequest || !raw.id) return;
    try {
      setActionLoading(true);
      await onActionRequest(raw.id, status);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
      {/* Top Reading Action Bar (ALWAYS MOUNTED & INTERACTIVE) */}
      <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-3 bg-slate-50/50">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenComposeReply && onOpenComposeReply(mail)}
            className="text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Reply className="w-3.5 h-3.5 text-blue-600" /> Reply
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenComposeReply && onOpenComposeReply(mail)}
            className="text-xs font-bold rounded-xl flex items-center gap-1 text-slate-600"
          >
            <Forward className="w-3.5 h-3.5" /> Forward
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {onToggleStar && (
            <button
              onClick={() => onToggleStar(mail.id)}
              className="p-2 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <Star className={`w-4 h-4 ${mail.starred ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
            </button>
          )}

          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(mail.id)}
              className="p-2 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${mail.bookmarked ? "fill-blue-600 text-blue-600" : "text-slate-400"}`} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(mail.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Mail Content View with Instant Fade/Slide Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mail.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
          {/* Subject & Category Pills */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {mail.category}
              </span>
              {mail.priority && (
                <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {mail.priority}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{mail.subject}</h2>
          </div>

          {/* Sender & Recipient Details */}
          <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-base border border-slate-200 overflow-hidden shrink-0">
                {mail.senderAvatar ? (
                  <img src={mail.senderAvatar} alt={mail.senderName} className="w-full h-full object-cover" />
                ) : (
                  mail.senderName[0]
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  {mail.senderName}
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {mail.senderRole}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 font-mono">{mail.senderEmail}</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-400">{mail.timestamp}</span>
          </div>

          {/* INTERACTIVE SMART CARDS */}
          {isRequest && isJob && (
            <div className="p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/80 rounded-2xl space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h4 className="font-extrabold text-sm text-slate-900">Interactive Job Application Smart Card</h4>
                </div>
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {reqType} Application
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Applicant</span>
                  <p className="font-bold text-slate-900">{mail.senderName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Target Startup</span>
                  <p className="font-bold text-slate-900">{mail.startupName || "Startup"}</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-2 flex items-center gap-3">
                {raw.status === "PENDING" ? (
                  <>
                    <Button
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleSmartAction("ACCEPTED")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Accept Candidate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionLoading}
                      onClick={() => handleSmartAction("REJECTED")}
                      className="font-bold text-xs px-4 rounded-xl flex items-center gap-1.5"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Reject Application
                    </Button>
                  </>
                ) : (
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                    raw.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
                  }`}>
                    {raw.status === "ACCEPTED" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    Application Status: {raw.status}
                  </div>
                )}
              </div>
            </div>
          )}

          {isRequest && isInvestment && (
            <div className="p-6 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-white border border-amber-200/80 rounded-2xl space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <h4 className="font-extrabold text-sm text-slate-900">VC Investment Pitch Smart Card</h4>
                </div>
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Capital Interest
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Investor <strong className="text-slate-900">{mail.senderName}</strong> submitted capital interest for startup <strong className="text-slate-900">{mail.startupName}</strong>.
              </p>

              <div className="pt-2 flex items-center gap-3">
                {raw.status === "PENDING" ? (
                  <>
                    <Button
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleSmartAction("ACCEPTED")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1.5"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Connect VC Partner
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionLoading}
                      onClick={() => handleSmartAction("REJECTED")}
                      className="font-bold text-xs px-4 rounded-xl flex items-center gap-1.5"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Decline Pitch
                    </Button>
                  </>
                ) : (
                  <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                    VC Connection Approved
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Body Content Area */}
          <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 font-sans text-xs leading-relaxed text-slate-800 whitespace-pre-wrap space-y-4">
            <p>{mail.preview || mail.subject}</p>

            {/* Quoted Thread History */}
            <div className="pt-4 border-t border-slate-200/80 text-slate-500 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Communication Log History</span>
              <p className="text-[11px] italic">
                On {mail.timestamp}, {mail.senderName} wrote: "{mail.preview}"
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
