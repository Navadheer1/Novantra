"use client";

import React from "react";
import { Bell } from "lucide-react";

interface NotificationsSectionProps {
  notifications: Record<string, boolean>;
  onChange: (field: string, enabled: boolean) => void;
}

export default function NotificationsStudioSection({ notifications, onChange }: NotificationsSectionProps) {
  const notifItems = [
    { id: "emailPitch", label: "Startup Pitch & Connection Requests", desc: "Receive email alerts when investors or founders connect." },
    { id: "mentions", label: "Direct Messages & Mentions", desc: "Receive alerts for new messages." },
    { id: "digest", label: "Weekly Ecosystem Digest", desc: "Curated newsletter of top startups and deals." },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Notification Preferences</h3>
        <p className="text-xs text-slate-500">Configure email and push notification channels.</p>
      </div>

      <div className="space-y-3">
        {notifItems.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">{item.label}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications[item.id] !== false}
                onChange={(e) => onChange(item.id, e.target.checked)}
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

    </div>
  );
}
