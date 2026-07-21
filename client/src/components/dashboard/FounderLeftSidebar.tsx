"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  User,
  BarChart3,
  Bookmark,
  Heart,
  FileText,
  Video,
  Building2,
  FolderGit2,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles
} from "lucide-react";

interface DBUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string | null;
  bio: string | null;
}

interface Stats {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  totalStartups: number;
}

interface Props {
  user: DBUser | null;
  clerkUser: any;
  stats: Stats;
  primaryStartupName?: string;
}

export default function FounderLeftSidebar({
  user,
  clerkUser,
  stats,
  primaryStartupName = "Noventra Core"
}: Props) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await signOut();
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  const displayName = clerkUser?.fullName || user?.name || "Founder";
  const avatarUrl = user?.avatarUrl || clerkUser?.imageUrl;

  const quickNavItems = [
    { label: "Profile Studio", href: "/settings/profile", icon: Sparkles, badge: "PRO" },
    { label: "Analytics", href: "#analytics", icon: BarChart3 },
    { label: "Saved Posts", href: "/settings?tab=content&filter=saved", icon: Bookmark },
    { label: "Liked Posts", href: "/settings?tab=content&filter=liked", icon: Heart },
    { label: "Draft Posts", href: "/settings?tab=content&filter=drafts", icon: FileText },
    { label: "My Meetings", href: "/settings?tab=meetings", icon: Video },
    { label: "Startup Analytics", href: "#startup-analytics", icon: Building2 },
    { label: "Documents", href: "#documents", icon: FolderGit2 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="w-full lg:w-72 shrink-0 space-y-6">
      {/* 1. Founder Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] shadow-xs overflow-hidden transition-all hover:border-slate-300">
        {/* Cover Image Banner */}
        <div className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        </div>

        {/* Avatar & Header Details */}
        <div className="px-5 pt-0 pb-5 relative">
          <div className="flex justify-between items-end -mt-10 mb-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-100 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl rounded-xl">
                    {displayName[0]}
                  </div>
                )}
              </div>
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-500/20 animate-pulse" />
            </div>

            <span className="text-[10px] font-black tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> Founder
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-base leading-tight flex items-center gap-1.5">
              {displayName}
              <ShieldCheck className="w-4 h-4 text-blue-600 inline shrink-0" />
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">{primaryStartupName}</p>
          </div>

          {/* Profile Completion Circle */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-600">Profile Strength</span>
              <span className="text-blue-600 font-extrabold">92%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[92%]" />
            </div>
          </div>

          {/* Followers / Stats Bar */}
          <div className="grid grid-cols-4 gap-1 mt-4 pt-3 border-t border-slate-100 text-center">
            <div>
              <p className="text-sm font-black text-slate-900">{stats.followersCount || 142}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Followers</p>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{stats.followingCount || 89}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Connects</p>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{stats.postsCount || 18}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Posts</p>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{stats.totalStartups || 1}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Startups</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Navigation Card */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-4 shadow-xs space-y-1">
        <h4 className="px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
          Navigation Studio
        </h4>

        {quickNavItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ItemIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-2 border-t border-slate-100 mt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
