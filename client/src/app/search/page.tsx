"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SearchPageSkeleton } from "@/components/SearchSkeleton";
import { 
  Search, SlidersHorizontal, User, Building2, FileText, 
  MapPin, Target, DollarSign, Briefcase, UserPlus, Send, 
  MessageSquare, ExternalLink, Filter, Sparkles, ArrowRight, X, Heart
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

interface SearchResultItem {
  id: string;
  type: "user" | "founder" | "investor" | "startup" | "post" | "hashtag";
  title: string;
  subtitle: string;
  avatarOrLogo: string | null;
  description: string;
  meta: Record<string, any>;
  relevanceScore: number;
  highlightSnippet?: string;
}

interface SearchResponse {
  results: SearchResultItem[];
  categoriesCount: {
    people: number;
    founders: number;
    investors: number;
    startups: number;
    posts: number;
    hashtags: number;
  };
  nextCursor: string | null;
  hasMore: boolean;
  parsedQueryFilter?: {
    rawQuery: string;
    extractedLocation?: string;
    extractedStage?: string;
    extractedIndustry?: string;
  };
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialType);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [resultsData, setResultsData] = useState<SearchResponse | null>(null);
  const [allResults, setAllResults] = useState<SearchResultItem[]>([]);

  // Category Specific Filter States
  const [industryFilter, setIndustryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [ticketSizeFilter, setTicketSizeFilter] = useState("");
  const [openToInvestFilter, setOpenToInvestFilter] = useState(false);

  // Sync state with URL params on change
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setActiveTab(searchParams.get("type") || "all");
  }, [searchParams]);

  const executeSearch = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const token = await getToken();
      const apiUrl = getApiUrl();

      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (activeTab && activeTab !== "all") params.set("type", activeTab);
      if (industryFilter) params.set("industry", industryFilter);
      if (stageFilter) params.set("stage", stageFilter);
      if (locationFilter) params.set("location", locationFilter);
      if (ticketSizeFilter) params.set("ticketSize", ticketSizeFilter);
      if (openToInvestFilter) params.set("openToInvestOnly", "true");

      if (isLoadMore && resultsData?.nextCursor) {
        params.set("cursor", resultsData.nextCursor);
      }

      const endpoint = `${apiUrl}/api/search?${params.toString()}`;
      console.log(`[Search Page Request] GET ${endpoint}`);
      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data: SearchResponse = await res.json();
        setResultsData(data);

        if (isLoadMore) {
          setAllResults(prev => [...prev, ...data.results]);
        } else {
          setAllResults(data.results);
        }
      }
    } catch (err) {
      console.error("[Search Page Error]:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, activeTab, industryFilter, stageFilter, locationFilter, ticketSizeFilter, openToInvestFilter, resultsData?.nextCursor, getToken]);

  useEffect(() => {
    executeSearch(false);
  }, [query, activeTab, industryFilter, stageFilter, locationFilter, ticketSizeFilter, openToInvestFilter]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("type", tab);
    router.push(`/search?${newParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("q", query);
    router.push(`/search?${newParams.toString()}`);
  };

  const handleFollowAction = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/${userId}/follow`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        alert("Follow status updated!");
        executeSearch(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight || !highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-primary font-black rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const tabs = [
    { key: "all", label: "All Results" },
    { key: "people", label: `People ${resultsData?.categoriesCount ? `(${resultsData.categoriesCount.people})` : ''}` },
    { key: "founders", label: `Founders ${resultsData?.categoriesCount ? `(${resultsData.categoriesCount.founders})` : ''}` },
    { key: "investors", label: `Investors ${resultsData?.categoriesCount ? `(${resultsData.categoriesCount.investors})` : ''}` },
    { key: "startups", label: `Startups ${resultsData?.categoriesCount ? `(${resultsData.categoriesCount.startups})` : ''}` },
    { key: "posts", label: `Posts ${resultsData?.categoriesCount ? `(${resultsData.categoriesCount.posts})` : ''}` },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Search Bar Header */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search everything across Noventra (people, startups, topics, posts)..."
                className="w-full pl-11 pr-4 py-3 border border-border rounded-xl bg-background text-base outline-none focus:ring-2 focus:ring-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    router.push("/search");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" className="h-12 px-6 font-bold">
              Search
            </Button>
          </form>

          {/* AI Natural Language Extracted Tags Indicator */}
          {resultsData?.parsedQueryFilter && (resultsData.parsedQueryFilter.extractedIndustry || resultsData.parsedQueryFilter.extractedStage || resultsData.parsedQueryFilter.extractedLocation) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 flex-wrap">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI Detected Query Tokens:</span>
              {resultsData.parsedQueryFilter.extractedIndustry && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
                  Industry: {resultsData.parsedQueryFilter.extractedIndustry}
                </span>
              )}
              {resultsData.parsedQueryFilter.extractedStage && (
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-bold">
                  Stage: {resultsData.parsedQueryFilter.extractedStage}
                </span>
              )}
              {resultsData.parsedQueryFilter.extractedLocation && (
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                  Location: {resultsData.parsedQueryFilter.extractedLocation}
                </span>
              )}
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex border-b border-border/80 overflow-x-auto gap-2 pt-2 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`py-2.5 px-4 font-extrabold text-sm border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Layout: Sidebar Filters + Main Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Dynamic Filter Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-black text-sm uppercase text-foreground flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> Refine Results
              </h3>

              {/* Startup / Industry Filter */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-muted-foreground uppercase">Industry</label>
                <input
                  type="text"
                  placeholder="e.g. AI, FinTech"
                  className="w-full p-2.5 border border-border rounded-lg bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                />
              </div>

              {/* Stage Filter */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-muted-foreground uppercase">Funding Stage</label>
                <select
                  className="w-full p-2.5 border border-border rounded-lg bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                >
                  <option value="">All Stages</option>
                  <option value="Idea">Idea / Concept</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-muted-foreground uppercase">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, Remote"
                  className="w-full p-2.5 border border-border rounded-lg bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              {/* Ticket Size (for Investors) */}
              {(activeTab === "all" || activeTab === "investors") && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase">Ticket Size</label>
                  <input
                    type="text"
                    placeholder="e.g. $50k - $250k"
                    className="w-full p-2.5 border border-border rounded-lg bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
                    value={ticketSizeFilter}
                    onChange={(e) => setTicketSizeFilter(e.target.value)}
                  />
                </div>
              )}

              {/* Open to Invest Checkbox */}
              {(activeTab === "all" || activeTab === "investors") && (
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold pt-1">
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                    checked={openToInvestFilter}
                    onChange={(e) => setOpenToInvestFilter(e.target.checked)}
                  />
                  <span>Open to Invest Only</span>
                </label>
              )}

              {(industryFilter || stageFilter || locationFilter || ticketSizeFilter || openToInvestFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-bold text-xs text-destructive hover:bg-destructive/5"
                  onClick={() => {
                    setIndustryFilter("");
                    setStageFilter("");
                    setLocationFilter("");
                    setTicketSizeFilter("");
                    setOpenToInvestFilter(false);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results List Viewport */}
          <div className="md:col-span-3 space-y-4">
            {loading ? (
              <SearchPageSkeleton />
            ) : allResults.length === 0 ? (
              <div className="bg-card border border-border p-16 rounded-2xl text-center shadow-sm space-y-3">
                <Search className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-bold text-foreground">No matching search results</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your keywords, switching category tabs, or clearing filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allResults.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    {/* Item Avatar & Details */}
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden shrink-0 border border-border flex items-center justify-center">
                        {item.avatarOrLogo ? (
                          <img src={item.avatarOrLogo} alt={item.title} className="w-full h-full object-cover" />
                        ) : item.type === "startup" ? (
                          <Building2 className="w-7 h-7 text-primary" />
                        ) : item.type === "post" ? (
                          <FileText className="w-7 h-7 text-primary" />
                        ) : (
                          <User className="w-7 h-7 text-primary" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-foreground leading-snug">
                            {renderHighlightedText(item.title, query)}
                          </h3>
                          <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground font-medium">
                          {renderHighlightedText(item.subtitle, query)}
                        </p>

                        {item.description && (
                          <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed pt-1">
                            {renderHighlightedText(item.highlightSnippet || item.description, query)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      {item.type === "user" || item.type === "founder" || item.type === "investor" ? (
                        <>
                          <Link href={`/profile/${item.id}`} className="w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="w-full font-bold text-xs flex items-center justify-center gap-1">
                              View Profile <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant={item.meta.isFollowing ? "secondary" : "default"}
                            className="w-full sm:w-auto font-bold text-xs flex items-center justify-center gap-1"
                            onClick={(e) => handleFollowAction(item.id, e)}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            {item.meta.isFollowing ? "Following" : "Connect"}
                          </Button>
                        </>
                      ) : item.type === "startup" ? (
                        <>
                          <Link href={`/startups/${item.id}`} className="w-full sm:w-auto">
                            <Button size="sm" className="w-full font-bold text-xs flex items-center justify-center gap-1">
                              View Startup <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Link href="/feed" className="w-full sm:w-auto">
                          <Button variant="outline" size="sm" className="w-full font-bold text-xs flex items-center justify-center gap-1">
                            View Post <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {/* Cursor Pagination Load More */}
                {resultsData?.hasMore && (
                  <div className="text-center pt-4">
                    <Button
                      onClick={() => executeSearch(true)}
                      disabled={loadingMore}
                      variant="outline"
                      className="font-bold px-8 h-11"
                    >
                      {loadingMore ? "Loading More..." : "Load More Search Results"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="p-8 text-center text-muted-foreground font-semibold">Configuring Noventra Universal Search...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
