"use client";

import React, { useState, useEffect } from "react";
import { Play, Sparkles, Heart, Bookmark, Share2, Plus, Users, ArrowRight } from "lucide-react";
import { Video } from "./types";
import { mockVideos, mockComments } from "./mockDiscoveryData";
import VideoPlayer from "./VideoPlayer";
import AIWorkspace from "./AIWorkspace";
import CommentsSection from "./CommentsSection";

interface FounderTVProps {
  videoId?: string | null;
  onSelectVideo: (videoId: string | null) => void;
  onSelectChannel: (channelId: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All FounderTV" },
  { id: "pitch", label: "Pitch Videos" },
  { id: "tech", label: "Coding & Tech" },
  { id: "design", label: "Product Design" },
  { id: "stories", label: "Startup Stories" }
];

export default function FounderTV({ videoId, onSelectVideo, onSelectChannel }: FounderTVProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Sync active video from props
  useEffect(() => {
    if (videoId) {
      const found = mockVideos.find((v) => v.id === videoId);
      if (found) {
        setCurrentVideo(found);
        setIsLiked(false);
        setIsBookmarked(false);
        setIsSubscribed(false);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setCurrentVideo(null);
    }
  }, [videoId]);

  const handleVideoEnded = () => {
    if (isAutoplay && currentVideo) {
      // Load next video in list
      const idx = mockVideos.findIndex((v) => v.id === currentVideo.id);
      const nextIdx = (idx + 1) % mockVideos.length;
      onSelectVideo(mockVideos[nextIdx].id);
    }
  };

  const handleSeek = (seconds: number) => {
    const videoElem = document.querySelector("video");
    if (videoElem) {
      videoElem.currentTime = seconds;
      videoElem.play().catch(() => {});
    }
  };

  const filteredVideos = activeCategory === "all"
    ? mockVideos
    : mockVideos.filter((v) => v.categoryId === activeCategory);

  // Theater Playback view
  if (currentVideo) {
    const relatedVideos = mockVideos.filter((v) => v.id !== currentVideo.id);

    return (
      <div className="w-full pb-10 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <button
          onClick={() => onSelectVideo(null)}
          className="text-xs font-bold text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition flex items-center space-x-1"
        >
          ← Back to FounderTV Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Player, Video Info, Comments */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Custom Video Player */}
            <VideoPlayer
              src={currentVideo.videoUrl}
              thumbnailUrl={currentVideo.thumbnailUrl}
              autoplay={true}
              onEnded={handleVideoEnded}
              transcript={currentVideo.transcript}
            />

            {/* Video Header Detail */}
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
                {currentVideo.title}
              </h1>

              {/* Interaction Bar & Channel Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-150 dark:border-neutral-800 pb-5 space-y-4 sm:space-y-0">
                <div
                  onClick={() => onSelectChannel(currentVideo.channelId)}
                  className="flex items-center space-x-3.5 cursor-pointer group"
                >
                  <img
                    src={currentVideo.channel.avatarUrl}
                    alt={currentVideo.channel.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                      {currentVideo.channel.name}
                    </h3>
                    <span className="text-xs text-neutral-500 font-semibold">
                      {currentVideo.channel.subscribersCount.toLocaleString()} subscribers
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSubscribed(!isSubscribed);
                    }}
                    className={`ml-4 px-4 py-1.5 rounded-full text-xs font-bold transition focus:outline-none ${
                      isSubscribed
                        ? "bg-neutral-100 dark:bg-neutral-850 text-neutral-500"
                        : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90"
                    }`}
                  >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                </div>

                {/* Like / Share Buttons */}
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold border transition focus:outline-none ${
                      isLiked
                        ? "bg-red-50 text-red-650 border-red-200"
                        : "bg-white dark:bg-neutral-900 text-neutral-650 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    <span>{currentVideo.likesCount + (isLiked ? 1 : 0)}</span>
                  </button>

                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold border transition focus:outline-none ${
                      isBookmarked
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white border-neutral-300 dark:border-neutral-700"
                        : "bg-white dark:bg-neutral-900 text-neutral-650 dark:text-neutral-350 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    <span>Save</span>
                  </button>

                  <button className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold border bg-white dark:bg-neutral-900 text-neutral-650 dark:text-neutral-350 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 focus:outline-none transition">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Description Drawer Box */}
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 p-4 sm:p-5 rounded-2xl space-y-2">
                <div className="flex items-center space-x-3 text-xs text-neutral-500 font-bold">
                  <span>{currentVideo.views.toLocaleString("en-US")} views</span>
                  <span>•</span>
                  <span>{new Date(currentVideo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-medium">
                  {currentVideo.description}
                </p>
                {currentVideo.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {currentVideo.tags.map((tag, idx) => (
                      <span key={idx} className="bg-neutral-100 dark:bg-neutral-850 text-neutral-650 dark:text-neutral-450 px-2 py-0.5 rounded text-[10px] font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Nested Comments Section */}
            <CommentsSection comments={mockComments} videoChannelUserId={currentVideo.channel.userId} videoId={currentVideo.id} />
          </div>

          {/* Right Column: AI Workspace & Queue */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* AI Workspace Panel */}
            <AIWorkspace video={currentVideo} onSeek={handleSeek} onSelectChannel={onSelectChannel} />

            {/* Autoplay Queue list */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Up Next</h3>
                <label className="flex items-center space-x-2 text-xs text-neutral-450 cursor-pointer font-bold select-none">
                  <span>Autoplay</span>
                  <input
                    type="checkbox"
                    checked={isAutoplay}
                    onChange={(e) => setIsAutoplay(e.target.checked)}
                    className="rounded border-neutral-300 accent-neutral-900 dark:accent-white focus:ring-0 focus:outline-none"
                  />
                </label>
              </div>

              <div className="space-y-3.5">
                {relatedVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onSelectVideo(video.id)}
                    className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-2.5 rounded-xl hover:border-neutral-350 dark:hover:border-neutral-700 transition flex space-x-3 items-center"
                  >
                    <div className="w-20 sm:w-28 aspect-video bg-neutral-950 rounded-lg overflow-hidden shrink-0 relative">
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                        {Math.floor(video.duration / 60)}:{video.duration % 60 < 10 ? "0" : ""}{video.duration % 60}
                      </span>
                    </div>
                    <div className="flex-1 space-y-0.5 overflow-hidden">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                        {video.title}
                      </h4>
                      <span className="text-[10px] text-neutral-455 font-semibold block">
                        {video.channel.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Browse grid view
  return (
    <div className="space-y-6 w-full pb-10">
      
      {/* Category Pills Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition focus:outline-none ${
              activeCategory === cat.id
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                : "bg-white dark:bg-neutral-900 text-neutral-550 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Video Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video.id)}
            className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm hover:border-neutral-350 dark:hover:border-neutral-700 transition duration-300 flex flex-col justify-between"
          >
            <div className="aspect-video w-full bg-neutral-900 relative overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
              />
              <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {Math.floor(video.duration / 60)}:{video.duration % 60 < 10 ? "0" : ""}{video.duration % 60}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <img
                  src={video.channel.avatarUrl}
                  alt={video.channel.name}
                  className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-850 object-cover mt-0.5 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                    {video.title}
                  </h3>
                  <div className="space-y-0.5">
                    <p className="text-xs text-neutral-500 font-semibold hover:text-neutral-900 dark:hover:text-white transition">
                      {video.channel.name}
                    </p>
                    <div className="flex items-center text-[10px] text-neutral-450 font-bold space-x-1.5">
                      <span>{video.views.toLocaleString("en-US")} views</span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
