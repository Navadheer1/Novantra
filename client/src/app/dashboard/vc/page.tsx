"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Search, Send, Clock, CheckCircle2, XCircle, Sparkles, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface Request {
  id: string;
  requestType: string;
  status: string;
  createdAt: string;
  startup: {
    id: string;
    name: string;
    logo: string | null;
  };
  receiverFounder: {
    name: string;
  };
}

interface DBUser {
  id: string;
  name: string;
  openToInvest: boolean;
  ticketSize: string | null;
}

export default function VCDashboard() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingToggle, setUpdatingToggle] = useState(false);

  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else {
        loadInvestorData();
      }
    }
  }, [clerkLoaded, clerkUser]);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const loadInvestorData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      // 1. Fetch DB User
      if (clerkUser?.id) {
        const userRes = await fetch(`${apiUrl}/api/users/clerk/${clerkUser.id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.role !== "INVESTOR") {
            router.push("/dashboard");
            return;
          }
          setDbUser(userData);
        }
      }

      // 2. Fetch Sent Requests (Pitches/Investments)
      if (token) {
        const requestsRes = await fetch(`${apiUrl}/api/requests/sent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequests(requestsData);
        }
      }
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInvest = async (checked: boolean) => {
    try {
      setUpdatingToggle(true);
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${getApiUrl()}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ openToInvest: checked })
      });

      if (res.ok) {
        const updated = await res.json();
        setDbUser(prev => prev ? { ...prev, openToInvest: updated.openToInvest } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingToggle(false);
    }
  };

  const pendingPitchesCount = requests.filter(r => r.status === "PENDING").length;
  const connectedStartupsCount = requests.filter(r => r.status === "ACCEPTED").length;
  const connectedStartups = requests.filter(r => r.status === "ACCEPTED");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Configuring your investor console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Investor Console</h1>
            <p className="text-muted-foreground mt-1">Discover startup opportunities, track allocation pitches, and toggle status.</p>
          </div>
          <Link href="/startups">
            <Button className="font-bold flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Explore Startups
            </Button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Pitches Sent (Pending)</p>
              <h3 className="text-3xl font-black text-foreground mt-0.5">{pendingPitchesCount}</h3>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Connected Portfolio</p>
              <h3 className="text-3xl font-black text-foreground mt-0.5">{connectedStartupsCount}</h3>
            </div>
          </div>

          {/* Profile Status Toggle Widget */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Dealflow Status</p>
                <h4 className="font-extrabold text-sm text-foreground mt-0.5">
                  {dbUser?.openToInvest ? "Open to Inquiries" : "Inquiries Closed"}
                </h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={dbUser?.openToInvest || false}
                  disabled={updatingToggle}
                  onChange={(e) => handleToggleInvest(e.target.checked)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 leading-snug">
              When toggled ON, you will appear in the public Investors directory for founders to send pitches.
            </p>
          </div>
        </div>

        {/* Dashboard Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Outgoing Pitches Tracker */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-extrabold text-foreground">Sent Allocation Requests</h2>

            {requests.length === 0 ? (
              <div className="bg-card border border-border p-12 rounded-xl text-center shadow-sm">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No investment requests sent</h3>
                <p className="text-muted-foreground mb-6">Discover promising startups and send them connection or funding requests.</p>
                <Link href="/startups">
                  <Button className="font-bold">Explore Startups Directory</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-card border border-border p-6 rounded-xl flex justify-between items-center gap-4 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary/10 text-primary rounded-lg flex items-center justify-center overflow-hidden border">
                        {req.startup.logo ? (
                          <img src={req.startup.logo} alt={req.startup.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm">{req.startup.name}</h4>
                        <p className="text-xs text-muted-foreground">Founder: {req.receiverFounder?.name || "Unknown"}</p>
                      </div>
                    </div>

                    <div className={`text-center font-bold px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 ${
                      req.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      req.status === "ACCEPTED" ? "bg-green-50 text-green-700 border-green-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {req.status === "PENDING" ? <Clock className="w-4 h-4" /> :
                       req.status === "ACCEPTED" ? <CheckCircle2 className="w-4 h-4" /> :
                       <XCircle className="w-4 h-4" />}
                      <span>{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar connected startups list */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Portfolio Connections
              </h3>

              {connectedStartups.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No accepted investments or connected startups yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {connectedStartups.map((req) => (
                    <div key={req.id} className="bg-muted/50 p-3 rounded-lg border border-border/60 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate">{req.startup.name}</h4>
                        <span className="text-[10px] text-muted-foreground">Founder: {req.receiverFounder?.name}</span>
                      </div>
                      <Link href={`/startups/${req.startup.id}`}>
                        <Button size="sm" variant="outline" className="h-8 font-black text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
