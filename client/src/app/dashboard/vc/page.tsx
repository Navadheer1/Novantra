"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, Building2, Search, Send, Clock, CheckCircle2, XCircle, Sparkles, 
  Eye, Loader2, TrendingUp, DollarSign, Users, Layers, Filter, Bookmark, 
  Plus, Calendar, MessageSquare, FileText, ArrowRight, ShieldCheck, ChevronRight,
  BarChart3, Check, Trash2, SlidersHorizontal, Share2, Award, Zap, Compass,
  LayoutDashboard, PieChart, Bell, Settings, LogOut, Phone, Scale, RefreshCw, X
} from "lucide-react";
import Link from "next/link";
import PitchKanbanBoard from "@/components/pitches/PitchKanbanBoard";
import PitchViewerModal from "@/components/pitches/PitchViewerModal";

interface MetricCards {
  totalStartups: number;
  portfolioCount: number;
  pendingMeetings: number;
  activeDeals: number;
  todaysCallsCount: number;
  unreadMessagesCount: number;
  totalInvestmentValue: number;
  avgStartupScore: number;
}

interface StartupItem {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  tagline: string | null;
  industry: string;
  stage: string;
  location: string;
  teamSize: number;
  fundingNeeded: string | null;
  mrr: number;
  arr: number;
  growthRate: number;
  burnRate: number;
  runway: number;
  valuation: number;
  foundedYear: number;
  aiMatchScore: number;
  matchReasons: string[];
  isSaved: boolean;
  pipelineStage: string | null;
  investorInterestCount: number;
  isVerified: boolean;
  isTrending: boolean;
  founder: {
    id: string;
    name: string;
    avatarUrl: string | null;
    email: string;
    location: string | null;
  };
}

interface PipelineItem {
  id: string;
  stage: string;
  priority: string;
  notes: string | null;
  targetTicket: number | null;
  startup: StartupItem;
}

interface PortfolioItem {
  id: string;
  amountInvested: number;
  currentValuation: number;
  entryValuation: number;
  ownershipPct: number;
  entryStage: string;
  investedAt: string;
  healthScore: number;
  nextMilestone: string | null;
  startup: StartupItem;
}

