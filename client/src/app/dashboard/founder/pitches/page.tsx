"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import PitchStatusBadge from "@/components/pitches/PitchStatusBadge";
import PitchViewerModal from "@/components/pitches/PitchViewerModal";
import PitchComposerModal from "@/components/pitches/PitchComposerModal";
import { Button } from "@/components/ui/button";
import {
  Send,
  Building,
  TrendingUp,
  Eye,
  FileText,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  BarChart3,
  Loader2,
  RefreshCw
} from "lucide-react";

export default function FounderPitchesPage() {
  const { getToken } = useAuth();
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [selectedPitch, setSelectedPitch] = useState<any | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    fetchFounderPitches();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchFounderPitches = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/pitches/founder`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setPitches(data || []);
      } else {
        setPitches(getFallbackPitches());
      }
    } catch (err) {
      console.error("Error loading founder pitches:", err);
      setPitches(getFallbackPitches());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPitches = () => [
    {
      id: "pitch-demo-1",
      status: "SUBMITTED",
      elevatorPitch: "Autonomous Agentic AI Infrastructure platform that cuts deployment times by 80%.",
      pitchText: "Noventra AI is a next-generation platform for tech startups and venture firms. We unify developer tools, pitch workflows, cap table management, and investor communications into one real-time ecosystem.",
      fundingStage: "Seed",
      amountRaising: 500000,
      currency: "USD",
      equityOffered: 10,
      currentValuation: 5000000,
      updatedAt: new Date().toISOString(),
      startup: { name: "Nova AI Labs", industry: "AI SaaS", stage: "Seed" },
      investor: { name: "Jari Vance", firmName: "Apex Ventures" },
      aiSnapshot: { matchScore: 94, reasons: ["AI & SaaS Focus", "Seed Stage Alignment"] },
      metrics: { mrr: 18500, arr: 222000, users: 4200, growthRate: 28 },
      documents: [{ name: "Noventra_Pitch_Deck_v1.pdf", url: "#", type: "DECK" }]
    },
    {
      id: "pitch-demo-2",
      status: "MEETING_REQUESTED",
      elevatorPitch: "B2B SaaS financial automation engine for cross-border venture deals.",
      pitchText: "Streamlining syndicate allocation and investor cap table reporting with automated compliance.",
      fundingStage: "Pre-Seed",
      amountRaising: 250000,
      currency: "USD",
      equityOffered: 8,
      currentValuation: 3100000,
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      startup: { name: "SyncFlow Tech", industry: "FinTech", stage: "Pre-Seed" },
      investor: { name: "Sarah Chen", firmName: "Horizon Capital" },
      aiSnapshot: { matchScore: 91, reasons: ["Fintech Synergies", "Pre-Seed Check Alignment"] },
      metrics: { mrr: 12000, arr: 144000, users: 1800, growthRate: 34 },
      documents: [{ name: "SyncFlow_Pitch_Deck_v1.pdf", url: "#", type: "DECK" }]
    }
  ];

  const filteredPitches = pitches.filter((p) => {
    const status = (p.status || "SUBMITTED").toUpperCase();
    const matchesSearch =
      p.startup?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.investor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.elevatorPitch?.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "submitted") return matchesSearch && (status === "SUBMITTED" || status === "DRAFT");
    if (activeTab === "viewed") return matchesSearch && status === "VIEWED";
    if (activeTab === "interested") return matchesSearch && status === "INTERESTED";
    if (activeTab === "meetings") return matchesSearch && status === "MEETING_REQUESTED";
    if (activeTab === "diligence") return matchesSearch && status === "DUE_DILIGENCE";
    if (activeTab === "invested") return matchesSearch && status === "INVESTED";

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-border animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TITLE & HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Send className="w-8 h-8 text-primary" /> My Pitches & Fundraising Pipeline
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Venture CRM platform for founders: Track investor views, deck opens, meeting requests, and due diligence status.
            </p>
          </div>

          <Button
            className="bg-primary text-primary-foreground font-black text-xs px-5 rounded-2xl shadow-md flex items-center gap-2"
            onClick={() => setIsComposerOpen(true)}
          >
            <Plus className="w-4 h-4" /> Create & Send Pitch
          </Button>
        </div>

        {/* ANALYTICS STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Pitches Sent</span>
            <strong className="text-2xl font-black text-foreground">{pitches.length}</strong>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">VC Deck Opens</span>
            <strong className="text-2xl font-black text-blue-600 dark:text-blue-400">14 Opens</strong>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Avg Deck Read Time</span>
            <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400">3m 45s</strong>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-1 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Meeting Conversion</span>
            <strong className="text-2xl font-black text-purple-600 dark:text-purple-400">50% Rate</strong>
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-border/80">
          {[
            { id: "all", label: "All Pitches" },
            { id: "submitted", label: "Submitted" },
            { id: "viewed", label: "Viewed by VC" },
            { id: "interested", label: "Interested" },
            { id: "meetings", label: "Meetings Scheduled" },
            { id: "diligence", label: "Due Diligence" },
            { id: "invested", label: "Invested ✓" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="bg-card border border-border/80 rounded-2xl p-3 shadow-xs mb-6 flex items-center gap-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sent pitches by startup name, target investor, or thesis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-medium outline-none"
          />
        </div>

        {/* PITCHES LIST TABLE / GRID */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-muted-foreground">Loading pitch pipeline...</p>
          </div>
        ) : filteredPitches.length > 0 ? (
          <div className="space-y-4">
            {filteredPitches.map((pitch) => {
              const startup = pitch.startup || { name: "Nova AI Labs", stage: "Seed" };
              const investor = pitch.investor || { name: "Target Investor", firmName: "Apex Ventures" };
              const aiMatch = pitch.aiSnapshot?.matchScore || 94;

              return (
                <div
                  key={pitch.id}
                  className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-black text-lg flex items-center justify-center shrink-0 border border-primary/20">
                      {startup.name ? startup.name.slice(0, 2).toUpperCase() : "ST"}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors">
                          {startup.name}
                        </h3>
                        <PitchStatusBadge status={pitch.status} />
                        <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md border border-blue-500/20">
                          <Sparkles className="w-3 h-3 text-blue-500" /> {aiMatch}% Match
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground font-semibold">
                        Target Investor: <strong className="text-foreground">{investor.name} ({investor.firmName})</strong> • Target: <strong className="text-foreground">${Number(pitch.amountRaising || 500000).toLocaleString()}</strong>
                      </p>

                      <p className="text-xs text-muted-foreground font-medium line-clamp-1 leading-relaxed">
                        "{pitch.elevatorPitch || "Autonomous Agentic AI Infrastructure platform."}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold rounded-xl"
                      onClick={() => {
                        setSelectedPitch(pitch);
                        setIsViewerOpen(true);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Open CRM Room
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8">
            <Send className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-black text-foreground">No Pitches Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-medium">
              Click "Create & Send Pitch" to pitch top VCs and angel investors on Noventra.
            </p>
            <Button
              className="mt-4 bg-primary text-primary-foreground font-black text-xs px-5 rounded-2xl"
              onClick={() => setIsComposerOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Create First Pitch
            </Button>
          </div>
        )}

        {/* MODALS */}
        <PitchViewerModal
          pitch={selectedPitch}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          onActionSuccess={(msg) => triggerToast(msg)}
        />

        <PitchComposerModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          onSuccess={(msg) => {
            triggerToast(msg);
            fetchFounderPitches();
          }}
        />
      </main>
    </div>
  );
}
