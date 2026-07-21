"use client";

import React from "react";
import { Users, Clock, DollarSign, Target } from "lucide-react";

interface MentorSectionProps {
  data: {
    expertiseTopics?: string;
    sessionRate?: string;
    mentorshipAvailability?: string;
  };
  onChange: (field: string, value: any) => void;
}

export default function MentorStudioSection({ data, onChange }: MentorSectionProps) {
  return (
    <div className="space-y-6">
      
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-black text-slate-900">Ecosystem Mentor Configurations</h3>
        </div>
        <p className="text-xs text-slate-500">Configure your mentorship focus, session booking rates, and availability slots.</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Areas of Expertise (comma separated)</label>
        <input
          type="text"
          placeholder="Fundraising, Pitch Decks, GTM Strategy, Scaling Engineering Teams"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          value={data.expertiseTopics || "Fundraising, GTM Strategy, Product-Market Fit"}
          onChange={(e) => onChange("expertiseTopics", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Session Rate / Pricing</label>
          <input
            type="text"
            placeholder="e.g. Pro-Bono (Free 30m) or $150 / hr"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.sessionRate || "Pro-Bono (Free 30m)"}
            onChange={(e) => onChange("sessionRate", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Mentorship Availability</label>
          <select
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.mentorshipAvailability || "Open for 1:1 Sessions"}
            onChange={(e) => onChange("mentorshipAvailability", e.target.value)}
          >
            <option>Open for 1:1 Sessions</option>
            <option>Limited Slots Available</option>
            <option>Warm Intros Only</option>
          </select>
        </div>
      </div>

    </div>
  );
}
