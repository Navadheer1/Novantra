"use client";

import React, { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Upload, Image as ImageIcon, Sparkles, Check, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api";

interface GeneralSectionProps {
  data: {
    avatarUrl: string | null;
    coverUrl?: string | null;
    bannerGradient?: string;
    accentColor?: string;
  };
  onChange: (field: string, value: any) => void;
}

export default function GeneralStudioSection({ data, onChange }: GeneralSectionProps) {
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const gradientPresets = [
    { name: "Noventra Blue (Default)", value: "from-blue-600 via-indigo-600 to-sky-500" },
    { name: "Emerald Growth", value: "from-emerald-600 via-teal-600 to-cyan-500" },
    { name: "Purple Founder", value: "from-purple-600 via-indigo-600 to-pink-500" },
    { name: "Sunset Capital", value: "from-amber-500 via-orange-600 to-rose-600" },
    { name: "Midnight Stealth", value: "from-slate-900 via-slate-800 to-indigo-950" },
  ];

  const accentColors = [
    "#2563EB", // Royal Blue
    "#0EA5E9", // Sky Blue
    "#10B981", // Emerald
    "#8B5CF6", // Purple
    "#F59E0B", // Amber
    "#EC4899", // Pink
  ];


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          onChange("avatarUrl", json.url);
          return;
        }
      }

      // Local Object URL fallback
      const localUrl = URL.createObjectURL(file);
      onChange("avatarUrl", localUrl);
    } catch (err) {
      console.error(err);
      const localUrl = URL.createObjectURL(file);
      onChange("avatarUrl", localUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      
      {/* Header */}
      <div>
        <h3 className="text-base font-black text-slate-900">General & Visual Branding</h3>
        <p className="text-xs text-slate-500">Configure your profile picture, cover banner, and color themes.</p>
      </div>

      {/* Avatar Image Upload */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Profile Photo</h4>
        
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-2xl text-blue-600">N</span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <input
              type="text"
              placeholder="Enter Image URL (e.g. https://images.unsplash.com/...)"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:ring-2 focus:ring-blue-600"
              value={data.avatarUrl || ""}
              onChange={(e) => onChange("avatarUrl", e.target.value)}
            />
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold rounded-lg h-8"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin text-blue-600" />
                ) : (
                  <Upload className="w-3.5 h-3.5 mr-1" />
                )}
                <span>{uploading ? "Uploading..." : "Upload File"}</span>
              </Button>
              {data.avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange("avatarUrl", null)}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg h-8"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Banner & Presets */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Cover Banner Gradient</h4>
        
        {/* Banner Preview Box */}
        <div className={`h-24 rounded-xl bg-gradient-to-r ${data.bannerGradient || gradientPresets[0].value} relative overflow-hidden border border-white/20 shadow-inner`}>
          <span className="absolute bottom-2 right-3 text-[10px] font-bold text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
            Banner Preview
          </span>
        </div>

        {/* Gradient Presets Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">Preset Gradient Themes</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gradientPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onChange("bannerGradient", preset.value)}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  (data.bannerGradient || gradientPresets[0].value) === preset.value
                    ? "border-blue-600 bg-blue-50/60 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${preset.value}`} />
                  <span>{preset.name}</span>
                </div>
                {(data.bannerGradient || gradientPresets[0].value) === preset.value && (
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accent Color Picker */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Profile Accent Color</h4>
        <div className="flex items-center gap-3">
          {accentColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange("accentColor", color)}
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center text-white ${
                data.accentColor === color ? "scale-110 ring-4 ring-blue-200" : "hover:scale-105"
              }`}
            >
              {data.accentColor === color && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
