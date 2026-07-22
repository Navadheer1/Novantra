"use client";

import React, { useState } from "react";
import { MapPin, Building2, Users, Calendar, GraduationCap, Map } from "lucide-react";
import { mockStartups, mockInvestors, mockEvents } from "./mockDiscoveryData";

interface HubDetail {
  city: string;
  country: string;
  startupsCount: number;
  investorsCount: number;
  eventsCount: number;
  universities: string[];
}

const HUBS: HubDetail[] = [
  {
    city: "San Francisco",
    country: "USA",
    startupsCount: 28,
    investorsCount: 15,
    eventsCount: 8,
    universities: ["Stanford University", "UC Berkeley"]
  },
  {
    city: "New York",
    country: "USA",
    startupsCount: 14,
    investorsCount: 8,
    eventsCount: 4,
    universities: ["Columbia University", "NYU"]
  },
  {
    city: "Austin",
    country: "USA",
    startupsCount: 10,
    investorsCount: 6,
    eventsCount: 3,
    universities: ["UT Austin"]
  },
  {
    city: "London",
    country: "UK",
    startupsCount: 12,
    investorsCount: 7,
    eventsCount: 5,
    universities: ["Imperial College", "LSE"]
  },
  {
    city: "Tokyo",
    country: "Japan",
    startupsCount: 6,
    investorsCount: 3,
    eventsCount: 2,
    universities: ["University of Tokyo"]
  },
  {
    city: "Bengaluru",
    country: "India",
    startupsCount: 15,
    investorsCount: 6,
    eventsCount: 4,
    universities: ["IISc", "IIT"]
  }
];

export default function DiscoveryMap() {
  const [selectedHub, setSelectedHub] = useState<HubDetail>(HUBS[0]);

  // Filter mock datasets matching selected hub location
  const startupsInHub = mockStartups.filter(s => s.founderName && (
    selectedHub.city === "San Francisco" ? s.id.endsWith("0") || s.id.endsWith("2") || s.name === "Noventra"
    : selectedHub.city === "New York" ? s.id.endsWith("1") || s.id.endsWith("3")
    : selectedHub.city === "Austin" ? s.id.endsWith("4") || s.id.endsWith("6")
    : selectedHub.city === "London" ? s.id.endsWith("5") || s.id.endsWith("7")
    : selectedHub.city === "Tokyo" ? s.id.endsWith("8")
    : s.id.endsWith("9") || s.id.endsWith("5")
  )).slice(0, 4);

  const investorsInHub = mockInvestors.filter(i => 
    i.location.toLowerCase().includes(selectedHub.city.toLowerCase())
  ).slice(0, 3);

  const eventsInHub = mockEvents.filter(e => 
    e.location.toLowerCase().includes(selectedHub.city.toLowerCase()) || e.location.toLowerCase().includes("virtual")
  ).slice(0, 2);

  return (
    <div className="space-y-6 w-full pb-10 animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center space-x-2">
          <Map className="w-5 h-5 text-neutral-450" />
          <span>Global Discovery Map</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-450 mt-0.5">Explore active startups, venture capitals, hackathons, and research universities across major hubs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Interactive Map Grid (Col-span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-6 rounded-3xl shadow-xs space-y-6">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Select Startup Hub</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {HUBS.map((hub) => {
              const active = selectedHub.city === hub.city;
              return (
                <div
                  key={hub.city}
                  onClick={() => setSelectedHub(hub)}
                  className={`cursor-pointer p-4.5 rounded-2xl border transition duration-300 flex items-start space-x-3.5 ${
                    active
                      ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-955 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-850 hover:border-neutral-300 hover:bg-neutral-50/50"
                  }`}
                >
                  <MapPin className={`w-5 h-5 mt-0.5 ${active ? "text-red-500 fill-current" : "text-neutral-400"}`} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white">{hub.city}</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">{hub.country}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-neutral-500 font-semibold pt-1 border-t border-neutral-100 dark:border-neutral-800/80 mt-1 w-full">
                      <span>🚀 {hub.startupsCount}</span>
                      <span>💼 {hub.investorsCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hub Visual abstraction block */}
          <div className="bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850 h-44 rounded-2xl flex items-center justify-center relative overflow-hidden">
            {/* Visual dot grid representing a map */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="z-10 text-center space-y-1.5 p-4">
              <MapPin className="w-8 h-8 text-red-500 fill-current mx-auto animate-bounce" />
              <h4 className="text-xs font-black text-neutral-900 dark:text-white">Active Node: {selectedHub.city} Hub</h4>
              <p className="text-[10px] text-neutral-450 font-bold max-w-sm">Connected to Noventra API networks, caching local directories within {selectedHub.country}.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Hub detail stats panel (Col-span 1) */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl p-5 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 dark:border-neutral-850 pb-2">
            <h3 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">
              {selectedHub.city} Directory
            </h3>
          </div>

          {/* Active Startups */}
          <div className="space-y-2.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-neutral-400" />
              <span>Active Startups</span>
            </span>
            <div className="space-y-2">
              {startupsInHub.map(s => (
                <div key={s.id} className="flex items-center space-x-3.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850">
                  <img src={s.logo} alt="" className="w-7 h-7 rounded-lg object-cover border" />
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 dark:text-white leading-tight">{s.name}</h4>
                    <p className="text-[9.5px] text-neutral-500 font-semibold">{s.industry} • {s.fundingStage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investors in Hub */}
          <div className="space-y-2.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1">
              <Users className="w-3 h-3 text-neutral-400" />
              <span>Matching Investors</span>
            </span>
            {investorsInHub.length > 0 ? (
              <div className="space-y-2">
                {investorsInHub.map(i => (
                  <div key={i.id} className="flex items-center space-x-3.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850">
                    <img src={i.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border" />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">{i.name}</h4>
                      <p className="text-[9.5px] text-neutral-500 font-semibold">{i.headline.split(" at ")[0]} • {i.ticketSize}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-neutral-450 italic pl-1">Accelerators are active online here.</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="space-y-2.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>Upcoming Streams / Events</span>
            </span>
            {eventsInHub.length > 0 ? (
              <div className="space-y-2">
                {eventsInHub.map(e => (
                  <div key={e.id} className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{e.title}</h4>
                    <p className="text-[9.5px] text-neutral-500 mt-0.5">{new Date(e.date).toLocaleDateString([], { month: "short", day: "numeric" })} • {e.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-neutral-455 italic pl-1">No upcoming live coding sessions scheduled.</p>
            )}
          </div>

          {/* Research Universities */}
          <div className="space-y-2.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1">
              <GraduationCap className="w-3 h-3 text-neutral-400" />
              <span>Partner Universities</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedHub.universities.map(u => (
                <span key={u} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-650 dark:text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded">
                  {u}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
