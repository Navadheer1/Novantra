"use client";

import React from "react";
import { Image as ImageIcon, FileText, Video, Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaSectionProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export default function MediaStudioSection({ data, onChange }: MediaSectionProps) {
  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Media, Pitch Decks & Documents</h3>
        <p className="text-xs text-slate-500">Attach pitch decks, certificates, and video links to your profile.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" /> Pitch Deck Document (DocSend / PDF)
          </label>
          <input
            type="text"
            placeholder="https://docsend.com/view/..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
            value={data.pitchDeckPdf || ""}
            onChange={(e) => onChange("pitchDeckPdf", e.target.value)}
          />
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Video className="w-4 h-4 text-purple-600" /> Founder Demo Video (Loom / YouTube)
          </label>
          <input
            type="text"
            placeholder="https://loom.com/share/..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
            value={data.demoVideoUrl || ""}
            onChange={(e) => onChange("demoVideoUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" /> Key Certificate / Accreditation
        </label>
        <input
          type="text"
          placeholder="e.g. Y Combinator W24 Certificate URL"
          className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
          value={data.certificateUrl || ""}
          onChange={(e) => onChange("certificateUrl", e.target.value)}
        />
      </div>

    </div>
  );
}
