"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Heart,
  Bookmark,
  Sparkles,
  Search,
  Filter,
  Trash2,
  ThumbsUp,
  MessageSquare,
  Building2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/apiConfig";

export type ContentFilter =
  | "all"
  | "liked"
  | "saved"
  | "mine"
  | "drafts"
  | "hiring"
  | "funding"
  | "launch";

interface PostItem {
  id: string;
  content: string;
  postType: string;
  mediaUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string | null;
  };
  startup?: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Props {
  initialFilter?: ContentFilter;
}

export default function ContentSettingsSection({ initialFilter = "liked" }: Props) {
  const { getToken } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ContentFilter>(initialFilter);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actioningPostId, setActioningPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchContentPosts();
  }, [activeFilter]);

  const fetchContentPosts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      if (!token) return;

      let endpoint = `${apiUrl}/api/posts`;
      if (activeFilter === "liked") {
        endpoint = `${apiUrl}/api/posts/liked`;
      } else if (activeFilter === "saved") {
        endpoint = `${apiUrl}/api/posts/bookmarked`;
      } else if (activeFilter === "mine") {
        endpoint = `${apiUrl}/api/posts/mine`;
      }

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        let filtered = data;
        if (activeFilter === "hiring") {
          filtered = data.filter((p: PostItem) => p.postType === "hiring");
        } else if (activeFilter === "funding") {
          filtered = data.filter((p: PostItem) => p.postType === "funding");
        } else if (activeFilter === "launch") {
          filtered = data.filter((p: PostItem) => p.postType === "startup_update");
        }
        setPosts(filtered);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      setActioningPostId(postId);
      const token = await getToken();
      const apiUrl = getApiUrl();

      // Optimistic state update
      setPosts((prev) =>
        prev
          .map((p) => {
            if (p.id === postId) {
              const newLiked = !p.isLiked;
              return {
                ...p,
                isLiked: newLiked,
                likesCount: newLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
              };
            }
            return p;
          })
          .filter((p) => (activeFilter === "liked" ? p.isLiked : true))
      );

      const res = await fetch(`${apiUrl}/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        // Dispatch window event for global synchronization
        window.dispatchEvent(new Event("feed-updated"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActioningPostId(null);
    }
  };

  const handleToggleBookmark = async (postId: string) => {
    try {
      setActioningPostId(postId);
      const token = await getToken();
      const apiUrl = getApiUrl();

      // Optimistic update
      setPosts((prev) =>
        prev
          .map((p) => {
            if (p.id === postId) {
              return { ...p, isBookmarked: !p.isBookmarked };
            }
            return p;
          })
          .filter((p) => (activeFilter === "saved" ? p.isBookmarked : true))
      );

      const res = await fetch(`${apiUrl}/api/posts/${postId}/bookmark`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        window.dispatchEvent(new Event("feed-updated"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActioningPostId(null);
    }
  };

  const searchedPosts = posts.filter(
    (p) =>
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.startup?.name && p.startup.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Content Studio & Feed Sync
          </h2>
          <p className="text-xs text-slate-500">
            Manage your posts, drafts, bookmarked items, and liked posts. Changes sync live with the Home Feed.
          </p>
        </div>

        <Button
          onClick={fetchContentPosts}
          variant="outline"
          size="sm"
          className="text-xs font-bold rounded-xl flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} /> Refresh Feed Sync
        </Button>
      </div>

      {/* Sub-Filters Pill Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
        {(
          [
            { id: "liked", label: "Liked Posts", icon: Heart },
            { id: "saved", label: "Saved Posts", icon: Bookmark },
            { id: "mine", label: "My Published Posts", icon: FileText },
            { id: "hiring", label: "Hiring Posts", icon: Sparkles },
            { id: "funding", label: "Funding Announcements", icon: Sparkles },
            { id: "launch", label: "Launch Posts", icon: Sparkles }
          ] as const
        ).map((f) => {
          const FIcon = f.icon;
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FIcon className="w-3.5 h-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeFilter} content...`}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
        />
      </div>

      {/* Content Feed List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Synchronizing content from Home Feed backend...</p>
        </div>
      ) : searchedPosts.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Content Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeFilter === "liked"
              ? "You haven't liked any posts yet. Like posts on the Home Feed to see them here instantly."
              : activeFilter === "saved"
              ? "You haven't bookmarked any posts yet. Bookmark posts on the Home Feed to save them here."
              : "No posts found matching the selected filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {searchedPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                      {post.author.avatarUrl ? (
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                      ) : (
                        post.author.name[0]
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{post.author.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {post.startup ? `Startup: ${post.startup.name}` : post.author.role || "Founder"}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>

                {/* Content Text */}
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {/* Media Image */}
                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden max-h-60 border border-slate-100">
                    <img src={post.mediaUrl} alt="Post Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Action Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      disabled={actioningPostId === post.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        post.isLiked
                          ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span>{post.likesCount} Likes</span>
                    </button>

                    <button
                      onClick={() => handleToggleBookmark(post.id)}
                      disabled={actioningPostId === post.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        post.isBookmarked
                          ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${post.isBookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
                      <span>{post.isBookmarked ? "Saved" : "Save"}</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount} Comments
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
