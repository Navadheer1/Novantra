"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Video, X, Sparkles, Shield, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiConfig";

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewMeetingModal({ isOpen, onClose }: NewMeetingModalProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [meetingTitle, setMeetingTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateInstant = async () => {
    setErrorMsg(null);
    try {
      setLoading(true);
      const token = await getToken();
      
      console.log("[NewMeetingModal] Submitting POST /api/meetings/instant...");
      const res = await apiFetch("/api/meetings/instant", {
        method: "POST",
        token,
        body: JSON.stringify({ title: meetingTitle.trim() || undefined }),
      });

      const json = await res.json().catch(() => ({}));
      console.log("[NewMeetingModal] Received response:", json);

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || `Server error (${res.status}): Failed to create meeting.`);
        return;
      }

      const code = json.meetingCode || json.meeting?.meetingCode;
      if (!code) {
        setErrorMsg("Server returned invalid meeting payload.");
        return;
      }

      onClose();
      router.push(`/communications/meeting/${code}`);
    } catch (e: any) {
      console.error("[NewMeetingModal] Exception during creation:", e);
      setErrorMsg(e.message || "Network error creating meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[24px] max-w-md w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Start New Meeting</h3>
              <p className="text-xs text-slate-500">Create a secure WebRTC video room</p>
            </div>
          </div>
          
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Investor Pitch & Technical Review"
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-600">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>End-to-End P2P WebRTC connection with host waiting room controls enabled.</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleCreateInstant}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-11 shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Start Instantly</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full border-slate-200 text-slate-700 font-bold text-xs rounded-xl h-10"
          >
            Cancel
          </Button>
        </div>

      </div>
    </div>
  );
}
