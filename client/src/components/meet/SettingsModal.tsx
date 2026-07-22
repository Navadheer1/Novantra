"use client";

import React, { useState, useEffect } from "react";
import { Settings, X, Camera, Mic, Volume2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundBlur: boolean;
  onToggleBlur: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  backgroundBlur,
  onToggleBlur,
}: SettingsModalProps) {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedAudio, setSelectedAudio] = useState("");
  const [quality, setQuality] = useState("720p");

  useEffect(() => {
    if (isOpen) {
      loadDevices();
    }
  }, [isOpen]);

  const loadDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const video = devices.filter((d) => d.kind === "videoinput");
      const audio = devices.filter((d) => d.kind === "audioinput");
      setVideoDevices(video);
      setAudioDevices(audio);
      if (video[0]) setSelectedVideo(video[0].deviceId);
      if (audio[0]) setSelectedAudio(audio[0].deviceId);
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      
      {/* Floating Glassmorphism Modal Card */}
      <div className="bg-white/72 backdrop-blur-[18px] border border-white/45 rounded-[20px] max-w-md w-full shadow-[0_12px_40px_rgba(15,23,42,0.10)] p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 font-sans text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] font-bold flex items-center justify-center border border-blue-100">
              <Settings className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Audio & Video Settings</h3>
              <p className="text-xs text-slate-500">Configure media inputs and quality</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#2563EB]" /> Camera Input
          </label>
          <select
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white/90 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]"
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
          >
            {videoDevices.length === 0 ? (
              <option>Default Camera</option>
            ) : (
              videoDevices.map((d, i) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Mic Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-[#2563EB]" /> Microphone Input
          </label>
          <select
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white/90 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]"
            value={selectedAudio}
            onChange={(e) => setSelectedAudio(e.target.value)}
          >
            {audioDevices.length === 0 ? (
              <option>Default Microphone</option>
            ) : (
              audioDevices.map((d, i) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Microphone ${i + 1}`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Video Quality */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" /> Video Resolution
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["360p", "720p HD", "1080p Full HD"].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuality(q)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  quality === q
                    ? "bg-[#2563EB] text-white border-[#2563EB] shadow-2xs"
                    : "bg-white/90 text-slate-700 border-slate-200 hover:bg-white"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Background Effects */}
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <div>
              <p className="text-xs font-bold text-slate-800">Background Blur</p>
              <p className="text-[10px] text-slate-500">Soft focus portrait effect</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleBlur}
            className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              backgroundBlur ? "bg-[#2563EB]" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                backgroundBlur ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-xl h-10 shadow-xs cursor-pointer"
          >
            Save & Apply Settings
          </Button>
        </div>

      </div>
    </div>
  );
}
