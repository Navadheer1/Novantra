"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import DiscoveryLayout, { DiscoveryView } from "@/components/explore/discovery/DiscoveryLayout";
import RecommendedFeed from "@/components/explore/discovery/RecommendedFeed";
import FounderTV from "@/components/explore/discovery/FounderTV";
import ShortsFeed from "@/components/explore/discovery/ShortsFeed";
import PodcastsFeed from "@/components/explore/discovery/PodcastsFeed";
import LearningPaths from "@/components/explore/discovery/LearningPaths";
import TrendingFeed from "@/components/explore/discovery/TrendingFeed";
import LiveStreaming from "@/components/explore/discovery/LiveStreaming";
import PlaylistsManager from "@/components/explore/discovery/PlaylistsManager";
import ChannelProfile from "@/components/explore/discovery/ChannelProfile";
import DiscoveryMap from "@/components/explore/discovery/DiscoveryMap";
import OpportunitiesFeed from "@/components/explore/discovery/OpportunitiesFeed";
import { 
  mockVideos, mockShorts, mockPodcasts, mockStartups, 
  mockFounders, mockInvestors, mockJobs, mockEvents, mockLearningPaths 
} from "@/components/explore/discovery/mockDiscoveryData";
import { Video, Short, Startup } from "@/components/explore/discovery/types";

