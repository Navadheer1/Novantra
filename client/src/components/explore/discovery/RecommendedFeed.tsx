"use client";

import React, { useState } from "react";
import { 
  Play, Flame, Sparkles, Clock, Heart, Radio, Bookmark, 
  ArrowUp, MessageSquare, Briefcase, Calendar, Star, CheckCircle, 
  Users, Award, Cpu, Code2, GraduationCap, Mic, ChevronRight, DollarSign, Quote
} from "lucide-react";
import { Video, Short, Startup, Podcast, CommunityPost, Event, Job } from "./types";
import { 
  mockVideos, mockShorts, mockStartups, mockPodcasts, 
  mockCommunityPosts, mockEvents, mockJobs, mockFounders, mockInvestors 
} from "./mockDiscoveryData";

interface RecommendedFeedProps {
  videos?: Video[];
  startups?: Startup[];
  shorts?: Short[];
  onSelectVideo: (videoId: string) => void;
  onSelectShort: (shortId: string) => void;
  onSelectPodcast?: (podcastId: string) => void;
}

export default function RecommendedFeed({ 
  videos, 
  startups, 
  shorts, 
  onSelectVideo, 
  onSelectShort, 
  onSelectPodcast 
}: RecommendedFeedProps) {
  // Fallbacks to default data if parent states are empty
  const liveVideos = videos || mockVideos;
  const liveStartups = startups || mockStartups;
  const liveShorts = shorts || mockShorts;

  // States for interactive widgets
  const [continueTab, setContinueTab] = useState<"learning" | "listening" | "reading" | "building">("learning");
  const [activePollVotes, setActivePollVotes] = useState<Record<string, number>>({});
  const [selectedPollOption, setSelectedPollOption] = useState<Record<string, string>>({});
  
  // Upvote Startup local interaction state
  const [votedStartups, setVotedStartups] = useState<Record<string, boolean>>({});

  const handleStartupUpvote = (id: string) => {
    setVotedStartups((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Poll Vote Handler
  const handlePollVote = (postId: string, optionText: string) => {
    if (selectedPollOption[postId]) return; // Single vote only
    setSelectedPollOption(prev => ({ ...prev, [postId]: optionText }));
    setActivePollVotes(prev => ({
      ...prev,
      [`${postId}-${optionText}`]: (prev[`${postId}-${optionText}`] || 0) + 1
    }));
  };

  // Calculate Briefing Stats from live datasets
  const newStartupsCount = liveStartups.filter(s => s.launchDay).length;
  const matchInvestorsCount = mockInvestors.slice(0, 5).length;
  const newPodcastsCount = mockPodcasts.slice(0, 3).length;
  const matchingJobsCount = mockJobs.slice(0, 7).length;
  const videoUploadersCount = 4;

  // Micro detail tags helper
  const getMicroBadge = (index: number) => {
    if (index % 5 === 0) return <span className="absolute top-2 left-2 bg-red-650 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">LIVE</span>;
    if (index % 5 === 1) return <span className="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Trending #3</span>;
    if (index % 5 === 2) return <span className="absolute top-2 left-2 bg-neutral-900 text-white dark:bg-white dark:text-black text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Staff Pick</span>;
    if (index % 5 === 3) return <span className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">AI Recommended</span>;
    return <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Editor's Choice</span>;
  };

  const featuredVideo = liveVideos[3];

  // Mixed Feed interleaving list using live ticking state
  const mixedFeedItems = [
    { type: "video", data: liveVideos[4] },
    { type: "launch", data: liveStartups[0] }, // Noventra launch
    { type: "podcast", data: mockPodcasts[1] },
    { type: "poll", data: mockCommunityPosts[0] },
    { type: "job", data: mockJobs[0] },
    { type: "launch", data: liveStartups[1] }, // Linear launch
    { type: "event", data: mockEvents[0] },
    { type: "video", data: liveVideos[5] },
    { type: "post", data: mockCommunityPosts[1] },
    { type: "job", data: mockJobs[1] }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 w-full pb-10">
      
      {/* LEFT COLUMN: Main Feed content (Col-span 3) */}
      <div className="xl:col-span-3 space-y-8 min-w-0">

        {/* 1. DAILY BRIEFING WIDGET */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border border-neutral-805 text-white rounded-3xl p-6 shadow-md relative overflow-hidden animate-fadeIn">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Good Morning, Builder</h1>
                <p className="text-[10px] sm:text-xs text-neutral-450 font-bold uppercase tracking-wider mt-0.5">Your daily Noventra briefing</p>
              </div>
              <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                <span>Live Feed</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-neutral-300">
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition">
                <span className="text-lg">🚀</span>
                <span>{newStartupsCount} new startups launched today</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition">
                <span className="text-lg">🤝</span>
                <span>{matchInvestorsCount} investors match your profile</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition">
                <span className="text-lg">🎙️</span>
                <span>{newPodcastsCount} new podcasts released</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition">
                <span className="text-lg">💼</span>
                <span>{matchingJobsCount} jobs match your skill stack</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between sm:items-center text-xs text-neutral-400 gap-2 font-bold">
              <span>🔔 {videoUploadersCount} founders you follow uploaded videos recently</span>
              <div className="flex items-center space-x-2 bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-700/50">
                <Cpu className="w-3.5 h-3.5 text-neutral-300" />
                <span>Trending: <span className="text-white">"MCP Servers"</span></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 2. FEATURED SPOTLIGHT */}
        {featuredVideo && (
          <div
            onClick={() => onSelectVideo(featuredVideo.id)}
            className="group cursor-pointer rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden relative min-h-[300px] sm:min-h-[380px] flex items-end p-6 sm:p-8 transition duration-300 shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-neutral-900">
              <img
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-101 transition duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

            <div className="relative z-20 max-w-2xl space-y-3.5">
              <span className="bg-white/15 text-white border border-white/25 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 w-max">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Recommended Spotlight</span>
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight group-hover:text-neutral-300 transition duration-300">
                {featuredVideo.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-semibold line-clamp-2 leading-relaxed">
                {featuredVideo.description}
              </p>
              
              <div className="flex items-center space-x-3.5 pt-1.5">
                <img
                  src={featuredVideo.channel.avatarUrl}
                  alt={featuredVideo.channel.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div className="text-xs font-semibold text-neutral-300">
                  <p className="font-extrabold text-white flex items-center space-x-1.5">
                    <span>{featuredVideo.channel.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-current" />
                  </p>
                  <p className="mt-0.5 text-neutral-400">{featuredVideo.views.toLocaleString()} views • {new Date(featuredVideo.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CONTINUE READING / LEARNING tabs selector */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-100 dark:border-neutral-850 pb-3 gap-3">
            <h3 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-neutral-450" />
              <span>Resume Your Workspace Track</span>
            </h3>
            
            <div className="flex bg-neutral-100 dark:bg-neutral-950 p-0.5 rounded-xl border dark:border-neutral-800">
              {[
                { id: "learning", label: "Learning" },
                { id: "listening", label: "Listening" },
                { id: "reading", label: "Reading" },
                { id: "building", label: "Building" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setContinueTab(tab.id as any)}
                  className={`px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition focus:outline-none ${
                    continueTab === tab.id
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-350"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Render Active Track Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continueTab === "learning" && (
              <div className="bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850 p-4.5 rounded-2xl flex flex-col justify-between space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-neutral-400">
                    <span>Next.js Production Arch</span>
                    <span>75% Complete</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Lesson 6: Swapping standard endpoints for batching APIs</h4>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-neutral-900 dark:bg-white h-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <button 
                  onClick={() => onSelectVideo("vid-3")} 
                  className="bg-neutral-900 dark:bg-white text-white dark:text-black font-extrabold text-[10px] px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 hover:opacity-90 transition w-full"
                >
                  <Play className="w-3 h-3 fill-current text-white dark:text-black" />
                  <span>Resume Lesson</span>
                </button>
              </div>
            )}

            {continueTab === "listening" && (
              <div className="bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850 p-4.5 rounded-2xl flex flex-col justify-between space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-neutral-400">
                    <span>Developer tools growth</span>
                    <span>14m remaining</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Ep 12: Scaling Cap Tables and pre-seed rounds with Sequoia VC</h4>
                </div>
                <button 
                  onClick={() => onSelectVideo("vid-4")} 
                  className="bg-neutral-900 dark:bg-white text-white dark:text-black font-extrabold text-[10px] px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 hover:opacity-90 transition w-full"
                >
                  <Mic className="w-3.5 h-3.5 text-white dark:text-black" />
                  <span>Resume Podcast</span>
                </button>
              </div>
            )}

            {continueTab === "reading" && (
              <div className="bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850 p-4.5 rounded-2xl flex flex-col justify-between space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-neutral-400">
                    <span>API Docs Reference</span>
                    <span>Section 4 of 12</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Neon serverless pooling: sockets configuration & caching limits</h4>
                </div>
                <button 
                  onClick={() => onSelectVideo("vid-5")} 
                  className="bg-neutral-900 dark:bg-white text-white dark:text-black font-extrabold text-[10px] px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 hover:opacity-90 transition w-full"
                >
                  <Code2 className="w-3.5 h-3.5 text-white dark:text-black" />
                  <span>Resume Docs Reading</span>
                </button>
              </div>
            )}

            {continueTab === "building" && (
              <div className="bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850 p-4.5 rounded-2xl flex flex-col justify-between space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-neutral-400">
                    <span>Noventra Workspace sandbox</span>
                    <span>Last active 4h ago</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">Connecting PgBouncer to SQLite test suites on the edge</h4>
                </div>
                <button 
                  onClick={() => onSelectVideo("vid-1")} 
                  className="bg-neutral-900 dark:bg-white text-white dark:text-black font-extrabold text-[10px] px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 hover:opacity-90 transition w-full"
                >
                  <Cpu className="w-3.5 h-3.5 text-white dark:text-black" />
                  <span>Open Sandbox Workspace</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. DYNAMIC FEED (Interleaved content types using ticking state) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Recommended feed</span>
            </h3>
          </div>

          <div className="space-y-6">
            {mixedFeedItems.map((item, idx) => {
              
              /* VIDEO CARD */
              if (item.type === "video") {
                const video = item.data as Video;
                return (
                  <div
                    key={`feed-vid-${video.id}-${idx}`}
                    onClick={() => onSelectVideo(video.id)}
                    className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4.5 rounded-3xl flex flex-col sm:flex-row gap-5 hover:border-neutral-350 dark:hover:border-neutral-750 transition"
                  >
                    <div className="w-full sm:w-56 aspect-video bg-neutral-950 rounded-2xl overflow-hidden shrink-0 relative border border-neutral-200/50 dark:border-neutral-800">
                      <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {Math.floor(video.duration / 60)}m
                      </span>
                      {getMicroBadge(idx)}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <img src={video.channel.avatarUrl} alt="" className="w-6 h-6 rounded-full border object-cover" />
                          <span className="text-[10px] font-bold text-neutral-500">{video.channel.name}</span>
                        </div>
                        <h4 className="text-sm font-black text-neutral-900 dark:text-white mt-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition leading-snug">
                          {video.title}
                        </h4>
                        <p className="text-xs text-neutral-500 font-semibold line-clamp-2 mt-1 leading-normal">
                          {video.description}
                        </p>
                      </div>
                      <div className="flex items-center text-[10px] text-neutral-450 font-bold space-x-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-850">
                        <span>{video.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                        <span>•</span>
                        <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-450 px-2 py-0.5 rounded-lg text-[9px]">
                          {video.technology}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              /* STARTUP LAUNCH PH CARD */
              if (item.type === "launch") {
                const startup = item.data as Startup;
                const voted = votedStartups[startup.id];
                const upvotes = (startup.upvotesCount || 100) + (voted ? 1 : 0);

                return (
                  <div
                    key={`feed-launch-${startup.id}-${idx}`}
                    className="bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-850 p-5 rounded-3xl flex flex-col space-y-4 shadow-xs"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start space-x-3.5">
                        <img src={startup.logo} alt="" className="w-12 h-12 rounded-2xl object-cover border bg-white" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-black text-neutral-900 dark:text-white">{startup.name}</h4>
                            <span className="text-[9px] bg-neutral-50 dark:bg-neutral-950 text-neutral-500 px-2.5 py-0.5 rounded font-bold border border-neutral-200/50">
                              {startup.industry}
                            </span>
                            <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-650 dark:text-orange-400 border border-orange-200/50 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                              Trending #{startup.trendingRank || 3}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 font-semibold mt-1 leading-normal">{startup.description}</p>
                        </div>
                      </div>

                      {/* PH Upvote button */}
                      <button
                        onClick={() => handleStartupUpvote(startup.id)}
                        className={`flex flex-col items-center justify-center border rounded-2xl px-3.5 py-2 min-w-14 transition focus:outline-none ${
                          voted
                            ? "bg-neutral-900 border-neutral-905 dark:bg-white dark:border-white text-white dark:text-black"
                            : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span className="text-[10px] font-black mt-0.5">{upvotes}</span>
                      </button>
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-850 pt-3 flex flex-wrap gap-4 text-xs font-semibold text-neutral-550 dark:text-neutral-400 items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Daily Visitors: <strong className="text-neutral-900 dark:text-white">{(startup.visitorsToday || 200).toLocaleString()}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Stage: <strong className="text-neutral-900 dark:text-white">{startup.fundingStage}</strong></span>
                      </div>
                      <button 
                        onClick={() => onSelectVideo(startup.launchVideoId || "vid-4")}
                        className="bg-neutral-50 dark:bg-neutral-955 hover:bg-neutral-100 dark:hover:bg-neutral-800 border dark:border-neutral-800 px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center space-x-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Founder pitch</span>
                      </button>
                    </div>
                  </div>
                );
              }

              /* POLL POST */
              if (item.type === "poll") {
                const post = item.data as CommunityPost;
                const votedOption = selectedPollOption[post.id];
                return (
                  <div key={`feed-poll-${post.id}-${idx}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xs">
                    <div className="flex items-center space-x-2.5">
                      <img src={post.creatorAvatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white">{post.creatorName}</h4>
                        <span className="text-[10px] text-neutral-450 font-bold">Community Post • Poll</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-semibold">
                      {post.content}
                    </p>

                    {post.poll && (
                      <div className="space-y-2 pt-2">
                        {post.poll.options.map((opt) => {
                          const votes = opt.votes + (activePollVotes[`${post.id}-${opt.text}`] || 0);
                          const total = post.poll!.totalVotes + (votedOption ? 1 : 0);
                          const percent = total > 0 ? Math.round((votes / total) * 100) : 0;
                          const active = votedOption === opt.text;

                          return (
                            <button
                              key={opt.text}
                              disabled={!!votedOption}
                              onClick={() => handlePollVote(post.id, opt.text)}
                              className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition duration-200 flex justify-between items-center relative overflow-hidden focus:outline-none ${
                                active
                                  ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800"
                                  : "border-neutral-150 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-955"
                              }`}
                            >
                              <div className="absolute inset-y-0 left-0 bg-neutral-100 dark:bg-neutral-800/80 pointer-events-none transition-all duration-500" style={{ width: votedOption ? `${percent}%` : "0%" }} />
                              <span className="relative z-10">{opt.text}</span>
                              {votedOption && <span className="relative z-10 text-[10px] text-neutral-500 font-extrabold">{percent}%</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              /* JOB POST */
              if (item.type === "job") {
                const job = item.data as Job;
                return (
                  <div key={`feed-job-${job.id}-${idx}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl flex justify-between items-center shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-neutral-50 dark:bg-neutral-955 text-neutral-500 px-2 py-0.5 border dark:border-neutral-800 rounded font-bold">
                        {job.type}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white mt-1.5">{job.title}</h4>
                      <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{job.companyName} • {job.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-neutral-900 dark:text-white block">{job.salary}</span>
                      <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition mt-2">
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Sidebar (Col-span 1) */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* 1. ECOSYSTEM LIVE ACTIVITIES LOG */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="border-b border-neutral-100 dark:border-neutral-850 pb-2.5 flex justify-between items-center">
            <h3 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Live Activity Log</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="space-y-3.5">
            {[
              { text: "Nayud Nayudu uploaded Next.js Masterclass", time: "18m ago" },
              { text: "Investor subscribed to Stripe Devs channel", time: "25m ago" },
              { text: "Linear Labs reached 10K active subscribers", time: "1h ago" },
              { text: "Founder announced $1.2M Seed funding", time: "2h ago" },
              { text: "New comment on Postgres socket batching", time: "3h ago" }
            ].map((activity, idx) => (
              <div key={idx} className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 space-y-1.5 leading-relaxed">
                <div className="flex justify-between items-start gap-2 border-b border-neutral-50 dark:border-neutral-850/50 pb-1.5 last:border-b-0">
                  <span className="text-neutral-800 dark:text-neutral-300">{activity.text}</span>
                  <span className="text-[8.5px] text-neutral-400 shrink-0 font-bold mt-0.5">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. FASTEST GROWING STARTUPS */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="border-b border-neutral-100 dark:border-neutral-850 pb-2">
            <h3 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-current" />
              <span>Fastest Growing Hubs</span>
            </h3>
          </div>
          <div className="space-y-3">
            {liveStartups.slice(0, 4).map((startup, idx) => (
              <div key={startup.id} className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2.5">
                  <img src={startup.logo} alt="" className="w-7 h-7 rounded-lg object-cover border bg-white" />
                  <div>
                    <h4 className="text-neutral-900 dark:text-white font-extrabold leading-tight">{startup.name}</h4>
                    <span className="text-[9px] text-neutral-450 font-bold">{startup.metrics.arr} ARR</span>
                  </div>
                </div>
                <span className="text-emerald-500 text-[10px] font-black">{startup.metrics.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TRENDING STACK */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="border-b border-neutral-100 dark:border-neutral-850 pb-2">
            <h3 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-neutral-400" />
              <span>Developer stack</span>
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "Next.js 16", type: "Framework", rank: "#1" },
              { name: "MCP SQLite Server", type: "API Protocol", rank: "#2" },
              { name: "pgvector (Postgres)", type: "Vector DB", rank: "#3" },
              { name: "Redis Cache Clusters", type: "Caching Node", rank: "#4" }
            ].map((stack, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                <div>
                  <h4 className="text-neutral-900 dark:text-white font-extrabold leading-tight">{stack.name}</h4>
                  <span className="text-[9px] text-neutral-450 font-bold">{stack.type}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-extrabold">{stack.rank}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
