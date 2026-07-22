"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Users, Award, Shield, DollarSign, ArrowUpRight, Search } from "lucide-react";
import { Opportunity } from "./types";
import { mockOpportunities } from "./mockDiscoveryData";

const CATEGORIES = [
  { id: "all", label: "All Opportunities" },
  { id: "Job", label: "Jobs" },
  { id: "Hackathon", label: "Hackathons" },
  { id: "Co-Founder", label: "Co-Founders" },
  { id: "VC Seeking Startups", label: "Investors Seeking Startups" },
  { id: "Beta Testing", label: "Beta Testing" },
  { id: "Accelerator", label: "Accelerators" },
  { id: "Open Source", label: "Open Source" }
];

export default function OpportunitiesFeed() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchVal, setSearchVal] = useState("");

  const filtered = mockOpportunities.filter((opp) => {
    const matchesCat = activeCategory === "all" || opp.category === activeCategory;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchVal.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchVal.toLowerCase()) ||
      opp.skillsRequired.some(s => s.toLowerCase().includes(searchVal.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    const styles: Record<string, string> = {
      "Job": "bg-blue-50 text-blue-650 border-blue-150 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
      "Hackathon": "bg-purple-50 text-purple-650 border-purple-150 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900",
      "Co-Founder": "bg-red-50 text-red-650 border-red-150 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
      "VC Seeking Startups": "bg-emerald-50 text-emerald-650 border-emerald-150 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
      "Beta Testing": "bg-amber-50 text-amber-650 border-amber-150 dark:bg-amber-955/40 dark:text-amber-400 dark:border-amber-900",
      "Accelerator": "bg-indigo-50 text-indigo-650 border-indigo-150 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
      "Competition": "bg-pink-50 text-pink-650 border-pink-150 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-900",
      "Open Source": "bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-850 dark:text-neutral-350 dark:border-neutral-800"
    };
    return styles[cat] || styles["Open Source"];
  };

  return (
    <div className="space-y-6 w-full pb-10 animate-fadeIn">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-150 dark:border-neutral-805 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-neutral-450" />
            <span>Opportunities Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-455 mt-0.5">Apply for seed grants, hackathons, matching co-founders, and accelerator applications.</p>
        </div>

        {/* Local Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by skill (e.g. SQLite)..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9.5 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition font-bold"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition focus:outline-none ${
              activeCategory === cat.id
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-250 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-750"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Opportunities Grid List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl shadow-xs hover:border-neutral-350 dark:hover:border-neutral-750 hover:shadow-sm transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <span className={`text-[9px] font-bold border rounded px-2 py-0.5 uppercase tracking-wider scale-95 shrink-0 ${getCategoryColor(opp.category)}`}>
                    {opp.category}
                  </span>
                  {opp.deadline && (
                    <span className="text-[10px] text-neutral-450 font-semibold shrink-0">
                      Ends: {opp.deadline}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white line-clamp-1 leading-snug">
                    {opp.title}
                  </h3>
                  <span className="text-[10px] text-neutral-450 font-bold block">{opp.organization}</span>
                </div>

                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  {opp.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-855">
                <div className="flex flex-wrap gap-1.5">
                  {opp.skillsRequired.map(skill => (
                    <span key={skill} className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-450 border border-neutral-150 dark:border-neutral-800 text-[9.5px] font-bold px-2 py-0.5 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  {opp.metric && (
                    <span className="text-[10.5px] text-emerald-500 font-extrabold flex items-center space-x-1">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>{opp.metric}</span>
                    </span>
                  )}
                  <button className="bg-neutral-900 dark:bg-white hover:opacity-90 text-white dark:text-neutral-900 text-[10px] font-extrabold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition">
                    <span>Apply / Join</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EDUCATIONAL EMPTY STATE */
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-850 space-y-3 animate-fadeIn max-w-xl mx-auto">
          <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">No opportunities match your filter</h3>
          <p className="text-xs text-neutral-450 px-6 leading-relaxed font-semibold">
            No active accelerator openings or co-founder requests match your current search parameter. Try exploring <strong className="text-neutral-900 dark:text-white">TypeScript</strong>, <strong className="text-neutral-900 dark:text-white">Pitch deck</strong>, or <strong className="text-neutral-900 dark:text-white">Next.js</strong>!
          </p>
          <button
            onClick={() => { setSearchVal(""); setActiveCategory("all"); }}
            className="bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-xs font-bold transition mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
