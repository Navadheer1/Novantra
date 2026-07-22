"use client";

import React, { useState } from "react";
import {
  Compass,
  PlaySquare,
  Radio,
  Mic,
  GraduationCap,
  TrendingUp,
  Tv,
  FolderOpen,
  Menu,
  X,
  Search,
  Map,
  Briefcase
} from "lucide-react";
import SearchBar from "./SearchBar";

export type DiscoveryView =
  | "recommended"
  | "foundertv"
  | "shorts"
  | "podcasts"
  | "learning"
  | "trending"
  | "live"
  | "library"
  | "channel"
  | "search"
  | "map"
  | "opportunities";

interface DiscoveryLayoutProps {
  currentView: DiscoveryView;
  onViewChange: (view: DiscoveryView, extraParams?: Record<string, string | null>) => void;
  children: React.ReactNode;
  onSearch: (query: string, category: string) => void;
}

export default function DiscoveryLayout({
  currentView,
  onViewChange,
  children,
  onSearch
}: DiscoveryLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const navItems = [
    { id: "recommended", label: "Recommended", icon: Compass },
    { id: "foundertv", label: "FounderTV", icon: PlaySquare },
    { id: "shorts", label: "Shorts", icon: Tv },
    { id: "podcasts", label: "Podcasts", icon: Mic },
    { id: "learning", label: "Learning Paths", icon: GraduationCap },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "live", label: "Live Streams", icon: Radio },
    { id: "library", label: "Your Library", icon: FolderOpen },
    { id: "map", label: "Discovery Map", icon: Map },
    { id: "opportunities", label: "Opportunities Hub", icon: Briefcase }
  ] as const;

  const handleNavClick = (id: DiscoveryView) => {
    onViewChange(id);
    setMobileMenuOpen(false);
  };

  const handleSearchTrigger = (isActive: boolean, query: string, category: string) => {
    setSearchActive(isActive);
    if (isActive) {
      onSearch(query, category);
    } else {
      onViewChange("recommended");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850 z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-bold tracking-tight uppercase">Discovery Hub</span>
        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <Compass className="w-4 h-4 text-neutral-600 dark:text-white" />
        </div>
      </div>

      {/* Responsive Left Sidebar Navigation (Desktop) */}
      <aside className={`lg:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-850 p-4 space-y-6 shrink-0 z-30 transition-all duration-300 lg:block lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:overflow-y-auto scrollbar-none ${
        mobileMenuOpen ? "fixed inset-y-0 left-0 w-64 block" : "hidden"
      }`}>
        <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1 mb-4 select-none">
          <div className="w-2.5 h-2.5 bg-neutral-900 dark:bg-white rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Discovery Engine</span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition focus:outline-none ${
                  active
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm"
                    : "text-neutral-550 hover:text-neutral-950 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-850"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Search bar area */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850 py-4.5 px-4 sm:px-8 space-y-4">
          <SearchBar onSearchActive={handleSearchTrigger} />
        </div>

        {/* Dynamic subview area */}
        <div className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
