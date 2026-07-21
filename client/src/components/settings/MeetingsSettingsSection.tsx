"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Video, Clock, CheckCircle2, FileText, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/apiConfig";

export default function MeetingsSettingsSection() {
  const { getToken } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      if (!token) return;

      const startupsRes = await fetch(`${apiUrl}/api/startups/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (startupsRes.ok) {
        const startups = await startupsRes.json();
        const list: any[] = [];
        for (const s of startups) {
          const mRes = await fetch(`${apiUrl}/api/meetings/${s.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (mRes.ok) {
            const data = await mRes.json();
            list.push(...data);
          }
        }
        setMeetings(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-blue-600" /> WebRTC Meetings & Pitch History
        </h2>
        <p className="text-xs text-slate-500">View call logs, WebRTC pitch room recordings, shared notes, and room configurations.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Video className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No WebRTC Pitch Meetings Found</h3>
          <p className="text-xs text-slate-500">Active video rooms started from your founder console will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{m.startup?.name || "Startup"} Meeting Room</h4>
                <p className="text-slate-500 font-mono text-[11px]">Room Code: {m.meetingCode} • Status: {m.status}</p>
              </div>

              <Link href={`/meeting/${m.meetingCode}`}>
                <Button size="sm" className="bg-blue-600 text-white font-bold">Join Room</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
