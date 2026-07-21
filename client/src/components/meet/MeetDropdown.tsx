"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Video, Plus, LogIn, Calendar, Clock, ArrowRight, Sparkles, Copy, Check } from "lucide-react";
import NewMeetingModal from "./NewMeetingModal";
import JoinMeetingModal from "./JoinMeetingModal";
import { getApiUrl } from "@/lib/apiConfig";
import { safeFetchJson } from "@/lib/meetingUtils";

interface MeetDropdownProps {
  onClose: () => void;
}

export default function MeetDropdown({ onClose }: MeetDropdownProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentMeetings();
  }, []);

  const fetchRecentMeetings = async () => {
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const { ok, data } = await safeFetchJson(`${apiUrl}/api/meetings/user/recent`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (ok && Array.isArray(data)) {
        setRecentMeetings(data);
      }
    } catch (e) {}
  };

  return (
    <>
      <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl p-4 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Noventra Meet</h3>
              <p className="text-[10px] text-slate-400 font-medium">Instant HD Video Collaboration</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            WebRTC P2P
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsNewOpen(true)}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </button>

          <button
            type="button"
            onClick={() => setIsJoinOpen(true)}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-all border border-slate-200"
          >
            <LogIn className="w-4 h-4 text-blue-600" />
            <span>Join Meeting</span>
          </button>
        </div>

        {/* Recent & Scheduled Meetings */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
            <span>Recent & Scheduled</span>
            <Calendar className="w-3 h-3 text-slate-400" />
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {recentMeetings.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-2 text-center bg-slate-50 rounded-xl">
                No recent meetings found. Start one above!
              </p>
            ) : (
              recentMeetings.map((m) => (
                <Link
                  key={m.id}
                  href={`/meet/${m.meetingCode}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors group border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{m.startup?.name || `Meeting ${m.meetingCode}`}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <NewMeetingModal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} />
      <JoinMeetingModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
    </>
  );
}
