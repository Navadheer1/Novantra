"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, X, Link as LinkIcon, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinMeetingModal({ isOpen, onClose }: JoinMeetingModalProps) {
  const router = useRouter();
  const [meetingInput, setMeetingInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = meetingInput.trim();
    if (!trimmed) {
      setErrorMsg("Please enter a meeting code or link.");
      return;
    }

    // Extract code if user pasted full URL e.g. https://noventra.io/meet/abc-defg-hij
    let code = trimmed;
    if (trimmed.includes("/meet/")) {
      code = trimmed.split("/meet/")[1]?.split("?")[0] || trimmed;
    }

    // Validate format: e.g. abc-defg-hij or valid string length >= 3
    if (code.length < 3) {
      setErrorMsg("Invalid meeting code format. Example: abc-defg-hij");
      return;
    }

    onClose();
    router.push(`/meet/${code}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[24px] max-w-md w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100">
              <LogIn className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Join Noventra Meet</h3>
              <p className="text-xs text-slate-500">Enter room code or paste meeting link</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Code or Full URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="e.g. abc-defg-hij or https://noventra.io/meet/..."
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                value={meetingInput}
                onChange={(e) => setMeetingInput(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-11 shadow-sm flex items-center justify-center gap-2"
            >
              <span>Join Meeting</span>
              <ArrowRight className="w-4 h-4" />
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
        </form>

      </div>
    </div>
  );
}
