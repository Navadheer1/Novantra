"use client";

import React, { useState } from "react";
import { Search, Sparkles, Rocket, Plus, UserPlus, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopHeroProps {
  onSearch: (query: string) => void;
  onSelectSuggestion: (category: string) => void;
  onOpenSellModal: () => void;
}

export default function ShopHero({ onSearch, onSelectSuggestion, onOpenSellModal }: ShopHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const suggestions = [
    "Restaurant", "Healthcare", "AI SaaS", "CRM", "Hotel",
    "Education", "Marketplace", "Logistics", "FinTech"
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative bg-gradient-to-br from-primary/15 via-card to-purple-500/10 border border-border/80 rounded-3xl p-8 md:p-12 mb-10 shadow-lg overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-foreground">The App Store for Startups</span>
          <span className="text-muted-foreground font-normal">• Buy, Sell, Customize & Hire</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none">
          Launch Your Startup <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">10x Faster</span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Discover production-ready software, complete startup kits, AI agents, physical hardware innovations, and top verified creators.
        </p>

        {/* SEARCH BAR */}
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto relative flex items-center">
          <div className="relative w-full">
            <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="What are you building today? (e.g. Hospital App, AI SaaS, POS)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full bg-background/90 backdrop-blur-md border-2 border-border focus:border-primary text-foreground text-sm font-semibold pl-12 pr-28 py-4 rounded-2xl outline-none shadow-lg transition-all"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-4 py-2 rounded-xl shadow-md"
            >
              Search <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </form>

        {/* SUGGESTION TAGS */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs font-bold">
          <span className="text-muted-foreground uppercase text-[10px] tracking-wider mr-1">Popular:</span>
          {suggestions.map((sugg, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchQuery(sugg);
                onSelectSuggestion(sugg);
              }}
              className="bg-background/80 hover:bg-background border border-border/80 hover:border-primary px-3 py-1 rounded-full text-foreground transition-all hover:scale-105"
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* HERO BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm px-6 h-12 shadow-md"
            onClick={() => onSelectSuggestion("ALL")}
          >
            <Rocket className="w-4 h-4 mr-2" /> Browse All Products
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="font-extrabold text-sm px-6 h-12 border-border/80 bg-background/80 hover:bg-background"
            onClick={onOpenSellModal}
          >
            <Plus className="w-4 h-4 mr-2 text-primary" /> Sell Product / Kit
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="font-extrabold text-sm px-6 h-12 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
            onClick={() => onSelectSuggestion("CREATORS")}
          >
            <UserPlus className="w-4 h-4 mr-2 text-purple-500" /> Hire Top Creator
          </Button>
        </div>
      </div>
    </div>
  );
}
