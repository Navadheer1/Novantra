"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  Film,
  BarChart3,
  Users,
  Briefcase,
  DollarSign,
  MessageSquare,
  Settings,
  Plus,
  Upload,
  Video,
  CheckCircle2,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowUpRight,
  Search,
} from "lucide-react";

interface StudioLayoutProps {
  children: React.ReactNode;
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Overview", href: "/studio", icon: LayoutDashboard },
    { name: "Content", href: "/studio/content", icon: Film },
    { name: "Analytics", href: "/studio/analytics", icon: BarChart3 },
    { name: "Audience", href: "/studio/audience", icon: Users },
    { name: "Opportunities", href: "/studio/opportunities", icon: Briefcase, badge: "4" },
    { name: "Revenue", href: "/studio/revenue", icon: DollarSign },
    { name: "Messages", href: "/studio/messages", icon: MessageSquare },
    { name: "Settings", href: "/studio/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      <Navbar />

      {/* STUDIO SUB-HEADER BAR */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-[64px] z-30 shadow-2xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900">FounderTV Studio</h1>
                <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">
                  Creator Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Publishing, Analytics, & Investor Connections for Founders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio/content?upload=true"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Upload Video
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN DASHBOARD WORKSPACE */}
      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col lg:flex-row items-start">
        
        {/* LEFT SIDEBAR NAVIGATION (240px) */}
        <aside className="w-full lg:w-60 bg-white border-r border-slate-200/80 p-4 space-y-1 shrink-0 lg:sticky lg:top-[128px] lg:h-[calc(100vh-128px)] overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Studio Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/studio" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 px-3">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/60 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Founder Growth AI</span>
              </div>
              <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                Your pitch demo has high investor retention (+42% VC watch rate).
              </p>
              <Link
                href="/studio/analytics"
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 mt-1"
              >
                View AI Insights <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN PAGE CONTENT CANVAS */}
        <main className="flex-1 min-w-0 p-6 w-full space-y-6">{children}</main>

      </div>
    </div>
  );
}
