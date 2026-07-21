"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { ExploreSkeleton } from "@/components/ExploreSkeleton";
import DiscoverByGoal from "@/components/explore/DiscoverByGoal";
import ExploreFilters, { FilterState } from "@/components/explore/ExploreFilters";
import WeeklySpotlight from "@/components/explore/WeeklySpotlight";
import FeaturedStartups from "@/components/explore/FeaturedStartups";
import DiscoverPeople from "@/components/explore/DiscoverPeople";
import FundingActivity from "@/components/explore/FundingActivity";
import TrendingModule from "@/components/explore/TrendingModule";
import NewsAndUpdates from "@/components/explore/NewsAndUpdates";
import { getApiUrl } from "@/lib/apiConfig";
import { Compass, Sparkles, Building2, DollarSign, Heart, Hash, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Filter & Goal States
  const [selectedGoal, setSelectedGoal] = useState(searchParams.get("goal") || "all");
  const [filters, setFilters] = useState<FilterState>({
    industry: searchParams.get("industry") || "",
    stage: searchParams.get("stage") || "",
    location: searchParams.get("location") || "",
    hiringOnly: searchParams.get("hiringOnly") === "true",
    openToInvestOnly: searchParams.get("openToInvestOnly") === "true",
    remoteOnly: searchParams.get("remoteOnly") === "true",
    verifiedOnly: searchParams.get("verifiedOnly") === "true",
  });

  const fetchExploreData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      const params = new URLSearchParams();
      if (selectedGoal && selectedGoal !== "all") params.set("goal", selectedGoal);
      if (filters.industry) params.set("industry", filters.industry);
      if (filters.stage) params.set("stage", filters.stage);
      if (filters.location) params.set("location", filters.location);
      if (filters.hiringOnly) params.set("hiringOnly", "true");
      if (filters.openToInvestOnly) params.set("openToInvestOnly", "true");
      if (filters.remoteOnly) params.set("remoteOnly", "true");

      const endpoint = `${apiUrl}/api/explore?${params.toString()}`;
      console.log(`[Explore Page Request] GET ${endpoint}`);
      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      }
    } catch (err) {
      console.error("[Explore Page Fetch Error]:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedGoal, filters, getToken]);

  useEffect(() => {
    fetchExploreData();
  }, [selectedGoal, filters]);

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    const newParams = new URLSearchParams(searchParams.toString());
    if (goalId === "all") newParams.delete("goal");
    else newParams.set("goal", goalId);
    router.push(`/explore?${newParams.toString()}`);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      industry: "",
      stage: "",
      location: "",
      hiringOnly: false,
      openToInvestOnly: false,
      remoteOnly: false,
      verifiedOnly: false,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Explore Hub Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-primary" />
              <span>Explore Discovery Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Discover active founders, venture capital, hiring startups, and ecosystem opportunities.
            </p>
          </div>
        </div>

        {/* Phase 5: Goal Selector */}
        <DiscoverByGoal selectedGoal={selectedGoal} onSelectGoal={handleSelectGoal} />

        {/* Phase 4: Sticky Filter Bar */}
        <ExploreFilters
          filters={filters}
          onChangeFilters={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {loading || !data ? (
          <ExploreSkeleton />
        ) : (
          <div className="space-y-10">
            
            {/* Phase 1: Hero Weekly Spotlight */}
            <WeeklySpotlight spotlight={data.spotlight} />

            {/* Ecosystem Categories Directory */}
            {data.startupCategories && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-foreground">Browse by Category</h3>
                  <span className="text-xs text-muted-foreground">Directories</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {data.startupCategories.map((cat: any) => (
                    <div
                      key={cat.name}
                      onClick={() => handleFilterChange({ industry: cat.tag })}
                      className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:bg-muted/40 transition-all cursor-pointer space-y-1"
                    >
                      <h4 className="font-extrabold text-xs text-foreground truncate">{cat.name}</h4>
                      <span className="text-[10px] text-primary font-bold block">{cat.count} Startups</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Multi-Column Discovery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Columns: Startups, Hiring & People */}
              <div className="lg:col-span-2 space-y-8">
                <FeaturedStartups
                  featuredStartups={data.featuredStartups}
                  hiringStartups={data.hiringStartups}
                />

                <DiscoverPeople
                  founders={data.discoverFounders}
                  investors={data.discoverInvestors}
                  recommendedPeople={data.recommendations?.recommendedPeople}
                />
              </div>

              {/* Right Column: Funding, Trends & Recommendations */}
              <div className="lg:col-span-1 space-y-8">
                <FundingActivity fundingActivity={data.fundingActivity} />

                <TrendingModule
                  trendingPosts={data.trendingPosts}
                  trendingHashtags={data.trendingHashtags}
                  trendingTopics={data.trendingTopics}
                />
              </div>

            </div>

            {/* Phase 13: Startup News & Ecosystem Updates */}
            <NewsAndUpdates news={data.news} />

          </div>
        )}

      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExplorePageContent />
    </Suspense>
  );
}
