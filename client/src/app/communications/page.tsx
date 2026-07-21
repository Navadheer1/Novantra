"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { 
  Video, Plus, LogIn, Sparkles, Briefcase, Building2, 
  Code2, Users, ShieldCheck, Layers, ArrowRight, Copy, 
  Check, Clock, Calendar, CheckSquare, FileText, AlertCircle, Loader2, RefreshCw, Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";

import CommunicationsSidebar, { CommTab } from "@/components/communications/CommunicationsSidebar";
import CommunicationsRightPanel from "@/components/communications/CommunicationsRightPanel";
import NetworkDiagnosticDrawer from "@/components/communications/NetworkDiagnosticDrawer";
import NewMeetingModal from "@/components/meet/NewMeetingModal";
import JoinMeetingModal from "@/components/meet/JoinMeetingModal";
import { getApiUrl, apiFetch } from "@/lib/apiConfig";

export default function CommunicationsHubPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<CommTab>("overview");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);
  
  // Realtime Network Diagnostics & Reactive State
  const [networkError, setNetworkError] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);

  // Custom Instant Meeting Form
  const [instantTitle, setInstantTitle] = useState("");
  const [instantType, setInstantType] = useState("GENERAL");
  const [isPrivate, setIsPrivate] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [isLaunching, setIsLaunching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // WebSocket & Server Health Ping Interval (every 5 seconds)
  const checkHealth = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${apiUrl}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        setNetworkError(false);
      } else {
        setNetworkError(true);
      }
    } catch (e) {
      setNetworkError(true);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  useEffect(() => {
    if (clerkLoaded) {
      fetchMeetings();
    }
  }, [clerkLoaded, clerkUser?.id]);

  const fetchMeetings = async () => {
    try {
      const token = await getToken();
      const res = await apiFetch("/api/meetings/user/recent", { token });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.meetings || [];
        setRecentMeetings(list);
        if (list[0]) setSelectedMeeting(list[0]);
      }
    } catch (e) {
      console.error("[Communications Hub] Failed to fetch meetings:", e);
    }
  };

  const handleStartInstantMeeting = async (typeOverride?: string) => {
    setErrorMsg(null);
    try {
      setIsLaunching(true);
      console.log("[Communications Hub] Requesting POST /api/meetings/instant...");

      // Request WebRTC Media Permissions early without blocking
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (mediaErr) {
        console.warn("[Media Permission Warning]:", mediaErr);
      }

      const token = await getToken();
      const res = await apiFetch("/api/meetings/instant", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: instantTitle.trim() || undefined,
          meetingType: typeOverride || instantType,
          isPrivate,
          waitingRoom,
          maxParticipants,
        }),
      });

      const json = await res.json().catch(() => ({}));
      console.log("[Communications Hub] Received response:", json);

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || `Server error (${res.status}): Failed to create meeting.`);
        setNetworkError(true);
        return;
      }

      const meetingCode = json.meetingCode || json.meeting?.meetingCode;
      if (!meetingCode) {
        setErrorMsg("Server returned invalid meeting data.");
        return;
      }

      // Navigate to /communications/meeting/[meetingCode]
      router.push(`/communications/meeting/${meetingCode}`);
    } catch (err: any) {
      console.error("[Communications Hub] Error creating instant meeting:", err);
      setErrorMsg(err.message || "Network error connecting to backend meeting server.");
      setNetworkError(true);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/communications/meeting/${code}`;
    navigator.clipboard.writeText(link);
  };

  const handleManualPingTest = async () => {
    setIsTestingPing(true);
    await checkHealth();
    setTimeout(() => setIsTestingPing(false), 800);
  };

  const startupModeCards = [
    {
      id: "pitch_mode",
      type: "PITCH",
      title: "Investor Pitch Mode",
      desc: "Founder shares deck, investors view metrics, financials, and live Q&A panel.",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "startup_canvas",
      type: "CANVAS",
      title: "Collaborative Startup Canvas",
      desc: "Shared Lean Canvas, product architecture, and roadmap whiteboard.",
      icon: Layers,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      id: "due_diligence",
      type: "DD_ROOM",
      title: "Investor Due Diligence Room",
      desc: "Private encrypted room for cap table, financial models, and legal docs.",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "code_interview",
      type: "INTERVIEW",
      title: "Live Technical Code Viewer",
      desc: "Syntax-highlighted code editor for technical co-founder & engineering interviews.",
      icon: Code2,
      color: "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      id: "product_review",
      type: "REVIEW",
      title: "Product UI & Design Review",
      desc: "Upload UI mockups, annotate screens, and review product flows live.",
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: "founder_workspace",
      type: "GENERAL",
      title: "Founder Sprint Workspace",
      desc: "Kanban sprint board, milestones, and shared meeting notes.",
      icon: Building2,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      <Navbar />

      {/* Communications Hub Main Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Network Error Alert Banner */}
        {networkError && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>
                <strong>Connection Warning:</strong> Backend signaling server connection error. Reconnecting automatically every 5s...
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleManualPingTest}
                className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-black hover:bg-amber-700 transition-all flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isTestingPing ? 'animate-spin' : ''}`} /> Ping Test
              </button>
              <button onClick={() => setNetworkError(false)} className="text-amber-700 font-bold hover:underline text-[11px]">
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* 1. Left Sidebar Navigation */}
          <CommunicationsSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenNewMeeting={() => setIsNewOpen(true)}
            onOpenJoinMeeting={() => setIsJoinOpen(true)}
            onOpenDiagnostic={() => setDiagnosticOpen(true)}
          />

          {/* 2. Center Panel Main Collaboration Workspace */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Header Banner */}
            <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center border border-blue-100">
                    <Video className="w-4.5 h-4.5" />
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Noventra Communications Hub
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  HD WebRTC meetings, startup pitch rooms, collaborative due diligence, and technical code reviews.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  onClick={() => handleStartInstantMeeting()}
                  disabled={isLaunching}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl px-5 h-10 shadow-sm flex items-center gap-2"
                >
                  {isLaunching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Start Instant Meeting</span>
                </Button>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button onClick={() => setErrorMsg(null)} className="text-rose-500 font-bold hover:underline text-[11px]">
                  Dismiss
                </button>
              </div>
            )}

            {/* Overview / Active Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Instant Launch Form Card */}
                <div className="p-6 rounded-[24px] border border-slate-200/80 bg-white shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" /> Quick Launch Meeting Room
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Meeting Room Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Noventra Seed Pitch Review"
                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        value={instantTitle}
                        onChange={(e) => setInstantTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Room Category</label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        value={instantType}
                        onChange={(e) => setInstantType(e.target.value)}
                      >
                        <option value="GENERAL">General Meeting</option>
                        <option value="PITCH">Investor Pitch Review</option>
                        <option value="CANVAS">Startup Canvas</option>
                        <option value="DD_ROOM">Cap Table & DD Review</option>
                        <option value="INTERVIEW">Technical Code Audit</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                          checked={waitingRoom}
                          onChange={(e) => setWaitingRoom(e.target.checked)}
                        />
                        <span>Waiting Room Enabled</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        <span>Private Access</span>
                      </label>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleStartInstantMeeting()}
                      disabled={isLaunching}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl px-6 h-10 shadow-sm flex items-center gap-2"
                    >
                      {isLaunching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      <span>Launch Room</span>
                    </Button>
                  </div>
                </div>

                {/* Specialized Startup Modes Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Startup Collaboration Modes
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {startupModeCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.id}
                          onClick={() => handleStartInstantMeeting(card.type)}
                          className="p-5 rounded-[20px] border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Launch Room
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                              {card.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {card.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Meetings Table */}
                <div className="p-6 rounded-[24px] border border-slate-200/80 bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Recent & Active Rooms ({recentMeetings.length})
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {recentMeetings.length === 0 ? (
                      <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border">
                        No recent meeting rooms found. Use the quick launch form above.
                      </p>
                    ) : (
                      recentMeetings.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMeeting(m)}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedMeeting?.id === m.id
                              ? "border-blue-600 bg-blue-50/50"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100">
                              <Video className="w-4.5 h-4.5" />
                            </div>

                            <div>
                              <h4 className="font-extrabold text-xs text-slate-900">
                                {m.title || m.startup?.name || `Meeting ${m.meetingCode}`}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-mono">
                                Code: {m.meetingCode} • {new Date(m.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyLink(m.meetingCode);
                              }}
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold"
                              title="Copy Room Link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <Button
                              type="button"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/communications/meeting/${m.meetingCode}`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-8 px-4"
                            >
                              <span>Enter Room</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. Right Sidebar Workspace Panel */}
          <CommunicationsRightPanel
            selectedMeeting={selectedMeeting}
            onCopyLink={handleCopyLink}
          />

        </div>
      </main>

      {/* System Health Diagnostic Drawer */}
      <NetworkDiagnosticDrawer
        isOpen={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
        onRetryConnection={handleManualPingTest}
        isConnecting={isTestingPing}
        networkError={networkError}
      />

      {/* Modals */}
      <NewMeetingModal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} />
      <JoinMeetingModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
    </div>
  );
}
