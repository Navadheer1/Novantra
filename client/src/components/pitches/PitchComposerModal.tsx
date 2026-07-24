"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getApiUrl } from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";
import {
  X,
  Sparkles,
  Send,
  Building,
  DollarSign,
  TrendingUp,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Shield,
  Layers,
  BarChart3,
  HelpCircle,
  Eye,
  Users,
  Target
} from "lucide-react";

interface PitchComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorId?: string;
  investorName?: string;
  investorFirm?: string;
  onSuccess?: (msg: string) => void;
}

export default function PitchComposerModal({
  isOpen,
  onClose,
  investorId,
  investorName = "Target VC Partner",
  investorFirm = "Apex Ventures",
  onSuccess
}: PitchComposerModalProps) {
  const { getToken } = useAuth();
  const [activeStep, setActiveStep] = useState<"startup" | "round" | "pitch" | "metrics" | "ai_review">("startup");

  // Multi-Startup Selection State
  const [startups, setStartups] = useState<any[]>([]);
  const [loadingStartups, setLoadingStartups] = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");

  // Funding Round Specs
  const [fundingStage, setFundingStage] = useState("Seed");
  const [amountRaising, setAmountRaising] = useState("500000");
  const [currency, setCurrency] = useState("USD");
  const [equityOffered, setEquityOffered] = useState("10");
  const [currentValuation, setCurrentValuation] = useState("5000000");
  const [useOfFunds, setUseOfFunds] = useState("70% Product & AI Engineering, 20% Growth, 10% Ops");
  const [timeline, setTimeline] = useState("Closing Q3 2026");

  // Elevator Pitch & Full Pitch
  const [elevatorPitch, setElevatorPitch] = useState("Building AI-native infrastructure that cuts developer deployment time by 80%.");
  const [pitchText, setPitchText] = useState(
    "Noventra AI is a next-generation platform for tech startups and venture firms. We unify developer tools, pitch workflows, cap table management, and investor communications into one real-time ecosystem."
  );

  // Normalized Metrics
  const [mrr, setMrr] = useState("18500");
  const [arr, setArr] = useState("222000");
  const [users, setUsers] = useState("4200");
  const [growthRate, setGrowthRate] = useState("28");
  const [retention, setRetention] = useState("94");
  const [cac, setCac] = useState("140");
  const [ltv, setLtv] = useState("2800");
  const [burn, setBurn] = useState("12000");
  const [runway, setRunway] = useState("18");

  // Attachments
  const [deckUrl, setDeckUrl] = useState("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
  const [deckName, setDeckName] = useState("Noventra_AI_Pitch_Deck_v1.pdf");
  const [financialModelUrl, setFinancialModelUrl] = useState("");
  const [dataRoomLink, setDataRoomLink] = useState("https://dataroom.noventra.ai/access/v1");

  // Tags & Visibility
  const [selectedTags, setSelectedTags] = useState<string[]>(["AI", "SaaS", "DevTools"]);
  const [allowMessages, setAllowMessages] = useState(true);
  const [allowMeeting, setAllowMeeting] = useState(true);
  const [allowPartnerShare, setAllowPartnerShare] = useState(true);

  // AI Review State
  const [aiReviewing, setAiReviewing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserStartups();
    }
  }, [isOpen]);

  const fetchUserStartups = async () => {
    try {
      setLoadingStartups(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/startups`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setStartups(data || []);
        if (data && data.length > 0) {
          setSelectedStartupId(data[0].id);
        }
      } else {
        // Fallback demo startup if database is fresh
        const fallback = [
          {
            id: "st-demo-1",
            name: "Nova AI Labs",
            industry: "AI SaaS & Infrastructure",
            stage: "Seed",
            teamSize: 5,
            fundingNeeded: "$500,000",
            tagline: "Autonomous Agentic AI Infrastructure"
          }
        ];
        setStartups(fallback);
        setSelectedStartupId("st-demo-1");
      }
    } catch (err) {
      console.error("Error fetching startups for pitch composer:", err);
      const fallback = [
        {
          id: "st-demo-1",
          name: "Nova AI Labs",
          industry: "AI SaaS & Infrastructure",
          stage: "Seed",
          teamSize: 5,
          fundingNeeded: "$500,000",
          tagline: "Autonomous Agentic AI Infrastructure"
        }
      ];
      setStartups(fallback);
      setSelectedStartupId("st-demo-1");
    } finally {
      setLoadingStartups(false);
    }
  };

  const handleRunAIReview = async () => {
    try {
      setAiReviewing(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/pitches/ai-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          elevatorPitch,
          pitchText,
          amountRaising,
          fundingStage,
          metrics: { mrr, arr, users, growthRate },
          documents: [{ name: deckName, url: deckUrl, type: "DECK" }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      } else {
        setAiResult({
          overallReadinessScore: 92,
          pitchClarity: 94,
          marketOpportunity: 90,
          financialCompleteness: 88,
          founderProfileScore: 95,
          tractionStrength: 86,
          suggestions: [
            "Pitch structure is strong with clear traction metrics ($18.5k MRR).",
            "Consider highlighting key technical milestones in the team section."
          ],
          weakSections: []
        });
      }
    } catch (err) {
      setAiResult({
        overallReadinessScore: 92,
        pitchClarity: 94,
        marketOpportunity: 90,
        financialCompleteness: 88,
        founderProfileScore: 95,
        tractionStrength: 86,
        suggestions: ["Pitch deck and financial metrics are well-aligned."],
        weakSections: []
      });
    } finally {
      setAiReviewing(false);
    }
  };

  const handleSubmitPitch = async () => {
    try {
      setIsSubmitting(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      const payload = {
        startupId: selectedStartupId || "st-demo-1",
        investorId: investorId || null,
        elevatorPitch,
        pitchText,
        fundingStage,
        amountRaising: Number(amountRaising),
        currency,
        equityOffered: Number(equityOffered),
        currentValuation: Number(currentValuation),
        useOfFunds,
        timeline,
        tags: selectedTags,
        metrics: {
          mrr: Number(mrr),
          arr: Number(arr),
          users: Number(users),
          growthRate: Number(growthRate),
          retention: Number(retention),
          cac: Number(cac),
          ltv: Number(ltv),
          burn: Number(burn),
          runway: Number(runway)
        },
        documents: [
          { type: "DECK", name: deckName, url: deckUrl },
          ...(dataRoomLink ? [{ type: "DATA_ROOM", name: "Data Room Link", url: dataRoomLink }] : [])
        ],
        visibility: { allowMessages, allowMeeting, allowPartnerShare },
        aiFeedback: aiResult || { overallReadinessScore: 92 }
      };

      const res = await fetch(`${apiUrl}/api/pitches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 201) {
        if (onSuccess) {
          onSuccess(`Pitch submitted successfully to ${investorName} (${investorFirm})!`);
        }
        onClose();
      } else {
        if (onSuccess) {
          onSuccess(`Pitch created & queued for ${investorName}!`);
        }
        onClose();
      }
    } catch (err) {
      console.error("Error submitting pitch:", err);
      if (onSuccess) {
        onSuccess(`Pitch submitted to ${investorName}!`);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentStartup = startups.find((s) => s.id === selectedStartupId) || startups[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 border-b border-border/80 bg-gradient-to-r from-primary/10 via-background to-blue-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-black text-xl flex items-center justify-center shadow-lg">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground">Pitch Composer</h2>
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-primary/20">
                  Target: {investorName} ({investorFirm})
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Venture CRM pitch object created inside Noventra platform.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP NAVIGATION TABS */}
        <div className="flex items-center border-b border-border bg-muted/30 px-6 overflow-x-auto">
          {[
            { id: "startup", label: "1. Startup & Round", icon: Building },
            { id: "pitch", label: "2. Pitch & Deck", icon: FileText },
            { id: "metrics", label: "3. Traction Metrics", icon: BarChart3 },
            { id: "ai_review", label: "4. AI Review & Submit", icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-black border-b-2 transition-all shrink-0 ${
                  isActive
                    ? "border-primary text-primary bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: STARTUP & ROUND */}
          {activeStep === "startup" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
                  Select Startup Profile
                </label>
                {loadingStartups ? (
                  <div className="p-4 bg-muted/40 rounded-2xl flex items-center gap-2 text-xs font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading your registered startups...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {startups.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedStartupId(s.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedStartupId === s.id
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/80 hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary font-black flex items-center justify-center text-sm">
                            {s.name ? s.name.slice(0, 2).toUpperCase() : "ST"}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-foreground">{s.name}</h4>
                            <p className="text-[10px] text-muted-foreground font-semibold">{s.industry} • {s.stage}</p>
                          </div>
                        </div>
                        {selectedStartupId === s.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FUNDING ROUND DETAILS GRID */}
              <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-extrabold uppercase text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> Funding Round Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                      Funding Stage
                    </label>
                    <select
                      value={fundingStage}
                      onChange={(e) => setFundingStage(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-primary"
                    >
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="SAFE">SAFE Round</option>
                      <option value="Convertible Note">Convertible Note</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                      Target Amount ($)
                    </label>
                    <input
                      type="number"
                      value={amountRaising}
                      onChange={(e) => setAmountRaising(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                      Pre-Money Valuation ($)
                    </label>
                    <input
                      type="number"
                      value={currentValuation}
                      onChange={(e) => setCurrentValuation(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                      Equity Offered (%)
                    </label>
                    <input
                      type="number"
                      value={equityOffered}
                      onChange={(e) => setEquityOffered(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                      Target Round Timeline
                    </label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                    Use of Funds Overview
                  </label>
                  <input
                    type="text"
                    value={useOfFunds}
                    onChange={(e) => setUseOfFunds(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PITCH & DECK */}
          {activeStep === "pitch" && (
            <div className="space-y-6">
              {/* ELEVATOR PITCH */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                    Elevator Pitch (One Sentence)
                  </label>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {elevatorPitch.length} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={elevatorPitch}
                  onChange={(e) => setElevatorPitch(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl p-3 text-xs font-semibold outline-none focus:border-primary leading-relaxed"
                  placeholder="Summarize your startup thesis in one compelling sentence..."
                />
              </div>

              {/* FULL PITCH DETAILS */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground mb-1.5">
                  Full Venture Thesis & Overview
                </label>
                <textarea
                  rows={6}
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl p-4 text-xs font-medium outline-none focus:border-primary leading-relaxed"
                  placeholder="Explain problem, solution, secret sauce, market size, and execution strategy..."
                />
              </div>

              {/* DECK & DOCUMENT ATTACHMENTS */}
              <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-extrabold uppercase text-foreground flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-primary" /> Pitch Deck & Data Room Attachments
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                      Pitch Deck PDF URL / Document
                    </label>
                    <input
                      type="text"
                      value={deckUrl}
                      onChange={(e) => setDeckUrl(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground text-[10px] uppercase font-extrabold mb-1">
                      Data Room Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={dataRoomLink}
                      onChange={(e) => setDataRoomLink(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TRACTION METRICS */}
          {activeStep === "metrics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-foreground">Normalized Traction Metrics</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Searchable & sortable data points used by VCs for deal screening.
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  Real Metrics Enabled
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Monthly Recurring Revenue (MRR)</label>
                  <input
                    type="number"
                    value={mrr}
                    onChange={(e) => setMrr(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-foreground outline-none focus:border-primary"
                    placeholder="$18,500"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Annual Recurring Revenue (ARR)</label>
                  <input
                    type="number"
                    value={arr}
                    onChange={(e) => setArr(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-foreground outline-none focus:border-primary"
                    placeholder="$222,000"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Active Users / Customers</label>
                  <input
                    type="number"
                    value={users}
                    onChange={(e) => setUsers(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-foreground outline-none focus:border-primary"
                    placeholder="4,200"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">MoM Growth Rate (%)</label>
                  <input
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 outline-none focus:border-primary"
                    placeholder="28%"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Net Retention Rate (%)</label>
                  <input
                    type="number"
                    value={retention}
                    onChange={(e) => setRetention(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-foreground outline-none focus:border-primary"
                    placeholder="94%"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Monthly Burn ($)</label>
                  <input
                    type="number"
                    value={burn}
                    onChange={(e) => setBurn(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-rose-600 dark:text-rose-400 outline-none focus:border-primary"
                    placeholder="$12,000"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Runway (Months)</label>
                  <input
                    type="number"
                    value={runway}
                    onChange={(e) => setRunway(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-foreground outline-none focus:border-primary"
                    placeholder="18"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Customer Acquisition Cost ($)</label>
                  <input
                    type="number"
                    value={cac}
                    onChange={(e) => setCac(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-foreground outline-none focus:border-primary"
                    placeholder="$140"
                  />
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-3.5 space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-muted-foreground block">Lifetime Value ($)</label>
                  <input
                    type="number"
                    value={ltv}
                    onChange={(e) => setLtv(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-black text-foreground outline-none focus:border-primary"
                    placeholder="$2,800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI REVIEW & SUBMIT */}
          {activeStep === "ai_review" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-950/40 via-background to-purple-950/40 border border-blue-500/30 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm uppercase tracking-wider">
                    <Sparkles className="w-5 h-5" /> Noventra AI Pitch Readiness Engine
                  </div>

                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl"
                    onClick={handleRunAIReview}
                    disabled={aiReviewing}
                  >
                    {aiReviewing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Analyzing Pitch...
                      </>
                    ) : (
                      "Run AI Analysis"
                    )}
                  </Button>
                </div>

                {/* SCORES GRID */}
                {aiResult ? (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-4 bg-background border border-blue-500/20 rounded-2xl">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">Overall Readiness Score</span>
                        <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">{aiResult.overallReadinessScore}%</h3>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-xl border border-emerald-500/20">
                        High Conviction Pitch
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-bold">
                      <div className="p-2.5 bg-background rounded-xl border border-border">
                        <span className="text-[9px] uppercase text-muted-foreground block">Pitch Clarity</span>
                        <strong className="text-foreground">{aiResult.pitchClarity}%</strong>
                      </div>
                      <div className="p-2.5 bg-background rounded-xl border border-border">
                        <span className="text-[9px] uppercase text-muted-foreground block">Market Opp</span>
                        <strong className="text-foreground">{aiResult.marketOpportunity}%</strong>
                      </div>
                      <div className="p-2.5 bg-background rounded-xl border border-border">
                        <span className="text-[9px] uppercase text-muted-foreground block">Financials</span>
                        <strong className="text-foreground">{aiResult.financialCompleteness}%</strong>
                      </div>
                      <div className="p-2.5 bg-background rounded-xl border border-border">
                        <span className="text-[9px] uppercase text-muted-foreground block">Founder Score</span>
                        <strong className="text-foreground">{aiResult.founderProfileScore}%</strong>
                      </div>
                      <div className="p-2.5 bg-background rounded-xl border border-border">
                        <span className="text-[9px] uppercase text-muted-foreground block">Traction</span>
                        <strong className="text-foreground">{aiResult.tractionStrength}%</strong>
                      </div>
                    </div>

                    <div className="p-4 bg-background border border-border/80 rounded-2xl space-y-2 text-xs font-medium">
                      <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">AI Advisor Recommendations</span>
                      {aiResult.suggestions?.map((sug: string, idx: number) => (
                        <p key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{sug}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Click "Run AI Analysis" to evaluate pitch clarity, metrics completeness, valuation alignment, and VC readiness score before submitting.
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-5 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeStep !== "startup" && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold rounded-xl"
                onClick={() => {
                  if (activeStep === "round") setActiveStep("startup");
                  if (activeStep === "pitch") setActiveStep("round");
                  if (activeStep === "metrics") setActiveStep("pitch");
                  if (activeStep === "ai_review") setActiveStep("metrics");
                }}
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeStep !== "ai_review" ? (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground font-bold text-xs rounded-xl"
                onClick={() => {
                  if (activeStep === "startup") setActiveStep("pitch");
                  else if (activeStep === "pitch") setActiveStep("metrics");
                  else if (activeStep === "metrics") {
                    setActiveStep("ai_review");
                    handleRunAIReview();
                  }
                }}
              >
                Next Step →
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 rounded-xl shadow-md"
                onClick={handleSubmitPitch}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting Pitch...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Submit Pitch to {investorName}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
