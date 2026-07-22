"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, CornerDownRight, MoreHorizontal } from "lucide-react";
import { Comment } from "./types";

interface CommentsSectionProps {
  comments: Comment[];
  videoChannelUserId?: string; // To match creator badge
  videoId?: string;
}

export default function CommentsSection({ comments: initialComments, videoChannelUserId, videoId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Sync and filter comments based on active video
  useEffect(() => {
    const vidNum = parseInt(videoId?.replace("vid-", "") || "0");
    // Get a deterministic subset of comments for this video
    const filtered = initialComments.filter((_, idx) => {
      return (idx % 8) === (vidNum % 8);
    });
    setComments(filtered.length > 0 ? filtered : initialComments.slice(0, 5));
  }, [videoId, initialComments]);

  const handleAddMainComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c-added-${Date.now()}`,
      content: commentText,
      userId: "user-curr",
      userName: "You (Developer)",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      userBadge: "developer",
      likesCount: 0,
      createdAt: new Date().toISOString(),
      replies: []
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Comment = {
      id: `c-reply-${Date.now()}`,
      content: replyText,
      userId: "user-curr",
      userName: "You (Developer)",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      userBadge: "developer",
      likesCount: 0,
      createdAt: new Date().toISOString(),
      parentId
    };

    const addReplyRecursive = (list: Comment[]): Comment[] => {
      return list.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [newReply, ...(item.replies || [])]
          };
        } else if (item.replies && item.replies.length > 0) {
          return {
            ...item,
            replies: addReplyRecursive(item.replies)
          };
        }
        return item;
      });
    };

    setComments((prev) => addReplyRecursive(prev));
    setReplyText("");
    setReplyTarget(null);
  };

  const toggleLikeComment = (commentId: string) => {
    const toggleLikeRecursive = (list: Comment[]): Comment[] => {
      return list.map((item) => {
        if (item.id === commentId) {
          const wasLiked = (item as any).liked;
          return {
            ...item,
            likesCount: wasLiked ? item.likesCount - 1 : item.likesCount + 1,
            liked: !wasLiked
          } as any;
        } else if (item.replies && item.replies.length > 0) {
          return {
            ...item,
            replies: toggleLikeRecursive(item.replies)
          };
        }
        return item;
      });
    };
    setComments((prev) => toggleLikeRecursive(prev));
  };

  const renderBadge = (badge?: string, userId?: string) => {
    if (userId === videoChannelUserId) {
      return (
        <span className="text-[9px] bg-red-55/90 text-red-650 border border-red-100 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider scale-90">
          Creator
        </span>
      );
    }

    if (!badge) return null;

    const styles: Record<string, string> = {
      founder: "bg-blue-50 text-blue-650 border border-blue-150 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
      investor: "bg-emerald-50 text-emerald-650 border border-emerald-150 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
      developer: "bg-neutral-50 text-neutral-700 border border-neutral-200 dark:bg-neutral-850 dark:text-neutral-350 dark:border-neutral-800",
      creator: "bg-red-50 text-red-650 border border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900"
    };

    return (
      <span className={`text-[9px] rounded px-1.5 py-0.5 font-bold uppercase tracking-wider scale-90 ${styles[badge] || ""}`}>
        {badge}
      </span>
    );
  };

  const CommentNode = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isLiked = (comment as any).liked;
    return (
      <div className={`flex flex-col space-y-2.5 p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-950 ${
        isReply ? "border-l border-neutral-100 dark:border-neutral-850 pl-4 mt-2" : ""
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src={comment.userAvatar}
              alt={comment.userName}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-200 dark:border-neutral-800 object-cover"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                {comment.userName}
              </span>
              {renderBadge(comment.userBadge, comment.userId)}
              <span className="text-[10px] sm:text-xs text-neutral-400">
                {new Date(comment.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
          <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-semibold pl-9.5">
          {comment.content}
        </p>

        {/* Comment Action Bar */}
        <div className="flex items-center space-x-4 pl-9.5">
          <button
            onClick={() => toggleLikeComment(comment.id)}
            className={`flex items-center space-x-1.5 text-xs font-semibold focus:outline-none transition ${
              isLiked ? "text-red-500" : "text-neutral-450 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
            <span>{comment.likesCount}</span>
          </button>

          <button
            onClick={() => setReplyTarget(replyTarget === comment.id ? null : comment.id)}
            className="flex items-center space-x-1.5 text-xs text-neutral-455 hover:text-neutral-950 dark:hover:text-white font-semibold focus:outline-none transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
        </div>

        {/* Reply Editor Form */}
        {replyTarget === comment.id && (
          <div className="flex items-center space-x-2 pl-9.5 w-full mt-2">
            <input
              type="text"
              placeholder={`Reply to ${comment.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
              autoFocus
            />
            <button
              onClick={() => handleAddReply(comment.id)}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition"
            >
              Reply
            </button>
          </div>
        )}

        {/* Recursive replies rendering */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1 space-y-1.5">
            {comment.replies.map((reply) => (
              <CommentNode key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
          <span>Discussion Panel</span>
          <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2.5 py-0.5 rounded-full font-bold">
            {comments.length} comments
          </span>
        </h3>
      </div>

      {/* Main Comment Editor Form */}
      <form onSubmit={handleAddMainComment} className="flex space-x-3 items-start">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 object-cover mt-0.5"
        />
        <div className="flex-1 space-y-2">
          <textarea
            placeholder="Add to the coding discussion..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 text-xs sm:text-sm border border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white dark:focus:bg-neutral-900 rounded-2xl focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40 text-xs font-semibold px-4 py-2 rounded-2xl transition"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {comments.map((comment) => (
          <CommentNode key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
