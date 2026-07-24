"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudioLayout from "@/components/studio/StudioLayout";
import {
  Eye,
  Clock,
  Users,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Briefcase,
  TrendingUp,
  ArrowLeft,
  Globe,
  PieChart,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import { mockVideos } from "@/components/explore/discovery/mockDiscoveryData";

export default function StudioVideoDetailPage() {
  const params = useParams();
  const videoId = params?.id as string;
  const video = mockVideos.find((v) => v.id === videoId) || mockVideos[0];

  const metrics = [
    { label: "Total Views", value: video.views.toLocaleString(), change: "+24%", icon: Eye, color: "text-blue-600 bg-blue-50" },
    { label: "Unique Viewers", value: "8,450", change: "+19%", icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Avg Watch Duration", value: "03:42 (68%)", change: "+12%", icon: Clock, color: "text-purple-600 bg-purple-50" },
    { label: "Investor Views", value: "142 VCs", change: "+35%", icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
    { label: "Likes & Engagement", value: video.likesCount.toLocaleString(), change: "+15%", icon: ThumbsUp, color: "text-amber-600 bg-amber-50" },
    { label: "Saves & Shares", value: `${(video as any).sharesCount || 142} / ${(video as any).savesCount || 280}`, change: "+28%", icon: Share2, color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* TOP BACK LINK & TITLE */}
        <div className="space-y-2">
          <Link
            href="/studio/content"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Content Library
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <img src={video.thumbnailUrl} alt="" className="w-20 h-12 rounded-xl object-cover border shrink-0" />
              <div>
                <h1 className="text-base font-black text-slate-900 line-clamp-1">{video.title}</h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Published on Jul 22, 2026 • Category: {(video as any).category || video.categoryId || "Product Demo"}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-max">
              Public Ecosystem
            </span>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-base font-black text-slate-900">{m.value}</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{m.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AUDIENCE BREAKDOWN & RETENTION GRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* AUDIENCE ECOSYSTEM SPLIT (Col-span 6) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" /> Viewer Ecosystem Split
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Demographics of users watching this video</p>
            </div>

            <div className="space-y-3">
              {[
                { type: "Investors & VCs", pct: 18, count: "2,241 views", color: "bg-indigo-600" },
                { type: "Startup Founders", pct: 32, count: "3,984 views", color: "bg-blue-600" },
                { type: "General Ecosystem & Engineers", pct: 50, count: "6,225 views", color: "bg-slate-400" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-800 font-bold">{item.type}</span>
                    <span className="text-slate-500 font-mono">{item.pct}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AUDIENCE GEOGRAPHY (Col-span 6) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" /> Top Viewer Regions
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Geographic distribution of watch time</p>
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              {[
                { country: "India (Bengaluru, Mumbai, Delhi)", pct: "42%" },
                { country: "United States (San Francisco, NY)", pct: "28%" },
                { country: "United Kingdom (London)", pct: "14%" },
                { country: "Singapore & SEA", pct: "16%" },
              ].map((c, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
                  <span className="font-bold text-slate-800">{c.country}</span>
                  <span className="font-extrabold text-blue-600">{c.pct} of views</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </StudioLayout>
  );
}
