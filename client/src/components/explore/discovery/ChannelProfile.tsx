"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Globe, MessageSquare, Flame, Award, BarChart3, 
  TrendingUp, Clock, Eye, Sparkles, AlertCircle, PlaySquare 
} from "lucide-react";
import { Channel, Video, Short } from "./types";
import { mockChannels, mockVideos, mockShorts } from "./mockDiscoveryData";

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ChannelProfileProps {
  channelId: string;
  onSelectVideo: (videoId: string) => void;
  onSelectShort: (shortId: string) => void;
}

export default function ChannelProfile({ channelId, onSelectVideo, onSelectShort }: ChannelProfileProps) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"videos" | "shorts" | "playlists" | "community" | "about" | "analytics">("videos");

  useEffect(() => {
    const found = mockChannels.find((c) => c.id === channelId) || mockChannels[0];
    setChannel(found);
    setSubCount(found.subscribersCount);
    setActiveTab("videos");
  }, [channelId]);

  if (!channel) {
    return <div className="text-center py-12 font-semibold">Loading Channel...</div>;
  }

  const handleSubscribeToggle = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      setSubCount((c) => c - 1);
    } else {
      setIsSubscribed(true);
      setSubCount((c) => c + 1);
    }
  };

  const channelVideos = mockVideos.filter((v) => v.channelId === channel.id);
  const channelShorts = mockShorts.filter((s) => s.channelId === channel.id);

  // Render achievement badge
  const renderAchievementBadge = (badgeName: string) => {
    const icons: Record<string, string> = {
      "Founder": "🚀",
      "Top Creator": "⭐",
      "Top Mentor": "🤝",
      "Investor": "💼",
      "Hackathon Winner": "🏆",
      "AI Expert": "🤖",
      "Open Source Contributor": "💻",
      "Verified Startup": "✅",
      "Early Adopter": "✨"
    };

    return (
      <div 
        key={badgeName}
        className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-800 px-2.5 py-1 rounded-full text-[10px] font-bold text-neutral-700 dark:text-neutral-350 select-none shadow-xs"
        title={`${badgeName} Badge`}
      >
        <span>{icons[badgeName] || "🏅"}</span>
        <span>{badgeName}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full pb-10">
      
      {/* Banner Banner */}
      <div className="w-full h-40 sm:h-60 rounded-2xl overflow-hidden relative bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        {channel.bannerUrl ? (
          <img src={channel.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-neutral-800 to-neutral-950" />
        )}
      </div>

      {/* Profile Info Overlay Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between px-4 sm:px-8 -mt-16 sm:-mt-12 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-6 text-center sm:text-left w-full">
          <img
            src={channel.avatarUrl}
            alt={channel.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-neutral-900 object-cover shadow-md bg-white shrink-0"
          />
          <div className="pb-1 space-y-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white truncate">
                {channel.name}
              </h1>

              {/* Discovery Score Badge */}
              <div className="bg-orange-50 dark:bg-orange-950/40 text-orange-655 dark:text-orange-400 border border-orange-200 dark:border-orange-900 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1.5 w-max mx-auto sm:mx-0 shadow-xs animate-pulse">
                <Flame className="w-4 h-4 fill-current" />
                <span>Score: {channel.discoveryScore || 85}</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-3 text-xs sm:text-sm text-neutral-500 font-bold">
              <span>{subCount.toLocaleString()} subscribers</span>
              <span>•</span>
              <span>{channel.followersCount.toLocaleString()} followers</span>
            </div>

            {/* Achievements Shelf */}
            {channel.achievements && channel.achievements.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                {channel.achievements.map((badge) => renderAchievementBadge(badge))}
              </div>
            )}
          </div>
        </div>

        <div className="pb-1 shrink-0">
          <button
            onClick={handleSubscribeToggle}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition focus:outline-none ${
              isSubscribed
                ? "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-750 dark:text-white border border-neutral-200 dark:border-neutral-700"
                : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>

      {/* Tabs Menu Selection */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex overflow-x-auto scrollbar-none p-1">
        {[
          { id: "videos", label: "Videos" },
          { id: "shorts", label: "Shorts" },
          { id: "playlists", label: "Playlists" },
          { id: "community", label: "Community" },
          { id: "about", label: "About" },
          { id: "analytics", label: "Creator Dashboard" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs sm:text-sm font-black border-b-2 transition focus:outline-none whitespace-nowrap ${
              activeTab === tab.id
                ? "border-neutral-900 dark:border-white text-neutral-950 dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-350"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels Contents */}
      <div className="pt-4">
        
        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {channelVideos.length > 0 ? (
              channelVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video.id)}
                  className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm hover:border-neutral-350 dark:hover:border-neutral-700 transition duration-300"
                >
                  <div className="aspect-video w-full bg-neutral-950 relative overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {Math.floor(video.duration / 60)}:{video.duration % 60 < 10 ? "0" : ""}{video.duration % 60}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition leading-snug">
                      {video.title}
                    </h3>
                    <div className="flex items-center text-[10px] text-neutral-500 font-bold space-x-1.5">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString([], { month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-450 italic font-semibold">No videos uploaded yet.</div>
            )}
          </div>
        )}

        {/* SHORTS TAB */}
        {activeTab === "shorts" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {channelShorts.length > 0 ? (
              channelShorts.map((short) => (
                <div
                  key={short.id}
                  onClick={() => onSelectShort(short.id)}
                  className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded-2xl overflow-hidden aspect-[9/16] relative transition shadow-xs hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-neutral-950">
                    <img src={short.videoUrl.includes("Bunny") ? "https://images.unsplash.com/photo-1542744094-2ab25be78b90?w=400&q=80" : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80"} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-85 transition duration-500" />
                  </div>
                  <div className="absolute inset-0 p-3.5 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/20 to-black/30 z-10">
                    <div />
                    <div className="space-y-1.5">
                      <p className="text-white text-xs sm:text-sm font-bold line-clamp-2 leading-tight">
                        {short.title}
                      </p>
                      <span className="text-[10px] text-neutral-350 font-bold bg-white/10 px-1.5 py-0.5 rounded">
                        {short.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-450 italic font-semibold">No shorts uploaded yet.</div>
            )}
          </div>
        )}

        {/* PLAYLISTS TAB */}
        {activeTab === "playlists" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Playlist</span>
              <h4 className="text-sm font-black text-neutral-900 dark:text-white">Build a SaaS</h4>
              <p className="text-xs text-neutral-500 font-semibold">Step-by-step engineering walk log.</p>
              <div className="w-full bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl text-[10px] text-neutral-600 dark:text-neutral-400 font-bold border border-neutral-100 dark:border-neutral-850">
                12 Videos • 3 Podcasts
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-5 shadow-xs space-y-4">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Playlist</span>
              <h4 className="text-sm font-black text-neutral-900 dark:text-white">Next.js Masterclass</h4>
              <p className="text-xs text-neutral-500 font-semibold">Server-side rendering, RSC architectures.</p>
              <div className="w-full bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl text-[10px] text-neutral-600 dark:text-neutral-400 font-bold border border-neutral-100 dark:border-neutral-850">
                8 Videos • 2 Projects
              </div>
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === "community" && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2.5">
                <img src={channel.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border" />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{channel.name}</h4>
                  <span className="text-[10px] text-neutral-450 font-bold">Post • 2 days ago</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-medium">
                We are building the next cohort of builder projects live on stream. What features are you most excited to learn: React layouts, caching APIs, or vector stores? Let us know!
              </p>
              <div className="flex items-center space-x-4 pt-2 border-t border-neutral-100 dark:border-neutral-850">
                <button className="flex items-center space-x-1.5 text-xs text-neutral-450 hover:text-red-500 font-semibold focus:outline-none transition">
                  <MessageSquare className="w-4 h-4" />
                  <span>Comments</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-6">
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 mb-2">Description</h3>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-medium">
                {channel.about || "No additional information provided."}
              </p>
            </div>

            {channel.socialLinks && (
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 mb-3">Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  {channel.socialLinks.website && (
                    <a
                      href={channel.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2.5 text-xs sm:text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-semibold transition"
                    >
                      <Globe className="w-4 h-4 text-neutral-400" />
                      <span>Official Website</span>
                    </a>
                  )}
                  {channel.socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${channel.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2.5 text-xs sm:text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-semibold transition"
                    >
                      <Twitter className="w-4 h-4 text-neutral-400" />
                      <span>Twitter / X</span>
                    </a>
                  )}
                  {channel.socialLinks.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${channel.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2.5 text-xs sm:text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-semibold transition"
                    >
                      <Linkedin className="w-4 h-4 text-neutral-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {channel.socialLinks.github && (
                    <a
                      href={`https://github.com/${channel.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2.5 text-xs sm:text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-semibold transition"
                    >
                      <Github className="w-4 h-4 text-neutral-400" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CREATOR ANALYTICS DASHBOARD */}
        {activeTab === "analytics" && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-6 rounded-3xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-850 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">Channel Analytics</h3>
                <p className="text-[10px] sm:text-xs text-neutral-450 mt-0.5">Real-time engagement metrics and audience growth.</p>
              </div>
              <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-850 text-neutral-600 px-3 py-1 rounded-full flex items-center space-x-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Last 30 Days</span>
              </span>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border dark:border-neutral-850 space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Total Views</span>
                <p className="text-lg font-black text-neutral-900 dark:text-white">124.5K</p>
                <span className="text-[9.5px] text-emerald-500 font-bold flex items-center space-x-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4%</span>
                </span>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border dark:border-neutral-850 space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Watch Time</span>
                <p className="text-lg font-black text-neutral-900 dark:text-white">8,420h</p>
                <span className="text-[9.5px] text-emerald-500 font-bold flex items-center space-x-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.1%</span>
                </span>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border dark:border-neutral-850 space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">New Subs</span>
                <p className="text-lg font-black text-neutral-900 dark:text-white">+1,280</p>
                <span className="text-[9.5px] text-emerald-500 font-bold flex items-center space-x-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8.7%</span>
                </span>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border dark:border-neutral-850 space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">Returning Viewers</span>
                <p className="text-lg font-black text-neutral-900 dark:text-white">72.4%</p>
                <span className="text-[9.5px] text-emerald-500 font-bold flex items-center space-x-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+15.3%</span>
                </span>
              </div>
            </div>

            {/* Stylized retention curve preview */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Audience Retention Curve (Average)</h4>
              <div className="bg-neutral-50 dark:bg-neutral-950/80 border dark:border-neutral-850 rounded-2xl p-4 h-24 flex items-end space-x-1.5 justify-between">
                {[90, 85, 76, 70, 68, 65, 62, 60, 59, 58, 56, 55, 54, 52, 50].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center space-y-1">
                    <div 
                      className="w-full bg-neutral-900 dark:bg-neutral-400 rounded-t-sm" 
                      style={{ height: `${val * 0.6}px` }}
                    />
                    <span className="text-[7.5px] text-neutral-450 font-bold">{idx * 2}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top performing logs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Top Performing Content</h4>
              <div className="space-y-2">
                {channelVideos.slice(0, 3).map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-955 transition">
                    <div className="flex items-center space-x-3.5">
                      <PlaySquare className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">{video.title}</span>
                    </div>
                    <span className="text-[10px] text-neutral-450 font-black shrink-0">{video.views.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
