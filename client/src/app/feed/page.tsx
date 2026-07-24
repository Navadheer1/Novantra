"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { useFeedStore, feedStore, Post } from "@/lib/feedStore";
import LeftDashboard from "@/components/feed/LeftDashboard";
import RightTrendingPanel from "@/components/feed/RightTrendingPanel";
import NoventraAIAssistant from "@/components/feed/NoventraAIAssistant";
import PostCard from "@/components/feed/PostCard";
import CreatorStudioPanel from "@/components/feed/CreatorStudioPanel";
import FloatingCreateFAB from "@/components/feed/FloatingCreateFAB";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import EmptyState from "@/components/feed/EmptyState";
import { RefreshCw, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function HomeFeed() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Subscribe to module-level feedStore
  const { posts, dbUser, isFetched, isRefreshing, error, scrollPos } = useFeedStore();

  // Feed Filter state
  const [feedFilter, setFeedFilter] = useState("all");

  // Modal & Action state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState("text");

  // Comments state
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // 1. Initial Load & Revalidation
  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else {
        feedStore.fetchFeed(getToken, clerkUser.id);
      }
    }
  }, [clerkLoaded, clerkUser?.id, getToken]);

  // 2. Scroll Position Restoration
  useEffect(() => {
    if (posts.length > 0 && scrollPos > 0) {
      window.scrollTo({ top: scrollPos, behavior: "instant" as ScrollBehavior });
    }

    const handleScroll = () => {
      feedStore.saveScrollPos(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts.length, scrollPos]);

  // Quick Action Handler
  const handleQuickAction = (actionId: string) => {
    if (actionId === "browse_investors") {
      router.push("/investors");
    } else if (actionId === "browse_students" || actionId === "find_cofounder") {
      router.push("/explore");
    } else if (actionId === "schedule_meeting") {
      router.push("/meet");
    } else {
      setModalPreset(actionId);
      setModalOpen(true);
    }
  };

  // Create Post Submit Handler
  const handleSubmitPost = async (content: string, postType: string, mediaUrl: string): Promise<boolean> => {
    const apiUrl = getApiUrl();
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          postType,
          mediaUrl: mediaUrl || null,
        }),
      });

      if (res.ok) {
        const createdPost: Post = await res.json();
        feedStore.addPostOptimistic(createdPost);
        return true;
      } else {
        alert("Failed to publish post.");
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("Error sharing post.");
      return false;
    }
  };

  // Like Handler
  const handleLike = async (postId: string) => {
    feedStore.toggleLikeOptimistic(postId);
    try {
      const apiUrl = getApiUrl();
      const token = await getToken();
      await fetch(`${apiUrl}/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
      feedStore.toggleLikeOptimistic(postId);
    }
  };

  // Bookmark Handler
  const handleBookmark = async (postId: string) => {
    feedStore.toggleBookmarkOptimistic(postId);
    try {
      const apiUrl = getApiUrl();
      const token = await getToken();
      await fetch(`${apiUrl}/api/posts/${postId}/bookmark`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
      feedStore.toggleBookmarkOptimistic(postId);
    }
  };

  // Comments Toggle Handler
  const handleToggleComments = async (postId: string) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      setComments([]);
      return;
    }

    try {
      setActiveCommentsPostId(postId);
      setLoadingComments(true);
      const apiUrl = getApiUrl();
      const token = await getToken();
      const res = await fetch(`${apiUrl}/api/posts/${postId}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Add Comment Handler
  const handleAddComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const apiUrl = getApiUrl();
      const token = await getToken();
      const res = await fetch(`${apiUrl}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setCommentContent("");
        setComments((prev) => [...prev, newComment]);
        feedStore.incrementCommentCount(postId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Posts
  const filteredPosts = posts.filter((post) => {
    if (feedFilter === "all") return true;
    if (feedFilter === "trending") return post.likesCount > 0;
    return post.postType === feedFilter;
  });

  const showLoading = !isFetched && posts.length === 0;

  const [moreFilterOpen, setMoreFilterOpen] = useState(false);

  const mainFilters = [
    { label: "All", value: "all" },
    { label: "Trending", value: "trending" },
    { label: "Hiring", value: "hiring" },
    { label: "Funding", value: "funding" },
  ];

  const moreFilters = [
    { label: "Launches", value: "startup_launch" },
    { label: "Updates", value: "startup_update" },
    { label: "Polls", value: "poll" },
    { label: "Tech Blogs", value: "tech_blog" },
  ];

  const activeMoreFilter = moreFilters.find((f) => f.value === feedFilter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Sticky Navbar */}
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* SHARED WORKSPACE LAYOUT (Dynamic 3-Column Grid) */}
        <div
          className={`grid grid-cols-1 transition-all duration-300 items-start gap-6 ${
            modalOpen
              ? "lg:grid-cols-[200px_1fr_520px]"
              : "lg:grid-cols-[20%_1fr_20%]"
          }`}
        >
          
          {/* LEFT DASHBOARD - COMPACT COMMAND CENTER */}
          <div className="space-y-4 lg:sticky lg:top-20">
            <LeftDashboard dbUser={dbUser} clerkUser={clerkUser} />
          </div>

          {/* CENTER MAIN FEED COLUMN (Scrollable & Interactive) */}
          <div className="space-y-5 min-w-0">
            {/* Minimal Sticky Filter Bar */}
            <div className="sticky top-16 z-20 bg-[#F8FAFC]/90 backdrop-blur-md py-2 flex items-center justify-between gap-2 border-b border-slate-200/50">
              <div className="flex items-center gap-1.5 py-0.5">
                {mainFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      setFeedFilter(f.value);
                      setMoreFilterOpen(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                      feedFilter === f.value
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white/80 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                {/* More Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setMoreFilterOpen(!moreFilterOpen)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1 whitespace-nowrap ${
                      activeMoreFilter
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white/80 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{activeMoreFilter ? activeMoreFilter.label : "More"}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {moreFilterOpen && (
                    <div className="absolute left-0 mt-1.5 w-36 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-lg py-1 z-30 text-xs font-bold text-slate-700">
                      {moreFilters.map((mf) => (
                        <button
                          key={mf.value}
                          onClick={() => {
                            setFeedFilter(mf.value);
                            setMoreFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                            feedFilter === mf.value ? "text-blue-600 font-extrabold bg-blue-50/50" : ""
                          }`}
                        >
                          <span>{mf.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Silent Sync Indicator */}
              {isRefreshing && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold px-3 py-1 bg-blue-50 rounded-full border border-blue-200 shrink-0 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="text-[10px]">Syncing...</span>
                </div>
              )}
            </div>

            {/* Posts Stream */}
            {showLoading ? (
              <FeedSkeleton />
            ) : error && posts.length === 0 ? (
              <div className="bg-white border border-slate-200/60 p-8 rounded-2xl text-center shadow-sm text-rose-600 font-bold text-xs">
                {error}
              </div>
            ) : filteredPosts.length === 0 ? (
              <EmptyState
                category={feedFilter}
                onActionClick={() => handleQuickAction("share_update")}
              />
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    dbUserId={dbUser?.id}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onToggleComments={handleToggleComments}
                    activeCommentsPostId={activeCommentsPostId}
                    comments={comments}
                    commentContent={commentContent}
                    setCommentContent={setCommentContent}
                    onAddComment={handleAddComment}
                    loadingComments={loadingComments}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DYNAMIC CREATOR STUDIO WORKSPACE PANEL OR ECOSYSTEM RADAR */}
          <AnimatePresence mode="wait">
            {modalOpen ? (
              <CreatorStudioPanel
                key="creator-studio-panel"
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                presetType={modalPreset}
                dbUser={dbUser}
                clerkUser={clerkUser}
                onSubmitPost={handleSubmitPost}
              />
            ) : (
              <motion.div
                key="right-ecosystem-radar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 lg:sticky lg:top-20"
              >
                <NoventraAIAssistant />
                <RightTrendingPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FLOATING CREATE FAB BUTTON */}
      <FloatingCreateFAB onSelectAction={handleQuickAction} />
    </div>
  );
}


