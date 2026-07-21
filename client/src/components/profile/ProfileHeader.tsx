"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, MapPin, UserPlus, UserCheck, 
  MessageSquare, Calendar, Edit3, Send, Sparkles, Briefcase, Building2, Code2, Users
} from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    id: string;
    name: string;
    role: string;
    headline?: string;
    avatarUrl: string | null;
    coverUrl?: string | null;
    bannerGradient?: string;
    location: string | null;
    availabilityStatus?: string;
    isFollowing?: boolean;
    isMutual?: boolean;
    openToInvest?: boolean;
  };
  isOwnProfile: boolean;
  isPreview?: boolean;
  onFollow: () => void;
  onEdit: () => void;
  onScheduleMeeting: () => void;
  onPitchInvestor?: () => void;
}

export default function ProfileHeader({
  profile,
  isOwnProfile,
  isPreview = false,
  onFollow,
  onEdit,
  onScheduleMeeting,
  onPitchInvestor,
}: ProfileHeaderProps) {
  const getRoleBadgeStyle = (role: string) => {
    switch (role.toUpperCase()) {
      case "INVESTOR":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: Briefcase };
      case "FOUNDER":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200/60", icon: Building2 };
      case "DEVELOPER":
        return { bg: "bg-sky-50 text-sky-700 border-sky-200/60", icon: Code2 };
      case "MENTOR":
        return { bg: "bg-purple-50 text-purple-700 border-purple-200/60", icon: Users };
      default:
        return { bg: "bg-slate-50 text-slate-700 border-slate-200", icon: Sparkles };
    }
  };

  const badgeConfig = getRoleBadgeStyle(profile.role);
  const RoleIcon = badgeConfig.icon;

  const getAvailabilityBadge = () => {
    if (profile.availabilityStatus) return profile.availabilityStatus;
    switch (profile.role.toUpperCase()) {
      case "INVESTOR":
        return profile.openToInvest !== false ? "Accepting Pitches" : "Portfolio Focused";
      case "FOUNDER":
        return "Raising Seed Round";
      case "DEVELOPER":
        return "Open to Co-Founder Roles";
      case "MENTOR":
        return "Open for 1:1 Mentorship";
      default:
        return "Active Ecosystem Member";
    }
  };

  const gradientClass = profile.bannerGradient || "from-blue-600 via-indigo-600 to-sky-500";

  return (
    <div className="bg-white border border-slate-100 rounded-[20px] shadow-sm overflow-hidden mb-6">
      {/* Animated Cover Banner */}
      <div className={`h-36 ${isPreview ? 'sm:h-40' : 'sm:h-52'} bg-gradient-to-r ${gradientClass} relative overflow-hidden`}>
        {profile.coverUrl && (
          <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        )}
        {!profile.coverUrl && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-40"></div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-400/20 rounded-full blur-2xl pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Profile Info Row */}
      <div className={`${isPreview ? 'px-4 sm:px-5 pb-5' : 'px-6 sm:px-8 pb-6'} relative bg-white flex flex-col ${isPreview ? 'items-start' : 'md:flex-row items-center md:items-start justify-between'} gap-4 sm:gap-6`}>
        
        {/* Avatar & Identifiers */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          
          {/* Avatar Container with Negative Top Margin */}
          <div className="relative group shrink-0 -mt-16 sm:-mt-20">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-[24px] border-4 border-white bg-slate-100 overflow-hidden shadow-md">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-4xl text-blue-600 bg-blue-50">
                  {profile.name[0]}
                </div>
              )}
            </div>
            {/* Live Indicator */}
            <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm" title="Active in Ecosystem" />
          </div>

          {/* Details Column sitting cleanly on White Background */}
          <div className="space-y-1.5 pt-2 sm:pt-3">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {profile.name}
              </h1>
              <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-600/10 shrink-0" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg">
              {profile.headline || `${profile.role.charAt(0) + profile.role.slice(1).toLowerCase()} driving innovation on Noventra.`}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
              {/* Role Badge */}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badgeConfig.bg}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{profile.role}</span>
              </span>

              {/* Availability Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{getAvailabilityBadge()}</span>
              </span>

              {/* Location */}
              {profile.location && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium ml-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons sitting cleanly on White Background */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto shrink-0 pt-2 sm:pt-3">
          {isOwnProfile ? (
            <Button
              onClick={onEdit}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl px-5 h-10 shadow-sm flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <>
              {/* Connect / Follow */}
              <Button
                onClick={onFollow}
                className={`font-semibold text-xs rounded-xl px-5 h-10 shadow-sm flex items-center gap-2 transition-all ${
                  profile.isFollowing
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {profile.isFollowing ? <UserCheck className="w-4 h-4 text-blue-600" /> : <UserPlus className="w-4 h-4" />}
                <span>{profile.isFollowing ? "Following" : "Connect"}</span>
              </Button>

              {/* Message */}
              <Link href="/messages">
                <Button
                  variant="outline"
                  className="border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl px-4 h-10 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Message</span>
                </Button>
              </Link>

              {/* Schedule Meeting */}
              <Button
                onClick={onScheduleMeeting}
                variant="outline"
                className="border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl px-4 h-10 flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>Schedule 1:1</span>
              </Button>

              {/* Pitch Button if Investor */}
              {profile.role.toUpperCase() === "INVESTOR" && onPitchInvestor && (
                <Button
                  onClick={onPitchInvestor}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl px-4 h-10 shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Pitch</span>
                </Button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
