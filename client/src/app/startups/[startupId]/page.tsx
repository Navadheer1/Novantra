"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Building2, MapPin, Target, DollarSign, Briefcase, 
  Send, ExternalLink, Loader2, ArrowLeft, Users, 
  Shield, CheckCircle2, UserCheck, Sparkles, MessageSquare,
  Globe, Bell, Heart, Share2, Play, Tv, Mic,
  ListTodo, TrendingUp, Calendar, Info, Star, FileText
} from "lucide-react";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import Link from "next/link";
import { 
  mockStartups, mockVideos, mockShorts, mockPodcasts, 
  mockJobs, mockInvestors, mockCommunityPosts, mockEvents 
} from "@/components/explore/discovery/mockDiscoveryData";

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

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "updates" | "foundertv" | "products" | "team" | "jobs" | "investors" | "roadmap" | "community" | "media" | "about"
  >("overview");

  // Local Action States
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  // Connection Request Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [customRoleTitle, setCustomRoleTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // New Redesigned Modal States
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [availability, setAvailability] = useState("immediate");
  const [openToRelocation, setOpenToRelocation] = useState(false);
  const [useProfileAsPrimary, setUseProfileAsPrimary] = useState(true);
  const [uploadedResumeName, setUploadedResumeName] = useState("");
  const [uploadedDeckName, setUploadedDeckName] = useState("");

  const [founderProposal, setFounderProposal] = useState("");
  const [equityExpectation, setEquityExpectation] = useState("");
  const [elevatorPitch, setElevatorPitch] = useState("");
  const [raisingAmount, setRaisingAmount] = useState("");
  const [fundingStageSelect, setFundingStageSelect] = useState("Seed");

  const [mentorshipGoals, setMentorshipGoals] = useState("");
  const [mentorshipInterests, setMentorshipInterests] = useState("");
  const [mentorshipQuestions, setMentorshipQuestions] = useState("");

  // Community discussion state
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      loadStartupData();
    } else if (clerkLoaded && !clerkUser) {
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

      if (clerkUser?.id) {
        const userRes = await fetch(`${getApiUrl()}/api/users/clerk/${clerkUser.id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setDbUserId(userData.id);
          setUserRole(userData.role);
        }
      }

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

  // Find matching rich mock startup in ecosystem
  const ecoStartup = mockStartups.find(
    (s) => s.id === startupId || s.name.toLowerCase() === startup?.name.toLowerCase()
  ) || mockStartups[0];

  useEffect(() => {
    if (ecoStartup?.reviews) {
      setReviewsList(ecoStartup.reviews);
    }
  }, [ecoStartup]);

  const openRequestModal = (type: string, job?: any) => {
    if (!clerkUser) {
      router.push("/auth/login");
      return;
    }
    setRequestType(type);
    setSelectedJob(job || null);

    // Initial default message based on type
    if (type === "JOB" || type === "INTERN") {
      setCustomMessage(`Hi, I am excited to apply for the ${job?.title || "role"} at ${startup?.name}.`);
    } else if (type === "INVESTMENT") {
      setCustomMessage(`Interested in pitching investment to ${startup?.name}.`);
      setRaisingAmount(startup?.fundingNeeded || "500000");
      setElevatorPitch(ecoStartup?.description || "");
    } else {
      setCustomMessage(`Hi, I would love to connect to discuss potential collaboration/role opportunities.`);
    }

    setCustomRoleTitle("");
    setIsModalOpen(true);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startup) return;

    try {
      setSubmitting(true);
      const token = await getToken();

      const applicationPayload = {
        type: requestType,
        message: customMessage,
        roleTitle: customRoleTitle || selectedJob?.title || undefined,
        expectedSalary: expectedSalary || undefined,
        availability: availability || undefined,
        openToRelocation: openToRelocation || undefined,
        useProfileAsPrimary: useProfileAsPrimary || undefined,
        resumeFileName: uploadedResumeName || undefined,
        proposal: founderProposal || undefined,
        equityExpectation: equityExpectation || undefined,
        raisingAmount: raisingAmount || undefined,
        fundingRound: fundingStageSelect || undefined,
        deckFileName: uploadedDeckName || undefined,
        elevatorPitch: elevatorPitch || undefined,
        mentorshipGoals: mentorshipGoals || undefined,
        mentorshipInterests: mentorshipInterests || undefined,
        mentorshipQuestions: mentorshipQuestions || undefined
      };

      const res = await fetch(`${getApiUrl()}/api/startups/${startup.id}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(applicationPayload)
      });

      if (res.ok) {
        alert("Your professional application has been submitted successfully!");
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

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: `rev-added-${Date.now()}`,
      userName: clerkUser?.fullName || "Anonymous Builder",
      userAvatar: clerkUser?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      rating: newReviewRating,
      comment: newReviewText
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setNewReviewText("");
  };

  const getModalTitle = () => {
    if (requestType === "JOB" || requestType === "INTERN") return "Apply for Position";
    if (requestType === "COFOUNDER" || requestType === "ROLE") return "Request Collaboration";
    if (requestType === "INVESTMENT") return "Pitch to Investor";
    return "Connect with Founder";
  };

  const getModalSubtitle = () => {
    if (requestType === "JOB" || requestType === "INTERN") return `Submit application to ${startup?.name}`;
    if (requestType === "COFOUNDER" || requestType === "ROLE") return `Partner with ${startup?.founder.name}`;
    if (requestType === "INVESTMENT") return `Pitch funding request for ${startup?.name}`;
    return `Introduce yourself to ${startup?.founder.name}`;
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

  // Filter linked ecosystem items
  const relatedVideos = mockVideos.filter(v => v.startupId === ecoStartup.id);
  const relatedPodcasts = mockPodcasts.filter(p => p.relatedStartupId === ecoStartup.id);
  const relatedShorts = mockShorts.filter(s => s.relatedStartupId === ecoStartup.id);
  const relatedJobs = mockJobs.filter(j => j.companyId === ecoStartup.id);
  const relatedEvents = mockEvents.filter(e => e.location.toLowerCase().includes(ecoStartup.name.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Back Link */}
        <Link href="/explore?view=recommended" className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Discovery Feed
        </Link>

        {/* PREMIUM BANNER HERO CARD */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl shadow-xs overflow-hidden">
          
          {/* Cover image wrapper */}
          <div className="h-44 sm:h-52 relative w-full bg-neutral-950 overflow-hidden">
            {ecoStartup.banner ? (
              <img src={ecoStartup.banner} alt="Cover" className="w-full h-full object-cover opacity-75" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-neutral-800 to-neutral-950" />
            )}

            {/* Quick Actions (Follow, Notifications, Share) */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`p-2 rounded-xl border focus:outline-none transition shadow-sm ${
                  isFollowing 
                    ? "bg-white text-red-500 border-white" 
                    : "bg-black/60 text-white border-white/20 hover:bg-black/85"
                }`}
                title="Follow Startup"
              >
                <Heart className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`} />
              </button>

              <button 
                onClick={() => setIsNotified(!isNotified)}
                className={`p-2 rounded-xl border focus:outline-none transition shadow-sm ${
                  isNotified 
                    ? "bg-white text-orange-500 border-white" 
                    : "bg-black/60 text-white border-white/20 hover:bg-black/85"
                }`}
                title="Toggle Notifications"
              >
                <Bell className={`w-4 h-4 ${isNotified ? "fill-current animate-swing" : ""}`} />
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Startup hub link copied to clipboard!");
                }}
                className="p-2 rounded-xl border bg-black/60 text-white border-white/20 hover:bg-black/85 focus:outline-none transition shadow-sm"
                title="Share Hub"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 bg-white dark:bg-neutral-900">
            
            {/* Logo, Title & Tagline */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white dark:border-neutral-900 overflow-hidden shadow-md flex items-center justify-center shrink-0 -mt-14 md:-mt-16 relative z-10">
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-neutral-400" />
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
                  <span>{startup.name}</span>
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 fill-current" />
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 font-bold">
                  {startup.tagline || ecoStartup.description.split(". ")[0]}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 justify-center md:justify-start">
                  <span className="text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2.5 py-0.5 rounded font-bold uppercase">
                    {startup.industry}
                  </span>
                  <span className="text-[9px] bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded border border-green-200 dark:border-green-900 font-bold uppercase">
                    {startup.stage} Stage
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 justify-center shrink-0">
              {/* Social/Link actions */}
              <div className="flex items-center space-x-1.5 mr-2">
                <a href={ecoStartup.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 border dark:border-neutral-750 text-neutral-600 dark:text-neutral-350 transition">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={`https://github.com/${startup.name.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 border dark:border-neutral-750 text-neutral-600 dark:text-neutral-350 transition">
                  <Github className="w-4 h-4" />
                </a>
              </div>

              {isOwner ? (
                <Link href={`/dashboard/founder/startup/${startup.id}`}>
                  <Button className="font-bold flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90">
                    <Shield className="w-4 h-4" /> Manage Startup
                  </Button>
                </Link>
              ) : (
                <>
                  {userRole === "INVESTOR" && (
                    <Button onClick={() => openRequestModal("INVESTMENT")} className="font-bold flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black">
                      <Send className="w-4 h-4" /> Pitch Investment
                    </Button>
                  )}

                  {userRole === "USER" && (
                    <div className="flex gap-2">
                      <Button onClick={() => openRequestModal("JOB")} className="font-bold text-xs rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black">
                        Apply for Jobs
                      </Button>
                    </div>
                  )}

                  {userRole === "FOUNDER" && (
                    <Button onClick={() => openRequestModal("COFOUNDER")} className="font-bold flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black">
                      <Send className="w-4 h-4" /> Request Co-Founder
                  </Button>
                  )}

                  {!userRole && (
                    <Button variant="secondary" className="font-bold text-xs rounded-xl" disabled>
                      Sign In to Pitch
                    </Button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

        {/* TABS SELECTOR MENU */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 flex overflow-x-auto scrollbar-none p-1 shrink-0">
          {[
            { id: "overview", label: "Overview" },
            { id: "updates", label: "Updates" },
            { id: "foundertv", label: "FounderTV" },
            { id: "products", label: "Products" },
            { id: "team", label: "Team" },
            { id: "jobs", label: "Jobs" },
            { id: "investors", label: "Investors" },
            { id: "roadmap", label: "Roadmap" },
            { id: "community", label: "Community" },
            { id: "media", label: "Media" },
            { id: "about", label: "About" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-black border-b-2 transition focus:outline-none whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-neutral-900 dark:border-white text-neutral-950 dark:text-white"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-350"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB PANELS LAYOUT */}
        <div className="pt-2">

          {/* OVERVIEW PANEL */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="md:col-span-2 space-y-6">
                
                {/* Briefing stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Total upvotes</span>
                    <p className="text-base font-black text-neutral-900 dark:text-white">{ecoStartup.upvotesCount || 120}</p>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">ARR</span>
                    <p className="text-base font-black text-neutral-900 dark:text-white">{ecoStartup.metrics.arr || "$150K"}</p>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Growth</span>
                    <p className="text-base font-black text-emerald-500">{ecoStartup.metrics.growth || "15% MoM"}</p>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">DAU</span>
                    <p className="text-base font-black text-neutral-900 dark:text-white">{ecoStartup.metrics.dau?.split(" ")[0] || "500"}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl space-y-3">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Pitch Synopsis</h3>
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-semibold">
                    {ecoStartup.launchPitch || startup.description}
                  </p>
                </div>

                {/* Milestones list snippet */}
                {ecoStartup.buildInPublicTimeline && (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Recent Milestones</h3>
                    <div className="space-y-4 border-l border-neutral-200 dark:border-neutral-850 pl-4.5 ml-2.5">
                      {ecoStartup.buildInPublicTimeline.slice(0, 3).map((item) => (
                        <div key={item.day} className="relative space-y-1">
                          <span className="absolute -left-7 top-1 w-2.5 h-2.5 bg-neutral-900 dark:bg-white rounded-full" />
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white flex flex-wrap items-center gap-2">
                            <span>{item.title}</span>
                            <span className="text-[9px] bg-neutral-50 dark:bg-neutral-955 text-neutral-500 px-2 py-0.5 rounded">{item.day}</span>
                          </h4>
                          <p className="text-xs text-neutral-500 font-semibold leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Quick Details */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl space-y-3.5 text-xs sm:text-sm font-semibold">
                  <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-neutral-450 border-b pb-2">Quick Stats</h3>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                    <Target className="w-4 h-4 text-neutral-400" />
                    <span>{startup.stage} Stage</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span>{ecoStartup.employeesCount || startup.teamSize} employees</span>
                  </div>
                  {startup.fundingNeeded && (
                    <div className="flex items-center gap-2 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Seeking: ${Number(startup.fundingNeeded).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* UPDATES PANEL */}
          {activeTab === "updates" && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Build in Public Timeline</h3>
              {ecoStartup.buildInPublicTimeline && ecoStartup.buildInPublicTimeline.map((item) => (
                <div key={item.day} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold">
                    <span>{item.day} • Stage: {item.stage}</span>
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-450 px-2 py-0.5 rounded">Milestone</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* FOUNDERTV PANEL */}
          {activeTab === "foundertv" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {relatedVideos.length > 0 ? (
                relatedVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => router.push(`/explore?view=foundertv&video=${video.id}`)}
                    className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-350 dark:hover:border-neutral-700 transition"
                  >
                    <div className="aspect-video bg-neutral-950 relative overflow-hidden">
                      <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {Math.floor(video.duration / 60)}m
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-neutral-400">{video.technology}</h4>
                      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-neutral-450 italic font-semibold">
                  No video logs uploaded to FounderTV yet. Check back soon for tutorials or pitches!
                </div>
              )}
            </div>
          )}

          {/* PRODUCTS PANEL */}
          {activeTab === "products" && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Core Product Suite</h3>
                <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">{startup.name} v1.0 Production Sandbox</h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-semibold leading-relaxed">
                  Our product is configured to streamline B2B scaling boundaries. Features an ultra fast Rust compiler backend core, and keyboard-first Next.js clients.
                </p>

                <div className="border-t border-neutral-100 dark:border-neutral-850 pt-4 space-y-2.5">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Technology Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {ecoStartup.techStack.map(tech => (
                      <span key={tech} className="bg-neutral-50 dark:bg-neutral-955 text-neutral-600 dark:text-neutral-450 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold px-3 py-1 rounded-xl">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEAM PANEL */}
          {activeTab === "team" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {/* Founder */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-full bg-neutral-100 overflow-hidden shrink-0 border">
                  {startup.founder.avatarUrl ? (
                    <img src={startup.founder.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10">
                      {startup.founder.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{startup.founder.name}</h4>
                  <span className="text-[9px] bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900 px-2 py-0.5 rounded font-black uppercase inline-block mt-0.5">
                    Founder & CEO
                  </span>
                </div>
              </div>

              {/* Database Team Members */}
              {startup.teamMembers.map((member) => (
                <div key={member.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-full bg-neutral-105 overflow-hidden shrink-0 border">
                    {member.user.avatarUrl ? (
                      <img src={member.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-neutral-400 bg-neutral-100">
                        {member.user.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.user.name}</h4>
                    <span className="text-[9px] bg-neutral-50 dark:bg-neutral-950 text-neutral-550 border dark:border-neutral-800 px-2 py-0.5 rounded font-bold uppercase inline-block mt-0.5">
                      {member.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}

              {/* Seeded Ecosystem Employees */}
              {ecoStartup.employees && ecoStartup.employees.map((member, idx) => (
                <div key={idx} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl flex items-center space-x-3.5">
                  <img src={member.avatar} alt="" className="w-11 h-11 rounded-full object-cover border shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{member.name}</h4>
                    <span className="text-[9px] bg-neutral-50 dark:bg-neutral-950 text-neutral-550 border dark:border-neutral-850 px-2 py-0.5 rounded font-bold uppercase inline-block mt-0.5">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* JOBS PANEL */}
          {activeTab === "jobs" && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Available Opportunities</h3>
                <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-850 px-2.5 py-0.5 rounded font-bold">
                  {relatedJobs.length} openings
                </span>
              </div>

              {relatedJobs.length > 0 ? (
                <div className="space-y-4">
                  {relatedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl flex justify-between items-center shadow-xs"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] bg-neutral-50 dark:bg-neutral-955 text-neutral-550 border dark:border-neutral-800 px-2 py-0.5 rounded font-bold">
                          {job.type}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white mt-1.5">{job.title}</h4>
                        <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{job.companyName} • {job.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block">{job.salary}</span>
                        <button 
                          onClick={() => openRequestModal("JOB")}
                          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 text-[10px] font-extrabold px-3.5 py-1.5 rounded-xl transition mt-2 focus:outline-none"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Educational Empty State */
                <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-850 space-y-3">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white">No active job listings</h3>
                  <p className="text-xs text-neutral-450 px-6 max-w-sm mx-auto leading-relaxed font-semibold">
                    This startup is not actively hiring right now. Try exploring other AI, SaaS, or cybersecurity careers in the opportunities hub!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* INVESTORS PANEL */}
          {activeTab === "investors" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {startup.connectedInvestors && startup.connectedInvestors.length > 0 ? (
                startup.connectedInvestors.map((investor) => (
                  <div key={investor.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-full bg-neutral-100 overflow-hidden shrink-0 border">
                      {investor.avatarUrl ? (
                        <img src={investor.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-green-700 bg-green-50">
                          {investor.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white leading-tight">{investor.name}</h4>
                      <span className="text-[9px] bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900 px-2 py-0.5 rounded font-black uppercase inline-block mt-0.5">
                        Partner Investor
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-neutral-450 italic font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl">
                  No connected institutional investors listed. Seeking investors matching pre-seed targets.
                </div>
              )}
            </div>
          )}

          {/* ROADMAP PANEL */}
          {activeTab === "roadmap" && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Development Roadmap</h3>
              
              {ecoStartup.roadmap && ecoStartup.roadmap.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 p-5 rounded-3xl flex justify-between items-center shadow-xs">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">{item.title}</h4>
                    <span className="text-[10px] text-neutral-450 font-bold">Target Deadline: {item.target}</span>
                  </div>
                  <span className={`text-[9.5px] font-black border rounded px-2.5 py-0.5 uppercase tracking-wider ${
                    item.status === 'completed' 
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900"
                      : item.status === 'in_progress'
                      ? "bg-orange-50 text-orange-650 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900"
                      : "bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-neutral-850 dark:text-neutral-450 dark:border-neutral-800"
                  }`}>
                    {item.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* COMMUNITY PANEL */}
          {activeTab === "community" && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Builder Reviews & Critique</h3>
                <span className="text-[10px] text-neutral-450 bg-neutral-100 dark:bg-neutral-850 px-2.5 py-0.5 rounded font-bold">
                  {reviewsList.length} reviews
                </span>
              </div>

              {/* Review submit form */}
              <form onSubmit={handlePostReview} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xs">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase">Write Review / Critique</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star className={`w-4 h-4 ${star <= newReviewRating ? "text-yellow-500 fill-current" : "text-neutral-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="Share constructive feedback about stack architecture or design layout..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm border border-neutral-250 dark:border-neutral-800 bg-neutral-55/40 focus:bg-white dark:focus:bg-neutral-900 rounded-2xl focus:outline-none transition"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 text-xs font-semibold px-4 py-2 rounded-2xl transition focus:outline-none"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>

              {/* Reviews lists */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        <img src={rev.userAvatar} alt="" className="w-7 h-7 rounded-full object-cover border" />
                        <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white">{rev.userName}</h4>
                      </div>
                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= rev.rating ? "text-yellow-500 fill-current" : "text-neutral-250"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-semibold pl-9.5">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEDIA PANEL */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Podcasts */}
              {relatedPodcasts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Podcasts Discussions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPodcasts.map((podcast) => (
                      <div
                        key={podcast.id}
                        onClick={() => router.push(`/explore?view=podcasts&podcast=${podcast.id}`)}
                        className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl flex items-center space-x-4 hover:border-neutral-350 dark:hover:border-neutral-700 transition"
                      >
                        <img src={podcast.artworkUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border" />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white truncate">{podcast.title}</h4>
                          <p className="text-[10px] text-neutral-500 font-semibold line-clamp-1 mt-0.5">{podcast.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shorts */}
              {relatedShorts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Short Logs</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {relatedShorts.map((short) => (
                      <div
                        key={short.id}
                        onClick={() => router.push(`/explore?view=shorts&short=${short.id}`)}
                        className="group cursor-pointer aspect-[9/16] bg-neutral-955 border dark:border-neutral-850 rounded-2xl overflow-hidden relative"
                      >
                        <img src="https://images.unsplash.com/photo-1542744094-2ab25be78b90?w=300&q=80" alt="" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/85 to-transparent">
                          <p className="text-white text-xs font-bold line-clamp-2">{short.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedPodcasts.length === 0 && relatedShorts.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl italic text-neutral-450 font-semibold">
                  No additional podcast talks or short clips uploaded.
                </div>
              )}
            </div>
          )}

          {/* ABOUT PANEL */}
          {activeTab === "about" && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-6 rounded-3xl space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-450 mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-semibold">
                  {startup.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-455 mb-2">Hub Founder</h3>
                <div className="flex items-center space-x-3.5 p-3.5 bg-neutral-50 dark:bg-neutral-955 rounded-2xl border dark:border-neutral-850">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                    {startup.founder.avatarUrl ? (
                      <img src={startup.founder.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10">
                        {startup.founder.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white leading-none">{startup.founder.name}</h4>
                    <span className="text-[10px] text-neutral-450 font-semibold mt-1 block">Founder & CEO • Contact: {startup.founder.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Redesigned Professional Application Modal Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-150 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-955/50 shrink-0 flex justify-between items-center">
              <div>
                <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-orange-500" />
                  <span>{getModalTitle()}</span>
                </h3>
                <p className="text-xs text-neutral-450 mt-0.5">{getModalSubtitle()}</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-955 transition focus:outline-none"
              >
                Close
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSendRequest} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 1. JOB APPLICATION VIEW */}
              {(requestType === "JOB" || requestType === "INTERN") && (
                <div className="space-y-6">
                  
                  {/* Job Details Card */}
                  {selectedJob && (
                    <div className="bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-850 p-4.5 rounded-2xl space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-sm font-black text-neutral-900 dark:text-white">{selectedJob.title}</h4>
                          <p className="text-[11px] text-neutral-450 font-semibold">{startup.name} • {selectedJob.location} • {selectedJob.type}</p>
                        </div>
                        <span className="text-xs font-black text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border dark:border-neutral-800 px-3 py-1 rounded-lg">
                          {selectedJob.salary}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Match Score Widget */}
                  <div className="bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20 p-4.5 rounded-2xl flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center shrink-0 bg-white dark:bg-neutral-900">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">94%</span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">AI Match Score Analysis</h4>
                      <ul className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-450 space-y-1">
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-500">✓</span> Skills Match: Your stack (React, Next.js, TypeScript) matches this position perfectly.
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-500">✓</span> Location Match: remote availability matches the startup work guidelines.
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-500">✓</span> Domain Affinity: Experience in early stage SaaS aligns with hiring goals.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Toggle Profile Primary */}
                  <div className="flex items-center justify-between p-1">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-neutral-800 dark:text-white block">Use Noventra Profile as Primary Application</span>
                      <span className="text-[10px] text-neutral-450 block font-bold">Auto-fills resume, experience, and coordinates</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={useProfileAsPrimary}
                      onChange={(e) => setUseProfileAsPrimary(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 dark:accent-white focus:ring-0 focus:outline-none"
                    />
                  </div>

                  {/* Profile Preview */}
                  {useProfileAsPrimary && (
                    <div className="bg-neutral-50/50 dark:bg-neutral-955/30 border border-neutral-200/50 dark:border-neutral-850 p-4.5 rounded-2xl space-y-3">
                      <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Noventra Profile Preview</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <span className="text-[9px] text-neutral-400 block uppercase">Full Name</span>
                          <span className="text-neutral-800 dark:text-neutral-200">{clerkUser?.fullName || "Nayud Nayudu"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-neutral-400 block uppercase">Email</span>
                          <span className="text-neutral-800 dark:text-neutral-200">{clerkUser?.primaryEmailAddress?.emailAddress || "nayudu@noventra.com"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-neutral-400 block uppercase">GitHub</span>
                          <span className="text-neutral-800 dark:text-neutral-200">github.com/developer-user</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-neutral-400 block uppercase">LinkedIn</span>
                          <span className="text-neutral-800 dark:text-neutral-200">linkedin.com/in/developer-user</span>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <span className="text-[9px] text-neutral-400 block uppercase">Skills</span>
                          <span className="text-neutral-800 dark:text-neutral-200">Next.js, TypeScript, Tailwind, React, Node.js</span>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <span className="text-[9px] text-neutral-400 block uppercase">Experience Summary</span>
                          <span className="text-neutral-800 dark:text-neutral-200">Senior Frontend Architect (3 Years) • Stanford CS</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Expected Salary</label>
                      <input
                        type="text"
                        placeholder="e.g. $120,000/yr"
                        className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Availability</label>
                      <select
                        className="w-full p-2.5 border border-neutral-200 dark:border-neutral-855 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                      >
                        <option value="immediate">Immediate Availability</option>
                        <option value="2weeks">2 Weeks Notice</option>
                        <option value="1month">1 Month Notice</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="relocate"
                      checked={openToRelocation}
                      onChange={(e) => setOpenToRelocation(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-350 accent-neutral-900 dark:accent-white focus:ring-0 focus:outline-none"
                    />
                    <label htmlFor="relocate" className="text-xs font-bold text-neutral-600 dark:text-neutral-300 cursor-pointer">
                      Open to relocation
                    </label>
                  </div>

                  {/* Resume upload override */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-500 uppercase">Override Resume File (Optional)</label>
                    <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-center hover:border-neutral-450 transition relative">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedResumeName(file.name);
                        }}
                      />
                      <p className="text-xs text-neutral-500 font-semibold">
                        {uploadedResumeName ? `Selected File: ${uploadedResumeName}` : "Click or drag files here to override profile resume (.pdf)"}
                      </p>
                    </div>
                  </div>

                  {/* Cover Message */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Cover Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Explain why you want to join this team..."
                      className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-955 dark:focus:ring-white resize-none transition"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>

                </div>
              )}

              {/* 2. FOUNDER COLLABORATION VIEW */}
              {(requestType === "COFOUNDER" || requestType === "ROLE") && (
                <div className="space-y-6">
                  
                  {/* Info details */}
                  <div className="bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-850 p-4.5 rounded-2xl space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Collaboration Intent</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-[9px] text-neutral-450 block uppercase">Target Startup</span>
                        <span className="text-neutral-800 dark:text-neutral-200">{startup.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-450 block uppercase">Target Founder</span>
                        <span className="text-neutral-800 dark:text-neutral-200">{startup.founder.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Proposal field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Short Proposal Summary</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe how your expertise can help build this product, and explain your previous startup experience..."
                      className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white resize-none transition"
                      value={founderProposal}
                      onChange={(e) => setFounderProposal(e.target.value)}
                    />
                  </div>

                  {/* Equity expectations */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Equity & Compensation Expectations</label>
                    <input
                      type="text"
                      placeholder="e.g. 5% - 15% equity / co-founder status"
                      className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
                      value={equityExpectation}
                      onChange={(e) => setEquityExpectation(e.target.value)}
                    />
                  </div>

                </div>
              )}

              {/* 3. INVESTMENT PITCH VIEW */}
              {requestType === "INVESTMENT" && (
                <div className="space-y-6">
                  
                  {/* Summary info */}
                  <div className="bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-850 p-4.5 rounded-2xl space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Startup Raise Pitch Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-[9px] text-neutral-450 block uppercase">Funding Stage</span>
                        <span className="text-neutral-800 dark:text-neutral-200">{startup.stage}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-450 block uppercase">Target Raise</span>
                        <span className="text-neutral-800 dark:text-neutral-200">
                          {startup.fundingNeeded ? `$${Number(startup.fundingNeeded).toLocaleString()}` : "$500,005"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-450 block uppercase">Industry Focus</span>
                        <span className="text-neutral-800 dark:text-neutral-200">{startup.industry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Raising Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Amount Pitching ($)</label>
                      <input
                        type="text"
                        placeholder="e.g. 250,000"
                        className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-955 dark:focus:ring-white transition"
                        value={raisingAmount}
                        onChange={(e) => setRaisingAmount(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Round Stage</label>
                      <select
                        className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
                        value={fundingStageSelect}
                        onChange={(e) => setFundingStageSelect(e.target.value)}
                      >
                        <option value="Pre-seed">Pre-Seed</option>
                        <option value="Seed">Seed</option>
                        <option value="SeriesA">Series A</option>
                        <option value="SeriesB">Series B</option>
                      </select>
                    </div>
                  </div>

                  {/* Deck attachments */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-500 uppercase">Attach Pitch Deck / Term Sheet</label>
                    <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-850 rounded-2xl p-4 text-center hover:border-neutral-450 transition relative">
                      <input 
                        type="file" 
                        accept=".pdf,.ppt,.pptx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedDeckName(file.name);
                        }}
                      />
                      <p className="text-xs text-neutral-500 font-semibold">
                        {uploadedDeckName ? `Attached: ${uploadedDeckName}` : "Click or drag deck slide PDF/PPT to attach"}
                      </p>
                    </div>
                  </div>

                  {/* Elevator pitch */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Elevator Pitch / Synopsis</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Provide a quick summary of the thesis, traction, and core technology stack..."
                      className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white resize-none transition"
                      value={elevatorPitch}
                      onChange={(e) => setElevatorPitch(e.target.value)}
                    />
                  </div>

                </div>
              )}

              {/* 4. MENTORSHIP / GENERIC CONNECT VIEW */}
              {requestType !== "JOB" && requestType !== "INTERN" && requestType !== "COFOUNDER" && requestType !== "ROLE" && requestType !== "INVESTMENT" && (
                <div className="space-y-6">
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Connection Intent / Goals</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Seeking technical feedback, code architecture critique, or general guidance..."
                      className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white resize-none transition"
                      value={mentorshipGoals}
                      onChange={(e) => setMentorshipGoals(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Key Areas of Interest</label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js, Rust microservices, SaaS scale architectures"
                      className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
                      value={mentorshipInterests}
                      onChange={(e) => setMentorshipInterests(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Specific Questions for the Team</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Ask specific questions about product scaling, developer hiring, or fundraising..."
                      className="w-full p-2.5 border border-neutral-200 dark:border-neutral-850 rounded-xl bg-neutral-50 dark:bg-neutral-955 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white resize-none transition"
                      value={mentorshipQuestions}
                      onChange={(e) => setMentorshipQuestions(e.target.value)}
                    />
                  </div>

                </div>
              )}

            </form>

            {/* Footer Actions */}
            <div className="p-4.5 border-t border-neutral-150 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-955/50 shrink-0 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs text-neutral-555 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-55 dark:hover:bg-neutral-955 transition focus:outline-none font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendRequest}
                type="submit" 
                disabled={submitting}
                className="px-5 py-2 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold transition disabled:opacity-40 focus:outline-none"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
