"use client";

import React, { useState } from "react";
import { FolderHeart, Clock, Bookmark, Heart, ListVideo, Plus, Play, ExternalLink, Sparkles, Cpu } from "lucide-react";
import { Video } from "./types";
import { mockVideos } from "./mockDiscoveryData";

interface PlaylistsManagerProps {
  onSelectVideo: (videoId: string) => void;
}

interface CustomPlaylist {
  id: string;
  name: string;
  count: number;
  icon: any;
  videos: Video[];
  description: string;
}

export default function PlaylistsManager({ onSelectVideo }: PlaylistsManagerProps) {
  const [playlists, setPlaylists] = useState<CustomPlaylist[]>([
    {
      id: "build-saas",
      name: "Build a SaaS",
      count: 3,
      icon: Clock,
      videos: [mockVideos[0], mockVideos[1], mockVideos[3]],
      description: "Complete process of building and validating pre-seed SaaS companies."
    },
    {
      id: "nextjs-masterclass",
      name: "Next.js Masterclass",
      count: 2,
      icon: ListVideo,
      videos: [mockVideos[2], mockVideos[12]],
      description: "Advanced compilation routing, server actions, and edge rendering."
    },
    {
      id: "system-design",
      name: "System Design",
      count: 3,
      icon: Bookmark,
      videos: [mockVideos[0], mockVideos[4], mockVideos[6]],
      description: "High throughput databases, connection pooling, and caching topologes."
    },
    {
      id: "fundraising",
      name: "Startup Fundraising",
      count: 2,
      icon: FolderHeart,
      videos: [mockVideos[3], mockVideos[8]],
      description: "Pre-seed pitching guides, cap tables, and investor alignments."
    },
    {
      id: "ai-agents",
      name: "AI Agents",
      count: 2,
      icon: Sparkles,
      videos: [mockVideos[5], mockVideos[10]],
      description: "LLM loops pipelines, vector embeddings, and RAG databases."
    },
    {
      id: "react-roadmap",
      name: "React Roadmap",
      count: 2,
      icon: Cpu,
      videos: [mockVideos[2], mockVideos[9]],
      description: "RSC rendering lifecycle, custom hooks, and state management."
    }
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<CustomPlaylist | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPL: CustomPlaylist = {
      id: `pl-user-${Date.now()}`,
      name: newPlaylistName,
      count: 0,
      icon: ListVideo,
      videos: [],
      description: "User created playlist."
    };

    setPlaylists((prev) => [...prev, newPL]);
    setNewPlaylistName("");
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex items-center justify-between border-b border-neutral-150 dark:border-neutral-805 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">Your Library</h1>
          <p className="text-xs sm:text-sm text-neutral-450 mt-0.5">Manage bookmarks, favorite tutorials, and saved playlists.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 focus:outline-none hover:opacity-90 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {showCreateModal && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl max-w-md mx-auto space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Create New Playlist</h3>
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <input
              type="text"
              placeholder="e.g. Next.js Core Features, Pre-seed Prep..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-955 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-550 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-955 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold transition"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedPlaylist ? (
        <div className="space-y-6 animate-fadeIn">
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="text-xs font-bold text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition flex items-center space-x-1"
          >
            ← Back to Library
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 dark:border-neutral-850 pb-4">
            <div>
              <h2 className="text-lg font-black text-neutral-900 dark:text-white">{selectedPlaylist.name}</h2>
              <span className="text-xs text-neutral-450">{selectedPlaylist.videos.length} items in this track</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedPlaylist.videos.length > 0 ? (
              selectedPlaylist.videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video.id)}
                  className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-350 dark:hover:border-neutral-700 transition duration-300"
                >
                  <div className="aspect-video w-full relative overflow-hidden bg-neutral-950">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {Math.floor(video.duration / 60)}:{video.duration % 60 < 10 ? "0" : ""}{video.duration % 60}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-neutral-450">{video.channel.name}</h4>
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-450 italic font-semibold">No videos in this playlist yet. Add videos to start.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => {
            const Icon = playlist.icon;
            return (
              <div
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist)}
                className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 p-6 rounded-2xl shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition duration-300 flex flex-col justify-between h-44"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl text-neutral-900 dark:text-white group-hover:scale-105 transition duration-350 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-200" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white line-clamp-1">
                    {playlist.name}
                  </h3>
                  <span className="text-xs text-neutral-500 font-semibold mt-0.5 block line-clamp-1">
                    {playlist.description}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold mt-1.5 block">
                    {playlist.videos.length} videos / podcasts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
