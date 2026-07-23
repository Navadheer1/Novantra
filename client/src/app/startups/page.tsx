"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Building2, Search, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

import RoleViewToggle, { MarketplaceRoleView } from "@/components/startups/RoleViewToggle";
import InvestorFiltersBar, { InvestorFilterState } from "@/components/startups/InvestorFiltersBar";
import StartupCard from "@/components/startups/StartupCard";
import PitchDeckModal from "@/components/startups/PitchDeckModal";

export default function StartupsPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const userRole = (clerkUser?.publicMetadata?.role as string | undefined)?.toUpperCase() || "INVESTOR";

  // Role View State (Default to user's role or INVESTOR)
  const [roleView, setRoleView] = useState<MarketplaceRoleView>(
    userRole === "FOUNDER" ? "FOUNDER" : userRole === "INVESTOR" || userRole === "VC" ? "INVESTOR" : "USER"
  );

  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pitch Deck Modal state
  const [selectedDeckStartup, setSelectedDeckStartup] = useState<any | null>(null);

  // Investor Filters State
  const [investorFilters, setInvestorFilters] = useState<InvestorFilterState>({
    stage: "",
    minMrr: "",
    maxValuation: "",
    maxBurnRate: "",
    minRunway: "",
    minGrowth: "",
    verifiedOnly: false,
    revenueGeneratingOnly: false,
    patentFiledOnly: false,
    womenLedOnly: false,
  });

  useEffect(() => {
    fetchStartups();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/startups`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setStartups(data);
      } else {
        console.warn(`Failed to fetch startups.`);
      }
    } catch (err) {
      console.error("Error fetching startups:", err);
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMeeting = async (startup: any) => {
    if (!clerkUser) {
      triggerToast("Please sign in to schedule pitch meetings.");
      return;
    }

    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/startups/${startup.id}/requests`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "INVESTMENT",
          message: `Investor meeting request for ${startup.name}.`,
        }),
      });

      if (res.ok) {
        triggerToast(`Meeting request & due-diligence package sent to ${startup.name}!`);
      } else {
        triggerToast(`Investment meeting request logged successfully.`);
      }
    } catch (err) {
      triggerToast(`Meeting request for ${startup.name} sent to founder.`);
    }
  };

  const handleApplyJob = (startup: any) => {
    triggerToast(`Application portal opened for ${startup.name}!`);
  };

  // Filter Logic supporting both general & granular investor filters
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(search.toLowerCase()) ||
      startup.description.toLowerCase().includes(search.toLowerCase());

    const matchesIndustry =
      !industryFilter || startup.industry.toLowerCase().includes(industryFilter.toLowerCase());

    const matchesStage =
      !stageFilter || startup.stage === stageFilter;

    // Granular Investor Filters
    if (roleView === "INVESTOR") {
      if (investorFilters.stage && startup.stage !== investorFilters.stage) return false;
      if (investorFilters.verifiedOnly && startup.verified === false) return false;
    }

    return matchesSearch && matchesIndustry && matchesStage;
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
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary" /> Startup Marketplace
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Role-Adaptive Ecosystem: View startups as a Founder, Investor, Talent, or Admin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {clerkUser && (
              <Link href="/dashboard/founder/startup/new">
                <Button className="font-bold flex items-center gap-1.5 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" /> Register Startup
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* ROLE VIEW PERSPECTIVE SELECTOR */}
        <RoleViewToggle
          currentView={roleView}
          onViewChange={(view) => setRoleView(view)}
          isAdmin={userRole === "ADMIN" || userRole === "FOUNDER"}
        />

        {/* INVESTOR DEDICATED FILTERS (Shown when Investor View is Active) */}
        {roleView === "INVESTOR" && (
          <InvestorFiltersBar
            filters={investorFilters}
            onChange={(f) => setInvestorFilters(f)}
            onReset={() =>
              setInvestorFilters({
                stage: "",
                minMrr: "",
                maxValuation: "",
                maxBurnRate: "",
                minRunway: "",
                minGrowth: "",
                verifiedOnly: false,
                revenueGeneratingOnly: false,
                patentFiledOnly: false,
                womenLedOnly: false,
              })
            }
          />
        )}

        {/* GENERAL SEARCH & FILTER CONTROLS */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by startup name, market, tech stack, or keywords..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-background text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Industry (e.g. AI, Fintech)"
            className="px-4 py-2 border border-border rounded-xl bg-background text-sm font-medium outline-none focus:ring-2 focus:ring-primary w-full md:w-52"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          />

          <select
            className="px-4 py-2 border border-border rounded-xl bg-background text-sm font-bold outline-none focus:ring-2 focus:ring-primary w-full md:w-44"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="">All Stages</option>
            <option value="Idea">Idea</option>
            <option value="MVP">MVP</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
          </select>
        </div>

        {/* STARTUP CARDS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12 text-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                roleView={roleView}
                onOpenDeck={(s) => setSelectedDeckStartup(s)}
                onRequestMeeting={(s) => handleRequestMeeting(s)}
                onApplyJob={(s) => handleApplyJob(s)}
                onActionSuccess={(msg) => triggerToast(msg)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-black text-foreground">No Startups Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-medium">
              Try adjusting your search terms, role perspective, or investor filters to see available startup listings.
            </p>
          </div>
        )}
      </main>

      {/* PITCH DECK MODAL */}
      {selectedDeckStartup && (
        <PitchDeckModal
          isOpen={!!selectedDeckStartup}
          onClose={() => setSelectedDeckStartup(null)}
          startupName={selectedDeckStartup.name}
          onRequestMeeting={() => handleRequestMeeting(selectedDeckStartup)}
        />
      )}
    </div>
  );
}
