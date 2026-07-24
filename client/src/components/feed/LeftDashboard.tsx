"use client";

import { motion } from "framer-motion";
import { DBUser } from "@/lib/feedStore";
import {
  User,
  Sparkles,
  Building,
  Bookmark,
  FileText,
  BarChart3,
  Calendar,
  Trophy,
  Settings,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LeftDashboardProps {
  dbUser: DBUser | null;
  clerkUser: any;
}

export default function LeftDashboard({ dbUser, clerkUser }: LeftDashboardProps) {
  const router = useRouter();

  const profileName = dbUser?.name || clerkUser?.fullName || "Founder";
  const profileRole = dbUser?.role || "FOUNDER";
  const avatarUrl = dbUser?.avatarUrl || clerkUser?.imageUrl;

  // Calculate completion percentage
  let completion = 50;
  if (dbUser?.bio) completion += 20;
  if (dbUser?.location) completion += 15;
  if (dbUser?.skills?.length) completion += 15;

  const quickAccessItems = [
    { label: "Saved Posts", icon: Bookmark, href: "/feed", count: "12" },
    { label: "Draft Posts", icon: FileText, href: "/feed", count: "2" },
    { label: "Startup Analytics", icon: BarChart3, href: "/dashboard", count: "Live" },
    { label: "My Meetings", icon: Calendar, href: "/meet", count: "2 today" },
    { label: "My Events", icon: Trophy, href: "/explore", count: "1 upcoming" },
    { label: "Settings", icon: Settings, href: "/settings", count: null },
  ];

  return (
    <div className="space-y-5 select-none">
      {/* 1. Compact Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3"
      >
        {/* User Identity Header */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={profileName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-extrabold text-lg text-blue-600 bg-blue-50">
                  {profileName[0]}
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className="font-bold text-slate-900 text-sm truncate">{profileName}</h3>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50 shrink-0" />
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.2 rounded-md">
                {profileRole}
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate">• Noventra Tech</span>
            </div>
          </div>
        </div>

        {/* Micro Stats & Profile Strength */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-bold text-slate-900">142</span> <span className="text-slate-400">Followers</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-slate-900">89</span> <span className="text-slate-400">Connections</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-blue-600 font-extrabold bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-100">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{completion}%</span>
          </div>
        </div>

        {/* View Profile Action */}
        <button
          onClick={() => router.push(dbUser?.id ? `/profile/${dbUser.id}` : "/onboarding")}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <User className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>
      </motion.div>

      {/* 2. Uncarded Quick Access Section */}
      <div className="px-2 space-y-1">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Quick Access
        </div>

        {quickAccessItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold text-xs transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.count ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {item.count}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

