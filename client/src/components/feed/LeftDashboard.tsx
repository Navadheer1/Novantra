"use client";

import { motion } from "framer-motion";
import { DBUser } from "@/lib/feedStore";
import { User, Sparkles, Building, Bookmark, FileText, BarChart3, Calendar, Trophy, Settings, ExternalLink, CheckCircle2 } from "lucide-react";
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
  
  // Calculate completion percentage based on bio, location, skills
  let completion = 50;
  if (dbUser?.bio) completion += 20;
  if (dbUser?.location) completion += 15;
  if (dbUser?.skills?.length) completion += 15;

  const navItems = [
    { label: "Saved Posts", icon: Bookmark, href: "/feed", count: "12" },
    { label: "Draft Posts", icon: FileText, href: "/feed", count: "2" },
    { label: "Startup Analytics", icon: BarChart3, href: "/dashboard", count: "Live" },
    { label: "My Meetings", icon: Calendar, href: "/meet", count: "2 today" },
    { label: "My Events", icon: Trophy, href: "/explore", count: "1 upcoming" },
    { label: "Account Settings", icon: Settings, href: "/settings", count: null },
  ];

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/30">
            Verified OS
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-5 relative -mt-10 pt-0 text-center">
          {/* Avatar with Status Ring */}
          <div className="relative inline-block mx-auto mb-3">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-md mx-auto">
              {avatarUrl ? (
                <img src={avatarUrl} alt={profileName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-extrabold text-2xl text-blue-600 bg-blue-50">
                  {profileName[0]}
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-slate-100" />
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h3 className="font-extrabold text-slate-900 text-base">{profileName}</h3>
            <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
          </div>

          <div className="mt-1">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              {profileRole}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5 line-clamp-2">
            {dbUser?.bio || "Building high-growth technology startups on Noventra Ecosystem."}
          </p>

          {/* Current Startup Badge */}
          <div className="mt-3.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-700">Noventra Tech</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-slate-50/80">
              <div className="text-sm font-extrabold text-slate-900">142</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Followers</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50/80">
              <div className="text-sm font-extrabold text-slate-900">89</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connections</div>
            </div>
          </div>

          {/* Profile Strength Progress Bar */}
          <div className="mt-4 text-left">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Profile Strength
              </span>
              <span className="text-blue-600">{completion}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 space-y-2">
            <button
              onClick={() => router.push(dbUser?.id ? `/profile/${dbUser.id}` : "/onboarding")}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <User className="w-3.5 h-3.5" /> View Profile Studio
            </button>
          </div>
        </div>
      </motion.div>

      {/* Profile Command Menu */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-bold text-xs transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.count && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
