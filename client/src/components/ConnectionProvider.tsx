"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { resilientFetch } from "@/lib/apiClient";
import { useMailStore } from "@/lib/stores/useMailStore";
import OfflineToast from "@/components/mailbox/OfflineToast";

interface ConnectionContextType {
  isOnline: boolean;
  isOffline: boolean;
  lastChecked: Date | null;
  retryConnection: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType>({
  isOnline: true,
  isOffline: false,
  lastChecked: null,
  retryConnection: async () => {}
});

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const offlineMode = useMailStore((state) => state.offlineMode);
  const setOfflineMode = useMailStore((state) => state.setOfflineMode);

  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = useCallback(async () => {
    const response = await resilientFetch("/api/health", { timeoutMs: 3000, retries: 1 });
    setLastChecked(new Date());
    if (response.success) {
      setOfflineMode(false);
    } else if (response.offline) {
      setOfflineMode(true);
    }
  }, [setOfflineMode]);

  // Initial startup health check & periodic polling when offline
  useEffect(() => {
    checkHealth();

    // Auto-retry connection every 10 seconds to auto-recover when server starts
    const interval = setInterval(() => {
      checkHealth();
    }, 10000);

    const handleOnline = () => {
      checkHealth();
    };
    const handleOffline = () => {
      setOfflineMode(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkHealth, setOfflineMode]);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline: !offlineMode,
        isOffline: offlineMode,
        lastChecked,
        retryConnection: checkHealth
      }}
    >
      {children}
      <OfflineToast onRetryConnection={checkHealth} />
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
