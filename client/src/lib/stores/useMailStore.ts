import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MailItem } from "@/components/mailbox/MailboxList";
import { FolderId } from "@/components/mailbox/MailboxLeftSidebar";
import { mailCacheManager } from "../cache/mailCacheManager";

interface MailState {
  mails: MailItem[];
  activeFolder: FolderId;
  selectedMailId: string | null;
  isLoaded: boolean;
  isRefreshing: boolean;
  offlineMode: boolean;

  setMails: (mails: MailItem[]) => void;
  setSelectedMailId: (id: string | null) => void;
  setActiveFolder: (folder: FolderId) => void;
  setIsLoaded: (loaded: boolean) => void;
  setIsRefreshing: (refreshing: boolean) => void;
  setOfflineMode: (offline: boolean) => void;

  // Optimistic UI Actions with Rollback capability
  toggleStar: (id: string) => { previousMails: MailItem[] };
  toggleBookmark: (id: string) => { previousMails: MailItem[] };
  archiveMails: (ids: string[]) => { previousMails: MailItem[]; previousSelected: string | null };
  deleteMails: (ids: string[]) => { previousMails: MailItem[]; previousSelected: string | null };
  updateRequestStatus: (requestId: string, status: "ACCEPTED" | "REJECTED") => { previousMails: MailItem[] };
  rollbackMails: (previousMails: MailItem[], previousSelected?: string | null) => void;
}

export const useMailStore = create<MailState>()(
  persist(
    (set, get) => ({
      mails: [],
      activeFolder: "inbox",
      selectedMailId: null,
      isLoaded: false,
      isRefreshing: false,
      offlineMode: false,

      setMails: (mails) => {
        mailCacheManager.setCache("noventra_mails", mails);
        set((state) => ({
          mails,
          selectedMailId:
            state.selectedMailId && mails.some((m) => m.id === state.selectedMailId)
              ? state.selectedMailId
              : mails.length > 0
              ? mails[0].id
              : null
        }));
      },

      setSelectedMailId: (selectedMailId) => set({ selectedMailId }),

      setActiveFolder: (activeFolder) => set({ activeFolder }),

      setIsLoaded: (isLoaded) => set({ isLoaded }),

      setIsRefreshing: (isRefreshing) => set({ isRefreshing }),

      setOfflineMode: (offlineMode) => set({ offlineMode }),

      toggleStar: (id) => {
        const previousMails = get().mails;
        const updated = previousMails.map((m) =>
          m.id === id ? { ...m, starred: !m.starred } : m
        );
        mailCacheManager.setCache("noventra_mails", updated);
        set({ mails: updated });
        return { previousMails };
      },

      toggleBookmark: (id) => {
        const previousMails = get().mails;
        const updated = previousMails.map((m) =>
          m.id === id ? { ...m, bookmarked: !m.bookmarked } : m
        );
        mailCacheManager.setCache("noventra_mails", updated);
        set({ mails: updated });
        return { previousMails };
      },

      archiveMails: (ids) => {
        const previousMails = get().mails;
        const previousSelected = get().selectedMailId;
        const updated = previousMails.filter((m) => !ids.includes(m.id));
        mailCacheManager.setCache("noventra_mails", updated);
        const newSelected =
          previousSelected && ids.includes(previousSelected)
            ? updated.length > 0
              ? updated[0].id
              : null
            : previousSelected;
        set({ mails: updated, selectedMailId: newSelected });
        return { previousMails, previousSelected };
      },

      deleteMails: (ids) => {
        const previousMails = get().mails;
        const previousSelected = get().selectedMailId;
        const updated = previousMails.filter((m) => !ids.includes(m.id));
        mailCacheManager.setCache("noventra_mails", updated);
        const newSelected =
          previousSelected && ids.includes(previousSelected)
            ? updated.length > 0
              ? updated[0].id
              : null
            : previousSelected;
        set({ mails: updated, selectedMailId: newSelected });
        return { previousMails, previousSelected };
      },

      updateRequestStatus: (requestId, status) => {
        const previousMails = get().mails;
        const updated = previousMails.map((m) => {
          if (m.rawPayload && m.rawPayload.id === requestId) {
            return {
              ...m,
              unread: false,
              rawPayload: { ...m.rawPayload, status }
            };
          }
          return m;
        });
        mailCacheManager.setCache("noventra_mails", updated);
        set({ mails: updated });
        return { previousMails };
      },

      rollbackMails: (previousMails, previousSelected) => {
        mailCacheManager.setCache("noventra_mails", previousMails);
        set((state) => ({
          mails: previousMails,
          selectedMailId: previousSelected !== undefined ? previousSelected : state.selectedMailId
        }));
      }
    }),
    {
      name: "noventra_mailbox_store",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (null as any))),
      partialize: (state) => ({
        mails: state.mails,
        activeFolder: state.activeFolder,
        selectedMailId: state.selectedMailId
      })
    }
  )
);
