"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Video, Users, Briefcase, Zap, Calendar, Radio, Play, Clock, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearchActive: (isActive: boolean, query: string, category: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Content" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "founders", label: "Founders" },
  { id: "startups", label: "Startups" },
  { id: "investors", label: "Investors" },
  { id: "jobs", label: "Jobs" },
  { id: "learning", label: "Learning" },
  { id: "podcasts", label: "Podcasts" },
  { id: "events", label: "Events" }
];

const SUGGESTIONS = [
  "How to scale caching in Postgres",
  "React server layout patterns",
  "Linear design tokens workflow",
  "Next.js 16 cold starts",
  "Pre-seed fundraising pitch template",
  "AI embeddings vector stores comparison",
  "MCP Servers setup guide"
];

const TRENDING_SEARCHES = [
  "MCP Servers",
  "Vector DB",
  "Next.js streaming",
  "Sequoia ticket size",
  "Hiring Node.js",
  "RAG cache"
];

export default function SearchBar({ onSearchActive }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(SUGGESTIONS);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Close suggestions popover on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      const filtered = SUGGESTIONS.filter((s) => s.toLowerCase().includes(val.toLowerCase()));
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      onSearchActive(true, val, activeCategory);
    } else {
      setShowSuggestions(false);
      onSearchActive(false, "", activeCategory);
    }
  };

  const saveSearchQuery = (sug: string) => {
    const trimmed = sug.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(x => x !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("recent-searches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectSuggestion = (sug: string) => {
    setQuery(sug);
    setShowSuggestions(false);
    onSearchActive(true, sug, activeCategory);
    saveSearchQuery(sug);
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    onSearchActive(false, "", activeCategory);
  };

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recent-searches");
  };

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    onSearchActive(query.trim() !== "", query, catId);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      onSearchActive(query.trim() !== "", query, activeCategory);
      saveSearchQuery(query);
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-4 max-w-4xl mx-auto relative">
      <div className="relative">
        <div className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-1 shadow-xs transition hover:border-neutral-350 dark:hover:border-neutral-700">
          <div className="pl-3.5 pr-2.5 text-neutral-400">
            <Search className="w-4 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search videos, founders, startups, investors, learning playlists..."
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleSearchKeyPress}
            onFocus={() => setShowSuggestions(true)}
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-neutral-900 dark:text-white py-2.5 focus:outline-none placeholder-neutral-400 font-bold"
          />
          {query && (
            <button
              onClick={handleClear}
              className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dynamic Search Suggestions Popover */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden z-40 p-4 space-y-4 max-h-[420px] overflow-y-auto animate-fadeIn">
            
            {/* 1. MATCHING SUGGESTIONS (if typing) */}
            {query.trim() !== "" && filteredSuggestions.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span>Suggestions</span>
                </span>
                <div className="space-y-1">
                  {filteredSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(sug)}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-850 dark:text-neutral-200 font-semibold flex items-center space-x-2 transition rounded-xl"
                    >
                      <Search className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. RECENT SEARCHES */}
            {recentSearches.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Recent Searches</span>
                  </span>
                  <button onClick={handleClearRecent} className="hover:text-red-500 font-extrabold lowercase">
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(sug)}
                      className="bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-850 border dark:border-neutral-850 px-3 py-1 rounded-full text-xs font-bold text-neutral-700 dark:text-neutral-350 transition flex items-center space-x-1"
                    >
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TRENDING SEARCHES */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-orange-500 fill-current" />
                <span>Trending Queries</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-850 border dark:border-neutral-850 px-3 py-1 rounded-full text-xs font-bold text-neutral-700 dark:text-neutral-350 transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Categories Horizontal scrolling filter pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition focus:outline-none ${
              activeCategory === cat.id
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
