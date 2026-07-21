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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[24px] max-w-md w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Audio & Video Settings</h3>
              <p className="text-xs text-slate-500">Configure media inputs and quality</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Select */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" /> Camera Input
            </label>
            <select
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
            >
              {videoDevices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Mic Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-emerald-600" /> Microphone Input
            </label>
            <select
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={selectedAudio}
              onChange={(e) => setSelectedAudio(e.target.value)}
            >
              {audioDevices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Microphone ${i + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Video Resolution */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Video Resolution Preset</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuality("720p")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  quality === "720p"
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                HD 720p (60fps)
              </button>
              <button
                type="button"
                onClick={() => setQuality("1080p")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  quality === "1080p"
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Full HD 1080p
              </button>
            </div>
          </div>

          {/* Background Blur */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Background Blur</h4>
                <p className="text-[11px] text-slate-500">Blur background surroundings</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleBlur}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                backgroundBlur ? "bg-purple-600 text-white" : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              {backgroundBlur ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-10 shadow-sm"
          >
            Done
          </Button>
        </div>

      </div>
    </div>
  );
}
