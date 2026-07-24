"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PitchStatusBadge from "./PitchStatusBadge";
import {
  X,
  Building,
  Sparkles,
  User,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  Share2,
  ShieldCheck,
  Award,
  Zap,
  Bookmark,
  ChevronRight,
  Send,
  Loader2
} from "lucide-react";

interface PitchViewerModalProps {
  pitch: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (pitchId: string, newStatus: string) => void;
  onActionSuccess?: (msg: string) => void;
}

export default function PitchViewerModal({
  pitch,
  isOpen,
  onClose,
  onStatusChange,
  onActionSuccess
}: PitchViewerModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "deck" | "metrics" | "diligence" | "notes" | "timeline">("overview");
  const [selectedVersion, setSelectedVersion] = useState<number>(1);

  // New Comment state
  const [newComment, setNewComment] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(true);
  const [commentsList, setCommentsList] = useState<any[]>(pitch?.comments || []);

  // Meeting Modal inline state
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("14:00");
  const [meetingAgenda, setMeetingAgenda] = useState("Discuss Seed Round terms & cap table expansion.");

  if (!isOpen || !pitch) return null;

  const startup = pitch.startup || { name: "Nova AI Labs", industry: "AI SaaS", stage: "Seed" };
  const founder = pitch.founder || { name: "Sarah Vance", email: "sarah@nova.ai", id: "user-demo-1" };
  const metrics = pitch.metrics || { mrr: 18500, arr: 222000, users: 4200, growthRate: 28, retention: 94, burn: 12000, runway: 18 };
  const aiSnapshot = pitch.aiSnapshot || { matchScore: 94, reasons: ["AI & SaaS Focus Match", "Fits Target Ticket Size", "Pre-Seed Alignment"] };
  const documents = pitch.documents || [{ name: "Noventra_Pitch_Deck_v1.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", type: "DECK" }];
  const activities = pitch.activities || [
    { action: "PITCH_SUBMITTED", details: "Submitted pitch deck raising $500,000", createdAt: new Date().toISOString() },
    { action: "VIEWED", details: "Reviewed by VC Partner", createdAt: new Date().toISOString() }
  ];
  const dueDiligence = pitch.dueDiligence || [
    { id: "dd-1", category: "LEGAL", title: "Certificate of Incorporation", status: "VERIFIED" },
    { id: "dd-2", category: "FINANCIAL", title: "Cap Table & Historical P&L", status: "PENDING" },
    { id: "dd-3", category: "TECH", title: "Product Architecture & Security Audit", status: "PENDING" },
    { id: "dd-4", category: "COMPLIANCE", title: "IP Transfer Agreements", status: "SUBMITTED" }
  ];

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const added = {
      id: `cm-${Date.now()}`,
      authorName: "Partner @ Noventra Capital",
      content: newComment,
      isInternal: isInternalComment,
      createdAt: new Date().toISOString()
    };
    setCommentsList([added, ...commentsList]);
    setNewComment("");
    if (onActionSuccess) {
      onActionSuccess(isInternalComment ? "Internal VC note added" : "Message sent to founder");
    }
  };

  const handleScheduleMeeting = () => {
    if (onStatusChange) {
      onStatusChange(pitch.id, "MEETING_REQUESTED");
    }
    if (onActionSuccess) {
      onActionSuccess(`Meeting scheduled with ${founder.name} for ${meetingDate || "Tomorrow"} ${meetingTime}!`);
    }
    setShowMeetingForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-emerald-500/10 via-background to-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
              {startup.name ? startup.name.slice(0, 2).toUpperCase() : "ST"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-foreground">{startup.name}</h2>
                <PitchStatusBadge status={pitch.status} />
                <span className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-black px-2.5 py-0.5 rounded-xl border border-blue-500/20 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Match {aiSnapshot.matchScore}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Founder:{" "}
                <Link href={`/profile/${founder.id}`} className="font-extrabold text-foreground hover:underline">
                  {founder.name}
                </Link>{" "}
                • Target: <strong className="text-foreground">${Number(pitch.amountRaising || 500000).toLocaleString()}</strong> ({pitch.fundingStage || startup.stage})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CRM SUB-NAVIGATION TABS */}
        <div className="flex items-center border-b border-border bg-muted/30 px-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Thesis", icon: Building },
            { id: "deck", label: "Deck & Documents", icon: FileText },
            { id: "metrics", label: "Traction Metrics", icon: TrendingUp },
            { id: "diligence", label: "Due Diligence (4)", icon: ShieldCheck },
            { id: "notes", label: `Notes (${commentsList.length})`, icon: MessageSquare },
            { id: "timeline", label: "Activity Timeline", icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? "border-primary text-primary bg-background shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL MAIN CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* ELEVATOR PITCH BANNER */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-primary block">Elevator Pitch</span>
                <p className="text-sm font-black text-foreground leading-relaxed">
                  "{pitch.elevatorPitch || "Building autonomous AI infrastructure for scalable cloud engineering."}"
                </p>
              </div>

              {/* AI MATCH SNAPSHOT & REASONS */}
              <div className="bg-muted/30 border border-border/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Investment Recommendation
                  </span>
                  <span className="text-xs font-black text-foreground">Score: {aiSnapshot.matchScore}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSnapshot.reasons?.map((reason: string, idx: number) => (
                    <span key={idx} className="text-xs font-bold text-foreground bg-background px-3 py-1 rounded-xl border border-border flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {reason}
                    </span>
                  ))}
                </div>
              </div>

              {/* FULL THESIS & ROUND SPECS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase text-foreground">Venture Thesis & Problem/Solution</h3>
                  <div className="p-4 bg-card border border-border/80 rounded-2xl text-xs text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                    {pitch.pitchText || "Noventra AI is a next-generation platform for tech startups and venture firms. We unify developer tools, pitch workflows, cap table management, and investor communications into one real-time ecosystem."}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase text-foreground">Round Specifications</h3>
                  <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2.5 text-xs font-semibold">
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Amount Raising</span>
                      <strong className="text-foreground">${Number(pitch.amountRaising || 500000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Pre-Money Valuation</span>
                      <strong className="text-foreground">${Number(pitch.currentValuation || 5000000).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Equity Offered</span>
                      <strong className="text-foreground">{pitch.equityOffered || 10}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{pitch.timeline || "Closing Q3 2026"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DECK & DOCUMENTS */}
          {activeTab === "deck" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-foreground">Pitch Deck Viewer & Version History</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Compare Deck versions (Deck v1 vs v2) and inspect attached financial models.
                  </p>
                </div>

                {/* VERSION SELECTOR */}
                <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setSelectedVersion(1)}
                    className={`px-3 py-1 rounded-lg transition-all ${selectedVersion === 1 ? "bg-background shadow-xs text-foreground font-black" : "text-muted-foreground"}`}
                  >
                    Deck v1 (Initial)
                  </button>
                  <button
                    onClick={() => setSelectedVersion(2)}
                    className={`px-3 py-1 rounded-lg transition-all ${selectedVersion === 2 ? "bg-background shadow-xs text-foreground font-black" : "text-muted-foreground"}`}
                  >
                    Deck v2 (Updated)
                  </button>
                </div>
              </div>

              {/* EMBEDDED PDF DECK PREVIEWER */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
                <FileText className="w-12 h-12 text-primary animate-pulse" />
                <div>
                  <h4 className="text-base font-black text-foreground">
                    {selectedVersion === 2 ? "Noventra_Pitch_Deck_v2_Updated.pdf" : "Noventra_Pitch_Deck_v1.pdf"}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {selectedVersion === 2 ? "Uploaded 2 days ago with updated Q2 MRR numbers" : "Initial deck submitted with pitch"}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={documents[0]?.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-sm hover:opacity-90 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Open Fullscreen Deck PDF
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: METRICS */}
          {activeTab === "metrics" && (
            <div className="space-y-6">
              <h3 className="text-sm font-black text-foreground">Normalized Traction Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">MRR</span>
                  <strong className="text-xl font-black text-foreground">${metrics.mrr?.toLocaleString() || "18,500"}</strong>
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">ARR</span>
                  <strong className="text-xl font-black text-foreground">${metrics.arr?.toLocaleString() || "222,000"}</strong>
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">MoM Growth Rate</span>
                  <strong className="text-xl font-black text-emerald-600 dark:text-emerald-400">+{metrics.growthRate || 28}%</strong>
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Net Retention</span>
                  <strong className="text-xl font-black text-foreground">{metrics.retention || 94}%</strong>
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Monthly Burn</span>
                  <strong className="text-xl font-black text-rose-600 dark:text-rose-400">${metrics.burn?.toLocaleString() || "12,000"}</strong>
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Runway</span>
                  <strong className="text-xl font-black text-foreground">{metrics.runway || 18} Months</strong>
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Users</span>
                  <strong className="text-xl font-black text-foreground">{metrics.users?.toLocaleString() || "4,200"}</strong>
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">LTV / CAC</span>
                  <strong className="text-xl font-black text-foreground">20.0x</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DUE DILIGENCE */}
          {activeTab === "diligence" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-foreground">Due Diligence Checklist</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Review legal documents, cap table records, and security compliance files.
                  </p>
                </div>
                <span className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-black px-3 py-1 rounded-xl border border-cyan-500/20">
                  1 / 4 Verified
                </span>
              </div>

              <div className="space-y-3">
                {dueDiligence.map((item: any) => (
                  <div key={item.id} className="p-4 bg-card border border-border/80 rounded-2xl flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className={`w-5 h-5 ${item.status === "VERIFIED" ? "text-emerald-500" : "text-muted-foreground"}`} />
                      <div>
                        <span className="text-[9px] uppercase text-muted-foreground block font-black">{item.category}</span>
                        <h4 className="text-xs font-extrabold text-foreground">{item.title}</h4>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                      item.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTES & COMMENTS */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsInternalComment(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${isInternalComment ? "bg-purple-600 text-white" : "bg-muted text-muted-foreground"}`}
                  >
                    Internal VC Team Notes
                  </button>
                  <button
                    onClick={() => setIsInternalComment(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${!isInternalComment ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}
                  >
                    Message to Founder
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isInternalComment ? "Write internal note for your VC team..." : "Send direct message/question to founder..."}
                    className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                  />
                  <Button size="sm" className="bg-primary text-primary-foreground font-extrabold text-xs px-4 rounded-2xl shrink-0" onClick={handleAddComment}>
                    <Send className="w-3.5 h-3.5 mr-1" /> Post
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {commentsList.map((c: any) => (
                  <div key={c.id} className="p-4 bg-card border border-border/80 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground flex items-center gap-1.5">
                        {c.authorName}{" "}
                        {c.isInternal ? (
                          <span className="bg-purple-500/10 text-purple-600 text-[9px] px-2 py-0.5 rounded font-black">Internal VC</span>
                        ) : (
                          <span className="bg-blue-500/10 text-blue-600 text-[9px] px-2 py-0.5 rounded font-black">Shared</span>
                        )}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <h3 className="text-sm font-black text-foreground">Immutable Activity Timeline</h3>
              <div className="relative pl-6 space-y-4 border-l-2 border-primary/20">
                {activities.map((act: any, idx: number) => (
                  <div key={idx} className="relative space-y-1 text-xs">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />
                    <span className="text-[10px] font-extrabold uppercase text-primary block">{act.action}</span>
                    <p className="text-foreground font-bold">{act.details}</p>
                    <span className="text-[10px] text-muted-foreground block">{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-5 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3">
          {/* STATUS CHANGE SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-muted-foreground">Pipeline Stage:</span>
            <select
              value={pitch.status}
              onChange={(e) => {
                if (onStatusChange) onStatusChange(pitch.id, e.target.value);
                if (onActionSuccess) onActionSuccess(`Pipeline status updated to ${e.target.value}`);
              }}
              className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-extrabold text-foreground outline-none focus:border-primary"
            >
              <option value="SUBMITTED">Submitted / New</option>
              <option value="VIEWED">Viewed</option>
              <option value="INTERESTED">Interested</option>
              <option value="MEETING_REQUESTED">Meeting Requested</option>
              <option value="DUE_DILIGENCE">Due Diligence</option>
              <option value="PARTNER_REVIEW">Partner Review</option>
              <option value="TERM_SHEET">Term Sheet Issued</option>
              <option value="INVESTED">Invested ✓</option>
              <option value="REJECTED">Passed / Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-rose-500/30 text-rose-600 hover:bg-rose-500/10 rounded-xl"
              onClick={() => {
                if (onStatusChange) onStatusChange(pitch.id, "REJECTED");
                if (onActionSuccess) onActionSuccess(`Passed on pitch for ${startup.name}`);
              }}
            >
              Pass / Reject
            </Button>

            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl"
              onClick={() => setShowMeetingForm(true)}
            >
              <Calendar className="w-3.5 h-3.5 mr-1" /> Schedule Meeting
            </Button>

            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 rounded-xl shadow-md"
              onClick={() => {
                if (onStatusChange) onStatusChange(pitch.id, "DUE_DILIGENCE");
                if (onActionSuccess) onActionSuccess(`Started Due Diligence for ${startup.name}`);
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Advance to Diligence
            </Button>
          </div>
        </div>

        {/* INLINE MEETING FORM MODAL */}
        {showMeetingForm && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" /> Schedule Pitch Meeting
              </h3>

              <div className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-muted-foreground mb-1">Meeting Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Meeting Time</label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Agenda & Next Steps</label>
                  <textarea
                    rows={3}
                    value={meetingAgenda}
                    onChange={(e) => setMeetingAgenda(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-2 text-xs font-normal"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowMeetingForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="bg-purple-600 text-white font-bold" onClick={handleScheduleMeeting}>
                  Confirm Schedule
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
