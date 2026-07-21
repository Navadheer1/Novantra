"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, X, Inbox, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/apiConfig";

interface Request {
  id: string;
  senderId: string;
  receiverFounderId: string;
  startupId: string;
  requestType: string;
  message: string | null;
  status: string;
  createdAt: string;
  sender: {
    name: string;
    email: string;
    role: string;
  };
  startup: {
    name: string;
    logo: string | null;
  };
  receiverFounder?: {
    name: string;
    email: string;
  };
}

export default function InboxPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [dbRole, setDbRole] = useState<string | null>(null);

  const [incomingRequests, setIncomingRequests] = useState<Request[]>([]);
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      fetchInboxData();
    }
  }, [clerkLoaded, clerkUser]);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const fetchInboxData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      // Fetch user role from DB
      let currentRole = "";
      if (clerkUser?.id) {
        const userEndpoint = `${apiUrl}/api/users/clerk/${clerkUser.id}`;
        console.log(`[Inbox Request] GET ${userEndpoint} | Base API URL: ${apiUrl}`);
        const userRes = await fetch(userEndpoint);
        if (userRes.ok) {
          const userData = await userRes.json();
          currentRole = userData.role?.toLowerCase() || "";
          setDbRole(currentRole);
        }
      }
      
      // Fetch incoming requests if founder
      if (currentRole === "founder" && token) {
        const incomingEndpoint = `${apiUrl}/api/requests/incoming`;
        console.log(`[Inbox Request] GET ${incomingEndpoint} | Base API URL: ${apiUrl}`);
        const incomingRes = await fetch(incomingEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (incomingRes.ok) {
          const data = await incomingRes.json();
          setIncomingRequests(data);
        }
      }

      // Fetch sent requests for anyone (investors, users)
      if (token) {
        const sentEndpoint = `${apiUrl}/api/requests/sent`;
        console.log(`[Inbox Request] GET ${sentEndpoint} | Base API URL: ${apiUrl}`);
        const sentRes = await fetch(sentEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (sentRes.ok) {
          const data = await sentRes.json();
          setSentRequests(data);
        }
      }
    } catch (err) {
      console.error("Error loading inbox details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const token = await getToken();
      const res = await fetch(`${getApiUrl()}/api/requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setIncomingRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        window.dispatchEvent(new Event("inbox-updated"));
      } else {
        alert("Action failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            Inbox Mailbox
          </h1>
          <p className="text-muted-foreground mt-1">Manage connection requests, job applications, and investment pitches.</p>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-semibold">Retrieving inbox items...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Incoming Requests Section (Founder Only) */}
            {dbRole === "founder" && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-primary" /> Incoming Applications
                </h2>

                {incomingRequests.length === 0 ? (
                  <div className="bg-card border border-border p-8 rounded-xl text-center shadow-sm text-sm text-muted-foreground">
                    No incoming requests or applications at this time.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingRequests.map((req) => (
                      <div key={req.id} className="bg-card border border-border p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:border-primary/50 transition-colors">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-base text-foreground">{req.sender.name}</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              {req.sender.role}
                            </span>
                            <span className="text-xs text-muted-foreground">• {new Date(req.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            Applying for <strong className="text-foreground">{req.requestType}</strong> at startup <strong className="text-foreground">{req.startup.name}</strong>
                          </p>

                          {req.message && (
                            <p className="text-xs bg-muted/60 p-3 rounded border border-border/50 text-muted-foreground italic max-w-xl">
                              "{req.message}"
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 w-full sm:w-36">
                          {req.status === "PENDING" ? (
                            <>
                              <Button size="sm" onClick={() => handleAction(req.id, "ACCEPTED")} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                                <Check className="w-4 h-4 mr-1.5" /> Accept
                              </Button>
                              <Button size="sm" onClick={() => handleAction(req.id, "REJECTED")} variant="destructive" className="w-full font-bold">
                                <X className="w-4 h-4 mr-1.5" /> Reject
                              </Button>
                            </>
                          ) : (
                            <div className={`text-center font-bold px-3 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1.5 ${
                              req.status === "ACCEPTED" 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                              {req.status === "ACCEPTED" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              <span>{req.status}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sent Applications Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-primary" /> Outgoing / Sent Applications
              </h2>

              {sentRequests.length === 0 ? (
                <div className="bg-card border border-border p-8 rounded-xl text-center shadow-sm text-sm text-muted-foreground">
                  You haven't submitted any job or investment applications yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {sentRequests.map((req) => (
                    <div key={req.id} className="bg-card border border-border p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:border-primary/50 transition-colors">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm text-foreground">{req.requestType.replace("_", " ")} Request</strong>
                          <span className="text-xs text-muted-foreground">• {new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          To startup: <strong className="text-foreground">{req.startup.name}</strong> (Founder: {req.receiverFounder?.name || "Unknown"})
                        </p>
                      </div>

                      {/* Status indicator */}
                      <div className={`text-center font-bold px-3 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1.5 ${
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

          </div>
        )}

      </main>
    </div>
  );
}
