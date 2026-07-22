"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { 
  Video, Plus, LogIn, Sparkles, Briefcase, Building2, Search,
  Code2, Users, ShieldCheck, Layers, ArrowRight, Copy, 
  Check, Clock, Calendar, CheckSquare, FileText, AlertCircle, Loader2, RefreshCw, Activity, LayoutGrid
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

  const [activeTab, setActiveTab] = useState<CommTab>("meetings");
  const [searchQuery, setSearchQuery] = useState("");
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

  // Server Health Ping Check
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
    const interval = setInterval(checkHealth, 10000);
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

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || `Server error (${res.status}): Failed to create meeting.`);
        return;
      }

      const meetingCode = json.meetingCode || json.meeting?.meetingCode;
      if (!meetingCode) {
        setErrorMsg("Server returned invalid meeting data.");
        return;
      }

      // Route directly to canonical route
      router.push(`/meet/${meetingCode}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error connecting to backend meeting server.");
    } finally {
      setIsLaunching(false);
    }
  };

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/meet/${code}`;
    navigator.clipboard.writeText(link);
  };

  const handleManualPingTest = async () => {
    setIsTestingPing(true);
    await checkHealth();
    setTimeout(() => setIsTestingPing(false), 800);
  };

  // Filtered Meetings based on global Search
  const filteredMeetings = useMemo(() => {
    if (!searchQuery.trim()) return recentMeetings;
    const query = searchQuery.toLowerCase();
    return recentMeetings.filter(
      (m) =>
        m.title?.toLowerCase().includes(query) ||
        m.meetingCode?.toLowerCase().includes(query) ||
        m.meetingType?.toLowerCase().includes(query)
    );
  }, [recentMeetings, searchQuery]);

  const workspacesCards = [
    {
      id: "pitch_workspace",
      type: "PITCH",
      title: "Investor Pitch Workspace",
      desc: "Founder shares pitch deck, investors view metrics, financials, and cap table Q&A.",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "product_workspace",
      type: "REVIEW",
      title: "Product UI Workspace",
      desc: "Review product design flows, annotate screen mockups, and run UI sprint audits.",
      icon: LayoutGrid,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: "canvas_workspace",
      type: "CANVAS",
      title: "Whiteboard Canvas Workspace",
      desc: "Shared Lean Canvas, system architecture diagrams, and product roadmap.",
      icon: Layers,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      id: "diligence_workspace",
      type: "DD_ROOM",
      title: "Due Diligence Workspace",
      desc: "Encrypted room for cap table, audit term sheets, and legal checklist verification.",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "sprint_workspace",
      type: "GENERAL",
      title: "Sprint Planning Workspace",
      desc: "Kanban milestone planning, sprint backlog, and real-time team action items.",
      icon: Clock,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      id: "code_workspace",
      type: "INTERVIEW",
      title: "Code Review Workspace",
      desc: "Syntax-highlighted code editor for technical co-founder & engineering interviews.",
      icon: Code2,
      color: "text-sky-600 bg-sky-50 border-sky-200",
    },
  ];

  const userName = clerkUser?.firstName || clerkUser?.fullName?.split(" ")[0] || "Navadheer";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased font-sans">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Network Diagnostics Warning */}
        {networkError && activeTab === "settings" && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>
                <strong>Connection Warning:</strong> Signaling server diagnostic latency detected.
              </span>
            </div>
            <button
              onClick={handleManualPingTest}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-black hover:bg-amber-700 transition-all flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isTestingPing ? 'animate-spin' : ''}`} /> Run Diagnostic
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* Left Sidebar Navigation */}
          <CommunicationsSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenNewMeeting={() => setIsNewOpen(true)}
            onOpenJoinMeeting={() => setIsJoinOpen(true)}
            onOpenDiagnostic={() => {
              setActiveTab("settings");
              setDiagnosticOpen(true);
            }}
          />

          {/* Center Main Workspace Content */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Dynamic Personalized Header Banner */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center border border-blue-100">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Good afternoon, {userName}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Continue where you left off • Noventra Startup Operating System
                </p>
              </div>

              {/* Global Search Bar */}
              <div className="w-full md:w-80 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meetings, rooms, notes..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
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

            {/* Main Tabs Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* 1. MEETINGS TAB / DASHBOARD MAIN */}
                {(activeTab === "meetings" || activeTab === "rooms") && (
                  <>
                    {/* Quick Launch Card */}
                    <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-600" /> Start or Schedule a Meeting
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Meeting Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Series A Due Diligence Call"
                            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                            value={instantTitle}
                            onChange={(e) => setInstantTitle(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Workspace Category</label>
                          <select
                            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                            value={instantType}
                            onChange={(e) => setInstantType(e.target.value)}
                          >
                            <option value="GENERAL">General Workspace</option>
                            <option value="PITCH">Investor Pitch</option>
                            <option value="CANVAS">Whiteboard Canvas</option>
                            <option value="DD_ROOM">Due Diligence Room</option>
                            <option value="INTERVIEW">Code Review</option>
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
                            <span>Enable Waiting Room</span>
                          </label>
                        </div>

                        <Button
                          type="button"
                          onClick={() => handleStartInstantMeeting()}
                          disabled={isLaunching}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl px-6 h-10 shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                          {isLaunching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                          <span>Launch Meeting</span>
                        </Button>
                      </div>
                    </div>

                    {/* Recent Meetings Table */}
                    <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Recent Meetings ({filteredMeetings.length})
                        </h3>
                      </div>

                      {filteredMeetings.length === 0 ? (
                        <div className="text-center py-10 space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                          <Video className="w-8 h-8 text-slate-400 mx-auto" />
                          <p className="text-xs font-bold text-slate-600">No meeting rooms found</p>
                          <p className="text-[11px] text-slate-400">Use the form above to start your first call.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                                <th className="pb-3 pl-2">Title / Code</th>
                                <th className="pb-3">Workspace</th>
                                <th className="pb-3">Participants</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3 pr-2 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                              {filteredMeetings.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3 pl-2">
                                    <div className="font-extrabold text-slate-900">{m.title || "Noventra Room"}</div>
                                    <div className="text-[10px] font-mono text-slate-400">{m.meetingCode}</div>
                                  </td>
                                  <td className="py-3">
                                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] uppercase border border-blue-100">
                                      {m.meetingType || "GENERAL"}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-1 text-slate-600">
                                      <Users className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Host + Team</span>
                                    </div>
                                  </td>
                                  <td className="py-3 text-slate-500">
                                    {new Date(m.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="py-3 pr-2 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handleCopyLink(m.meetingCode)}
                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
                                        title="Copy Link"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>

                                      <Button
                                        size="sm"
                                        onClick={() => router.push(`/meet/${m.meetingCode}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-8 px-3"
                                      >
                                        Rejoin
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* 2. WORKSPACES DIRECTORY TAB */}
                {(activeTab === "workspaces" || activeTab.endsWith("_workspace")) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Startup Collaboration Workspaces
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {workspacesCards.map((card) => {
                        const Icon = card.icon;
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleStartInstantMeeting(card.type)}
                            className="p-5 rounded-3xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${card.color}`}>
                                <Icon className="w-5 h-5" />
                              </div>

                              <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                Launch Workspace
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
                )}

                {/* 3. HISTORY TAB */}
                {activeTab === "history" && (
                  <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" /> Meeting Call History & Transcripts
                    </h3>

                    {recentMeetings.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center italic border border-dashed rounded-2xl">
                        No meeting history recorded yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {recentMeetings.map((m) => (
                          <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <div className="font-extrabold text-slate-900">{m.title || "Noventra Session"}</div>
                              <div className="text-[10px] text-slate-500 font-mono">Code: {m.meetingCode} • Completed</div>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => router.push(`/meet/${m.meetingCode}`)}
                              variant="outline"
                              className="border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl h-8 px-3"
                            >
                              View Summary
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SETTINGS & DIAGNOSTICS TAB */}
                {activeTab === "settings" && (
                  <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Communications Settings & Network Diagnostics
                      </h3>
                      <p className="text-xs text-slate-500">Configure WebRTC media defaults and run system diagnostics.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">Signaling Server Diagnostics</h4>
                          <p className="text-[11px] text-slate-500">Check WebRTC socket server connection health.</p>
                        </div>
                        <Button
                          onClick={handleManualPingTest}
                          className="bg-blue-600 text-white font-bold text-xs rounded-xl h-9 px-4 flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                          <span>Run Ping Test</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Right Selected Room Workspace Info */}
          <CommunicationsRightPanel
            selectedMeeting={selectedMeeting}
            onCopyLink={handleCopyLink}
          />

        </div>
      </main>

      {/* Modals */}
      <NewMeetingModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
      />

      <JoinMeetingModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
      />

      <NetworkDiagnosticDrawer
        isOpen={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
        onRetryConnection={handleManualPingTest}
        isConnecting={isTestingPing}
        networkError={networkError}
      />

    </div>
  );
}
