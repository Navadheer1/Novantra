"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";
import { 
  Building2, MapPin, Target, DollarSign, Briefcase, 
  Send, ExternalLink, Loader2, ArrowLeft, Users, 
  ShieldCheck, CheckCircle2, UserCheck, Sparkles, MessageSquare,
  Globe, Bell, Heart, Share2, Play, Tv, Mic,
  ListTodo, TrendingUp, Calendar, Info, Star, FileText,
  AlertTriangle, Shield, Award, Zap
} from "lucide-react";
import Link from "next/link";
import { 
  mockStartups, mockVideos, mockShorts, mockPodcasts, 
  mockJobs, mockInvestors, mockCommunityPosts, mockEvents 
} from "@/components/explore/discovery/mockDiscoveryData";

import RoleViewToggle, { MarketplaceRoleView } from "@/components/startups/RoleViewToggle";
import InvestorDashboardWidget from "@/components/startups/InvestorDashboardWidget";
import AIInsightsWidget from "@/components/startups/AIInsightsWidget";
import PitchDeckModal from "@/components/startups/PitchDeckModal";

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
  const [loading, setLoading] = useState(true);

  // Role Perspective View
  const userRole = (clerkUser?.publicMetadata?.role as string | undefined)?.toUpperCase() || "INVESTOR";
  const [roleView, setRoleView] = useState<MarketplaceRoleView>(
    userRole === "FOUNDER" ? "FOUNDER" : userRole === "INVESTOR" || userRole === "VC" ? "INVESTOR" : "USER"
  );

  // Pitch Deck Modal state
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "deck" | "team" | "jobs" | "products" | "admin">("overview");

  // Actions
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    loadStartupData();
  }, [startupId]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadStartupData = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/startups/${startupId}`);
      if (res.ok) {
        const data = await res.json();
        setStartup(data);
      } else {
        // Fallback to mock ecosystem startup if ID is mock
        const ecoMatch = mockStartups.find((s) => s.id === startupId) || mockStartups[0];
        setStartup({
          id: ecoMatch.id,
          name: ecoMatch.name,
          logo: ecoMatch.logo || null,
          description: ecoMatch.description,
          industry: (ecoMatch as any).industry || "Technology",
          stage: (ecoMatch as any).stage || (ecoMatch as any).fundingStage || "Pre-Seed",
          location: (ecoMatch as any).location || "San Francisco, CA",
          requiredRoles: (ecoMatch as any).requiredRoles || ["Co-Founder", "Full-Stack Engineer", "UI/UX Designer"],
          fundingNeeded: (ecoMatch as any).fundingNeeded || "500000",
          tagline: (ecoMatch as any).tagline || "Pioneering Next-Gen Tech Ecosystems",
          teamSize: (ecoMatch as any).teamSize || (ecoMatch as any).employeesCount || 5,
          founderId: (ecoMatch as any).founderId || "mock-founder-id",
          createdAt: new Date().toISOString(),
          founder: {
            id: (ecoMatch as any).founderId || "mock-founder-id",
            name: (ecoMatch as any).founderName || (ecoMatch as any).founder?.name || "Alex Rivera",
            email: "founder@noventra.ai",
            role: "FOUNDER",
            avatarUrl: (ecoMatch as any).founderAvatar || null,
          },
          teamMembers: [],
          connectedInvestors: [],
        });
      }
    } catch (err) {
      console.error("Error loading startup details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMeeting = async () => {
    if (!clerkUser) {
      triggerToast("Please sign in to schedule investment meetings.");
      return;
    }
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/api/startups/${startupId}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "INVESTMENT",
          message: `Investor meeting request for ${startup?.name}.`,
        }),
      });
      triggerToast(`Pitch meeting request submitted for ${startup?.name}!`);
    } catch (err) {
      triggerToast(`Investment meeting request logged.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-muted-foreground font-semibold text-sm">Loading Startup Intelligence Hub...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mb-3" />
          <h2 className="text-xl font-bold text-foreground">Startup Not Found</h2>
          <p className="text-muted-foreground text-xs mt-1 mb-6">The requested startup could not be located.</p>
          <Link href="/startups">
            <Button size="sm">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const seekingFormatted = startup.fundingNeeded
    ? Number(startup.fundingNeeded) >= 1000000
      ? `$${(Number(startup.fundingNeeded) / 1000000).toFixed(1)}M`
      : `$${(Number(startup.fundingNeeded) / 1000).toFixed(0)}k`
    : "$500k";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-border animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BACK NAVIGATION & BREADCRUMB */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link href="/startups" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Startup Marketplace
          </Link>
        </div>

        {/* ROLE PERSPECTIVE SWITCHER */}
        <RoleViewToggle
          currentView={roleView}
          onViewChange={(view) => setRoleView(view)}
          isAdmin={userRole === "ADMIN" || userRole === "FOUNDER"}
        />

        {/* STARTUP HERO HEADER */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-primary/20 via-emerald-500/10 to-secondary/30 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-black bg-emerald-500 text-white px-3 py-1 rounded-full shadow">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED STARTUP
              </span>
              <span className="text-xs font-extrabold uppercase bg-background/90 text-foreground px-3 py-1 rounded-full border border-border">
                {startup.stage}
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-card bg-background shadow-lg overflow-hidden shrink-0 flex items-center justify-center font-black text-2xl text-primary">
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                ) : (
                  startup.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                  {startup.name}
                </h1>
                <p className="text-xs font-semibold text-muted-foreground">{startup.tagline || startup.industry}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> {startup.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> {startup.teamSize} Team Members</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-primary" /> {startup.industry}</span>
                </div>
              </div>
            </div>

            {/* HEADER ACTIONS DEPENDING ON ROLE */}
            <div className="flex items-center gap-2 shrink-0">
              {roleView === "INVESTOR" && (
                <>
                  <Button variant="outline" size="sm" className="font-bold border-emerald-500/30 text-emerald-700 dark:text-emerald-300" onClick={() => setDeckModalOpen(true)}>
                    <FileText className="w-4 h-4 mr-1.5" /> Pitch Deck
                  </Button>
                  <Button size="sm" className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleRequestMeeting}>
                    <Calendar className="w-4 h-4 mr-1.5" /> Request Meeting
                  </Button>
                </>
              )}

              {roleView === "FOUNDER" && (
                <>
                  <Button size="sm" className="font-bold bg-blue-600 hover:bg-blue-700 text-white" onClick={() => triggerToast(`Collaboration request sent to ${startup.founder.name}`)}>
                    <UserCheck className="w-4 h-4 mr-1.5" /> Join / Collaborate
                  </Button>
                  <Button variant="outline" size="sm" className="font-bold" onClick={() => setIsFollowing(!isFollowing)}>
                    {isFollowing ? "Following ✓" : "+ Follow"}
                  </Button>
                </>
              )}

              {roleView === "USER" && (
                <>
                  <Button size="sm" className="font-bold bg-purple-600 hover:bg-purple-700 text-white" onClick={() => triggerToast(`Application portal opened for ${startup.name}`)}>
                    Apply for Role
                  </Button>
                  <Button variant="outline" size="sm" className="font-bold border-purple-500/30 text-purple-700 dark:text-purple-300" onClick={() => triggerToast(`Registered for ${startup.name} Beta Program`)}>
                    Join Beta
                  </Button>
                </>
              )}

              {roleView === "ADMIN" && (
                <>
                  <Button size="sm" variant="outline" className="font-bold text-emerald-600 border-emerald-500/30" onClick={() => triggerToast(`Verified badge confirmed`)}>
                    Verify Startup
                  </Button>
                  <Button size="sm" variant="outline" className="font-bold text-blue-600 border-blue-500/30" onClick={() => triggerToast(`${startup.name} featured on homepage!`)}>
                    Feature
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROLE 1: INVESTOR VIEW EXPERIENCE                          */}
        {/* ========================================================= */}
        {roleView === "INVESTOR" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* AI Investment Readiness & Score Dashboard */}
            <InvestorDashboardWidget
              startupName={startup.name}
              stage={startup.stage}
              fundingNeeded={seekingFormatted}
              valuation="$4,200,000"
              mrr="$14,500"
              runwayMonths={14}
            />

            {/* AI Risk & Market Intelligence Insights */}
            <AIInsightsWidget startupName={startup.name} industry={startup.industry} />

            {/* FOUNDER & EXITS SNAPSHOT */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" /> Founder & Executive Track Record
              </h3>
              <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/60">
                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-xl text-primary overflow-hidden">
                  {startup.founder.avatarUrl ? (
                    <img src={startup.founder.avatarUrl} alt={startup.founder.name} className="w-full h-full object-cover" />
                  ) : (
                    startup.founder.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground">{startup.founder.name}</h4>
                  <p className="text-xs text-muted-foreground">Chief Executive Officer & Founder • {startup.founder.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                      Previous Exit ($12M Acquisition)
                    </span>
                    <span className="text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                      Ex-Google Lead Engineer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROLE 2: FOUNDER VIEW RECRUITMENT & COLLABORATION          */}
        {/* ========================================================= */}
        {roleView === "FOUNDER" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-foreground mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" /> Co-Founders & Core Talent Recruitment
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {startup.name} is currently recruiting top-tier partners and key contributors.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {startup.requiredRoles.map((role, idx) => (
                  <div key={idx} className="bg-background border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-foreground block">{role}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">Equity + Revenue Share</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 text-white font-bold text-xs" onClick={() => triggerToast(`Application started for ${role}`)}>
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION & BUILD PROGRESS */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-foreground mb-2">About & Build Progress</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-4">{startup.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>MVP Development Milestone</span>
                  <span className="text-blue-600">85% Complete</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROLE 3: USER & TALENT VIEW                                */}
        {/* ========================================================= */}
        {roleView === "USER" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> Early Access & Beta Testing Program
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Be among the first users to test {startup.name}'s products and earn early community rewards.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Enter your email to request beta invite..."
                  className="px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500 flex-1 max-w-md"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs" onClick={() => triggerToast(`Beta invite requested!`)}>
                  Request Beta Access
                </Button>
              </div>
            </div>

            {/* OPEN POSITIONS */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" /> Open Careers & Internships
              </h3>
              <div className="space-y-3">
                {["Frontend Developer Intern", "Growth Marketing Lead", "Product Designer"].map((jobTitle, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
                    <div>
                      <h4 className="text-xs font-black text-foreground">{jobTitle}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">Remote • Competitive Stipend / Salary</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs font-bold border-purple-500/30 text-purple-700 dark:text-purple-300" onClick={() => triggerToast(`Applied for ${jobTitle}`)}>
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ROLE 4: ADMIN MODERATION PANEL                             */}
        {/* ========================================================= */}
        {roleView === "ADMIN" && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
            <h3 className="text-base font-black text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" /> Platform Moderation Controls
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs" onClick={() => triggerToast(`Verified status saved!`)}>
                Verify Badge
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs" onClick={() => triggerToast(`Featured on Homepage!`)}>
                Feature Startup
              </Button>
              <Button size="sm" variant="outline" className="font-bold text-xs border-amber-500/30" onClick={() => triggerToast(`Flagged for review`)}>
                Flag for Audit
              </Button>
              <Button size="sm" variant="destructive" className="font-bold text-xs" onClick={() => triggerToast(`Startup rejected`)}>
                Reject Listing
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* PITCH DECK MODAL */}
      <PitchDeckModal
        isOpen={deckModalOpen}
        onClose={() => setDeckModalOpen(false)}
        startupName={startup.name}
        onRequestMeeting={handleRequestMeeting}
      />
    </div>
  );
}
