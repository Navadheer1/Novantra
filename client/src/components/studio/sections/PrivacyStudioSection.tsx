"use client";

import React from "react";
import { Lock, Eye } from "lucide-react";

interface PrivacySectionProps {
  privacy: Record<string, string>;
  onChange: (field: string, level: string) => void;
}

export default function PrivacyStudioSection({ privacy, onChange }: PrivacySectionProps) {
  const privacyItems = [
    { id: "email", label: "Email Address Visibility", desc: "Who can view your email address" },
    { id: "phone", label: "Phone Number Visibility", desc: "Who can view your private phone number" },
    { id: "funding", label: "Financial / Traction Metrics", desc: "Visibility of MRR and raised capital" },
    { id: "activity", label: "Activity Feed & Likes", desc: "Who can view your likes and saved posts" },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Privacy & Visibility Controls</h3>
        <p className="text-xs text-slate-500">Configure who can see sensitive details on your profile.</p>
      </div>

      <div className="space-y-4">
        {privacyItems.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">{item.label}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>

            <select
              className="p-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 shrink-0"
              value={privacy[item.id] || "Connections Only"}
              onChange={(e) => onChange(item.id, e.target.value)}
            >
              <option>Public (Everyone)</option>
              <option>Connections Only</option>
              <option>Investors Only</option>
              <option>Private (Only Me)</option>
            </select>
          </div>
        ))}
      </div>

    </div>
  );
}
