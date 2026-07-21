"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Building2, MapPin, Target, DollarSign, Briefcase, 
  Send, ExternalLink, Loader2, ArrowLeft, Users, 
  Shield, CheckCircle2, UserCheck, Sparkles, MessageSquare
} from "lucide-react";
import Link from "next/link";

interface TeamMember {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface Investor {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

interface StartupDetails {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  industry: string;
  stage: string;
  location: string;
  requiredRoles: string[];
  fundingNeeded: string | null;
  tagline: string | null;
  teamSize: number;
  founderId: string;
  createdAt: string;
  founder: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  teamMembers: TeamMember[];
  connectedInvestors: Investor[];
}

export default function StartupDetailPage() {
  const { startupId } = useParams() as { startupId: string };
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [startup, setStartup] = useState<StartupDetails | null>(null);
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Request Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [customRoleTitle, setCustomRoleTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      loadStartupData();
    } else if (clerkLoaded && !clerkUser) {
      // Unauthenticated view
      loadStartupDataOnly();
    }
  }, [clerkLoaded, clerkUser, startupId]);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const loadStartupDataOnly = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${getApiUrl()}/api/startups/${startupId}`);
      if (res.ok) {
        const data = await res.json();
        setStartup(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStartupData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Resolve database user details
      if (clerkUser?.id) {
        const userRes = await fetch(`${getApiUrl()}/api/users/clerk/${clerkUser.id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setDbUserId(userData.id);
          setUserRole(userData.role);
        }
      }

      // Fetch startup details
      const res = await fetch(`${getApiUrl()}/api/startups/${startupId}`);
      if (res.ok) {
        const data = await res.json();
        setStartup(data);
      }
    } catch (err) {
      console.error("Error loading startup details:", err);
    } finally {
      setLoading(false);
    }
  };

  const openRequestModal = (type: string) => {
    if (!clerkUser) {
      router.push("/auth/login");
      return;
    }
    setRequestType(type);
    setCustomMessage(`Hi, I am interested in connecting for the ${type.toLowerCase().replace("_", " ")} opportunity.`);
    setCustomRoleTitle("");
    setIsModalOpen(true);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startup) return;

    try {
      setSubmitting(true);
      const token = await getToken();

      const res = await fetch(`${getApiUrl()}/api/startups/${startup.id}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: requestType,
          message: customMessage,
          roleTitle: customRoleTitle || undefined
        })
      });

      if (res.ok) {
        alert("Your connection request has been sent successfully!");
        setIsModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while sending your request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Retrieving startup details...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground">Startup Not Found</h2>
          <p className="text-muted-foreground text-sm max-w-sm mt-1 mb-6">The startup record may have been deleted or does not exist.</p>
          <Link href="/startups">
            <Button>Back to Startups</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = dbUserId === startup.founderId;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Back Link */}
        <Link href="/startups" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>

        {/* Brand Banner Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/70 relative"></div>
          <div className="p-6 sm:p-8 relative -mt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            
            {/* Logo, Title & Tagline */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-24 h-24 bg-card rounded-2xl border-4 border-card overflow-hidden shadow-md flex items-center justify-center flex-shrink-0">
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                  {startup.name}
                </h1>
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  {startup.tagline || "Visionary Startup in the Ecosystem"}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded">
                    {startup.industry}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-0.5 rounded border border-green-200">
                    {startup.stage} Stage
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {isOwner ? (
                <Link href={`/dashboard/founder/startup/${startup.id}`}>
                  <Button className="font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Manage Startup
                  </Button>
                </Link>
              ) : (
                <>
                  {userRole === "INVESTOR" && (
                    <Button onClick={() => openRequestModal("INVESTMENT")} className="font-bold flex items-center gap-1.5">
                      <Send className="w-4 h-4" /> Connect to Invest
                    </Button>
                  )}

                  {userRole === "USER" && (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => openRequestModal("JOB")} className="font-bold text-xs">
                        Apply Job
                      </Button>
                      <Button variant="outline" onClick={() => openRequestModal("INTERN")} className="font-bold text-xs">
                        Apply Internship
                      </Button>
                      <Button onClick={() => openRequestModal("ROLE")} className="font-bold text-xs">
                        Request Role
                      </Button>
                    </div>
                  )}

                  {userRole === "FOUNDER" && (
                    <Button onClick={() => openRequestModal("COFOUNDER")} className="font-bold flex items-center gap-1.5">
                      <Send className="w-4 h-4" /> Request Co-Founder Role
                    </Button>
                  )}

                  {!userRole && (
                    <Button variant="secondary" className="font-bold text-xs" disabled>
                      View Only (Sign in to pitch)
                    </Button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Description details (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* About / Description card */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="font-black text-sm text-muted-foreground tracking-wide uppercase">Startup Overview</h3>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {startup.description}
              </p>
            </div>

            {/* Core Team Roster */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-black text-sm text-muted-foreground tracking-wide uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" /> Core Team
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Founder Owner */}
                <div className="flex items-center gap-3 p-3.5 border border-border/80 rounded-xl bg-muted/10">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {startup.founder.avatarUrl ? (
                      <img src={startup.founder.avatarUrl} alt={startup.founder.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10">
                        {startup.founder.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground leading-tight">{startup.founder.name}</h4>
                    <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                      Founder & Owner
                    </span>
                  </div>
                </div>

                {/* Team Members */}
                {startup.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3.5 border border-border/80 rounded-xl bg-muted/10">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      {member.user.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt={member.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10">
                          {member.user.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground leading-tight">{member.user.name}</h4>
                      <span className="text-[9px] font-black uppercase text-muted-foreground bg-secondary px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        {member.role.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {startup.teamMembers.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No team members have joined yet.</p>
              )}
            </div>

            {/* Connected Investors Roster */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-black text-sm text-muted-foreground tracking-wide uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Connected Investors
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {startup.connectedInvestors && startup.connectedInvestors.map((investor) => (
                  <div key={investor.id} className="flex items-center gap-3 p-3.5 border border-border/80 rounded-xl bg-muted/10">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      {investor.avatarUrl ? (
                        <img src={investor.avatarUrl} alt={investor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-green-700 bg-green-50">
                          {investor.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground leading-tight">{investor.name}</h4>
                      <span className="text-[9px] font-black uppercase text-green-700 bg-green-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        Partner Investor
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {(!startup.connectedInvestors || startup.connectedInvestors.length === 0) && (
                <p className="text-xs text-muted-foreground italic">No connected investors listed for this startup.</p>
              )}
            </div>

          </div>

          {/* Sidebar Metadata (1 Col) */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Quick Metadata Info */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-black text-sm text-muted-foreground tracking-wide uppercase border-b border-border/60 pb-2">Details</h3>
              
              <div className="space-y-3.5 text-sm font-semibold">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{startup.location}</span>
                </div>
                
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Target className="w-4 h-4 text-primary shrink-0" />
                  <span>{startup.stage} Stage</span>
                </div>

                {startup.fundingNeeded && (
                  <div className="flex items-center gap-2.5 text-green-700">
                    <DollarSign className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Seeking: ${Number(startup.fundingNeeded).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hiring Roles List */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="font-black text-sm text-muted-foreground tracking-wide uppercase border-b border-border/60 pb-2 flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-primary" /> Active Roles
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {startup.requiredRoles && startup.requiredRoles.length > 0 ? (
                  startup.requiredRoles.map((role) => (
                    <span key={role} className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-bold">
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No open roles posted currently.</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Send Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border bg-muted/10">
              <h3 className="text-base font-black text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Submit connection request
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Introduce yourself to the startup founder.</p>
            </div>

            <form onSubmit={handleSendRequest} className="p-6 space-y-4">
              {requestType === "ROLE" && (
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Target Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Designer"
                    className="w-full p-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={customRoleTitle}
                    onChange={(e) => setCustomRoleTitle(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Introduction Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell the founder why you want to connect..."
                  className="w-full p-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
