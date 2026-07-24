"use client";

import React, { useState } from "react";
import Link from "next/link";
import StudioLayout from "@/components/studio/StudioLayout";
import {
  Film,
  UploadCloud,
  Plus,
  Search,
  CheckCircle2,
  Globe,
  Users,
  Lock,
  Building,
  DollarSign,
  Send,
  Eye,
  ThumbsUp,
  MessageSquare,
  MoreVertical,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  FileVideo,
} from "lucide-react";
import { mockVideos } from "@/components/explore/discovery/mockDiscoveryData";

export default function StudioContentPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Video Upload Form State
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoCategory, setVideoCategory] = useState("Product Demo");
  const [startupName, setStartupName] = useState("Noventra Tech");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"
  );
  const [visibility, setVisibility] = useState("public");
  const [distribution, setDistribution] = useState<Record<string, boolean>>({
    foundertv: true,
    explore: true,
    startupProfile: true,
    founderProfile: true,
    investorDiscovery: true,
  });

  const toggleDistribution = (key: string) => {
    setDistribution((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Video "${videoTitle}" published successfully to FounderTV!`);
    setShowUploadModal(false);
    setFileSelected(false);
    setVideoTitle("");
    setVideoDescription("");
  };

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Content Library</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage your FounderTV videos, product demos, pitch videos, and publishing settings.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2 w-max"
          >
            <Plus className="w-4 h-4" /> Upload Video
          </button>
        </div>

        {/* UPLOAD FORM / MODAL CONTAINER */}
        {showUploadModal && (
          <div className="p-6 bg-white rounded-3xl border-2 border-blue-200 shadow-md space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-base text-slate-900">Upload & Publish FounderTV Video</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-xs text-slate-400 font-bold hover:text-slate-900"
              >
                Close
              </button>
            </div>

            {!fileSelected ? (
              <div className="p-10 text-center border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/30 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Drag & Drop your video file here</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Supports MP4, MOV, WEBM (Maximum Size 2GB)</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileSelected(true);
                    setFileName("noventra_demo_v2.mp4");
                    setVideoTitle("Noventra 2.0: Multi-Region Healthcare AI Architecture Walkthrough");
                  }}
                  className="px-5 py-2 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition"
                >
                  Choose Video File
                </button>
              </div>
            ) : (
              <form onSubmit={handlePublish} className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex justify-between items-center">
                  <span>File Selected: <strong>{fileName}</strong> (45.2 MB • 1080p 60fps)</span>
                  <button type="button" onClick={() => setFileSelected(false)} className="text-xs text-emerald-700 underline font-bold">Change</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Video Title</label>
                      <input
                        type="text"
                        required
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Explain your product demo, technology stack, or founder journey..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Category</label>
                        <select
                          value={videoCategory}
                          onChange={(e) => setVideoCategory(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none"
                        >
                          {[
                            "Startup Story",
                            "Product Demo",
                            "Founder Journey",
                            "Technology",
                            "Hiring",
                            "Educational",
                            "Portfolio Showcase",
                            "Investor Pitch",
                          ].map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Attached Startup</label>
                        <input
                          type="text"
                          value={startupName}
                          onChange={(e) => setStartupName(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Thumbnail Image URL</label>
                      <input
                        type="text"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ecosystem Visibility</label>
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 outline-none"
                      >
                        <option value="public">🌍 Public Ecosystem</option>
                        <option value="followers">👥 Followers Only</option>
                        <option value="investors">💰 Investors Only (Exclusive Pitch)</option>
                        <option value="private">🔒 Private Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Auto Cross-Post Distribution</label>
                      <div className="grid grid-cols-2 gap-2 font-bold text-[11px] text-slate-700">
                        {[
                          { key: "foundertv", label: "FounderTV" },
                          { key: "explore", label: "Explore Feed" },
                          { key: "startupProfile", label: "Startup Profile" },
                          { key: "founderProfile", label: "Founder Profile" },
                          { key: "investorDiscovery", label: "Investor Discovery" },
                        ].map((dist) => (
                          <label key={dist.key} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!distribution[dist.key]}
                              onChange={() => toggleDistribution(dist.key)}
                              className="w-3.5 h-3.5 text-blue-600 rounded"
                            />
                            <span>{dist.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-extrabold shadow-sm hover:bg-blue-700 transition"
                  >
                    Publish Video Now
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* CONTENT LIBRARY TABLE CONTAINER */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              {["all", "product_demo", "investor_pitch", "drafts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-3 font-extrabold">Video</th>
                  <th className="pb-3 font-extrabold">Visibility</th>
                  <th className="pb-3 font-extrabold">Views</th>
                  <th className="pb-3 font-extrabold">Likes</th>
                  <th className="pb-3 font-extrabold">Comments</th>
                  <th className="pb-3 font-extrabold">Date</th>
                  <th className="pb-3 font-extrabold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {mockVideos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 pr-3">
                      <Link href={`/studio/videos/${vid.id}`} className="flex items-center gap-3 group">
                        <img src={vid.thumbnailUrl} alt="" className="w-14 h-9 rounded-lg object-cover border shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                            {vid.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {(vid as any).category || vid.categoryId || "Product Demo"} • Noventra Tech
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <Globe className="w-3 h-3" /> Public
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">{vid.views.toLocaleString()}</td>
                    <td className="py-3 font-bold text-slate-900">{vid.likesCount.toLocaleString()}</td>
                    <td className="py-3 font-bold text-slate-900">{vid.commentsCount}</td>
                    <td className="py-3 text-[11px] text-slate-400 font-semibold">Jul 22, 2026</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/studio/videos/${vid.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Analytics"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </StudioLayout>
  );
}