export default function VCDashboard() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState<
    "DASHBOARD" | "DISCOVER" | "PIPELINE" | "PORTFOLIO" | "SAVED" | "MEETINGS" | "MESSAGES" | "DOCUMENTS" | "ANALYTICS" | "PROFILE"
  >("DASHBOARD");

  // Data states
  const [metrics, setMetrics] = useState<MetricCards>({
    totalStartups: 0,
    portfolioCount: 0,
    pendingMeetings: 0,
    activeDeals: 0,
    todaysCallsCount: 0,
    unreadMessagesCount: 0,
    totalInvestmentValue: 1250000,
    avgStartupScore: 88,
  });

  const [startups, setStartups] = useState<StartupItem[]>([]);
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [savedList, setSavedList] = useState<any[]>([]);
  const [pitchesList, setPitchesList] = useState<any[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<any | null>(null);
  const [isPitchViewerOpen, setIsPitchViewerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("ALL");
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [sortBy, setSortBy] = useState("highest_match");

  // Selection & Modal states
  const [selectedStartup, setSelectedStartup] = useState<StartupItem | null>(null);
  const [comparedStartups, setComparedStartups] = useState<StartupItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else {
        loadInvestorPlatformData();
      }
    }
  }, [clerkLoaded, clerkUser]);


  const loadInvestorPlatformData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Load Dashboard Metrics
      const dashRes = await fetch(`${apiUrl}/api/investor/dashboard`, { headers });
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setMetrics(dashData.metrics);
      }

      // 2. Load Discover Feed
      const queryParams = new URLSearchParams({
        industry: selectedIndustry,
        stage: selectedStage,
        search: searchQuery,
        sort: sortBy,
      });

      const discRes = await fetch(`${apiUrl}/api/investor/discover?${queryParams.toString()}`, { headers });
      if (discRes.ok) {
        const discData = await discRes.json();
        setStartups(discData);
      }

      // 3. Load Pipeline
      const pipeRes = await fetch(`${apiUrl}/api/investor/pipeline`, { headers });
      if (pipeRes.ok) {
        const pipeData = await pipeRes.json();
        setPipeline(pipeData);
      }

      // 4. Load Portfolio
      const portRes = await fetch(`${apiUrl}/api/investor/portfolio`, { headers });
      if (portRes.ok) {
        const portData = await portRes.json();
        setPortfolio(portData);
      }

      // 5. Load Saved
      const savedRes = await fetch(`${apiUrl}/api/investor/saved`, { headers });
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedList(savedData);
      }

      // 6. Load Incoming Pitch Objects
      const pitchesRes = await fetch(`${apiUrl}/api/pitches/investor`, { headers });
      if (pitchesRes.ok) {
        const pitchesData = await pitchesRes.json();
        setPitchesList(pitchesData);
      }

    } catch (err) {
      console.error("Error loading investor dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (startupId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${getApiUrl()}/api/investor/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startupId }),
      });

      if (res.ok) {
        const data = await res.json();
        setStartups(startups.map(s => s.id === startupId ? { ...s, isSaved: data.saved } : s));
        loadInvestorPlatformData();
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleUpdatePipelineStage = async (startupId: string, newStage: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${getApiUrl()}/api/investor/pipeline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startupId, stage: newStage }),
      });

      if (res.ok) {
        loadInvestorPlatformData();
      }
    } catch (err) {
      console.error("Pipeline update error:", err);
    }
  };

  const handleRequestPitch = async (startup: StartupItem) => {
    try {
      const token = await getToken();
      const res = await fetch(`${getApiUrl()}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startupId: startup.id,
          receiverFounderId: startup.founder.id,
          requestType: "INVESTMENT",
          message: `Hello ${startup.founder.name}, we evaluated ${startup.name} on Noventra and would love to review your pitch deck and schedule an introductory call.`,
        }),
      });

      if (res.ok) {
        alert(`Investment request & pitch inquiry sent to ${startup.name}!`);
        handleUpdatePipelineStage(startup.id, "CONTACTED");
      }
    } catch (err) {
      console.error("Request pitch error:", err);
    }
  };

  const handleInstantMeeting = async (startup: StartupItem) => {
    try {
      const token = await getToken();
      const res = await fetch(`${getApiUrl()}/api/meetings/instant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `VC Meeting: Noventra & ${startup.name}`,
          meetingType: "PITCH",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/meet/${data.meetingCode}`);
      }
    } catch (err) {
      console.error("Instant meeting error:", err);
    }
  };

  const toggleCompareStartup = (startup: StartupItem) => {
    if (comparedStartups.some(s => s.id === startup.id)) {
      setComparedStartups(comparedStartups.filter(s => s.id !== startup.id));
    } else {
      if (comparedStartups.length >= 4) {
        alert("You can compare up to 4 startups at a time.");
        return;
      }
      setComparedStartups([...comparedStartups, startup]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  };

  if (loading || !clerkLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-900 space-y-4 antialiased font-sans">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-slate-900">Loading Noventra VC Platform</h3>
          <p className="text-xs text-slate-500 font-mono">Syncing dealflow & database metrics...</p>
        </div>
      </div>
    );
  }

  const pipelineStages = [
    { key: "NEW", label: "New Deals", color: "bg-blue-50 border-blue-200 text-blue-800" },
    { key: "CONTACTED", label: "Contacted", color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
    { key: "MEETING_SCHEDULED", label: "Meeting Scheduled", color: "bg-purple-50 border-purple-200 text-purple-800" },
    { key: "DUE_DILIGENCE", label: "Due Diligence", color: "bg-amber-50 border-amber-200 text-amber-800" },
    { key: "NEGOTIATION", label: "Negotiation", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    { key: "COMMITTED", label: "Committed", color: "bg-teal-50 border-teal-200 text-teal-800" },
    { key: "INVESTED", label: "Invested", color: "bg-green-50 border-green-200 text-green-800" },
    { key: "PASSED", label: "Passed", color: "bg-slate-100 border-slate-200 text-slate-600" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased font-sans selection:bg-blue-100">
      
      {/* Top Main Navbar */}
      <Navbar />

      {/* Main VC Platform Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* 1. DESKTOP LEFT SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200/80 shrink-0 hidden md:flex flex-col justify-between py-5 px-3 z-20">
          <div className="space-y-6">
            
            {/* Header Badge */}
            <div className="px-3 py-2 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                  VC
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">Angel / VC Hub</h4>
                  <p className="text-[10px] text-blue-600 font-bold">Verified Investor</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1">
              {[
                { id: "DASHBOARD", label: "Dashboard", icon: LayoutDashboard },
                { id: "DISCOVER", label: "Discover Startups", icon: Compass, badge: startups.length },
                { id: "PIPELINE", label: "Investment Pipeline", icon: Layers, badge: pipeline.length },
                { id: "PORTFOLIO", label: "Portfolio", icon: Briefcase, badge: portfolio.length },
                { id: "SAVED", label: "Saved Startups", icon: Bookmark, badge: savedList.length },
                { id: "MEETINGS", label: "Meetings & Calls", icon: Calendar, badge: metrics.pendingMeetings },
                { id: "MESSAGES", label: "Deal Messages", icon: MessageSquare, badge: metrics.unreadMessagesCount },
                { id: "DOCUMENTS", label: "Data Room Files", icon: FileText },
                { id: "ANALYTICS", label: "Venture Analytics", icon: BarChart3 },
                { id: "PROFILE", label: "Investor Thesis", icon: Award },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer User Card */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-black text-xs text-blue-700">
                {clerkUser?.firstName?.[0] || "I"}
              </div>
              <div className="truncate min-w-0">
                <p className="text-xs font-extrabold text-slate-900 truncate">{clerkUser?.fullName || "Investor"}</p>
                <p className="text-[10px] text-slate-500 truncate">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* 2. MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Top Search & Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Omnibox */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadInvestorPlatformData()}
                  placeholder="Search startups, founders, technology, valuation, funding stage..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {comparedStartups.length > 0 && (
                  <Button
                    type="button"
                    onClick={() => setShowComparison(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl h-9 px-4 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare ({comparedStartups.length})</span>
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={loadInvestorPlatformData}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl h-9 px-3 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>

            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-blue-600" /> Filters:
              </span>

              {/* Industry Filter */}
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setTimeout(loadInvestorPlatformData, 100);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">All Industries</option>
                <option value="AI">AI & Machine Learning</option>
                <option value="SaaS">B2B SaaS</option>
                <option value="FinTech">FinTech & Web3</option>
                <option value="HealthTech">HealthTech & Biotech</option>
                <option value="DeepTech">DeepTech & Robotics</option>
                <option value="Climate">ClimateTech & Energy</option>
              </select>

              {/* Stage Filter */}
              <select
                value={selectedStage}
                onChange={(e) => {
                  setSelectedStage(e.target.value);
                  setTimeout(loadInvestorPlatformData, 100);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">All Funding Stages</option>
                <option value="PRE_SEED">Pre-Seed</option>
                <option value="SEED">Seed Round</option>
                <option value="SERIES_A">Series A</option>
                <option value="SERIES_B">Series B+</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setTimeout(loadInvestorPlatformData, 100);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-blue-700 border-blue-200 outline-none cursor-pointer"
              >
                <option value="highest_match">Sort by: AI Match Score</option>
                <option value="highest_growth">Sort by: Highest Growth %</option>
                <option value="trending">Sort by: Trending Dealflow</option>
                <option value="newest">Sort by: Newly Listed</option>
              </select>
            </div>
          </div>

          {/* 3. METRIC CARDS OVERVIEW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Evaluated</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{metrics.totalStartups}</p>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14 this week
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Deals</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{metrics.activeDeals}</p>
              <p className="text-[11px] text-purple-600 font-bold">In Pipeline Stages</p>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Portfolio Size</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{metrics.portfolioCount}</p>
              <p className="text-[11px] text-emerald-600 font-bold">Companies Backed</p>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Portfolio Value</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(metrics.totalInvestmentValue)}</p>
              <p className="text-[11px] text-indigo-600 font-bold">Est. Total Valuation</p>
            </div>

          </div>

          {/* 4. VIEW CONTENT SWITCHER */}
          
          {/* TAB A: DASHBOARD HOME & DISCOVER STARTUP FEED */}
          {(activeTab === "DASHBOARD" || activeTab === "DISCOVER") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Startup Dealflow Feed</h3>
                  <p className="text-xs text-slate-500">Real-time startup matches evaluated by AI compatibility engine</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {startups.length} Verified Startups
                </span>
              </div>

              {startups.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
                  <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">No Startups Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">Try clearing search or adjusting your industry/stage filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {startups.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 space-y-4 flex flex-col justify-between"
                    >
                      {/* Top Header Card */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center font-black text-blue-600 text-base">
                              {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover" /> : s.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-base font-black text-slate-900">{s.name}</h4>
                                {s.isVerified && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                                {s.isTrending && (
                                  <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                                    <Zap className="w-2.5 h-2.5" /> Trending
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-slate-500">{s.industry} • {s.location}</p>
                            </div>
                          </div>

                          {/* AI Match Score Badge */}
                          <div className="text-right shrink-0">
                            <div className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{s.aiMatchScore}% Match</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{s.investorInterestCount} VCs viewing</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                          {s.tagline || s.description}
                        </p>
                      </div>

                      {/* Startup Key Traction Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-center">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Est. MRR</span>
                          <p className="text-xs font-black text-slate-900">{formatCurrency(s.mrr)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Growth %</span>
                          <p className="text-xs font-black text-emerald-600">+{s.growthRate}%/mo</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Valuation</span>
                          <p className="text-xs font-black text-slate-900">{formatCurrency(s.valuation)}</p>
                        </div>
                      </div>

                      {/* AI Reasons Tag */}
                      {s.matchReasons && s.matchReasons.length > 0 && (
                        <div className="text-[11px] text-blue-700 bg-blue-50/70 p-2 rounded-xl border border-blue-100 flex items-center gap-1.5 font-semibold">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{s.matchReasons[0]}</span>
                        </div>
                      )}

                      {/* Action Buttons Toolbar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleSave(s.id)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              s.isSaved ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                            title="Bookmark Startup"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleCompareStartup(s)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              comparedStartups.some(c => c.id === s.id) ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                            title="Compare Startup"
                          >
                            <Scale className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={() => handleRequestPitch(s)}
                            variant="outline"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl h-8 px-3 cursor-pointer shadow-2xs"
                          >
                            <Send className="w-3 h-3 text-blue-600" />
                            <span>Inquire Pitch</span>
                          </Button>

                          <Button
                            type="button"
                            onClick={() => handleInstantMeeting(s)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-8 px-3 flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Founder</span>
                          </Button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB B: INVESTMENT KANBAN PIPELINE */}
          {activeTab === "PIPELINE" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Venture Investment CRM & Pitch Pipeline</h3>
                  <p className="text-xs text-slate-500">Drag-and-drop pitch objects across deal stages (New → Viewed → Interested → Meeting → Due Diligence → Term Sheet)</p>
                </div>
              </div>

              {/* Pitch Kanban Pipeline */}
              <PitchKanbanBoard
                pitches={pitchesList.length > 0 ? pitchesList : [
                  {
                    id: "pitch-demo-1",
                    status: "SUBMITTED",
                    elevatorPitch: "Autonomous Agentic AI Infrastructure platform cutting cloud deployment time by 80%.",
                    amountRaising: 500000,
                    startup: { name: "Nova AI Labs", stage: "Seed" },
                    founder: { name: "Sarah Vance" },
                    aiSnapshot: { matchScore: 94 }
                  },
                  {
                    id: "pitch-demo-2",
                    status: "MEETING_REQUESTED",
                    elevatorPitch: "Cross-border fintech syndicate allocation and cap table management platform.",
                    amountRaising: 250000,
                    startup: { name: "SyncFlow Tech", stage: "Pre-Seed" },
                    founder: { name: "Sarah Chen" },
                    aiSnapshot: { matchScore: 91 }
                  }
                ]}
                onSelectPitch={(p) => {
                  setSelectedPitch(p);
                  setIsPitchViewerOpen(true);
                }}
                onStatusChange={async (pitchId, newStatus) => {
                  setPitchesList(pitchesList.map((p) => (p.id === pitchId ? { ...p, status: newStatus } : p)));
                  try {
                    const token = await getToken();
                    await fetch(`${getApiUrl()}/api/pitches/${pitchId}/status`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ status: newStatus })
                    });
                  } catch (err) {
                    console.error("Error updating status:", err);
                  }
                }}
              />
            </div>
          )}

          <PitchViewerModal
            pitch={selectedPitch}
            isOpen={isPitchViewerOpen}
            onClose={() => setIsPitchViewerOpen(false)}
            onStatusChange={async (pitchId, newStatus) => {
              setPitchesList(pitchesList.map((p) => (p.id === pitchId ? { ...p, status: newStatus } : p)));
              try {
                const token = await getToken();
                await fetch(`${getApiUrl()}/api/pitches/${pitchId}/status`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ status: newStatus })
                });
              } catch (err) {
                console.error("Error updating status:", err);
              }
            }}
          />

          {/* TAB C: PORTFOLIO MANAGEMENT */}
          {activeTab === "PORTFOLIO" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Portfolio Companies</h3>
                  <p className="text-xs text-slate-500">Active investments, valuation tracking, and founder updates</p>
                </div>
              </div>

              {portfolio.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">No Investments Recorded Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">Move startups in your pipeline to "Invested" stage to track portfolio metrics.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.map((inv) => (
                    <div key={inv.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-blue-600 text-sm">
                            {inv.startup.name[0]}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">{inv.startup.name}</h4>
                            <p className="text-[11px] font-semibold text-slate-500">{inv.startup.industry} • Entry: {inv.entryStage}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                          Health Score: {inv.healthScore}/100
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 text-center text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Invested</span>
                          <p className="font-black text-slate-900">{formatCurrency(inv.amountInvested)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Valuation</span>
                          <p className="font-black text-slate-900">{formatCurrency(inv.currentValuation)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Ownership</span>
                          <p className="font-black text-blue-600">{inv.ownershipPct}%</p>
                        </div>
                      </div>

                      {inv.nextMilestone && (
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 font-semibold flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Milestone: {inv.nextMilestone}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

        {/* 5. RIGHT ACTIVITY SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200/80 p-5 shrink-0 hidden xl:flex flex-col space-y-6">
          
          {/* Section A: Today's Meetings */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> Scheduled Meetings
            </h4>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Partner Dealflow Sync</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Today, 4:00 PM</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Reviewing Seed Round diligence for top 3 AI startups</p>
              <Button
                type="button"
                onClick={() => router.push("/meet/partner-sync")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-8 shadow-xs cursor-pointer"
              >
                Join Noventra Room
              </Button>
            </div>
          </div>

          {/* Section B: Sector Trend Analysis */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Hot Sectors This Month
            </h4>

            <div className="space-y-2">
              {[
                { name: "AI Infrastructure", growth: "+34%", deals: 18 },
                { name: "B2B Developer Tools", growth: "+28%", deals: 14 },
                { name: "FinTech & Payments", growth: "+19%", deals: 11 },
              ].map((sec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{sec.name}</p>
                    <p className="text-[10px] text-slate-400">{sec.deals} startups evaluating</p>
                  </div>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    {sec.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Quick Investor Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> Quick Investment Notes
            </h4>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Record quick thesis or due diligence notes..."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 h-24 resize-none"
            />
          </div>

        </aside>

      </div>

      {/* STARTUP COMPARISON MODAL */}
      {showComparison && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">Startup Side-by-Side Comparison</h3>
              </div>
              <button onClick={() => setShowComparison(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-4 gap-4 text-xs">
              {comparedStartups.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="font-black text-slate-900 text-sm border-b border-slate-200 pb-2">{s.name}</div>
                  <div><strong className="text-slate-400 block text-[10px]">MRR:</strong> {formatCurrency(s.mrr)}</div>
                  <div><strong className="text-slate-400 block text-[10px]">Growth:</strong> +{s.growthRate}%/mo</div>
                  <div><strong className="text-slate-400 block text-[10px]">Valuation:</strong> {formatCurrency(s.valuation)}</div>
                  <div><strong className="text-slate-400 block text-[10px]">AI Match:</strong> {s.aiMatchScore}%</div>
                  <div><strong className="text-slate-400 block text-[10px]">Stage:</strong> {s.stage}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={() => setShowComparison(false)}
                className="bg-blue-600 text-white font-extrabold text-xs rounded-xl px-5 h-9"
              >
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
