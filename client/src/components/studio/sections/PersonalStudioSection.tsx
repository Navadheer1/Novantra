"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PersonalSectionProps {
  data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    pronouns?: string;
    location?: string;
    timezone?: string;
    languages?: string;
    email?: string;
    phone?: string;
  };
  onChange: (field: string, value: any) => void;
}

export default function PersonalStudioSection({ data, onChange }: PersonalSectionProps) {
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(true);

  // Debounced live username availability check simulation
  useEffect(() => {
    if (!data.username) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    const timer = setTimeout(() => {
      setCheckingUsername(false);
      setUsernameAvailable((data.username || "").length >= 3);
    }, 400);

    return () => clearTimeout(timer);
  }, [data.username]);

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Personal Information</h3>
        <p className="text-xs text-slate-500">Manage your identity, handle, contact info, and global preferences.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
          <input
            type="text"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.firstName || ""}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
          <input
            type="text"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.lastName || ""}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>
      </div>

      {/* Username with Live Check */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Username / Ecosystem Handle</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
          <input
            type="text"
            placeholder="username"
            className="w-full pl-8 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.username || ""}
            onChange={(e) => onChange("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {checkingUsername && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            {!checkingUsername && usernameAvailable === true && data.username && (
              <span title="Username available">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </span>
            )}
            {!checkingUsername && usernameAvailable === false && data.username && (
              <span title="Username must be at least 3 characters">
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </span>
            )}
          </div>
        </div>

        {data.username && usernameAvailable === true && (
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            ✓ Profile URL: noventra.io/@{data.username}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Pronouns (Optional)</label>
          <input
            type="text"
            placeholder="he/him, she/her, they/them"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.pronouns || ""}
            onChange={(e) => onChange("pronouns", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="San Francisco, CA or Remote"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
          <select
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.timezone || "PST (UTC-8)"}
            onChange={(e) => onChange("timezone", e.target.value)}
          >
            <option>PST (UTC-8) - San Francisco, Seattle</option>
            <option>EST (UTC-5) - New York, Boston</option>
            <option>GMT (UTC+0) - London, Western Europe</option>
            <option>IST (UTC+5:30) - India</option>
            <option>SGT (UTC+8) - Singapore</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Languages (comma separated)</label>
          <input
            type="text"
            placeholder="English, Spanish, Mandarin"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.languages || "English"}
            onChange={(e) => onChange("languages", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/80 pt-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Primary Email</label>
          <input
            type="email"
            readOnly
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-100 text-xs font-medium text-slate-500 cursor-not-allowed"
            value={data.email || "user@noventra.io"}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Private)</label>
          <input
            type="text"
            placeholder="+1 (555) 000-0000"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.phone || ""}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>
      </div>

    </div>
  );
}
