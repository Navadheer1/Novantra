"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowUp, Star, Flame, Eye, Sparkles, TrendingUp, 
  Calendar, Award, Radio, Tv, MessageSquare, Briefcase, Play, DollarSign, Users, Quote 
} from "lucide-react";
import { Video, Startup } from "./types";
import { mockVideos, mockStartups, mockEvents } from "./mockDiscoveryData";

interface TrendingFeedProps {
  onSelectVideo: (videoId: string) => void;
  onSelectChannel?: (channelId: string) => void;
  videos?: Video[];
  startups?: Startup[];
}

export default function TrendingFeed({ onSelectVideo, onSelectChannel, videos, startups }: TrendingFeedProps) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "all">("daily");
  
  const liveVideos = videos || mockVideos;
  const liveStartups = startups || mockStartups;

  // Launches data state
  const [launches, setLaunches] = useState<Startup[]>([]);

  useEffect(() => {
    setLaunches(liveStartups.filter((s) => s.launchDay).slice(0, 5));
  }, [liveStartups]);

  const handleLaunchUpvote = (id: string) => {
    setLaunches((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const active = (s as any).voted;
        return {
          ...s,
          upvotesCount: (s.upvotesCount || 100) + (active ? -1 : 1),
          voted: !active
        } as any;
      })
    );
  };

  // Filter events into calendar slots
  const todayDateStr = new Date().toDateString();
  const tomorrowDateStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
  
  const todayEvents = mockEvents.filter(e => new Date(e.date).toDateString() === todayDateStr);
  const tomorrowEvents = mockEvents.filter(e => new Date(e.date).toDateString() === tomorrowDateStr);
  const generalEvents = mockEvents.filter(e => {
    const dStr = new Date(e.date).toDateString();
    return dStr !== todayDateStr && dStr !== tomorrowDateStr;
  });

  return (
    <div className="space-y-8 w-full pb-10">
      
      {/* Timeframe Filter Panel */}
      <div className="flex justify-between items-center border-b border-neutral-150 dark:border-neutral-850 pb-4">
        <h2 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-neutral-450" />
          <span>Trending Discoveries</span>
        </h2>
        <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-800">
          {(["daily", "weekly", "all"] as const).map((time) => (
            <button
              key={time}
              onClick={() => setTimeframe(time)}
              className={`px-4 py-1 rounded-full text-xs font-bold capitalize transition focus:outline-none ${
                timeframe === time
                  ? "bg-white dark:bg-neutral-850 text-neutral-900 dark:text-white shadow-xs"
                  : "text-neutral-550 hover:text-neutral-900 dark:hover:text-neutral-350"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout: left side content, right side Discovery Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Product Hunt Leaderboard & Trending Code (Col-span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PRODUCT HUNT PREMIUM LEADERBOARD */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-450 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Today's Startup Launches</span>
              </h3>
              <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 dark:bg-neutral-850 px-2 py-0.5 rounded">
                Leaderboard
              </span>
            </div>

            <div className="space-y-4">
              {launches.map((startup, idx) => {
                const voted = (startup as any).voted;
                return (
                  <div
                    key={startup.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl shadow-xs hover:border-neutral-350 dark:hover:border-neutral-750 transition flex flex-col space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center space-x-3.5">
                        <span className="text-sm font-black text-neutral-300 dark:text-neutral-700 w-5">
                          #{idx + 1}
                        </span>
                        <img 
                          src={startup.logo} 
                          alt="" 
                          onClick={() => onSelectChannel?.(`ch-${startup.founderId}`)}
                          className="w-10 h-10 rounded-xl object-cover border bg-white cursor-pointer hover:opacity-85 transition" 
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 
                              onClick={() => onSelectChannel?.(`ch-${startup.founderId}`)}
                              className="text-sm font-extrabold text-neutral-900 dark:text-white cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-350 transition"
                            >
                              {startup.name}
                            </h4>
                            <span className="text-[9px] bg-neutral-50 dark:bg-neutral-950 text-neutral-500 px-2 py-0.5 rounded border border-neutral-200/30 font-bold">
                              {startup.industry}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 font-semibold mt-0.5">{startup.description}</p>
                        </div>
                      </div>

                      {/* PH Upvote button */}
                      <button
                        onClick={() => handleLaunchUpvote(startup.id)}
                        className={`flex flex-col items-center justify-center border rounded-xl px-3 py-1.5 min-w-12 transition focus:outline-none ${
                          voted
                            ? "bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-black"
                            : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-extrabold mt-0.5">{startup.upvotesCount}</span>
                      </button>
                    </div>

                    {/* Launch Mode Expanded details */}
                    <div className="border-t border-neutral-100 dark:border-neutral-850 pt-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center space-x-2">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Visitors today: <strong className="text-neutral-900 dark:text-white">{(startup.visitorsToday || 200).toLocaleString()}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Status: <strong className="text-emerald-500">{startup.hiringStatus === 'Hiring' ? 'Hiring / Raising' : 'Raising funding'}</strong></span>
                      </div>
                      <button 
                        onClick={() => onSelectVideo(startup.launchVideoId || "vid-4")}
                        className="bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-850 border dark:border-neutral-800 p-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center space-x-1.5 transition"
                      >
                        <Play className="w-3 h-3 fill-current text-neutral-700 dark:text-white" />
                        <span>Watch Founder Pitch</span>
                      </button>
                    </div>

                    {/* Reviews snippet */}
                    {startup.reviews && startup.reviews.length > 0 && (
                      <div className="bg-neutral-55/40 dark:bg-neutral-950/50 rounded-2xl p-3 border border-neutral-100 dark:border-neutral-850 space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>Builder Critique</span>
                        </span>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 italic font-medium leading-relaxed pl-1">
                          "{startup.reviews[0].comment}" – <strong className="text-neutral-900 dark:text-white not-italic">{startup.reviews[0].userName}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRENDING CODING SESSIONS */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1.5">
              <Tv className="w-3.5 h-3.5 text-neutral-450" />
              <span>Trending Developer Logs</span>
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xs divide-y divide-neutral-100 dark:divide-neutral-850">
              {liveVideos.slice(4, 9).map((video, idx) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video.id)}
                  className="group cursor-pointer p-4.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-950 transition duration-200"
                >
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <span className="text-base font-black text-neutral-300 dark:text-neutral-700 w-5 text-center">
                      {idx + 1}
                    </span>
                    
                    <div className="w-16 sm:w-20 aspect-video bg-neutral-950 rounded-lg overflow-hidden shrink-0 relative border border-neutral-200 dark:border-neutral-850">
                      <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-350 transition">
                        {video.title}
                      </h4>
                      <div className="flex items-center text-[10px] text-neutral-450 font-semibold space-x-2">
                        <span>{video.channel.name}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.views.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pl-4 shrink-0">
                    <button className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-[10px] text-neutral-650 dark:text-neutral-350 border-neutral-250 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-900 font-extrabold transition">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{Math.floor(video.views * 0.02)}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: DISCOVERY CALENDAR (Col-span 1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="border-b border-neutral-100 dark:border-neutral-850 pb-2">
              <h3 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>Discovery Calendar</span>
              </h3>
            </div>

            <div className="space-y-5">
              
              {/* TODAY */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  <span>Today's Events</span>
                </span>
                {todayEvents.length > 0 ? (
                  todayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200/55 dark:border-neutral-850">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{e.title}</h4>
                      <p className="text-[10px] text-neutral-500 mt-1 font-semibold">{e.location} • {e.attendeeCount} RSVPs</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-neutral-450 italic font-semibold pl-1">No scheduled streams today.</p>
                )}
              </div>

              {/* TOMORROW */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Tomorrow's Calendar</span>
                {tomorrowEvents.length > 0 ? (
                  tomorrowEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="bg-neutral-55/60 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200/55 dark:border-neutral-850">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{e.title}</h4>
                      <p className="text-[10px] text-neutral-500 mt-1 font-semibold">{e.location} • {e.attendeeCount} RSVPs</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-neutral-450 italic font-semibold pl-1">No upcoming events tomorrow.</p>
                )}
              </div>

              {/* Upcoming Hackathons / AMAs */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Hackathons & Demo Days</span>
                <div className="space-y-2">
                  {generalEvents.slice(0, 3).map((e, idx) => (
                    <div key={e.id} className="bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-150 dark:border-neutral-850 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <h4 className="text-[11px] font-bold text-neutral-900 dark:text-white line-clamp-1">{e.title}</h4>
                        <span className="text-[9px] text-neutral-400 font-bold block">
                          {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 px-2 py-0.5 rounded-full select-none shrink-0">
                        {idx % 2 === 0 ? "AMA" : "Hack"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
