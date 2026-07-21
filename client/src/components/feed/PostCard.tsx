"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Post } from "@/lib/feedStore";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  Briefcase,
  DollarSign,
  Rocket,
  Flame,
  FileText,
  BarChart2,
  Send,
  Loader2,
  Copy,
  BookmarkCheck,
  Check,
  Building,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  dbUserId?: string;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onToggleComments: (id: string) => void;
  activeCommentsPostId: string | null;
  comments: any[];
  commentContent: string;
  setCommentContent: (val: string) => void;
  onAddComment: (e: React.FormEvent, postId: string) => void;
  loadingComments: boolean;
}

export default function PostCard({
  post,
  onLike,
  onBookmark,
  onToggleComments,
  activeCommentsPostId,
  comments,
  commentContent,
  setCommentContent,
  onAddComment,
  loadingComments,
}: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Poll state simulation
  const [pollVoted, setPollVoted] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState([42, 28, 15, 15]);

  // Product launch upvote simulation
  const [launchUpvoted, setLaunchUpvoted] = useState(false);
  const [launchVotes, setLaunchVotes] = useState(post.likesCount || 128);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/feed#post-${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  const handlePollVote = (idx: number) => {
    if (pollVoted !== null) return;
    setPollVoted(idx);
    setPollVotes((prev) => {
      const copy = [...prev];
      copy[idx] += 1;
      return copy;
    });
  };

  const handleLaunchUpvote = () => {
    setLaunchUpvoted((prev) => !prev);
    setLaunchVotes((prev) => (launchUpvoted ? prev - 1 : prev + 1));
  };

  const totalPollVotes = pollVotes.reduce((a, b) => a + b, 0);

  // Post Type Badges
  const getPostTypeBadge = (type: string) => {
    switch (type) {
      case "startup_launch":
      case "launch":
        return { label: "Product Launch", icon: Rocket, style: "bg-blue-50 text-blue-600 border-blue-200" };
      case "hiring":
        return { label: "Hiring Talent", icon: Briefcase, style: "bg-purple-50 text-purple-600 border-purple-200" };
      case "funding":
        return { label: "Funding Round", icon: DollarSign, style: "bg-emerald-50 text-emerald-600 border-emerald-200" };
      case "poll":
        return { label: "Ecosystem Poll", icon: BarChart2, style: "bg-amber-50 text-amber-600 border-amber-200" };
      case "tech_blog":
        return { label: "Technical Blog", icon: FileText, style: "bg-indigo-50 text-indigo-600 border-indigo-200" };
      case "startup_update":
      default:
        return { label: "Startup Update", icon: TrendingUp, style: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const typeBadge = getPostTypeBadge(post.postType);
  const TypeIcon = typeBadge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-4 relative"
      id={`post-${post.id}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.id}`}>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm shrink-0">
                {post.author.avatarUrl ? (
                  <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-extrabold text-base text-blue-600 bg-blue-50">
                    {post.author.name[0]}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-slate-100" />
            </div>
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${post.author.id}`} className="font-extrabold text-sm text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>{post.author.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
              </Link>

              {post.author.role && (
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
                  {post.author.role}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-0.5">
              {post.startup ? (
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <Building className="w-3 h-3 text-blue-600" />
                  <Link href={`/startups/${post.startup.id}`} className="hover:underline">
                    {post.startup.name}
                  </Link>
                  <span>•</span>
                </span>
              ) : null}
              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Top Right Badges & Options */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${typeBadge.style}`}>
            <TypeIcon className="w-3.5 h-3.5" />
            <span>{typeBadge.label}</span>
          </span>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-30 text-xs font-bold text-slate-700">
                <button
                  onClick={handleCopyLink}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{copied ? "Copied!" : "Copy Post Link"}</span>
                </button>
                <button
                  onClick={() => {
                    setShowAnalytics(!showAnalytics);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Post Analytics</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Post Content */}
      <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Media Attachment Layout */}
      {post.mediaUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 max-h-[420px] bg-slate-50 shadow-inner">
          <img src={post.mediaUrl} alt="Post media" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Specialty Post Type Layouts */}
      {/* 1. Poll Post Layout */}
      {post.postType === "poll" && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="text-xs font-extrabold text-slate-900">Which cloud architecture will dominate early startups in 2026?</div>
          {["Serverless Edge (Vercel / Cloudflare)", "Managed Kubernetes (EKS / GKE)", "Bespoke Bare-Metal (Hetzner)", "Unified Monolith"].map((opt, idx) => {
            const pct = Math.round((pollVotes[idx] / totalPollVotes) * 100);
            const isSelected = pollVoted === idx;
            return (
              <button
                key={opt}
                onClick={() => handlePollVote(idx)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-bold transition-all relative overflow-hidden flex justify-between items-center ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                }`}
              >
                {pollVoted !== null && (
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-blue-100/60 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative z-10">{opt}</span>
                {pollVoted !== null && <span className="relative z-10 text-slate-500 font-extrabold">{pct}%</span>}
              </button>
            );
          })}
          <div className="text-[10px] text-slate-400 font-bold text-right">{totalPollVotes} total votes</div>
        </div>
      )}

      {/* 2. Product Launch Upvote Layout */}
      {(post.postType === "startup_launch" || post.postType === "launch") && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border border-blue-200/80 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Rocket className="w-4 h-4 transition-transform duration-150 group-hover:scale-110" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Featured Launch on Noventra</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Show your support to the founders building this product.</p>
          </div>

          <button
            onClick={handleLaunchUpvote}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 border shadow-sm ${
              launchUpvoted
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            <Flame className={`w-4 h-4 ${launchUpvoted ? "fill-white text-white" : "text-orange-500"}`} />
            <span>Upvote {launchVotes}</span>
          </button>
        </div>
      )}

      {/* Analytics Drawer */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-slate-900 text-white space-y-3"
          >
            <div className="flex justify-between items-center text-xs font-bold border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-blue-400">
                <BarChart2 className="w-4 h-4" /> Live Post Analytics
              </span>
              <button onClick={() => setShowAnalytics(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-800">
                <div className="text-lg font-extrabold text-white">1,240</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Impressions</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800">
                <div className="text-lg font-extrabold text-blue-400">8.4%</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Engagement</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800">
                <div className="text-lg font-extrabold text-emerald-400">42</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Profile Clicks</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-5">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 hover:text-rose-600 transition-colors ${
              post.isLiked ? "text-rose-600" : ""
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-600" : ""}`} />
            <span>{post.likesCount} Likes</span>
          </button>

          <button
            onClick={() => onToggleComments(post.id)}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount} Comments</span>
          </button>

          <button onClick={handleCopyLink} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>{copied ? "Copied" : "Share"}</span>
          </button>
        </div>

        <button
          onClick={() => onBookmark(post.id)}
          className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors ${
            post.isBookmarked ? "text-blue-600" : ""
          }`}
        >
          {post.isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 fill-blue-600 text-blue-600" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          <span>{post.isBookmarked ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      <AnimatePresence>
        {activeCommentsPostId === post.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-slate-100 space-y-4 bg-slate-50/60 p-4 rounded-xl"
          >
            <h4 className="text-xs font-extrabold uppercase text-slate-500">Discussion ({comments.length})</h4>

            <form onSubmit={(e) => onAddComment(e, post.id)} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a thought or reply..."
                className="flex-1 p-2.5 border border-slate-200 rounded-xl bg-white text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button
                type="submit"
                disabled={!commentContent.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                Reply
              </button>
            </form>

            {loadingComments ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/60">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      {comment.user?.avatarUrl ? (
                        <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-blue-600 bg-blue-50">
                          {comment.user?.name?.[0] || "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-900">{comment.user?.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
