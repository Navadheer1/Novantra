"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getApiUrl } from "@/lib/apiConfig";

export interface PostAuthor {
  id: string;
  name: string;
  role: string | null;
  avatarUrl: string | null;
}

export interface PostStartup {
  id: string;
  name: string;
  logo: string | null;
}

export interface Post {
  id: string;
  content: string;
  postType: string;
  mediaUrl: string | null;
  startupId: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  startup: PostStartup | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface DBUser {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  role: string | null;
  avatarUrl: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  location: string | null;
}

interface FeedContextType {
  posts: Post[];
  dbUser: DBUser | null;
  loading: boolean;
  isRefreshing: boolean;
  error: string;
  loadFeed: (isBackgroundRefresh?: boolean) => Promise<void>;
  toggleLikeOptimistic: (postId: string) => void;
  toggleBookmarkOptimistic: (postId: string) => void;
  addPostOptimistic: (newPost: Post) => void;
  incrementCommentCount: (postId: string) => void;
  scrollPos: number;
  saveScrollPos: (pos: number) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const scrollPosRef = useRef<number>(0);

  const saveScrollPos = useCallback((pos: number) => {
    scrollPosRef.current = pos;
  }, []);

  const loadFeed = useCallback(async (isBackgroundRefresh = false) => {
    const apiUrl = getApiUrl();

    // Stale-While-Revalidate pattern:
    // If we already have posts cached in memory, do NOT show full page spinner.
    // Instead, trigger a background refresh without clearing existing posts.
    if (posts.length > 0 || isBackgroundRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = await getToken();

      // 1. Fetch DB User if signed in
      if (clerkUser?.id) {
        const userEndpoint = `${apiUrl}/api/users/clerk/${clerkUser.id}`;
        const userRes = await fetch(userEndpoint);
        if (userRes.ok) {
          const userData = await userRes.json();
          setDbUser(userData);
        }
      }

      // 2. Fetch Posts
      const postsEndpoint = `${apiUrl}/api/posts`;
      const postsRes = await fetch(postsEndpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (postsRes.ok) {
        const postsData: Post[] = await postsRes.json();
        setPosts(postsData);
      } else {
        if (posts.length === 0) {
          setError("Failed to retrieve feed posts from server.");
        }
      }
    } catch (err: any) {
      console.error("[FeedContext] Revalidation error:", err);
      if (posts.length === 0) {
        setError("Unable to connect to server. Please try again later.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [clerkUser?.id, getToken, posts.length]);

  const toggleLikeOptimistic = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newIsLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newIsLiked,
            likesCount: newIsLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      })
    );
  }, []);

  const toggleBookmarkOptimistic = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isBookmarked: !p.isBookmarked
          };
        }
        return p;
      })
    );
  }, []);

  const addPostOptimistic = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const incrementCommentCount = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      })
    );
  }, []);

  return (
    <FeedContext.Provider
      value={{
        posts,
        dbUser,
        loading,
        isRefreshing,
        error,
        loadFeed,
        toggleLikeOptimistic,
        toggleBookmarkOptimistic,
        addPostOptimistic,
        incrementCommentCount,
        scrollPos: scrollPosRef.current,
        saveScrollPos
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
}
