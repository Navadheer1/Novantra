"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import ExploreHeroHeader from "@/components/explore/ExploreHeroHeader";
import AISearchDrawer from "@/components/explore/AISearchDrawer";
import ExploreCategorySelector from "@/components/explore/ExploreCategorySelector";
import ProductHuntLaunchpad from "@/components/explore/ProductHuntLaunchpad";
import InnovationRadar from "@/components/explore/InnovationRadar";
import MasonryDiscoveryFeed from "@/components/explore/MasonryDiscoveryFeed";
import FundingExplorer from "@/components/explore/FundingExplorer";
import IndustryWorldExplorer from "@/components/explore/IndustryWorldExplorer";
import ExploreRightSidebar from "@/components/explore/ExploreRightSidebar";
import ExploreFiltersDrawer from "@/components/explore/ExploreFiltersDrawer";
import { ExploreSkeleton } from "@/components/ExploreSkeleton";
import { CategoryType, ViewMode, ExploreCard } from "@/components/explore/types";
import { mockExploreFeed, mockStartups } from "@/components/explore/mockExploreData";
import { resilientFetch } from "@/lib/apiClient";

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("trending");
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    industry: searchParams.get("industry") || "",
    stage: searchParams.get("stage") || "",
    location: searchParams.get("location") || "",
    hiringOnly: searchParams.get("hiringOnly") === "true",
    openToInvestOnly: searchParams.get("openToInvestOnly") === "true",
    remoteOnly: searchParams.get("remoteOnly") === "true",
  });

  const [feedCards, setFeedCards] = useState<ExploreCard[]>(mockExploreFeed);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const fetchExploreFeed = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filters.industry) params.set("industry", filters.industry);
      if (filters.stage) params.set("stage", filters.stage);

      const response = await resilientFetch<any>(`/api/explore?${params.toString()}`, { token });

      if (response.success && response.data?.exploreFeed) {
        setFeedCards(response.data.exploreFeed);
      } else {
        // Fallback to local mock cards matching query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const filtered = mockExploreFeed.filter((c) => {
            const json = JSON.stringify(c.data).toLowerCase();
            return json.includes(q);
          });
          setFeedCards(filtered.length ? filtered : mockExploreFeed);
        } else {
          setFeedCards(mockExploreFeed);
        }
      }
    } catch (err) {
      console.error("[Explore Page Fetch Error]:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, getToken]);

  useEffect(() => {
    fetchExploreFeed();
  }, [fetchExploreFeed]);

  const handleApplyAISearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Section 1: Hero Header & Mode Switcher */}
        <ExploreHeroHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAISearch={() => setIsAISearchOpen(true)}
          onToggleFilters={() => setIsFiltersOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Section 3: Categories Selector Pills */}
        <ExploreCategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Section View Routing */}
        {viewMode === "launchpad" ? (
          <ProductHuntLaunchpad startups={mockStartups} />
        ) : viewMode === "radar" ? (
          <InnovationRadar />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Left 3 Columns: Main Discovery Feed & Spotlights */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Product Hunt Launches Teaser */}
              {selectedCategory === "startups" && (
                <ProductHuntLaunchpad startups={mockStartups.slice(0, 2)} />
              )}

              {/* AI Radar Teaser */}
              {selectedCategory === "ai" && <InnovationRadar />}

              {/* Funding Deal Explorer */}
              {selectedCategory === "fundraising" && <FundingExplorer />}

              {/* Main Masonry Feed */}
              {loading ? (
                <ExploreSkeleton />
              ) : (
                <MasonryDiscoveryFeed cards={feedCards} />
              )}

              {/* Industry & World Discovery Grid */}
              <IndustryWorldExplorer
                onSelectIndustry={(ind) => setFilters({ ...filters, industry: ind })}
                onSelectCity={(city) => setFilters({ ...filters, location: city })}
              />

              {/* Funding Deal Explorer Section */}
              <FundingExplorer />

            </div>

            {/* Right Column: Trending, Suggestions & Events */}
            <div className="lg:col-span-1">
              <ExploreRightSidebar />
            </div>

          </div>
        )}

      </main>

      {/* Section 2: AI Search Drawer */}
      <AISearchDrawer
        isOpen={isAISearchOpen}
        onClose={() => setIsAISearchOpen(false)}
        onApplyQuery={handleApplyAISearch}
      />

      {/* Advanced Filters Drawer */}
      <ExploreFiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters({ industry: "", stage: "", location: "", hiringOnly: false, openToInvestOnly: false, remoteOnly: false })}
      />
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
