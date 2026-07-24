"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  Clock,
  Users,
  DollarSign,
  Briefcase,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  Plus,
  FileVideo,
} from "lucide-react";
import { mockVideos } from "@/components/explore/discovery/mockDiscoveryData";

export default function StudioOverviewContent() {
  const metrics = [
    { label: "Total Views", value: "1.2M", change: "+18%", positive: true, icon: Eye, color: "text-blue-600 bg-blue-50" },
    { label: "Watch Time", value: "48,200 hrs", change: "+24%", positive: true, icon: Clock, color: "text-purple-600 bg-purple-50" },
    { label: "Followers", value: "12,450", change: "+12%", positive: true, icon: Users, color: "text-emerald-600 bg-emerald-50" },
    { label: "Revenue Generated", value: "₹42,500", change: "+35%", positive: true, icon: DollarSign, color: "text-amber-600 bg-amber-50" },
    { label: "Investor Views", value: "350 VCs", change: "+42%", positive: true, icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
    { label: "Connection Requests", value: "14 Pending", change: "+8", positive: true, icon: MessageSquare, color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      
      {/* HEADER WELCOME */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Welcome back! Here is your FounderTV channel performance and investor connection activity.
          </p>
        </div>

        <Link
          href="/studio/content?upload=true"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2 w-max shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload New Video
        </Link>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{m.label}</span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${m.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900">{m.value}</div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>{m.change} vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT VIDEOS TABLE & PERFORMANCE GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECENT VIDEOS (Col-span 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-blue-600" /> Recent Published Content
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Top performing FounderTV videos & demos</p>
            </div>

            <Link href="/studio/content" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TABLE CONTAINER WITH NO OVERFLOW */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-3 px-3 font-extrabold text-left">Video</th>
                  <th className="pb-3 px-3 font-extrabold text-center">Views</th>
                  <th className="pb-3 px-3 font-extrabold text-center">Likes</th>
                  <th className="pb-3 px-3 font-extrabold text-center">VC Interest</th>
                  <th className="pb-3 px-3 font-extrabold text-right">Revenue</th>
                  <th className="pb-3 px-3 font-extrabold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {mockVideos.slice(0, 4).map((vid, idx) => (
                  <tr key={vid.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <Link href={`/studio/videos/${vid.id}`} className="flex items-center gap-3 group max-w-[220px]">
                        <img src={vid.thumbnailUrl} alt="" className="w-12 h-8 rounded-lg object-cover border shrink-0" />
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                          {vid.title}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{vid.views.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{vid.likesCount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block">
                        {idx === 0 ? "42 VCs" : idx === 1 ? "18 VCs" : "8 VCs"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">₹{(idx + 1) * 8500}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 inline-block">
                        Published
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OPPORTUNITY QUICK INBOX (Col-span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Investor Opportunities
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Pending connection & pitch requests</p>
            </div>

            <Link href="/studio/opportunities" className="text-xs font-bold text-blue-600 hover:underline">
              See All
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: "Sarah Chen", firm: "Sequoia Capital", interest: "Healthcare AI", video: "Noventra Healthcare AI Demo" },
              { name: "Michael Vance", firm: "Accel Partners", interest: "Developer Tools", video: "Real-Time Sync Infrastructure" },
            ].map((req, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{req.name}</h4>
                    <p className="text-[10px] text-indigo-600 font-bold">{req.firm}</p>
                  </div>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-extrabold border border-indigo-100">
                    Pitch Request
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  Ref: <span className="font-bold text-slate-700">{req.video}</span>
                </p>
                <div className="flex gap-2 pt-1">
                  <Link
                    href="/studio/opportunities"
                    className="flex-1 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-[11px] text-center hover:bg-blue-700 transition"
                  >
                    Accept & Meet
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
