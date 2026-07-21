"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Building2, Inbox, Plus, Users, Video, Clock, CheckCircle2, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface Startup {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  industry: string;
  stage: string;
  fundingNeeded: string | null;
  teamMembers: any[];
  requests: any[];
  requiredRoles: string[];
}

interface Meeting {
  id: string;
  meetingCode: string;
  createdAt: string;
  startup?: {
    name: string;
  };
}

export default function FounderDashboard() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingMeeting, setStartingMeeting] = useState<string | null>(null);

  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else {
        fetchDashboardData();
      }
    }
  }, [clerkLoaded, clerkUser]);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const apiUrl = getApiUrl();

      // 1. Fetch founder's startups
      const startupsRes = await fetch(`${apiUrl}/api/startups/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (startupsRes.ok) {
        const startupsData = await startupsRes.json();
        setStartups(startupsData);

        // 2. Fetch active meetings for their startups
        if (startupsData.length > 0) {
          const meetingsList: Meeting[] = [];
          for (const startup of startupsData) {
            const meetingsRes = await fetch(`${apiUrl}/api/meetings/${startup.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (meetingsRes.ok) {
              const data = await meetingsRes.json();
              meetingsList.push(...data);
            }
          }
          setMeetings(meetingsList);
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
      setStartups([]);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMeeting = async (startupId: string) => {
    try {
      setStartingMeeting(startupId);
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${getApiUrl()}/api/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ startupId })
      });

      if (res.ok) {
        const meeting = await res.json();
        // Redirect directly to meeting room
        router.push(`/meeting/${meeting.meetingCode}`);
      } else {
        alert("Failed to start meeting room.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong starting the meeting.");
    } finally {
      setStartingMeeting(null);
    }
  };

  // Compute stats
  const totalStartups = startups.length;
  const pendingRequests = startups.reduce((acc, startup) => acc + startup.requests.length, 0);
  const totalTeamMembers = startups.reduce((acc, startup) => acc + startup.teamMembers.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Configuring your founder console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title and main actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Founder Console</h1>
            <p className="text-muted-foreground mt-1">Manage your startups, review applications, and coordinate team syncs.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/inbox">
              <Button variant="outline" className="font-bold flex items-center gap-1.5">
                <Inbox className="w-4 h-4" /> Mailbox
              </Button>
            </Link>
            <Link href="/dashboard/founder/startup/new">
              <Button className="font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create Startup
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">My Startups</p>
              <h3 className="text-3xl font-black text-foreground mt-0.5">{totalStartups}</h3>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Pending Requests</p>
              <h3 className="text-3xl font-black text-foreground mt-0.5">{pendingRequests}</h3>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Team Members</p>
              <h3 className="text-3xl font-black text-foreground mt-0.5">{totalTeamMembers}</h3>
            </div>
          </div>
        </div>

        {/* Workspace body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Startups details list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Registered Startups</h2>
            </div>

            {startups.length === 0 ? (
              <div className="bg-card border border-border p-12 rounded-xl text-center shadow-sm">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No startups created yet</h3>
                <p className="text-muted-foreground mb-6">Launch your startup profile to start hiring talent and pitching to VCs.</p>
                <Link href="/dashboard/founder/startup/new">
                  <Button className="font-bold">Register Startup</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {startups.map((startup) => (
                  <div key={startup.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center overflow-hidden border">
                          {startup.logo ? (
                            <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-lg leading-tight text-foreground">{startup.name}</h4>
                          <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded">
                            {startup.stage} Stage • {startup.industry}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={startingMeeting === startup.id}
                          onClick={() => handleStartMeeting(startup.id)}
                          className="font-bold flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
                        >
                          <Video className="w-4 h-4 text-primary" />
                          {startingMeeting === startup.id ? "Launching..." : "Pitch Room"}
                        </Button>
                        <Link href={`/dashboard/founder/startup/${startup.id}`} className="flex-1 sm:flex-initial">
                          <Button size="sm" className="font-bold w-full">Edit Info</Button>
                        </Link>
                      </div>
                    </div>

                    {/* Team Members accordion preview */}
                    <div className="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span>Actively hiring for: <strong>{startup.requiredRoles?.join(", ") || "None"}</strong></span>
                      <span>Team size: <strong>{startup.teamMembers.length + 1}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar - meetings & notifications widgets */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Meetings widgets */}
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" /> Active Video Calls
              </h3>

              {meetings.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No video calls active currently. Use the **Pitch Room** button next to your startups to start a WebRTC room.
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-muted/50 p-3 rounded-lg border border-border/60 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate">{meeting.startup?.name || "Startup"} Room</h4>
                        <span className="text-[10px] text-muted-foreground">Code: {meeting.meetingCode}</span>
                      </div>
                      <Link href={`/meeting/${meeting.meetingCode}`}>
                        <Button size="sm" className="h-8 font-black text-xs">
                          Join Call
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team details helper */}
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Core Team Sync
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Approve candidate request applications in your **Mailbox** to add them to your core team rosters and list them publicly.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
