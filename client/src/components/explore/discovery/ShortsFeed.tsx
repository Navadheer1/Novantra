"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageSquare, Bookmark, Share2, Sparkles, ChevronUp, ChevronDown, User, Store, Bot } from "lucide-react";
import { Short } from "./types";
import { mockShorts } from "./mockDiscoveryData";

interface ShortsFeedProps {
  shortId?: string | null;
  onSelectShort: (shortId: string | null) => void;
  onSelectChannel: (channelId: string) => void;
}

export default function ShortsFeed({ shortId, onSelectShort, onSelectChannel }: ShortsFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedShorts, setLikedShorts] = useState<Record<string, boolean>>({});
  const [bookmarkedShorts, setBookmarkedShorts] = useState<Record<string, boolean>>({});
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Sync index if a specific shortId is requested
  useEffect(() => {
    if (shortId) {
      const idx = mockShorts.findIndex((s) => s.id === shortId);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [shortId]);

  // Video playback controller based on active index
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIndex) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [activeIndex]);

  const currentShort = mockShorts[activeIndex];

  const handleNext = () => {
    if (activeIndex < mockShorts.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setShowAiSummary(false);
      setShowComments(false);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      setShowAiSummary(false);
      setShowComments(false);
    }
  };

  // Listen to keyboard up/down arrows and mouse scroll inside container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handlePrev();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 50) {
      handleNext();
    } else if (e.deltaY < -50) {
      handlePrev();
    }
  };

  const toggleLike = (id: string) => {
    setLikedShorts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedShorts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentShort) return;
    const shortId = currentShort.id;
    setCommentsMap((prev) => ({
      ...prev,
      [shortId]: [newComment, ...(prev[shortId] || [])]
    }));
    setNewComment("");
  };

  if (!currentShort) {
    return <div className="text-center py-12 font-semibold">No shorts available.</div>;
  }

  const isLiked = likedShorts[currentShort.id];
  const isBookmarked = bookmarkedShorts[currentShort.id];
  const activeComments = commentsMap[currentShort.id] || [];

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="flex items-center justify-center min-h-[80vh] w-full focus:outline-none py-6 select-none"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 max-w-2xl w-full justify-center relative">
        
        {/* Navigation arrow buttons for Desktop */}
        <div className="absolute left-4 hidden lg:flex flex-col space-y-4 z-20">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="p-3 bg-white dark:bg-neutral-850 border dark:border-neutral-800 rounded-full hover:scale-105 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition"
          >
            <ChevronUp className="w-5 h-5 text-neutral-800 dark:text-white" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === mockShorts.length - 1}
            className="p-3 bg-white dark:bg-neutral-850 border dark:border-neutral-800 rounded-full hover:scale-105 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition"
          >
            <ChevronDown className="w-5 h-5 text-neutral-800 dark:text-white" />
          </button>
        </div>

        {/* Swipe Viewport container */}
        <div
          onWheel={handleWheel}
          className="relative aspect-[9/16] h-[600px] w-[337px] rounded-3xl overflow-hidden bg-black border border-neutral-850 shadow-2xl flex flex-col justify-end"
        >
          {/* Looing Videos Container */}
          <div className="absolute inset-0 z-0">
            {mockShorts.map((short, idx) => (
              <video
                key={short.id}
                ref={(el) => { videoRefs.current[idx] = el; }}
                src={short.videoUrl}
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  idx === activeIndex ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              />
            ))}
          </div>

          {/* Shadow mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 z-10 pointer-events-none" />

          {/* Interactive Side Button Panel overlay */}
          <div className="absolute right-4.5 bottom-28 z-20 flex flex-col space-y-5 items-center">
            
            {/* Profile */}
            <div
              onClick={() => onSelectChannel(currentShort.channelId)}
              className="w-10 h-10 rounded-full border-2 border-white overflow-hidden cursor-pointer shadow-md transform hover:scale-105 transition"
              title={currentShort.channel.name}
            >
              <img src={currentShort.channel.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            {/* Like */}
            <button
              onClick={() => toggleLike(currentShort.id)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className={`p-3 rounded-full bg-black/45 border border-white/10 hover:bg-black/60 transition ${
                isLiked ? "text-red-500" : "text-white"
              }`}>
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </div>
              <span className="text-[10px] text-white font-bold mt-1">
                {currentShort.likesCount + (isLiked ? 1 : 0)}
              </span>
            </button>

            {/* Comment Drawer button */}
            <button
              onClick={() => {
                setShowComments(!showComments);
                setShowAiSummary(false);
              }}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className={`p-3 rounded-full bg-black/45 border border-white/10 hover:bg-black/60 transition ${
                showComments ? "text-primary" : "text-white"
              }`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-white font-bold mt-1">
                {currentShort.commentsCount + activeComments.length}
              </span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(currentShort.id)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className={`p-3 rounded-full bg-black/45 border border-white/10 hover:bg-black/60 transition ${
                isBookmarked ? "text-primary" : "text-white"
              }`}>
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </div>
              <span className="text-[10px] text-white font-bold mt-1">Save</span>
            </button>

            {/* AI Summary button drawer */}
            <button
              onClick={() => {
                setShowAiSummary(!showAiSummary);
                setShowComments(false);
              }}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className={`p-3 rounded-full bg-black/45 border border-white/10 hover:bg-black/60 transition ${
                showAiSummary ? "text-emerald-450" : "text-white"
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-white font-bold mt-1">AI Info</span>
            </button>
          </div>

          {/* Bottom Info card */}
          <div className="absolute left-4 right-16 bottom-6 z-20 space-y-3.5">
            <div className="space-y-1">
              <h3 className="text-white text-xs sm:text-sm font-bold leading-snug">
                {currentShort.title}
              </h3>
              <p className="text-neutral-300 text-[10px] sm:text-xs leading-relaxed line-clamp-2">
                {currentShort.description}
              </p>
            </div>

            {/* Tag Badges (Startup and Founder links) */}
            <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold">
              {currentShort.relatedStartupName && (
                <div className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full px-2.5 py-1 transition cursor-pointer">
                  <Store className="w-3 h-3 text-neutral-300" />
                  <span>{currentShort.relatedStartupName}</span>
                </div>
              )}
              {currentShort.relatedFounderName && (
                <div
                  onClick={() => onSelectChannel(currentShort.channelId)}
                  className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full px-2.5 py-1 transition cursor-pointer"
                >
                  <User className="w-3 h-3 text-neutral-300" />
                  <span>{currentShort.relatedFounderName}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Drawer overlay (inside player box) */}
          {showAiSummary && (
            <div className="absolute inset-x-0 bottom-0 max-h-[50%] bg-neutral-900/95 border-t border-neutral-800 rounded-t-3xl p-5 z-35 animate-slideUp text-white space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400 flex items-center space-x-1">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Short summary</span>
                </h4>
                <button onClick={() => setShowAiSummary(false)} className="text-neutral-400 text-xs font-bold">Close</button>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-semibold">
                {currentShort.aiSummary || "This builder short reviews frontend system configurations and interface triggers."}
              </p>
            </div>
          )}

          {/* Comment Drawer overlay (inside player box) */}
          {showComments && (
            <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-neutral-950/95 border-t border-neutral-850 rounded-t-3xl p-4 z-35 animate-slideUp text-white flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400">Comments</h4>
                <button onClick={() => setShowComments(false)} className="text-neutral-400 text-xs font-bold">Close</button>
              </div>

              {/* Comment list */}
              <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                {activeComments.length > 0 ? (
                  activeComments.map((cStr, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 p-2 rounded-xl text-xs space-y-1">
                      <span className="text-neutral-450 font-bold">You</span>
                      <p className="text-neutral-200">{cStr}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-neutral-500 italic">No comments yet. Start the discussion!</p>
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="flex space-x-1.5 pt-2 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 text-[10px] sm:text-xs border border-white/10 bg-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-white text-black px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold hover:bg-neutral-200 disabled:opacity-40 transition"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
