"use client";

import React, { useState } from "react";
import {
  Play,
  Flame,
  Sparkles,
  ArrowUp,
  Briefcase,
  Calendar,
  CheckCircle2,
  Users,
  DollarSign,
  UserPlus,
} from "lucide-react";
import { Video, Startup, Job } from "./types";
import {
  mockVideos,
  mockStartups,
  mockEvents,
  mockJobs,
  mockFounders,
  mockInvestors,
} from "./mockDiscoveryData";

interface RecommendedFeedProps {
  videos?: Video[];
  startups?: Startup[];
  shorts?: any[];
  onSelectVideo: (videoId: string) => void;
  onSelectShort: (shortId: string) => void;
  onSelectPodcast?: (podcastId: string) => void;
}

export default function RecommendedFeed({
  videos,
  startups,
  onSelectVideo,
}: RecommendedFeedProps) {
  const liveVideos = videos || mockVideos;
  const liveStartups = startups || mockStartups;

  const [votedStartups, setVotedStartups] = useState<Record<string, boolean>>({});
  const [followingFounders, setFollowingFounders] = useState<Record<string, boolean>>({});

  const handleStartupUpvote = (id: string) => {
    setVotedStartups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleFollow = (id: string) => {
    setFollowingFounders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const featuredVideo = liveVideos[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full pb-10 select-none">
      
      {/* LEFT / CENTER COLUMN: MAIN DISCOVERY FEED (Col-span 3) */}
      <div className="xl:col-span-3 space-y-8 min-w-0">

        {/* 1. FEATURED FOUNDERTV SPOTLIGHT */}
        {featuredVideo && (
          <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Contextual AI Recommendation: Because you follow AI & DevTools
              </span>
              <span className="text-xs text-slate-400 font-bold">Featured Demo</span>
            </div>

            <div
              onClick={() => onSelectVideo(featuredVideo.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden relative min-h-[280px] sm:min-h-[340px] flex items-end p-6 bg-slate-900"
            >
              <img
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-102 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

              <div className="relative z-20 max-w-2xl space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight group-hover:text-blue-200 transition">
                  {featuredVideo.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 leading-relaxed">
                  {featuredVideo.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredVideo.channel.avatarUrl}
                      alt={featuredVideo.channel.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/30"
                    />
                    <div className="text-xs font-semibold text-white">
                      <p className="font-bold flex items-center gap-1">
                        <span>{featuredVideo.channel.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                      </p>
                      <p className="text-[11px] text-slate-300 font-normal">
                        {featuredVideo.views.toLocaleString("en-US")} views • {new Date(featuredVideo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-white" /> Watch Product Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STREAM 1: 🔥 TRENDING TODAY (STARTUPS) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Trending Today</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Based on ecosystem activity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {liveStartups.slice(0, 3).map((startup) => {
              const voted = votedStartups[startup.id];
              const votes = (startup.upvotesCount || 120) + (voted ? 1 : 0);
              return (
                <div
                  key={startup.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <img src={startup.logo} alt={startup.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                      <span className="text-[9px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {startup.fundingStage}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{startup.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">{startup.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold">{startup.industry}</span>
                    <button
                      onClick={() => handleStartupUpvote(startup.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                        voted
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>{votes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STREAM 2: 👑 FEATURED FOUNDERS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Featured Founders</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Because your startup is in SaaS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mockFounders.slice(0, 3).map((f) => {
              const isFollowing = followingFounders[f.name];
              return (
                <div
                  key={f.name}
                  className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={f.avatarUrl} alt={f.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{f.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{f.headline}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>12 Mutuals</span>
                    <button
                      onClick={() => handleToggleFollow(f.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        isFollowing
                          ? "bg-slate-100 text-slate-600"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isFollowing ? "Following" : "Connect"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STREAM 3: 🎥 FOUNDERTV VIDEO CAROUSEL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>FounderTV Demos & Talks</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Because you watched Healthcare AI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveVideos.slice(1, 3).map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video.id)}
                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition cursor-pointer group space-y-3 p-3"
              >
                <div className="h-40 w-full rounded-xl bg-slate-100 overflow-hidden relative">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {Math.floor(video.duration / 60)}m
                  </span>
                </div>

                <div className="space-y-1 px-1">
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STREAM 4: 💼 HIRING STARTUPS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Startup Jobs Hiring Now</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Matched to your stack</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockJobs.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-extrabold uppercase bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                    {job.type}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{job.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{job.companyName} • {job.location}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">{job.salary}</span>
                  <button
                    onClick={() => alert(`Application submitted for ${job.title} at ${job.companyName}`)}
                    className="mt-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: ACTIONABLE REASONING SIDEBAR (Col-span 1) */}
      <div className="xl:col-span-1 space-y-4 min-w-0">

        {/* 1. RECOMMENDED FOR YOU (WITH CONTEXTUAL REASON) */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended For You</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Investors matching your thesis</span>
          </div>

          <div className="space-y-2.5">
            {mockInvestors.slice(0, 2).map((inv) => (
              <div key={inv.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <img src={inv.avatarUrl} alt={inv.name} className="w-8 h-8 rounded-full object-cover border" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{inv.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{inv.ticketSize} check size</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Pitch request ticket opened with ${inv.name}`)}
                  className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1"
                >
                  <DollarSign className="w-3.5 h-3.5" /> Pitch Startup
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. UPCOMING EVENTS & DEMO DAYS */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Live Events</span>
            </h3>
          </div>

          <div className="space-y-2">
            {mockEvents.slice(0, 2).map((ev) => (
              <div key={ev.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">{ev.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {ev.location}</p>
                <button
                  onClick={() => alert(`RSVP confirmed for ${ev.title}`)}
                  className="w-full mt-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition"
                >
                  RSVP Spot
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
