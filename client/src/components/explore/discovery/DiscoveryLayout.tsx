"use client";

import React, { useState } from "react";
import {
  Compass,
  TrendingUp,
  Users,
  Rocket,
  DollarSign,
  Briefcase,
  PlaySquare,
  Video,
  Mic,
  Calendar,
  Bookmark,
  Menu,
  X,
} from "lucide-react";
import SearchBar from "./SearchBar";

export type DiscoveryView =
  | "recommended"
  | "foundertv"
  | "studio"
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
    { id: "recommended", label: "Discover", icon: Compass },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "foundertv", label: "FounderTV", icon: PlaySquare },
    { id: "studio", label: "Creator Studio", icon: Video },
    { id: "podcasts", label: "Podcasts", icon: Mic },
    { id: "opportunities", label: "Startups & Deals", icon: Rocket },
    { id: "library", label: "Saved Library", icon: Bookmark }
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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#F8FAFC] text-slate-900 antialiased">
      
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80 z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-500 hover:text-slate-900 transition focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-bold tracking-tight uppercase">Discovery Hub</span>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <Compass className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Responsive Left Sidebar Navigation (Desktop) */}
      <aside className={`lg:w-60 bg-white border-r border-slate-200/80 p-4 space-y-6 shrink-0 z-30 transition-all duration-300 lg:block lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:overflow-y-auto scrollbar-none ${
        mobileMenuOpen ? "fixed inset-y-0 left-0 w-60 block shadow-2xl" : "hidden"
      }`}>
        <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1 mb-2 select-none">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Discover</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition focus:outline-none ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Search bar area (Hidden in Creator Studio view) */}
        {currentView !== "studio" && (
          <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-4 px-4 sm:px-8 space-y-4">
            <SearchBar onSearchActive={handleSearchTrigger} />
          </div>
        )}

        {/* Dynamic subview area */}
        <div className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

