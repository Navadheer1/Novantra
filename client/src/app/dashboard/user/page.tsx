"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Search, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Request {
  id: string;
  requestType: string;
  status: string;
  createdAt: string;
  startup: {
    name: string;
    logo: string | null;
  };
  receiverFounder: {
    name: string;
  };
}

export default function UserDashboard() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else {
        loadUserData();
      }
    }
  }, [clerkLoaded, clerkUser]);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      // 1. Validate role
      if (clerkUser?.id) {
        const userRes = await fetch(`${apiUrl}/api/users/clerk/${clerkUser.id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.role !== "USER") {
            router.push("/dashboard");
            return;
          }
        }
      }

      // 2. Fetch Sent Applications
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

  const pendingCount = requests.filter(r => r.status === "PENDING").length;
  const acceptedCount = requests.filter(r => r.status === "ACCEPTED").length;
  const joinedStartups = requests.filter(r => r.status === "ACCEPTED");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Configuring your talent console...</p>
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
            <h1 className="text-3xl font-black text-foreground tracking-tight">Talent Console</h1>
            <p className="text-muted-foreground mt-1">Track job applications, review invitations, and manage your startup team memberships.</p>
          </div>
          <Link href="/startups">
            <Button className="font-bold flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Find Opportunities
            </Button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Pending Applications</p>
              <h3 className="text-3xl font-black text-foreground mt-0.5">{pendingCount}</h3>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Joined Teams</p>
              <h3 className="text-3xl font-black text-foreground mt-0.5">{acceptedCount}</h3>
            </div>
          </div>
        </div>

        {/* Workspace panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Applications list */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-extrabold text-foreground">My Applications</h2>

            {requests.length === 0 ? (
              <div className="bg-card border border-border p-12 rounded-xl text-center shadow-sm">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No applications submitted yet</h3>
                <p className="text-muted-foreground mb-6">Explore registered startups and apply to join their team.</p>
                <Link href="/startups">
                  <Button className="font-bold">Browse Ecosystem Opportunities</Button>
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
                        <p className="text-xs text-muted-foreground">{req.requestType.replace("_", " ")} Role</p>
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

          {/* Right sidebar - Joined startups lists */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Active Team Memberships
              </h3>

              {joinedStartups.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  You haven't joined any startup team roster yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {joinedStartups.map((req) => (
                    <div key={req.id} className="bg-muted/50 p-3 rounded-lg border border-border/60 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate">{req.startup.name}</h4>
                        <span className="text-[10px] text-muted-foreground">Role: {req.requestType}</span>
                      </div>
                      <Link href="/startups">
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
