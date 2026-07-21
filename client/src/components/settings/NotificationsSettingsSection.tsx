"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Briefcase, Zap, Video, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsSettingsSection() {
  const [prefs, setPrefs] = useState({
    messages: true,
    likes: true,
    comments: true,
    mentions: true,
    hiring: true,
    funding: true,
    investors: true,
    meetings: true,
    emailAlerts: true,
    pushAlerts: true
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const controls: { key: keyof typeof prefs; label: string; desc: string; icon: any }[] = [
    { key: "messages", label: "Direct Messages", desc: "Alerts when founders, investors, or talent message you.", icon: MessageSquare },
    { key: "likes", label: "Post Likes & Reactions", desc: "Notifications when users like your ecosystem posts.", icon: Heart },
    { key: "comments", label: "Comments & Replies", desc: "Alerts for comments on your startup updates.", icon: MessageSquare },
    { key: "hiring", label: "Hiring Applications", desc: "Notifications when candidates apply for open roles.", icon: Briefcase },
    { key: "funding", label: "Investor Capital Interest", desc: "Instant high-priority alerts when VCs express investment interest.", icon: Zap },
    { key: "meetings", label: "Pitch Room Sync Invites", desc: "Alerts when WebRTC meeting links are generated.", icon: Video },
    { key: "emailAlerts", label: "Email Summaries", desc: "Receive daily digest emails for unread notifications.", icon: Mail },
    { key: "pushAlerts", label: "Browser Push Alerts", desc: "Enable browser notification popups.", icon: Bell }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" /> Notification Center Controls
        </h2>
        <p className="text-xs text-slate-500">Configure granular alert preferences for messages, funding, hiring, and meetings.</p>
      </div>

      <div className="space-y-3">
        {controls.map((ctrl) => {
          const CIcon = ctrl.icon;
          const isEnabled = prefs[ctrl.key];
          return (
            <div
              key={ctrl.key}
              onClick={() => toggle(ctrl.key)}
              className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600">
                  <CIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{ctrl.label}</h4>
                  <p className="text-[11px] text-slate-500">{ctrl.desc}</p>
                </div>
              </div>

              <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${isEnabled ? "bg-blue-600" : "bg-slate-300"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${isEnabled ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
