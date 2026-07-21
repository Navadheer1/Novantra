import { useSyncExternalStore } from "react";
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

export interface FeedStoreState {
  posts: Post[];
  dbUser: DBUser | null;
  isFetched: boolean;
  isRefreshing: boolean;
  error: string;
  scrollPos: number;
  lastFetchTime: number;
}

// Module-level in-memory cache store (persists across Next.js route transitions)
let state: FeedStoreState = {
  posts: [],
  dbUser: null,
  isFetched: false,
  isRefreshing: false,
  error: "",
  scrollPos: 0,
  lastFetchTime: 0
};

const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

let activeFetchPromise: Promise<void> | null = null;

export const feedStore = {
  getSnapshot(): FeedStoreState {
    return state;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  saveScrollPos(pos: number) {
    state.scrollPos = pos;
  },

  async fetchFeed(getToken: () => Promise<string | null>, clerkUserId?: string, forceRefetch = false) {
    const NOW = Date.now();
    const CACHE_TTL = 30000; // 30 seconds fresh window

    // Deduplicate in-flight requests
    if (activeFetchPromise) {
      return activeFetchPromise;
    }

    // Skip refetch if cache is fresh (< 30s) and not explicitly forced
    if (!forceRefetch && state.isFetched && NOW - state.lastFetchTime < CACHE_TTL) {
      return;
    }

    const isBackground = state.isFetched && state.posts.length > 0;

    state = {
      ...state,
      isRefreshing: isBackground,
      error: isBackground ? state.error : ""
    };
    emitChange();

    activeFetchPromise = (async () => {
      const apiUrl = getApiUrl();
      try {
        const token = await getToken();

        // 1. Fetch DB User if logged in and not yet cached
        if (clerkUserId && !state.dbUser) {
          const userRes = await fetch(`${apiUrl}/api/users/clerk/${clerkUserId}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            state.dbUser = userData;
          }
        }

        // 2. Fetch Posts
        const postsRes = await fetch(`${apiUrl}/api/posts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (postsRes.ok) {
          const postsData: Post[] = await postsRes.json();
          state = {
            ...state,
            posts: postsData,
            isFetched: true,
            isRefreshing: false,
            lastFetchTime: Date.now(),
            error: ""
          };
        } else {
          if (!state.isFetched) {
            state = { ...state, error: "Failed to retrieve feed posts from server.", isRefreshing: false };
          }
        }
      } catch (err: any) {
        console.error("[feedStore] Network error during fetchFeed:", err);
        if (!state.isFetched) {
          state = { ...state, error: "Unable to connect to server. Please try again later.", isRefreshing: false };
        }
      } finally {
        state = { ...state, isRefreshing: false };
        activeFetchPromise = null;
        emitChange();
      }
    })();

    return activeFetchPromise;
  },

  toggleLikeOptimistic(postId: string) {
    state = {
      ...state,
      posts: state.posts.map((p) => {
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
    };
    emitChange();
  },

  toggleBookmarkOptimistic(postId: string) {
    state = {
      ...state,
      posts: state.posts.map((p) => {
        if (p.id === postId) {
          return { ...p, isBookmarked: !p.isBookmarked };
        }
        return p;
      })
    };
    emitChange();
  },

  addPostOptimistic(newPost: Post) {
    state = {
      ...state,
      posts: [newPost, ...state.posts]
    };
    emitChange();
  },

  incrementCommentCount(postId: string) {
    state = {
      ...state,
      posts: state.posts.map((p) => {
        if (p.id === postId) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      })
    };
    emitChange();
  }
};

/**
 * Standard React 18/19 subscription hook for module store
 */
export function useFeedStore(): FeedStoreState {
  return useSyncExternalStore(
    feedStore.subscribe,
    feedStore.getSnapshot,
    feedStore.getSnapshot
  );
}
