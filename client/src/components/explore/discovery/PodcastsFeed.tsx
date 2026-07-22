"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Play, Pause, Volume2, User, Sparkles, BookOpen, Clock, Activity, Store } from "lucide-react";
import { Podcast } from "./types";
import { mockPodcasts } from "./mockDiscoveryData";

interface PodcastsFeedProps {
  podcastId?: string | null;
  onSelectPodcast: (podcastId: string | null) => void;
}

export default function PodcastsFeed({ podcastId, onSelectPodcast }: PodcastsFeedProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [activeTab, setActiveTab] = useState<"guests" | "summary" | "transcript">("guests");

  useEffect(() => {
    if (podcastId) {
      const found = mockPodcasts.find((p) => p.id === podcastId);
      if (found) {
        setCurrentPodcast(found);
        setIsPlaying(true);
        setCurrentTime(0);
      }
    } else {
      setCurrentPodcast(null);
      setIsPlaying(false);
    }
  }, [podcastId]);

  // Audio Playback effect
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentPodcast]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const seekToTime = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Playback Player screen
  if (currentPodcast) {
    return (
      <div className="space-y-6 w-full pb-10">
        
        {/* Back Button */}
        <button
          onClick={() => onSelectPodcast(null)}
          className="text-xs font-bold text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition flex items-center space-x-1"
        >
          ← Back to Podcasts Browse
        </button>

        <audio
          ref={audioRef}
          src={currentPodcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Big vinyl rotating artwork, audio progress, metadata */}
          <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl flex flex-col items-center space-y-6 shadow-xs">
            
            {/* Spinning artwork container */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl bg-neutral-950 flex items-center justify-center border-4 border-neutral-100 dark:border-neutral-800">
              <img
                src={currentPodcast.artworkUrl}
                alt="Artwork"
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? "animate-spinSlow" : ""
                }`}
              />
              {/* Vinyl center hole spacer */}
              <div className="absolute w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 z-10" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white line-clamp-1">
                {currentPodcast.title}
              </h2>
              <p className="text-xs text-neutral-450 font-bold">
                {currentPodcast.channel.name}
              </p>
            </div>

            {/* Audio timeline scrub */}
            <div className="w-full space-y-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-neutral-900 dark:accent-white bg-neutral-150 dark:bg-neutral-800 h-1 rounded appearance-none cursor-pointer focus:outline-none"
              />
              <div className="flex justify-between text-xs text-neutral-400 font-bold">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Player buttons Panel */}
            <div className="flex items-center space-x-6">
              <button
                onClick={togglePlay}
                className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 p-4 rounded-full shadow-md focus:outline-none transition transform hover:scale-105"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>
            </div>

            {/* Volume */}
            <div className="w-full flex items-center space-x-2 border-t border-neutral-100 dark:border-neutral-850 pt-4">
              <Volume2 className="w-4 h-4 text-neutral-400" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 bg-neutral-100 dark:bg-neutral-800 accent-neutral-450 rounded h-1 appearance-none cursor-pointer focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Tab info panel */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-xs space-y-6">
            
            {/* Header Tabs */}
            <div className="flex border-b border-neutral-100 dark:border-neutral-800 pb-2 space-x-6">
              {[
                { id: "guests", label: "Guests & Info", icon: User },
                { id: "summary", label: "AI Summary", icon: Sparkles },
                { id: "transcript", label: "Synced Transcript", icon: BookOpen }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 pb-2 text-xs sm:text-sm font-bold border-b-2 transition focus:outline-none ${
                      activeTab === tab.id
                        ? "border-neutral-900 dark:border-white text-neutral-950 dark:text-white"
                        : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-350"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Panel Body */}
            <div className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              
              {/* GUESTS TAB */}
              {activeTab === "guests" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Episode Description</h3>
                    <p className="font-medium text-neutral-800 dark:text-neutral-300">
                      {currentPodcast.description}
                    </p>
                  </div>

                  {currentPodcast.guestProfiles && currentPodcast.guestProfiles.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Featured Guests</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentPodcast.guestProfiles.map((guest, idx) => (
                          <div key={idx} className="flex items-center space-x-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 p-3.5 rounded-2xl">
                            <img src={guest.avatar} alt={guest.name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-800" />
                            <div>
                              <h4 className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">{guest.name}</h4>
                              <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold">{guest.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentPodcast.relatedStartups && currentPodcast.relatedStartups.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Associated Startups</h3>
                      <div className="flex flex-wrap gap-3">
                        {currentPodcast.relatedStartups.map((startup, idx) => (
                          <div key={idx} className="flex items-center space-x-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 px-3.5 py-2 rounded-full">
                            <Store className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">{startup.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI SUMMARY TAB */}
              {activeTab === "summary" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">AI Episode Analysis</h3>
                  <p className="font-medium text-neutral-855 dark:text-neutral-200 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950 p-4 rounded-2xl leading-relaxed">
                    {currentPodcast.aiSummary || "AI summary parsing is in progress for this episode."}
                  </p>
                </div>
              )}

              {/* TRANSCRIPT TAB */}
              {activeTab === "transcript" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Interactive Script</h3>
                  {currentPodcast.transcript ? (
                    <div className="space-y-3">
                      {currentPodcast.transcript.split(/(\[\d+:\d+\][^\[]+)/g).filter(Boolean).map((chunk, idx) => {
                        const match = chunk.match(/\[(\d+):(\d+)\]\s*(.*)/);
                        if (!match) return null;
                        const mins = parseInt(match[1]);
                        const secs = parseInt(match[2]);
                        const totalSeconds = mins * 60 + secs;
                        const text = match[3];

                        return (
                          <div
                            key={idx}
                            onClick={() => seekToTime(totalSeconds)}
                            className="group flex items-start space-x-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-950 border border-transparent hover:border-neutral-150 dark:hover:border-neutral-850 cursor-pointer transition"
                          >
                            <button className="text-[10px] font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-850 px-2 py-0.5 rounded group-hover:bg-neutral-900 group-hover:text-white transition">
                              {mins}:{secs < 10 ? "0" : ""}{secs}
                            </button>
                            <span className="flex-1 text-neutral-800 dark:text-neutral-300 leading-relaxed font-semibold">
                              {text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="italic text-neutral-450">No transcript available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Browse selection view
  return (
    <div className="space-y-6 w-full pb-10 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPodcasts.map((podcast) => (
          <div
            key={podcast.id}
            onClick={() => onSelectPodcast(podcast.id)}
            className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition flex flex-col space-y-4"
          >
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 relative border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <img src={podcast.artworkUrl} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
              {/* Play symbol badge */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <div className="bg-white text-black p-3.5 rounded-full shadow-lg">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-850 text-neutral-500 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                  <Mic className="w-2.5 h-2.5" />
                  <span>Podcast</span>
                </span>
                <span className="text-[10px] text-neutral-450 font-bold">
                  {Math.floor(podcast.duration / 60)} min
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white line-clamp-2 leading-tight">
                {podcast.title}
              </h3>
              <p className="text-xs text-neutral-450 font-semibold block">
                {podcast.channel.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
