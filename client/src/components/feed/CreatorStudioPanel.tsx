"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  Rocket,
  Briefcase,
  DollarSign,
  BarChart2,
  TrendingUp,
  Image as ImageIcon,
  Loader2,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  AtSign,
  Hash,
  Sparkles,
  CheckCircle2,
  Globe,
  Users,
  Lock,
  Building,
  Calendar,
  Clock,
  Trash2,
  UploadCloud,
  Eye,
  Check,
  Video,
  Tv,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  FileVideo,
  Scissors,
  RotateCw,
  Volume2,
  VolumeX,
  Type,
  ShieldCheck,
  Tag,
  Sliders,
  Maximize2,
  Music,
  Layers,
  Sparkle,
} from "lucide-react";
import { DBUser } from "@/lib/feedStore";

interface CreatorStudioPanelProps {
  isOpen: boolean;
  onClose: () => void;
  presetType?: string;
  dbUser: DBUser | null;
  clerkUser: any;
  onSubmitPost: (content: string, postType: string, mediaUrl: string) => Promise<boolean>;
}

export default function CreatorStudioPanel({
  isOpen,
  onClose,
  presetType = "text",
  dbUser,
  clerkUser,
  onSubmitPost,
}: CreatorStudioPanelProps) {
  const profileName = dbUser?.name || clerkUser?.fullName || "Founder";
  const profileRole = dbUser?.role || "FOUNDER";
  const avatarUrl = dbUser?.avatarUrl || clerkUser?.imageUrl;

  const [postType, setPostType] = useState("startup_update");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(true);

  // Settings & Metadata
  const [audience, setAudience] = useState("public"); // public | followers | investors | team | private
  const [selectedStartup, setSelectedStartup] = useState("Noventra Tech");
  const [selectedTags, setSelectedTags] = useState<string[]>(["AI", "SaaS"]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // --- FounderTV Video Upload & Editing Suite State ---
  const [activeTab, setActiveTab] = useState<"upload" | "edit" | "details" | "thumbnail" | "preview" | "publish">("upload");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("Product Demo");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"
  );
  const [selectedFrame, setSelectedFrame] = useState("00:05");
  const [videoDuration, setVideoDuration] = useState("12:45");
  const [fileSize, setFileSize] = useState("184 MB");
  const [resolution, setResolution] = useState("1080p 60fps");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "paused" | "processing" | "ready">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- Video Editing Engine State ---
  const [trimStart, setTrimStart] = useState(0); // 0%
  const [trimEnd, setTrimEnd] = useState(100); // 100%
  const [rotationAngle, setRotationAngle] = useState(0); // 0 | 90 | 180 | 270
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1x"); // 0.5x | 1x | 1.25x | 1.5x | 2x
  const [overlayText, setOverlayText] = useState("");
  const [overlayPosition, setOverlayPosition] = useState<"top" | "center" | "bottom">("bottom");
  const [overlayColor, setOverlayColor] = useState("#2563eb"); // Blue accent
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkOpacity, setWatermarkOpacity] = useState(80);
  const [badgeSticker, setBadgeSticker] = useState("🚀 Product Launch");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (presetType) {
      if (presetType === "foundertv" || presetType === "video") setPostType("foundertv");
      else if (presetType === "short") setPostType("short");
      else if (presetType === "launch_startup") setPostType("startup_launch");
      else if (presetType === "share_update") setPostType("startup_update");
      else if (presetType === "hire_talent") setPostType("hiring");
      else if (presetType === "raise_funding") setPostType("funding");
      else if (presetType === "create_event") setPostType("event");
      else setPostType("startup_update");
    }
  }, [presetType]);

  // Video Upload Progress Simulation
  const startVideoUpload = () => {
    setUploadStatus("uploading");
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setUploadStatus("processing");
          setTimeout(() => {
            setUploadStatus("ready");
            setUploadProgress(100);
          }, 800);
          return 90;
        }
        return prev + 25;
      });
    }, 350);
  };

  const pauseVideoUpload = () => setUploadStatus("paused");
  const resumeVideoUpload = () => setUploadStatus("uploading");
  const cancelVideoUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
  };

  // Keyboard Shortcuts (Ctrl+S, Ctrl+Enter, Esc, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleFormSubmit();
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        triggerDraftSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, content, postType, videoTitle, mediaUrl, uploadStatus, activeTab]);

  const triggerDraftSave = () => {
    setDraftSaved(false);
    setTimeout(() => setDraftSaved(true), 600);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerDraftSave();
  };

  const handleFormSubmit = async () => {
    const isVideo = postType === "foundertv" || postType === "short";
    if (isVideo && !videoTitle.trim()) return;
    if (!isVideo && !content.trim()) return;
    if (submitting) return;

    setSubmitting(true);
    const finalContent = isVideo ? `[FounderTV] ${videoTitle}\n\n${content}` : content;
    const finalMedia = thumbnailUrl || mediaUrl;

    const success = await onSubmitPost(finalContent, postType, finalMedia);
    setSubmitting(false);

    if (success) {
      setContent("");
      setVideoTitle("");
      setMediaUrl("");
      setActiveTab("upload");
      onClose();
    }
  };

  const insertFormatting = (syntax: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${syntax}${selected || "text"}${syntax}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    triggerDraftSave();
  };

  // Single AI Copilot Action Trigger
  const applySingleAICopilot = () => {
    setDraftSaved(false);
    setTimeout(() => {
      setVideoTitle(`${selectedStartup}: Scaling Healthcare AI Architecture`);
      setContent(
        `In this FounderTV episode, we demonstrate how ${selectedStartup} achieves real-time inference on the edge.\n\nKey takeaways:\n• Multi-region database sync\n• Real-time event streams\n• Scalable developer workflow`
      );
      setSelectedTags(["AI", "Healthcare", "DevTools", "SaaS"]);
      setOverlayText(`${selectedStartup} Live Demo`);
      setDraftSaved(true);
    }, 400);
  };

  const postTypes = [
    { id: "startup_update", label: "Post Update", icon: TrendingUp },
    { id: "foundertv", label: "FounderTV Video", icon: Video },
    { id: "short", label: "Short Video", icon: Tv },
    { id: "startup_launch", label: "Launch", icon: Rocket },
    { id: "hiring", label: "Hiring", icon: Briefcase },
    { id: "funding", label: "Fundraising", icon: DollarSign },
    { id: "poll", label: "Poll", icon: BarChart2 },
    { id: "event", label: "Event", icon: Calendar },
  ];

  const categoriesList = [
    "Product Demo",
    "Founder Story",
    "Startup Journey",
    "Tutorial",
    "AMA",
    "Podcast",
    "Launch",
    "Technical Talk",
    "Fundraising",
    "Hiring",
  ];

  if (!isOpen) return null;

  return (
    <motion.aside
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full lg:w-[540px] bg-white border-l border-slate-200/80 shadow-2xl h-[calc(100vh-80px)] sticky top-20 flex flex-col justify-between overflow-hidden z-30 select-none rounded-l-3xl"
    >
      {/* 1. HEADER */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={profileName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-extrabold text-blue-600 bg-blue-50">
                {profileName[0]}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-slate-900">{profileName}</h3>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {profileRole} • {selectedStartup}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${draftSaved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
            <span>{draftSaved ? "Draft Saved" : "Saving..."}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
        {/* A. CONTENT TYPE SELECTOR */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Content Type</div>
          <div className="grid grid-cols-4 gap-1.5">
            {postTypes.map((pt) => {
              const Icon = pt.icon;
              const isSelected = postType === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => {
                    setPostType(pt.id);
                    triggerDraftSave();
                  }}
                  className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-blue-600"}`} />
                  <span className="truncate leading-tight">{pt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* B. FOUNDERTV CREATOR STUDIO (6-TAB VIDEO EDITING ENGINE) */}
        {postType === "foundertv" ? (
          <div className="space-y-4">
            {/* WORKSPACE NAVIGATION TABS */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto border border-slate-200/60">
              {[
                { id: "upload", label: "🎥 Upload" },
                { id: "edit", label: "✂️ Edit" },
                { id: "details", label: "📝 Details" },
                { id: "thumbnail", label: "🖼 Thumbnail" },
                { id: "preview", label: "👀 Preview" },
                { id: "publish", label: "🚀 Publish" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: 🎥 UPLOAD */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-900">Step 1: Upload Video</div>

                <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center bg-blue-50/20 space-y-3">
                  {uploadStatus === "idle" ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Drop your FounderTV video file here</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">MP4 • MOV • WEBM (Max 2GB)</p>
                      </div>
                      <button
                        type="button"
                        onClick={startVideoUpload}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Choose Video File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 py-2 text-left">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-2">
                          <FileVideo className="w-4 h-4 text-blue-600" />
                          <span>foundertv_demo.mp4 ({fileSize})</span>
                        </span>
                        <span className="text-blue-600">{uploadProgress}%</span>
                      </div>

                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            uploadStatus === "paused" ? "bg-amber-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-slate-500 font-medium">
                          Res: <strong className="text-slate-900">{resolution}</strong> • Duration:{" "}
                          <strong className="text-slate-900">{videoDuration}</strong>
                        </span>
                        <div className="flex gap-2">
                          {uploadStatus === "uploading" ? (
                            <button
                              type="button"
                              onClick={pauseVideoUpload}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                            >
                              Pause
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={resumeVideoUpload}
                              className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 font-bold text-[10px]"
                            >
                              Resume
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={cancelVideoUpload}
                            className="px-2.5 py-1 rounded bg-rose-50 text-rose-600 font-bold text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    disabled={uploadStatus === "idle"}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Next: Edit Video</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ✂️ EDIT (LIGHTWEIGHT VIDEO EDITING ENGINE) */}
            {activeTab === "edit" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Step 2: Video Editing Engine</span>
                  <span className="text-[10px] text-blue-600 font-extrabold uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    CapCut Flow
                  </span>
                </div>

                {/* VIDEO DISPLAY SCENE */}
                <div className="h-44 w-full rounded-2xl bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-md">
                  <img
                    src={thumbnailUrl}
                    alt="Editing canvas"
                    className="w-full h-full object-cover opacity-75 transition-transform duration-300"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  />

                  {/* Text Overlay Render */}
                  {overlayText && (
                    <div
                      className={`absolute px-4 py-1.5 rounded-lg text-white font-extrabold text-xs shadow-lg backdrop-blur-xs ${
                        overlayPosition === "top"
                          ? "top-3"
                          : overlayPosition === "center"
                          ? "top-1/2 -translate-y-1/2"
                          : "bottom-3"
                      }`}
                      style={{ backgroundColor: overlayColor }}
                    >
                      {overlayText}
                    </div>
                  )}

                  {/* Watermark Logo Render */}
                  {watermarkEnabled && (
                    <div
                      className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md text-[9px] font-black text-slate-900 border border-white flex items-center gap-1"
                      style={{ opacity: watermarkOpacity / 100 }}
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      <span>{selectedStartup}</span>
                    </div>
                  )}

                  {/* Sticker Badge Render */}
                  {badgeSticker && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white border border-white/20 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                      {badgeSticker}
                    </div>
                  )}
                </div>

                {/* TIMELINE SCRUBBER */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>Trim Timeline</span>
                    <span>
                      {trimStart}% - {trimEnd}%
                    </span>
                  </div>
                  <div className="relative w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-blue-600 rounded-full"
                      style={{ left: `${trimStart}%`, width: `${trimEnd - trimStart}%` }}
                    />
                  </div>
                </div>

                {/* EDITING CONTROLS */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Rotate & Speed */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Rotation & Speed</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-100 flex items-center gap-1 text-xs"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> {rotationAngle}°
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className={`px-2.5 py-1 border rounded-lg font-bold flex items-center gap-1 text-xs ${
                          isMuted
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Playback Speed Picker */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Speed</span>
                    <div className="flex gap-1 overflow-x-auto">
                      {["0.5x", "1x", "1.25x", "1.5x", "2x"].map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setPlaybackSpeed(sp)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            playbackSpeed === sp
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TEXT OVERLAY & BRANDING */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Text Overlay</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add on-screen title text..."
                        value={overlayText}
                        onChange={(e) => setOverlayText(e.target.value)}
                        className="flex-1 p-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                      <select
                        value={overlayPosition}
                        onChange={(e) => setOverlayPosition(e.target.value as any)}
                        className="p-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white outline-none"
                      >
                        <option value="top">Top</option>
                        <option value="center">Center</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Watermark Toggle */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Startup Watermark</span>
                      <input
                        type="checkbox"
                        checked={watermarkEnabled}
                        onChange={(e) => setWatermarkEnabled(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </div>

                    {/* Sticker Badge */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Sticker Badge</span>
                      <select
                        value={badgeSticker}
                        onChange={(e) => setBadgeSticker(e.target.value)}
                        className="p-1 text-[10px] font-bold text-slate-800 bg-white border border-slate-200 rounded-lg outline-none"
                      >
                        <option value="🚀 Product Launch">🚀 Launch</option>
                        <option value="💼 Hiring">💼 Hiring</option>
                        <option value="💰 Funding">💰 Funding</option>
                        <option value="✔️ Verified Founder">✔️ Verified</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Next: Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: 📝 DETAILS */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Step 3: Video Details</span>
                  <button
                    type="button"
                    onClick={applySingleAICopilot}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg text-[11px] font-bold text-blue-700 transition"
                  >
                    ✨ Improve with AI
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Video Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Noventra Healthcare AI Demo"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Description</label>
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Describe what founders will learn in this video..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Category</label>
                      <select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 text-xs outline-none"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tags</label>
                      <input
                        type="text"
                        value={selectedTags.join(", ")}
                        onChange={(e) => setSelectedTags(e.target.value.split(",").map((s) => s.trim()))}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("thumbnail")}
                    disabled={!videoTitle.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Next: Thumbnail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: 🖼 THUMBNAIL */}
            {activeTab === "thumbnail" && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-900">Step 4: Choose Thumbnail</div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Custom Thumbnail URL</label>
                    <input
                      type="text"
                      placeholder="Paste Image URL"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Or Choose Frame</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { frame: "00:05", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80" },
                        { frame: "00:15", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80" },
                        { frame: "00:30", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
                      ].map((f) => (
                        <button
                          key={f.frame}
                          type="button"
                          onClick={() => {
                            setSelectedFrame(f.frame);
                            setThumbnailUrl(f.url);
                          }}
                          className={`p-1.5 rounded-xl border text-center transition ${
                            selectedFrame === f.frame
                              ? "border-blue-600 ring-2 ring-blue-600/30"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <img src={f.url} alt="" className="w-full h-16 object-cover rounded-lg" />
                          <span className="text-[10px] font-bold text-slate-700 block mt-1">○ {f.frame}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Next: Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: 👀 PREVIEW */}
            {activeTab === "preview" && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-900">Step 5: Live FounderTV Card Preview</div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-md">
                  <div className="h-40 w-full rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800">
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover opacity-80" />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {videoDuration}
                    </span>
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                      {videoCategory}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white leading-snug">
                      {videoTitle || "Untitled FounderTV Episode"}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {profileName[0]}
                        </div>
                        <span className="text-white font-bold">{profileName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span>• {selectedStartup}</span>
                      </div>
                      <span>0 views</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("thumbnail")}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("publish")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Next: Publish & Visibility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: 🚀 PUBLISH */}
            {activeTab === "publish" && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-900">Step 6: Ecosystem Visibility & Publish</div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Posting As</label>
                    <select
                      value={selectedStartup}
                      onChange={(e) => setSelectedStartup(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 text-xs outline-none"
                    >
                      <option value="Noventra Tech">Noventra Tech</option>
                      <option value="Personal Profile">Personal Profile</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Visibility</label>
                    <div className="space-y-1.5">
                      {[
                        { id: "public", label: "🌍 Public Ecosystem", desc: "Visible to all founders, investors & builders" },
                        { id: "followers", label: "👥 Followers Only", desc: "Only visible to your network followers" },
                        { id: "investors", label: "💰 Investors Only", desc: "Exclusive pitch visibility for accredited VCs & angels" },
                        { id: "team", label: "🏢 Startup Team", desc: "Internal video demo for team members" },
                        { id: "private", label: "🔒 Private Draft", desc: "Only visible to you" },
                      ].map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setAudience(v.id)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                            audience === v.id
                              ? "bg-blue-50 border-blue-600 text-blue-900"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs">{v.label}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{v.desc}</div>
                          </div>
                          {audience === v.id && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SCHEDULING */}
                  <div className="pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsScheduled(false)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          !isScheduled ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        Publish Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsScheduled(true)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          isScheduled ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        Schedule
                      </button>
                    </div>

                    {isScheduled && (
                      <div className="grid grid-cols-2 gap-2 pt-2 animate-fadeIn">
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="p-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white outline-none"
                        />
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="p-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center gap-1.5"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isScheduled ? "Schedule Video" : "Publish FounderTV Video"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD POST EDITOR FOR NON-FOUNDERTV CONTENT */
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Creator Content</span>
                <span className="text-slate-400 text-xs font-semibold">{content.length} chars</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 bg-white shadow-2xs">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1 overflow-x-auto">
                  <button onClick={() => insertFormatting("**")} className="p-1 rounded hover:bg-slate-200 text-slate-600" title="Bold">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting("*")} className="p-1 rounded hover:bg-slate-200 text-slate-600" title="Italic">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-200">|</span>
                  <button onClick={() => setContent((prev) => `${prev}\n• `)} className="p-1 rounded hover:bg-slate-200 text-slate-600" title="Bullet List">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setContent((prev) => `${prev}\n> `)} className="p-1 rounded hover:bg-slate-200 text-slate-600" title="Quote">
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting("`")} className="p-1 rounded hover:bg-slate-200 text-slate-600" title="Code">
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  ref={textareaRef}
                  rows={5}
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Share an update with the startup ecosystem... (Markdown supported)"
                  className="w-full p-3.5 text-xs font-medium text-slate-900 outline-none resize-none bg-transparent leading-relaxed placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                AI Assistant
              </span>
              <button
                type="button"
                onClick={applySingleAICopilot}
                className="px-3 py-1 rounded-lg bg-white border border-blue-200 hover:bg-blue-600 hover:text-white text-xs font-bold text-blue-700 transition shadow-2xs"
              >
                ✨ Improve with AI
              </button>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Image Attachment URL</label>
                <input
                  type="text"
                  placeholder="Paste Image URL"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs outline-none"
                  >
                    <option value="public">🌍 Public Ecosystem</option>
                    <option value="followers">👥 Followers Only</option>
                    <option value="investors">💰 Investors Only</option>
                    <option value="team">🏢 Startup Team</option>
                    <option value="private">🔒 Private Draft</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Posting As</label>
                  <select
                    value={selectedStartup}
                    onChange={(e) => setSelectedStartup(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs outline-none"
                  >
                    <option value="Noventra Tech">Noventra Tech</option>
                    <option value="Personal Profile">Personal Profile</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. FOOTER ACTIONS */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-semibold">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">Ctrl+Enter</kbd> to publish
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          {postType !== "foundertv" && (
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={submitting || !content.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Publish Post</span>
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
