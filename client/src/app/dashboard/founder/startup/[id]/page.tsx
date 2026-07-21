"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Video,
  Users,
  Briefcase,
  BarChart2,
  FileText,
  Zap,
  Target,
  CheckSquare,
  Settings,
  ChevronRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/apiConfig";

type WorkspaceTab =
  | "overview"
  | "analytics"
  | "hiring"
  | "funding"
  | "pitchdeck"
  | "investors"
  | "documents"
  | "roadmap"
  | "meetings"
  | "tasks"
  | "settings"
  | "team";

export default function StartupWorkspacePortal() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const [startup, setStartup] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [loading, setLoading] = useState(true);
  const [meetingLoading, setMeetingLoading] = useState(false);

  useEffect(() => {
    fetchStartupData();
  }, [id]);

  const fetchStartupData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      // Fetch single startup or fallback to /me list
      const res = await fetch(`${apiUrl}/api/startups/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setStartup(data);
      } else {
        // Fallback to /api/startups/me
        const meRes = await fetch(`${apiUrl}/api/startups/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (meRes.ok) {
          const list = await meRes.json();
          const found = list.find((s: any) => s.id === id);
          setStartup(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startMeeting = async () => {
    try {
      setMeetingLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ startupId: id })
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/meeting/${data.meetingCode}`);
      } else {
        alert("Failed to create WebRTC pitch room.");
      }
    } catch (err) {
      console.error(err);
      alert("Error starting meeting room.");
    } finally {
      setMeetingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 font-bold text-sm">Opening Startup Operating Workspace...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-auto p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Startup Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">The requested startup workspace does not exist or access was denied.</p>
          <Button onClick={() => router.push("/dashboard/founder")} className="bg-blue-600 text-white font-bold">
            Return to Founder Console
          </Button>
        </div>
      </div>
    );
  }

  const tabs: { id: WorkspaceTab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "hiring", label: "Hiring", icon: Briefcase },
    { id: "funding", label: "Funding", icon: Zap },
    { id: "pitchdeck", label: "Pitch Deck", icon: Sparkles },
    { id: "investors", label: "Investors", icon: Shield },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "roadmap", label: "Roadmap", icon: Layers },
    { id: "meetings", label: "Meetings", icon: Video },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "team", label: "Team Members", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      <Navbar />

      {/* Top Breadcrumb & Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/founder")}
                className="text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Console
              </Button>

              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-7 h-7" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-900">{startup.name}</h1>
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {startup.stage} STAGE
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {startup.industry}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{startup.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={startMeeting}
                disabled={meetingLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                {meetingLoading ? "Initializing..." : "Launch Pitch Room"}
              </Button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto mt-6 pt-2 border-t border-slate-100 no-scrollbar">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Tab Workspace Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-white border border-slate-200/80 rounded-[24px] p-8 shadow-xs min-h-[500px]"
          >
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900">Startup Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60">
                    <span className="text-xs font-bold text-slate-500">Target Funding</span>
                    <h4 className="text-2xl font-black text-slate-900 mt-1">{startup.fundingNeeded || "$500,000"}</h4>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60">
                    <span className="text-xs font-bold text-slate-500">Team Size</span>
                    <h4 className="text-2xl font-black text-slate-900 mt-1">{(startup.teamMembers?.length || 0) + 1} Members</h4>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60">
                    <span className="text-xs font-bold text-slate-500">Location</span>
                    <h4 className="text-2xl font-black text-slate-900 mt-1">{startup.location || "San Francisco, CA"}</h4>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Workspace Analytics</h3>
                <p className="text-xs text-slate-500">Detailed metric breakdown for investor due diligence.</p>
              </div>
            )}

            {activeTab === "hiring" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Open Positions & Hiring Pipeline</h3>
                <div className="flex flex-wrap gap-2">
                  {(startup.requiredRoles?.length ? startup.requiredRoles : ["Staff AI Engineer", "Full Stack Lead"]).map((r: string) => (
                    <span key={r} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "funding" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Funding & Capital Raised</h3>
                <p className="text-xs text-slate-500">Seed Round Status: 65% Committed ($325,000 / $500,000)</p>
              </div>
            )}

            {activeTab === "pitchdeck" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Pitch Deck Room</h3>
                <div className="p-8 bg-slate-900 text-white rounded-2xl text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-blue-400 mx-auto" />
                  <h4 className="font-extrabold text-base">Investor Pitch Deck 2026</h4>
                  <p className="text-xs text-slate-400">Interactive WebRTC pitch presentation active.</p>
                </div>
              </div>
            )}

            {activeTab === "investors" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Connected VCs & Angel Investors</h3>
                {startup.connectedInvestors?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No investors connected yet.</p>
                ) : (
                  <div className="space-y-2">
                    {startup.connectedInvestors?.map((vc: any) => (
                      <div key={vc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                        <span className="font-bold">{vc.name} ({vc.email})</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">Connected VC</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Recent Documents & Data Room</h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
                  Data Room Cap Table 2026.pdf
                </div>
              </div>
            )}

            {activeTab === "roadmap" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Product Roadmap Milestones</h3>
                <p className="text-xs text-slate-500">Q3 2026: Public API & Mobile App Beta</p>
              </div>
            )}

            {activeTab === "meetings" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Meeting Room History</h3>
                <Button onClick={startMeeting} className="bg-blue-600 text-white font-bold text-xs">
                  Create WebRTC Meeting
                </Button>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Team Sprint Tasks</h3>
                <p className="text-xs text-slate-500">3 active tasks in progress.</p>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Team Members, Roles & Permissions</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold">{startup.founder?.name || "Founder"} (Owner)</span>
                    <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">Founder / Admin</span>
                  </div>
                  {startup.teamMembers?.map((tm: any) => (
                    <div key={tm.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <span className="font-bold">{tm.user?.name} ({tm.user?.email})</span>
                      <span className="bg-slate-200 text-slate-800 font-bold px-2.5 py-0.5 rounded-full">{tm.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Startup Workspace Settings</h3>
                <p className="text-xs text-slate-500">Configure profile, visibility, domain, and permissions.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
