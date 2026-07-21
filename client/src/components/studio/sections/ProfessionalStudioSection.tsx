"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfessionalSectionProps {
  data: {
    headline?: string;
    bio?: string;
    company?: string;
    roleTitle?: string;
    yearsOfExp?: number;
    websiteUrl?: string;
  };
  onChange: (field: string, value: any) => void;
  onAIGenerateHeadline: () => void;
  onAIGenerateBio: () => void;
}

export default function ProfessionalStudioSection({
  data,
  onChange,
  onAIGenerateHeadline,
  onAIGenerateBio,
}: ProfessionalSectionProps) {
  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Professional Information</h3>
        <p className="text-xs text-slate-500">Define your headline, elevator pitch, and career summary.</p>
      </div>

      {/* Professional Headline with AI Tool */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">Professional Headline</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAIGenerateHeadline}
            className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 h-7 px-2 flex items-center gap-1"
          >
            <Wand2 className="w-3 h-3" />
            <span>AI Suggest</span>
          </Button>
        </div>

        <input
          type="text"
          placeholder="e.g. Co-Founder & CTO @ Acme AI | Ex-Google | Building LLM Infrastructure"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          value={data.headline || ""}
          onChange={(e) => onChange("headline", e.target.value)}
        />
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
          <span>Keep it concise (1-line pitch)</span>
          <span>{(data.headline || "").length}/120</span>
        </div>
      </div>

      {/* Biography with AI Tool */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">Biography / Ecosystem Story</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAIGenerateBio}
            className="text-[11px] font-bold text-purple-600 hover:bg-purple-50 h-7 px-2 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Polish</span>
          </Button>
        </div>

        <textarea
          rows={5}
          placeholder="Share your background, achievements, and what drives you in the startup ecosystem..."
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none leading-relaxed"
          value={data.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
        />
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
          <span>Markdown formatting supported</span>
          <span>{(data.bio || "").length}/1500</span>
        </div>
      </div>

      {/* Company, Role & Years */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Current Company</label>
          <input
            type="text"
            placeholder="Noventra, Stripe, Self-Employed"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.company || ""}
            onChange={(e) => onChange("company", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Job Title / Role</label>
          <input
            type="text"
            placeholder="Founder, Lead GP, Staff Eng"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.roleTitle || ""}
            onChange={(e) => onChange("roleTitle", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
          <input
            type="number"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.yearsOfExp ?? 6}
            onChange={(e) => onChange("yearsOfExp", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Personal / Company Website</label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="https://yourwebsite.io"
            className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.websiteUrl || ""}
            onChange={(e) => onChange("websiteUrl", e.target.value)}
          />
        </div>
      </div>

    </div>
  );
}