// Pulse Skeleton Loader for premium entry loading
function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 p-6 space-y-8 animate-pulse antialiased">
      <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full max-w-4xl mx-auto" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-3xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full" />
            <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full" />
            <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-3xl w-full" />
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-3xl w-full" />
        </div>
      </div>
    </div>
  );
}

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentView, setCurrentView] = useState<DiscoveryView>("recommended");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeShortId, setActiveShortId] = useState<string | null>(null);
  const [activePodcastId, setActivePodcastId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  // Live state databases for real-time tickers
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [shorts, setShorts] = useState<Short[]>(mockShorts);
  const [startups, setStartups] = useState<Startup[]>(mockStartups);

  // Search Results State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchActive, setSearchActive] = useState(false);

  // 1. Post-Hydration client shuffling for evolving feeds on refresh
  useEffect(() => {
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    setVideos(shuffle(mockVideos));
    setShorts(shuffle(mockShorts));
    setStartups(shuffle(mockStartups));
  }, []);

  // 2. Real-time simulated ecosystem ticks (views & upvotes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly bump view counts of some videos
      setVideos((prev) =>
        prev.map((v, idx) => {
          if (idx % 6 === 0) {
            return {
              ...v,
              views: v.views + Math.floor(Math.random() * 4) + 1,
              commentsCount: v.commentsCount + (Math.random() > 0.95 ? 1 : 0)
            };
          }
          return v;
        })
      );

      // Randomly bump views of some shorts
      setShorts((prev) =>
        prev.map((s, idx) => {
          if (idx % 8 === 0) {
            return { ...s, views: s.views + Math.floor(Math.random() * 8) + 1 };
          }
          return s;
        })
      );

      // Randomly bump upvote metrics on launches
      setStartups((prev) =>
        prev.map((s, idx) => {
          if (s.launchDay && idx % 3 === 0) {
            const increment = Math.random() > 0.85 ? 1 : 0;
            return {
              ...s,
              upvotesCount: (s.upvotesCount || 0) + increment,
              visitorsToday: (s.visitorsToday || 0) + Math.floor(Math.random() * 3) + 1
            };
          }
          return s;
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Synchronise state from URL Search Params
  useEffect(() => {
    const viewParam = searchParams.get("view") as DiscoveryView | null;
    if (viewParam) {
      setCurrentView(viewParam);
    } else {
      setCurrentView("recommended");
    }

    setActiveVideoId(searchParams.get("video"));
    setActiveShortId(searchParams.get("short"));
    setActivePodcastId(searchParams.get("podcast"));
    setActiveChannelId(searchParams.get("channel"));
  }, [searchParams]);

  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleViewChange = (view: DiscoveryView, extraParams?: Record<string, string | null>) => {
    setSearchActive(false);
    
    // Clear playback targets when switching views
    const updates: Record<string, string | null> = {
      view,
      video: null,
      short: null,
      podcast: null,
      channel: null,
      ...extraParams
    };
    updateUrlParams(updates);
  };

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSearchCategory(category);
    setSearchActive(query.trim() !== "");
  };

  // Click callbacks to route views
  const handleSelectVideo = (videoId: string | null) => {
    handleViewChange("foundertv", { video: videoId });
  };

  const handleSelectShort = (shortId: string | null) => {
    handleViewChange("shorts", { short: shortId });
  };

  const handleSelectPodcast = (podcastId: string | null) => {
    handleViewChange("podcasts", { podcast: podcastId });
  };

  const handleSelectChannel = (channelId: string) => {
    handleViewChange("channel", { channel: channelId });
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchActive(false);
  };

  // Filter Search results based on query & category (Dynamic Rankings)
  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredShorts = shorts.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPodcasts = mockPodcasts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const searchStartups = startups.map(s => ({
    id: s.id,
    name: s.name,
    tagline: s.description,
    industry: s.industry,
    stage: s.fundingStage,
    logo: s.logo
  }));
  const filteredStartups = searchStartups.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchFounders = mockFounders.map(f => ({
    name: f.name,
    title: f.headline,
    role: "FOUNDER",
    avatar: f.avatarUrl,
    channelId: f.channelId
  }));
  const filteredFounders = searchFounders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchInvestors = mockInvestors.map(i => ({
    name: i.name,
    title: i.headline,
    ticket: i.ticketSize,
    avatar: i.avatarUrl
  }));
  const filteredInvestors = searchInvestors.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchJobs = mockJobs.map(j => ({
    id: j.id,
    title: j.title,
    company: j.companyName,
    location: j.location,
    type: j.type,
    salary: j.salary
  }));
  const filteredJobs = searchJobs.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = mockEvents.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showAll = searchCategory === "all";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      <Navbar />

      <DiscoveryLayout
        currentView={currentView}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
      >
        {searchActive ? (
          /* SEARCH RESULTS PANEL VIEW */
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-xs text-neutral-450 mt-1 font-bold">
                Dynamic matches filtered across global builder directories.
              </p>
            </div>

            {/* VIDEOS RESULTS */}
            {(showAll || searchCategory === "videos") && filteredVideos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleSelectVideo(video.id)}
                      className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-350 dark:hover:border-neutral-700 transition"
                    >
                      <div className="aspect-video bg-neutral-950 relative overflow-hidden">
                        <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {Math.floor(video.duration / 60)}m
                        </span>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="text-[9px] uppercase font-bold text-neutral-400">{video.channel.name}</h4>
                        <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-1 leading-snug">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SHORTS RESULTS */}
            {(showAll || searchCategory === "shorts") && filteredShorts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Shorts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredShorts.map((short) => (
                    <div
                      key={short.id}
                      onClick={() => handleSelectShort(short.id)}
                      className="group cursor-pointer aspect-[9/16] bg-neutral-950 border border-neutral-855 rounded-2xl overflow-hidden relative"
                    >
                      <img src="https://images.unsplash.com/photo-1542744094-2ab25be78b90?w=300&q=80" alt="" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/85 to-transparent">
                        <p className="text-white text-xs font-bold line-clamp-2">{short.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STARTUPS RESULTS */}
            {(showAll || searchCategory === "startups") && filteredStartups.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Startups</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStartups.map((startup, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 p-4.5 rounded-2xl flex items-center space-x-3.5"
                    >
                      <img src={startup.logo} alt="" className="w-10 h-10 rounded-xl border object-cover bg-white" />
                      <div>
                        <h4 className="text-sm font-black text-neutral-900 dark:text-white">{startup.name}</h4>
                        <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{startup.tagline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FOUNDERS RESULTS */}
            {(showAll || searchCategory === "founders") && filteredFounders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Founders & Builders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFounders.map((founder, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectChannel(founder.channelId)}
                      className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl flex items-center space-x-3.5 hover:border-neutral-350 dark:hover:border-neutral-755 transition"
                    >
                      <img src={founder.avatar} alt="" className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <h4 className="text-sm font-black text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">{founder.name}</h4>
                        <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{founder.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INVESTORS RESULTS */}
            {(showAll || searchCategory === "investors") && filteredInvestors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Investors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInvestors.map((investor, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl flex items-center space-x-3.5"
                    >
                      <img src={investor.avatar} alt="" className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <h4 className="text-sm font-black text-neutral-900 dark:text-white">{investor.name}</h4>
                        <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{investor.title} • Ticket: {investor.ticket}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PODCASTS RESULTS */}
            {(showAll || searchCategory === "podcasts") && filteredPodcasts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Podcasts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredPodcasts.map((podcast) => (
                    <div
                      key={podcast.id}
                      onClick={() => handleSelectPodcast(podcast.id)}
                      className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4 rounded-2xl flex items-center space-x-4 hover:border-neutral-350 dark:hover:border-neutral-700 transition"
                    >
                      <img src={podcast.artworkUrl} alt="" className="w-12 h-12 rounded-xl object-cover border shrink-0" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white truncate">{podcast.title}</h4>
                        <p className="text-[10px] text-neutral-505 font-bold line-clamp-1 mt-0.5">{podcast.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JOBS RESULTS */}
            {(showAll || searchCategory === "jobs") && filteredJobs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Available Startup Jobs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-5 rounded-2xl flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] bg-neutral-100 dark:bg-neutral-850 text-neutral-500 font-bold px-2 py-0.5 rounded">
                          {job.type}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white mt-1.5">{job.title}</h4>
                        <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{job.company} • {job.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block">{job.salary}</span>
                        <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 text-[10px] font-bold px-3 py-1.5 rounded-lg transition mt-2">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS RESULTS */}
            {(showAll || searchCategory === "events") && filteredEvents.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-neutral-400">Upcoming Live Coding / Events</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-4.5 rounded-2xl space-y-2.5"
                    >
                      <span className="text-[9px] bg-red-50 dark:bg-red-955 text-red-650 px-2.5 py-0.5 rounded font-extrabold uppercase">
                        {event.type}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white mt-1">{event.title}</h4>
                      <p className="text-[10px] text-neutral-500 font-semibold">{new Date(event.date).toLocaleDateString([], { month: "short", day: "numeric" })} • {event.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Search Fallback */}
            {filteredVideos.length === 0 &&
              filteredShorts.length === 0 &&
              filteredStartups.length === 0 &&
              filteredFounders.length === 0 &&
              filteredInvestors.length === 0 &&
              filteredPodcasts.length === 0 &&
              filteredJobs.length === 0 &&
              filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-850 space-y-3.5 animate-fadeIn max-w-xl mx-auto">
                  <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">No results found</h3>
                  <p className="text-xs text-neutral-450 px-6 leading-relaxed font-semibold">
                    No items match your search filters. Try exploring <strong className="text-neutral-900 dark:text-white">AI</strong>, <strong className="text-neutral-900 dark:text-white">SaaS</strong>, or <strong className="text-neutral-900 dark:text-white">Cybersecurity</strong>!
                  </p>
                  <button onClick={handleClear} className="bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-xs font-bold transition mt-2">
                    Clear Search Query
                  </button>
                </div>
              )}
          </div>
        ) : (
          /* WORKSPACE TAB VIEWS SWITCH ROUTING */
          <div className="w-full">
            {currentView === "recommended" && (
              <RecommendedFeed
                videos={videos}
                startups={startups}
                shorts={shorts}
                onSelectVideo={handleSelectVideo}
                onSelectShort={handleSelectShort}
                onSelectPodcast={handleSelectPodcast}
              />
            )}

            {currentView === "foundertv" && (
              <FounderTV
                videoId={activeVideoId}
                onSelectVideo={handleSelectVideo}
                onSelectChannel={handleSelectChannel}
              />
            )}

            {currentView === "shorts" && (
              <ShortsFeed
                shortId={activeShortId}
                onSelectShort={handleSelectShort}
                onSelectChannel={handleSelectChannel}
              />
            )}

            {currentView === "podcasts" && (
              <PodcastsFeed
                podcastId={activePodcastId}
                onSelectPodcast={handleSelectPodcast}
              />
            )}

            {currentView === "learning" && (
              <LearningPaths onSelectVideo={handleSelectVideo} />
            )}

            {currentView === "trending" && (
              <TrendingFeed 
                videos={videos}
                startups={startups}
                onSelectVideo={handleSelectVideo} 
                onSelectChannel={handleSelectChannel}
              />
            )}

            {currentView === "live" && (
              <LiveStreaming onSelectChannel={handleSelectChannel} />
            )}

            {currentView === "library" && (
              <PlaylistsManager onSelectVideo={handleSelectVideo} />
            )}

            {currentView === "channel" && (
              <ChannelProfile
                channelId={activeChannelId || "ch-noventra"}
                onSelectVideo={handleSelectVideo}
                onSelectShort={handleSelectShort}
              />
            )}

            {currentView === "map" && (
              <DiscoveryMap />
            )}

            {currentView === "opportunities" && (
              <OpportunitiesFeed />
            )}
          </div>
        )}
      </DiscoveryLayout>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <ExplorePageContent />
    </Suspense>
  );
}
