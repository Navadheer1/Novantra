"use client";

import React, { useState } from "react";
import { Globe, MapPin, Building2, Cpu, Stethoscope, Landmark, Layers, Leaf, Bot, Server, Globe2 } from "lucide-react";

interface Props {
  onSelectIndustry: (ind: string) => void;
  onSelectCity: (city: string) => void;
}

export default function IndustryWorldExplorer({ onSelectIndustry, onSelectCity }: Props) {
  const industries = [
    { id: "ai", label: "Artificial Intelligence", icon: Bot, count: "4,200 Startups" },
    { id: "devtools", label: "Developer Tools", icon: Server, count: "1,850 Startups" },
    { id: "fintech", label: "FinTech & Payments", icon: Landmark, count: "2,400 Startups" },
    { id: "healthtech", label: "HealthTech & Bio", icon: Stethoscope, count: "1,200 Startups" },
    { id: "climate", label: "Climate Tech", icon: Leaf, count: "980 Startups" },
    { id: "saas", label: "Enterprise SaaS", icon: Layers, count: "3,100 Startups" },
  ];

  const globalHubs = [
    { city: "San Francisco / Bay Area", country: "United States", startups: 8400, vcs: 620 },
    { city: "New York City", country: "United States", startups: 4200, vcs: 380 },
    { city: "London", country: "United Kingdom", startups: 3100, vcs: 290 },
    { city: "Bangalore", country: "India", startups: 3800, vcs: 240 },
    { city: "Singapore", country: "Singapore", startups: 1900, vcs: 180 },
    { city: "Berlin", country: "Germany", startups: 1600, vcs: 140 },
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Discover by Industry Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>Discover by Industry Vertical</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Filter ecosystem entities by core technology domain.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <button
                key={ind.id}
                onClick={() => onSelectIndustry(ind.label)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left transition-all group space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {ind.label}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{ind.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. World Discovery Hub Map Grid */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-[28px] p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Global Tech Hub Discovery
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Explore founders, incubators, and investors by global tech city.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {globalHubs.map((hub) => (
            <button
              key={hub.city}
              onClick={() => onSelectCity(hub.city)}
              className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-blue-500 text-left transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <h4 className="font-extrabold text-sm text-white">{hub.city}</h4>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">{hub.country}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-1">
                <span>{hub.startups.toLocaleString()} Startups</span>
                <span>•</span>
                <span className="text-blue-400 font-bold">{hub.vcs} VC Funds</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
