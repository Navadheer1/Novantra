/**
 * Noventra Mailbox Cache Manager
 * Implements Stale-While-Revalidate caching for Inbox, Sent, Drafts, Bookmarks, Trash, and Conversations.
 */

export interface CacheEntry<T = any> {
  data: T;
  lastFetched: number;
  etag?: string;
  expiresAt: number;
}

class MailCacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  getCache<T>(key: string): { data: T | null; isStale: boolean } {
    const entry = this.cache.get(key);
    if (!entry) return { data: null, isStale: true };

    const now = Date.now();
    const isStale = now > entry.expiresAt;
    return { data: entry.data as T, isStale };
  }

  setCache<T>(key: string, data: T, ttlMs: number = this.defaultTTL, etag?: string): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      lastFetched: now,
      etag,
      expiresAt: now + ttlMs
    });
  }

  invalidateCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  patchCacheItem<T extends { id: string }>(key: string, itemId: string, patch: Partial<T>): void {
    const entry = this.cache.get(key);
    if (entry && Array.isArray(entry.data)) {
      const updated = entry.data.map((item: any) =>
        item.id === itemId ? { ...item, ...patch } : item
      );
      this.setCache(key, updated, entry.expiresAt - Date.now(), entry.etag);
    }
  }
}

export const mailCacheManager = new MailCacheManager();
