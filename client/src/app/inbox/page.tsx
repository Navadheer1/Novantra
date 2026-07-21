"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import MailboxLeftSidebar, { FolderId } from "@/components/mailbox/MailboxLeftSidebar";
import MailboxList, { MailItem } from "@/components/mailbox/MailboxList";
import MailboxReadingPanel from "@/components/mailbox/MailboxReadingPanel";
import MailboxComposeModal from "@/components/mailbox/MailboxComposeModal";
import MailboxSettingsModal from "@/components/mailbox/MailboxSettingsModal";
import MailboxErrorBoundary from "@/components/mailbox/MailboxErrorBoundary";
import OfflineToast from "@/components/mailbox/OfflineToast";

import { useMailStore } from "@/lib/stores/useMailStore";
import { mailCacheManager } from "@/lib/cache/mailCacheManager";
import { resilientFetch } from "@/lib/apiClient";
import { getApiUrl } from "@/lib/apiConfig";

let globalUserRole = "";

export default function InboxCommunicationHubPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  // Zustand Store Selectors
  const mails = useMailStore((state) => state.mails);
  const activeFolder = useMailStore((state) => state.activeFolder);
  const selectedMailId = useMailStore((state) => state.selectedMailId);
  const isLoaded = useMailStore((state) => state.isLoaded);

  const setMails = useMailStore((state) => state.setMails);
  const setSelectedMailId = useMailStore((state) => state.setSelectedMailId);
  const setActiveFolder = useMailStore((state) => state.setActiveFolder);
  const setIsLoaded = useMailStore((state) => state.setIsLoaded);
  const toggleStar = useMailStore((state) => state.toggleStar);
  const toggleBookmark = useMailStore((state) => state.toggleBookmark);
  const archiveMails = useMailStore((state) => state.archiveMails);
  const deleteMails = useMailStore((state) => state.deleteMails);
  const updateRequestStatus = useMailStore((state) => state.updateRequestStatus);
  const rollbackMails = useMailStore((state) => state.rollbackMails);

  // Active AbortController for request cancellation
  const currentFetchController = useRef<AbortController | null>(null);

  // Modal states
  const [composeOpen, setComposeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [replyInitialRecipient, setReplyInitialRecipient] = useState("");
  const [replyInitialSubject, setReplyInitialSubject] = useState("");

  // Post-hydration cache hydration effect
  useEffect(() => {
    const { data: cachedMails } = mailCacheManager.getCache<MailItem[]>("noventra_mails");
    if (cachedMails && cachedMails.length > 0) {
      setMails(cachedMails);
    }
    setIsLoaded(true);
  }, [setMails, setIsLoaded]);

  // Silent Stale-While-Revalidate Background Revalidation with Resilient API Client
  const fetchHubDataSilently = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      // Cancel previous pending fetch if rapidly triggered
      if (currentFetchController.current) {
        currentFetchController.current.abort();
      }
      currentFetchController.current = new AbortController();

      let dbRole = globalUserRole;
      if (!dbRole && clerkUser?.id) {
        const userRes = await resilientFetch<any>(`/api/users/clerk/${clerkUser.id}`, {
          token,
          signal: currentFetchController.current.signal
        });
        if (userRes && userRes.success && userRes.data) {
          const uData = userRes.data;
          dbRole = uData.role?.toLowerCase() || "";
          globalUserRole = dbRole;
        }
      }

      const allItems: MailItem[] = [];

      // 1. Fetch Incoming Requests if Founder
      if (dbRole === "founder") {
        const incRes = await resilientFetch<any[]>("/api/requests/incoming", {
          token,
          signal: currentFetchController.current.signal
        });
        if (incRes && incRes.success && Array.isArray(incRes.data)) {
          const requests = incRes.data;
          requests.forEach((r: any) => {
            const reqType = r.requestType;
            let category: MailItem["category"] = "Primary";
            if (reqType === "JOB" || reqType === "INTERN" || reqType === "CO_FOUNDER") category = "Hiring";
            if (reqType === "INVESTMENT") category = "Funding";

            allItems.push({
              id: `req-${r.id}`,
              type: "request",
              senderName: r.sender?.name || "Applicant",
              senderEmail: r.sender?.email || "applicant@noventra.io",
              senderRole: r.sender?.role || "TALENT",
              senderAvatar: null,
              startupName: r.startup?.name,
              subject: `${reqType.replace("_", " ")} Application for ${r.startup?.name}`,
              preview: r.message || `Interested in ${reqType} role at ${r.startup?.name}.`,
              timestamp: new Date(r.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
              unread: r.status === "PENDING",
              starred: false,
              bookmarked: false,
              priority: r.status === "PENDING" ? "HIGH" : "NORMAL",
              category,
              rawPayload: r
            });
          });
        }
      }

      // 2. Fetch Sent Requests for anyone
      const sentRes = await resilientFetch<any[]>("/api/requests/sent", {
        token,
        signal: currentFetchController.current.signal
      });
      if (sentRes && sentRes.success && Array.isArray(sentRes.data)) {
        const sent = sentRes.data;
        sent.forEach((s: any) => {
          allItems.push({
            id: `sent-${s.id}`,
            type: "request",
            senderName: "Me (Sent)",
            senderEmail: clerkUser?.primaryEmailAddress?.emailAddress || "me@noventra.io",
            senderRole: dbRole.toUpperCase() || "USER",
            senderAvatar: clerkUser?.imageUrl || null,
            startupName: s.startup?.name,
            subject: `Sent ${s.requestType.replace("_", " ")} Request to ${s.startup?.name}`,
            preview: s.message || `Submitted application to ${s.startup?.name}. Status: ${s.status}`,
            timestamp: new Date(s.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
            unread: false,
            starred: false,
            bookmarked: false,
            category: "Primary",
            rawPayload: s
          });
        });
      }

      // 3. Fetch Conversations & Direct Messages
      const convRes = await resilientFetch<any[]>("/api/messages/conversations", {
        token,
        signal: currentFetchController.current.signal
      });
      if (convRes && convRes.success && Array.isArray(convRes.data)) {
        const convs = convRes.data;
        convs.forEach((c: any) => {
          if (c.lastMessage) {
            allItems.push({
              id: `msg-${c.lastMessage.id}`,
              type: "message",
              senderName: c.user?.name || "Member",
              senderEmail: "member@noventra.io",
              senderRole: c.user?.role || "FOUNDER",
              senderAvatar: c.user?.avatarUrl || null,
              subject: `Direct Message from ${c.user?.name}`,
              preview: c.lastMessage.content,
              timestamp: new Date(c.lastMessage.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
              unread: false,
              starred: false,
              bookmarked: false,
              category: "Primary",
              rawPayload: c
            });
          }
        });
      }

      if (allItems.length > 0) {
        setMails(allItems);
      }
    } catch (err) {
      console.warn("[InboxHub] Silent background revalidation error:", err);
    }
  }, [clerkUser, getToken, setMails]);

  // Mount Effect for API Sync & Socket.IO events
  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      fetchHubDataSilently();
    }

    const handleInboxUpdate = () => {
      fetchHubDataSilently();
    };

    window.addEventListener("inbox-updated", handleInboxUpdate);
    window.addEventListener("message-received", handleInboxUpdate);

    return () => {
      window.removeEventListener("inbox-updated", handleInboxUpdate);
      window.removeEventListener("message-received", handleInboxUpdate);
    };
  }, [clerkLoaded, clerkUser, fetchHubDataSilently]);

  // Hover prefetching handler
  const handleHoverPrefetch = useCallback((mail: MailItem) => {
    // Cache entry is already warm in memory store
    mailCacheManager.setCache(`mail_detail_${mail.id}`, mail, 60000);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        composeOpen ||
        settingsOpen ||
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      if (mails.length === 0) return;

      const currentIndex = mails.findIndex((m) => m.id === selectedMailId);

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(mails.length - 1, currentIndex + 1);
        if (nextIndex >= 0) setSelectedMailId(mails[nextIndex].id);
      }

      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        if (prevIndex >= 0) setSelectedMailId(mails[prevIndex].id);
      }

      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setComposeOpen(true);
      }

      if ((e.key === "s" || e.key === "S") && selectedMailId) {
        e.preventDefault();
        toggleStar(selectedMailId);
      }

      if ((e.key === "e" || e.key === "E") && selectedMailId) {
        e.preventDefault();
        archiveMails([selectedMailId]);
      }

      if ((e.key === "#" || e.key === "Delete") && selectedMailId) {
        e.preventDefault();
        deleteMails([selectedMailId]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mails, selectedMailId, composeOpen, settingsOpen, setSelectedMailId, toggleStar, archiveMails, deleteMails]);

  // Optimistic UI Actions with Rollback
  const handleActionRequest = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
    const { previousMails } = updateRequestStatus(requestId, status);
    try {
      const token = await getToken();
      const res = await resilientFetch(`/api/requests/${requestId}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status })
      });

      if (!res || !res.success) {
        rollbackMails(previousMails);
      }
    } catch (err) {
      rollbackMails(previousMails);
    }
  };

  const selectedMail = mails.find((m) => m.id === selectedMailId) || null;
  const unreadCount = mails.filter((m) => m.unread).length;

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased overflow-hidden selection:bg-blue-100">
      <Navbar />

      {/* Main 3-Pane Resizable Workspace (STABILIZED, 0 Full-Page Loaders, React ErrorBoundary) */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto flex overflow-hidden border-t border-slate-200/80 bg-white">
        {/* 1. Left Folders & Navigation */}
        <MailboxLeftSidebar
          activeFolder={activeFolder}
          onSelectFolder={setActiveFolder}
          unreadCount={unreadCount}
          onOpenCompose={() => setComposeOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* 2. Center Mail List */}
        <MailboxErrorBoundary fallbackText="We couldn't render the email list.">
          <MailboxList
            mails={mails}
            selectedMailId={selectedMailId}
            onSelectMail={(mail) => setSelectedMailId(mail.id)}
            onHoverPrefetch={handleHoverPrefetch}
            activeFolder={activeFolder}
            isLoaded={isLoaded}
            onToggleStar={(id, e) => {
              if (e) e.stopPropagation();
              toggleStar(id);
            }}
            onToggleBookmark={(id, e) => {
              if (e) e.stopPropagation();
              toggleBookmark(id);
            }}
            onBulkArchive={(ids) => archiveMails(ids)}
            onBulkDelete={(ids) => deleteMails(ids)}
          />
        </MailboxErrorBoundary>

        {/* 3. Right Mail Reading Panel */}
        <MailboxErrorBoundary fallbackText="We couldn't load this conversation.">
          <MailboxReadingPanel
            mail={selectedMail}
            onActionRequest={handleActionRequest}
            onOpenComposeReply={(m) => {
              setReplyInitialRecipient(m.senderName);
              setReplyInitialSubject(`Re: ${m.subject}`);
              setComposeOpen(true);
            }}
            onToggleStar={(id) => toggleStar(id)}
            onToggleBookmark={(id) => toggleBookmark(id)}
            onDelete={(id) => deleteMails([id])}
          />
        </MailboxErrorBoundary>
      </main>

      {/* Modals & Offline Toast */}
      <MailboxComposeModal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        initialRecipient={replyInitialRecipient}
        initialSubject={replyInitialSubject}
      />

      <MailboxSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <OfflineToast onRetryConnection={() => fetchHubDataSilently()} />
    </div>
  );
}
