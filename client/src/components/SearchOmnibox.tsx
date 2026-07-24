"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { 
  Search, X, Clock, TrendingUp, User, Building2, 
  MessageSquare, UserPlus, ExternalLink, ArrowRight, 
  Sparkles, Send, Briefcase, FileText, Hash 
} from "lucide-react";
import { OmniboxSkeleton } from "./SearchSkeleton";
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

interface SuggestionsData {
  suggestedFounders: Array<{ id: string; name: string; avatarUrl: string | null; role: string; location?: string | null }>;
  suggestedInvestors: Array<{ id: string; name: string; avatarUrl: string | null; ticketSize: string | null; location?: string | null }>;
  trendingStartups: Array<{ id: string; name: string; logo: string | null; stage: string; industry: string }>;
  trendingTopics: string[];
}

export default function SearchOmnibox({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter();
  const { getToken } = useAuth();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionsData | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load Recent Searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("noventra_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;
    try {
      const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("noventra_recent_searches", JSON.stringify(updated));
    } catch (e) {}
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem("noventra_recent_searches", JSON.stringify(updated));
    } catch (e) {}
  };

  // Fetch Zero-Query Suggestions on Mount / Focus
  const fetchSuggestions = async () => {
    if (suggestions) return;
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/search/suggestions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (err) {
      console.error("[Omnibox Suggestions Error]:", err);
    }
  };

  // Debounced Search API Handler
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(searchQuery)}&limit=12`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      console.error("[Omnibox Search Error]:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard Navigation Handler (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        const item = results[selectedIndex];
        handleSelectResult(item);
      } else if (query.trim()) {
        saveRecentSearch(query);
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectResult = (item: SearchResultItem) => {
    saveRecentSearch(query || item.title);
    setIsOpen(false);
    if (item.type === "user" || item.type === "founder" || item.type === "investor") {
      router.push(`/profile/${item.id}`);
    } else if (item.type === "startup") {
      router.push(`/startups/${item.id}`);
    } else if (item.type === "post" || item.type === "hashtag") {
      router.push(`/search?q=${encodeURIComponent(query || item.title)}&type=posts`);
    }
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
        alert("Action completed!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to Highlight Matched Search Text
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim() || !text) return text;
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

  return (
    <div ref={containerRef} className={`relative ${isMobile ? "w-full" : "w-full"}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => {
            setIsOpen(true);
            fetchSuggestions();
          }}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search founders, VCs, startups, posts..."
          suppressHydrationWarning
          className="w-full pl-10 pr-9 py-2 border border-border rounded-xl bg-muted/40 text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/80 focus:bg-background transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Omnibox Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150 max-h-[85vh] flex flex-col">
          
          {loading ? (
            <OmniboxSkeleton />
          ) : query.trim() !== "" ? (
            /* Results Available Mode */
            <div className="overflow-y-auto divide-y divide-border/60">
              {results.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground space-y-2">
                  <Search className="w-8 h-8 mx-auto text-muted-foreground/40" />
                  <p>No results found for "<strong className="text-foreground">{query}</strong>"</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    View global search page →
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-2 space-y-1">
                    {results.map((item, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={`${item.type}-${item.id}`}
                          onClick={() => handleSelectResult(item)}
                          className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border flex items-center justify-center">
                              {item.avatarOrLogo ? (
                                <img src={item.avatarOrLogo} alt={item.title} className="w-full h-full object-cover" />
                              ) : item.type === "startup" ? (
                                <Building2 className="w-5 h-5 text-primary" />
                              ) : item.type === "post" ? (
                                <FileText className="w-5 h-5 text-primary" />
                              ) : (
                                <User className="w-5 h-5 text-primary" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-extrabold text-sm text-foreground truncate">
                                  {renderHighlightedText(item.title, query)}
                                </h4>
                                <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {renderHighlightedText(item.subtitle, query)}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-muted-foreground/90 truncate mt-0.5 italic">
                                  "{renderHighlightedText(item.description.slice(0, 80), query)}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Inline Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            {item.type === "user" || item.type === "founder" || item.type === "investor" ? (
                              <>
                                <button
                                  title="Connect / Follow"
                                  onClick={(e) => handleFollowAction(item.id, e)}
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                                >
                                  <UserPlus className="w-4 h-4" />
                                </button>
                                <button
                                  title="Direct Message"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    router.push("/messages");
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-muted/20 border-t border-border text-center">
                    <button
                      onClick={() => {
                        saveRecentSearch(query);
                        setIsOpen(false);
                        router.push(`/search?q=${encodeURIComponent(query)}`);
                      }}
                      className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1.5 w-full"
                    >
                      <span>See all search results for "{query}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Zero-Query Empty State Suggestions */
            <div className="p-4 space-y-5 overflow-y-auto">
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-2">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Recent Searches
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("noventra_recent_searches");
                      }}
                      className="text-[10px] text-muted-foreground hover:text-destructive transition-all"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map(term => (
                      <span
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-all"
                      >
                        <span>{term}</span>
                        <X
                          className="w-3 h-3 text-muted-foreground hover:text-destructive"
                          onClick={(e) => removeRecentSearch(term, e)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics & Hashtags */}
              {suggestions?.trendingTopics && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Trending Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.trendingTopics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => {
                          setQuery(topic);
                          inputRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3 text-amber-600" />
                        <span>{topic.replace('#', '')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Founders & Investors Grid */}
              {suggestions?.suggestedFounders && suggestions.suggestedFounders.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Suggested Founders
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.suggestedFounders.map(f => (
                      <div
                        key={f.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/profile/${f.id}`);
                        }}
                        className="p-2 border border-border/80 rounded-xl bg-card hover:border-primary/50 cursor-pointer transition-all flex items-center gap-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-muted overflow-hidden shrink-0">
                          {f.avatarUrl ? (
                            <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary bg-primary/10">
                              {f.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold truncate leading-tight text-foreground">{f.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{f.location || "Founder"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}
    </div>
  );
}
