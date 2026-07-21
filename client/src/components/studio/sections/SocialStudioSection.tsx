"use client";

import React from "react";
import { Share2, Globe } from "lucide-react";

interface SocialSectionProps {
  socials: Record<string, string>;
  onChange: (network: string, value: string) => void;
}

export default function SocialStudioSection({ socials, onChange }: SocialSectionProps) {
  const networks = [
    { id: "github", label: "GitHub", placeholder: "https://github.com/username" },
    { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
    { id: "twitter", label: "Twitter / X", placeholder: "https://x.com/username" },
    { id: "portfolio", label: "Personal Portfolio", placeholder: "https://username.dev" },
    { id: "producthunt", label: "Product Hunt", placeholder: "https://producthunt.com/@username" },
    { id: "youtube", label: "YouTube Channel", placeholder: "https://youtube.com/@channel" },
    { id: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/username" },
    { id: "medium", label: "Medium / Blog", placeholder: "https://medium.com/@username" },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Social & External Links</h3>
        <p className="text-xs text-slate-500">Connect your web presence across developer, design, and founder platforms.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {networks.map((net) => (
          <div key={net.id}>
            <label className="block text-xs font-bold text-slate-700 mb-1">{net.label}</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={net.placeholder}
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                value={socials[net.id] || ""}
                onChange={(e) => onChange(net.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
