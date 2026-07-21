"use client";

import { useMailStore } from "@/lib/stores/useMailStore";
import { WifiOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onRetryConnection?: () => void;
}

export default function OfflineToast({ onRetryConnection }: Props) {
  const offlineMode = useMailStore((state) => state.offlineMode);

  if (!offlineMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 text-xs">
      <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div>
        <p className="font-extrabold text-slate-100">Unable to sync with server</p>
        <p className="text-[11px] text-slate-400">Working offline with cached communications.</p>
      </div>

      {onRetryConnection && (
        <Button
          size="sm"
          onClick={onRetryConnection}
          className="h-7 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-2"
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Retry Sync
        </Button>
      )}
    </div>
  );
}
