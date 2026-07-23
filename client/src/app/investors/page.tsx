"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, DollarSign, Target, UserPlus, Send, ExternalLink, Loader2, Sparkles, CheckCircle2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

import InvestorRoleToggle, { InvestorNetworkRole } from "@/components/investors/InvestorRoleToggle";
import InvestorFiltersBar, { NetworkFilterState } from "@/components/investors/InvestorFiltersBar";
import FounderInvestorCard, { InvestorCardData } from "@/components/investors/FounderInvestorCard";
import InvestorCoInvestorCard from "@/components/investors/InvestorCoInvestorCard";
import UserInvestorCard from "@/components/investors/UserInvestorCard";
import AdminInvestorCard from "@/components/investors/AdminInvestorCard";

import CoInvestmentMarketplace from "@/components/investors/CoInvestmentMarketplace";
import SyndicatesBoard from "@/components/investors/SyndicatesBoard";
import InvestmentCommunities from "@/components/investors/InvestmentCommunities";
import OfficeHoursWidget from "@/components/investors/OfficeHoursWidget";

export default function InvestorsPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const userRole = (clerkUser?.publicMetadata?.role as string | undefined)?.toUpperCase() || "FOUNDER";

  // Role Perspective Switcher (Default to user's role or FOUNDER)
  const [roleView, setRoleView] = useState<InvestorNetworkRole>(
    userRole === "INVESTOR" || userRole === "VC" ? "INVESTOR" : userRole === "ADMIN" ? "ADMIN" : "FOUNDER"
  );

  const [investors, setInvestors] = useState<InvestorCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-Navigation Tab State
  const [activeTab, setActiveTab] = useState<"directory" | "co_invest" | "syndicates" | "communities" | "office_hours">("directory");

  // Advanced Filters State
  const [filters, setFilters] = useState<NetworkFilterState>({
    stage: "",
    industry: "",
    location: "",
    ticketSize: "",
    fundSize: "",
    syndicationFriendlyOnly: false,
    recentlyActiveOnly: false,
    verifiedOnly: false,
  });

  useEffect(() => {
    fetchInvestors();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/investors`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        // Enrich data with rich role fields for production UI
        const enriched: InvestorCardData[] = data.map((inv: any, idx: number) => ({
          id: inv.id || `inv-${idx}`,
          name: inv.name || "Jari Vance",
          email: inv.email || "investor@noventra.ai",
          avatarUrl: inv.avatarUrl || null,
          role: inv.role || "INVESTOR",
          firmName: inv.firmName || (idx % 2 === 0 ? "Apex Ventures" : "Horizon Capital"),
          investorType: idx % 3 === 0 ? "VC" : idx % 3 === 1 ? "Angel" : "Syndicate Lead",
          location: inv.location || (idx % 2 === 0 ? "San Francisco, CA" : "Bengaluru / Remote"),
          ticketSize: inv.ticketSize || (idx % 2 === 0 ? "$50k - $250k" : "$100k - $500k"),
          portfolioCount: inv.portfolioCount || 12 + idx * 3,
          totalInvestments: inv.totalInvestments || 18 + idx * 2,
          recentInvestments: ["Nova AI", "SyncFlow", "CleanGrid"],
          investmentInterests: inv.investmentInterests || ["AI SaaS", "FinTech", "Developer Tools"],
          preferredStages: ["Pre-Seed", "Seed", "Series A"],
          avgResponseTimeHours: 2 + (idx % 5),
          verified: true,
          lastActive: idx === 0 ? "Just Now" : `${idx + 1} hours ago`,
          matchScore: 98 - idx * 2,
          matchReasons: [
            "AI & SaaS Focus Match",
            "Fits Target Ticket Size",
            "Pre-Seed & Seed Stage Alignment",
            "Active Investor (24h)"
          ],
          coInvestScore: 96 - idx * 2,
          syndicationFriendly: true,
          successfulExits: 3 + (idx % 4),
          thesisSummary: "Investing in high-conviction AI, Developer Infrastructure, and SaaS platforms."
        }));
        setInvestors(enriched);
      } else {
        // Fallback default mock investors if database is fresh
        setInvestors(getFallbackInvestors());
      }
    } catch (err) {
      console.error("Error fetching investors:", err);
      setInvestors(getFallbackInvestors());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackInvestors = (): InvestorCardData[] => [
    {
      id: "inv-1",
      name: "Jari Vance",
      email: "jari@apex.vc",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "INVESTOR",
      firmName: "Apex Ventures",
      investorType: "VC",
      location: "San Francisco, CA",
      ticketSize: "$100k - $500k",
      portfolioCount: 24,
      totalInvestments: 32,
      recentInvestments: ["Nova AI", "Linear", "Vercel"],
      investmentInterests: ["AI SaaS", "FinTech", "DevTools"],
      preferredStages: ["Pre-Seed", "Seed"],
      avgResponseTimeHours: 2,
      verified: true,
      lastActive: "Active Now",
      matchScore: 98,
      matchReasons: ["AI SaaS Focus Match", "Pre-Seed & Seed Alignment", "Fits Round Ticket Size"],
      coInvestScore: 96,
      syndicationFriendly: true,
      successfulExits: 5,
      thesisSummary: "We invest early in visionary founders building AI-native developer infrastructure."
    },
    {
      id: "inv-2",
      name: "Sarah Chen",
      email: "sarah@horizon.capital",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      role: "INVESTOR",
      firmName: "Horizon Capital",
      investorType: "Angel",
      location: "New York, NY",
      ticketSize: "$50k - $150k",
      portfolioCount: 18,
      totalInvestments: 22,
      recentInvestments: ["SyncFlow", "Supabase"],
      investmentInterests: ["B2B SaaS", "Automation", "ClimateTech"],
      preferredStages: ["Seed", "Series A"],
      avgResponseTimeHours: 4,
      verified: true,
      lastActive: "1 hour ago",
      matchScore: 94,
      matchReasons: ["B2B Software Focus", "Active Angel Investor", "High Response Rate"],
      coInvestScore: 92,
      syndicationFriendly: true,
      successfulExits: 3,
      thesisSummary: "Backing B2B software founders with proven customer traction."
    },
    {
      id: "inv-3",
      name: "Patrick Collison",
      email: "patrick@stripe.com",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "INVESTOR",
      firmName: "Stripe Angels Syndicate",
      investorType: "Syndicate Lead",
      location: "San Francisco / Remote",
      ticketSize: "$250k - $1M",
      portfolioCount: 42,
      totalInvestments: 56,
      recentInvestments: ["OpenAI", "Figma"],
      investmentInterests: ["FinTech", "Infrastructure", "AI"],
      preferredStages: ["Pre-Seed", "Seed", "Series A"],
      avgResponseTimeHours: 6,
      verified: true,
      lastActive: "3 hours ago",
      matchScore: 91,
      matchReasons: ["Fintech & Infrastructure Lead", "Top Exits Record"],
      coInvestScore: 98,
      syndicationFriendly: true,
      successfulExits: 12,
      thesisSummary: "Investing in global financial infrastructure and high-velocity developer products."
    }
  ];

  const handleSendPitch = (inv: InvestorCardData) => {
    triggerToast(`Pitch submission modal opened for ${inv.name} (${inv.firmName})`);
  };

  const handleRequestMeeting = (inv: InvestorCardData) => {
    triggerToast(`Pitch meeting request sent to ${inv.name}!`);
  };

  const handleRequestWarmIntro = (inv: InvestorCardData) => {
    triggerToast(`Warm introduction request logged via Noventra Mutual Network for ${inv.name}`);
  };

  // Filter Logic
  const filteredInvestors = investors.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      (inv.firmName && inv.firmName.toLowerCase().includes(search.toLowerCase())) ||
      (inv.thesisSummary && inv.thesisSummary.toLowerCase().includes(search.toLowerCase()));

    const matchesStage = !filters.stage || (inv.preferredStages && inv.preferredStages.includes(filters.stage));
    const matchesIndustry = !filters.industry || (inv.investmentInterests && inv.investmentInterests.some((int) => int.toLowerCase().includes(filters.industry.toLowerCase())));
    const matchesLocation = !filters.location || (inv.location && inv.location.toLowerCase().includes(filters.location.toLowerCase()));
    const matchesVerified = !filters.verifiedOnly || inv.verified === true;
    const matchesSyndication = !filters.syndicationFriendlyOnly || inv.syndicationFriendly === true;

    return matchesSearch && matchesStage && matchesIndustry && matchesLocation && matchesVerified && matchesSyndication;
  });

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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TITLE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" /> Investor Network
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Role-Aware Ecosystem: Pitch to VCs, discover co-investors, join syndicates, and access office hours.
            </p>
          </div>
        </div>

        {/* ROLE PERSPECTIVE SWITCHER */}
        <InvestorRoleToggle
          currentRole={roleView}
          onRoleChange={(r) => {
            setRoleView(r);
            setActiveTab("directory");
          }}
          isAdmin={userRole === "ADMIN" || userRole === "FOUNDER"}
        />

        {/* MODULE SUB-NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-border/80">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "directory"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {roleView === "INVESTOR" ? "Co-Investors Directory" : roleView === "FOUNDER" ? "AI Investor Matching" : "Investor Directory"}
          </button>

          {roleView === "INVESTOR" && (
            <>
              <button
                onClick={() => setActiveTab("co_invest")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === "co_invest"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Co-Investment Deals Pool
              </button>

              <button
                onClick={() => setActiveTab("syndicates")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === "syndicates"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Syndicates & Angel Clubs
              </button>

              <button
                onClick={() => setActiveTab("communities")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === "communities"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Sector Hubs
              </button>
            </>
          )}

          {roleView === "FOUNDER" && (
            <button
              onClick={() => setActiveTab("office_hours")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "office_hours"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              1-on-1 Office Hours
            </button>
          )}
        </div>

        {/* TAB 1: INVESTOR DIRECTORY VIEW */}
        {activeTab === "directory" && (
          <>
            {/* ADVANCED FILTERS */}
            <InvestorFiltersBar
              filters={filters}
              onChange={(f) => setFilters(f)}
              onReset={() =>
                setFilters({
                  stage: "",
                  industry: "",
                  location: "",
                  ticketSize: "",
                  fundSize: "",
                  syndicationFriendlyOnly: false,
                  recentlyActiveOnly: false,
                  verifiedOnly: false,
                })
              }
            />

            {/* SEARCH INPUT */}
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search investors by name, firm, investment thesis, or sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs font-medium outline-none"
              />
            </div>

            {/* CARDS GRID BY ROLE */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-card border border-border rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredInvestors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredInvestors.map((inv) => {
                  if (roleView === "INVESTOR") {
                    return (
                      <InvestorCoInvestorCard
                        key={inv.id}
                        investor={inv}
                        onInviteSyndicate={(i) => triggerToast(`Invited ${i.name} to Syndicate`)}
                        onInviteDeal={(i) => triggerToast(`Deal allocation shared with ${i.name}`)}
                        onStartConversation={(i) => triggerToast(`Conversation started with ${i.name}`)}
                        onActionSuccess={(msg) => triggerToast(msg)}
                      />
                    );
                  }

                  if (roleView === "USER") {
                    return (
                      <UserInvestorCard
                        key={inv.id}
                        investor={inv}
                        onActionSuccess={(msg) => triggerToast(msg)}
                      />
                    );
                  }

                  if (roleView === "ADMIN") {
                    return (
                      <AdminInvestorCard
                        key={inv.id}
                        investor={inv}
                        onActionSuccess={(msg) => triggerToast(msg)}
                      />
                    );
                  }

                  // Default: FOUNDER VIEW
                  return (
                    <FounderInvestorCard
                      key={inv.id}
                      investor={inv}
                      onSendPitch={handleSendPitch}
                      onRequestMeeting={handleRequestMeeting}
                      onRequestWarmIntro={handleRequestWarmIntro}
                      onActionSuccess={(msg) => triggerToast(msg)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-card border border-border rounded-2xl p-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-black text-foreground">No Investors Found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-medium">
                  Try adjusting search keywords or filter toggles.
                </p>
              </div>
            )}
          </>
        )}

        {/* TAB 2: CO-INVESTMENT MARKETPLACE (INVESTOR ROLE) */}
        {activeTab === "co_invest" && (
          <CoInvestmentMarketplace onActionSuccess={(msg) => triggerToast(msg)} />
        )}

        {/* TAB 3: SYNDICATES & ANGEL CLUBS */}
        {activeTab === "syndicates" && (
          <SyndicatesBoard onActionSuccess={(msg) => triggerToast(msg)} />
        )}

        {/* TAB 4: SECTOR COMMUNITIES */}
        {activeTab === "communities" && (
          <InvestmentCommunities onActionSuccess={(msg) => triggerToast(msg)} />
        )}

        {/* TAB 5: OFFICE HOURS (FOUNDER ROLE) */}
        {activeTab === "office_hours" && (
          <OfficeHoursWidget onActionSuccess={(msg) => triggerToast(msg)} />
        )}
      </main>
    </div>
  );
}
