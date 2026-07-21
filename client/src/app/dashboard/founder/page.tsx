"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FounderLeftSidebar from "@/components/dashboard/FounderLeftSidebar";
import FounderOverviewMetrics from "@/components/dashboard/FounderOverviewMetrics";
import FounderStartupWorkspace, { StartupItem } from "@/components/dashboard/FounderStartupWorkspace";
import FounderProductivityCenter from "@/components/dashboard/FounderProductivityCenter";
import FounderAnalyticsCharts from "@/components/dashboard/FounderAnalyticsCharts";
import FounderActivityTimeline from "@/components/dashboard/FounderActivityTimeline";
import FounderRightSidebar from "@/components/dashboard/FounderRightSidebar";
import SearchOmnibox from "@/components/SearchOmnibox";

import { Button } from "@/components/ui/button";
import { Loader2, Plus, Video, Sparkles, Inbox, Building2, Search } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

interface DBUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string | null;
  bio: string | null;
}

interface Meeting {
  id: string;
  meetingCode: string;
  createdAt: string;
  startup?: {
    name: string;
  };
}

export default function FounderDashboardPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [startups, setStartups] = useState<StartupItem[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState<any>({
    totalStartups: 0,
    pendingRequests: 0,
    totalTeamMembers: 0,
    activeMeetingsCount: 0,
    followersCount: 142,
    followingCount: 89,
    postsCount: 18,
    profileViews: 482,
    fundingRaised: "$1.4M",
    revenue: "$42,500",
    investorInterest: "94%",
    applications: 4,
    growthRate: "+18.4%"
  });

  const [loading, setLoading] = useState(true);
  const [startingMeetingId, setStartingMeetingId] = useState<string | null>(null);

  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else {
        fetchData();
      }
    }
  }, [clerkLoaded, clerkUser?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      // 1. Fetch DB User profile
      if (clerkUser?.id) {
        const userRes = await fetch(`${apiUrl}/api/users/clerk/${clerkUser.id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setDbUser(userData);
        }
      }

      // 2. Fetch Dashboard Stats
      if (token) {
        const statsRes = await fetch(`${apiUrl}/api/users/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats((prev: any) => ({ ...prev, ...statsData }));
        }
      }

      // 3. Fetch Startups
      if (token) {
        const startupsRes = await fetch(`${apiUrl}/api/startups/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (startupsRes.ok) {
          const startupsData = await startupsRes.json();
          setStartups(startupsData);

          // 4. Fetch Active Meetings for founder's startups
          if (startupsData.length > 0) {
            const list: Meeting[] = [];
            for (const startup of startupsData) {
              const mRes = await fetch(`${apiUrl}/api/meetings/${startup.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (mRes.ok) {
                const data = await mRes.json();
                list.push(...data);
              }
            }
            setMeetings(list);
          }
        }
      }
    } catch (err) {
      console.error("[FounderDashboard] Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMeeting = async (startupId?: string) => {
    const targetId = startupId || startups[0]?.id;
    if (!targetId) {
      alert("Please create a startup profile before initiating a pitch room call.");
      return;
    }

    try {
      setStartingMeetingId(targetId);
      const token = await getToken();
      const apiUrl = getApiUrl();

      const res = await fetch(`${apiUrl}/api/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ startupId: targetId })
      });

      if (res.ok) {
        const meeting = await res.json();
        router.push(`/meeting/${meeting.meetingCode}`);
      } else {
        alert("Failed to start WebRTC meeting room.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong starting meeting room.");
    } finally {
      setStartingMeetingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 font-extrabold text-sm">Initializing Founder Startup Operating System...</p>
        </div>
      </div>
    );
  }

  const primaryStartup = startups[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Header Banner */}
      <header className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Founder Operating System</h1>
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                OS v2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Manage your startups, review applications, launch WebRTC pitch rooms, and coordinate fundraising.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link href="/inbox">
              <Button variant="outline" className="font-bold text-xs rounded-xl flex items-center gap-1.5 border-slate-200">
                <Inbox className="w-4 h-4 text-slate-500" /> Mailbox ({stats.pendingRequests || 0})
              </Button>
            </Link>

            <Button
              onClick={() => handleStartMeeting()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" /> Start Pitch Call
            </Button>

            <Link href="/dashboard/founder/startup/new">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create Startup
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* 1. LEFT SIDEBAR */}
          <FounderLeftSidebar
            user={dbUser}
            clerkUser={clerkUser}
            stats={{
              followersCount: stats.followersCount,
              followingCount: stats.followingCount,
              postsCount: stats.postsCount,
              totalStartups: startups.length
            }}
            primaryStartupName={primaryStartup?.name || "Noventra Core"}
          />

          {/* 2. CENTER CONTENT */}
          <div className="flex-1 w-full space-y-8 min-w-0">
            {/* 8 Overview Metric Cards */}
            <FounderOverviewMetrics stats={stats} />

            {/* Startup Workspace Cards */}
            <FounderStartupWorkspace
              startups={startups}
              onStartMeeting={handleStartMeeting}
              startingMeetingId={startingMeetingId}
            />

            {/* Productivity Center */}
            <FounderProductivityCenter />

            {/* Startup Analytics Charts */}
            <FounderAnalyticsCharts />

            {/* GitHub-style Activity Timeline */}
            <FounderActivityTimeline />
          </div>

          {/* 3. RIGHT SIDEBAR */}
          <FounderRightSidebar
            meetings={meetings}
            onStartMeeting={() => handleStartMeeting()}
            startupName={primaryStartup?.name || "Noventra Core"}
            industry={primaryStartup?.industry || "AI & Software"}
          />

        </div>
      </main>
    </div>
  );
}
