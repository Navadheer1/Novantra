"use client";

import React, { useState } from "react";
import { Eye, Smartphone, Monitor, Globe, Lock, ShieldCheck } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSnapshot from "@/components/profile/ProfileSnapshot";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileInvestorView from "@/components/profile/ProfileInvestorView";
import ProfileFounderView from "@/components/profile/ProfileFounderView";
import ProfileDeveloperView from "@/components/profile/ProfileDeveloperView";
import ProfileMentorView from "@/components/profile/ProfileMentorView";

interface LivePreviewProps {
  data: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    role: string;
    headline: string;
    avatarUrl: string | null;
    coverUrl?: string | null;
    bannerGradient?: string;
    location: string | null;
    bio: string | null;
    openToInvest: boolean;
    ticketSize: string;
    skills: string[];
    portfolioCount: number;
    followersCount: number;
    followingCount: number;
    // Startup fields
    startupName?: string;
    startupStage?: string;
    startupRaised?: string;
    startupTagline?: string;
    // Developer fields
    primaryStack?: string;
    githubHandle?: string;
    // Mentor fields
    sessionRate?: string;
  };
}

export default function ProfileLivePreview({ data }: LivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  const primaryRole = (data.role || "FOUNDER").toUpperCase();
  const displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.name || "Your Name";
  const userHandle = data.username ? `@${data.username}` : "noventra.io";

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-[20px] shadow-sm overflow-hidden flex flex-col sticky top-20">
      
      {/* Top Header Bar */}
      <div className="p-3 px-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blue-600" /> Live Profile Preview
          </h3>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
              deviceMode === "desktop" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
            title="Desktop PC View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
              deviceMode === "mobile" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
            title="Mobile Phone View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Embedded Live Device Canvas */}
      <div className="p-3 sm:p-4 bg-slate-100/70 overflow-y-auto max-h-[calc(100vh-140px)] flex justify-center">
        
        {deviceMode === "desktop" ? (
          /* Desktop Browser Frame */
          <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden transition-all duration-300">
            {/* Browser Mockup Top Controls */}
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 bg-white border border-slate-200/80 rounded-md px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 flex items-center gap-1.5 truncate">
                <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">noventra.io/{userHandle}</span>
              </div>
            </div>

            {/* Desktop Canvas Body */}
            <div className="p-3 sm:p-4 space-y-4 text-left">
              <ProfileHeader
                profile={{
                  id: data.id,
                  name: displayName,
                  role: data.role || "FOUNDER",
                  headline: data.headline || data.bio || undefined,
                  avatarUrl: data.avatarUrl,
                  coverUrl: data.coverUrl,
                  bannerGradient: data.bannerGradient,
                  location: data.location,
                  openToInvest: data.openToInvest,
                }}
                isOwnProfile={true}
                isPreview={true}
                onFollow={() => {}}
                onEdit={() => {}}
                onScheduleMeeting={() => {}}
              />

              <ProfileSnapshot
                role={data.role || "FOUNDER"}
                data={{
                  checkSize: data.ticketSize || "$50k - $250k",
                  portfolioCount: data.portfolioCount || 12,
                  openToInvest: data.openToInvest,
                  location: data.location || "San Francisco, CA",
                  startupName: data.startupName || "Acme Startup",
                  startupStage: data.startupStage || "Seed Stage",
                  primaryStack: data.primaryStack || "TypeScript, React, Node",
                  sessionRate: data.sessionRate || "Free 30m",
                }}
              />

              <ProfileStats
                stats={{
                  followers: data.followersCount || 142,
                  following: data.followingCount || 89,
                  postsCount: 4,
                  role: data.role || "FOUNDER",
                }}
              />

              {primaryRole === "INVESTOR" && (
                <ProfileInvestorView
                  profile={{
                    bio: data.bio,
                    acceptingPitches: data.openToInvest,
                    preferences: {
                      stages: ["Pre-Seed", "Seed"],
                      geography: data.location || "North America",
                      checkSize: data.ticketSize || "$50k - $250k",
                      leadRole: "Leads or Co-Leads",
                      coInvest: true
                    }
                  }}
                />
              )}

              {primaryRole === "FOUNDER" && (
                <ProfileFounderView
                  profile={{
                    bio: data.bio,
                    startup: {
                      id: "preview-s1",
                      name: data.startupName || "Noventra Core",
                      tagline: data.startupTagline || "Building the future of startup ecosystems.",
                      stage: data.startupStage || "Seed Stage",
                      raised: data.startupRaised || "$1.2M Raised",
                    }
                  }}
                />
              )}

              {primaryRole === "DEVELOPER" && (
                <ProfileDeveloperView
                  profile={{
                    bio: data.bio,
                    githubHandle: data.githubHandle || "octocat",
                  }}
                />
              )}

              {primaryRole === "MENTOR" && (
                <ProfileMentorView
                  profile={{
                    bio: data.bio,
                    hourlyRate: data.sessionRate || "Free 30m Session"
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          /* Mobile Phone Frame */
          <div className="w-[320px] sm:w-[340px] border-[7px] border-slate-800 rounded-[38px] bg-white shadow-2xl p-1.5 overflow-hidden transition-all duration-300">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Mobile Canvas Body */}
            <div className="space-y-3 text-left max-h-[520px] overflow-y-auto px-1">
              <ProfileHeader
                profile={{
                  id: data.id,
                  name: displayName,
                  role: data.role || "FOUNDER",
                  headline: data.headline || data.bio || undefined,
                  avatarUrl: data.avatarUrl,
                  coverUrl: data.coverUrl,
                  bannerGradient: data.bannerGradient,
                  location: data.location,
                  openToInvest: data.openToInvest,
                }}
                isOwnProfile={true}
                isPreview={true}
                onFollow={() => {}}
                onEdit={() => {}}
                onScheduleMeeting={() => {}}
              />

              <ProfileSnapshot
                role={data.role || "FOUNDER"}
                data={{
                  checkSize: data.ticketSize || "$50k - $250k",
                  portfolioCount: data.portfolioCount || 12,
                  openToInvest: data.openToInvest,
                  location: data.location || "San Francisco, CA",
                  startupName: data.startupName || "Acme Startup",
                  startupStage: data.startupStage || "Seed Stage",
                  primaryStack: data.primaryStack || "TypeScript, React, Node",
                  sessionRate: data.sessionRate || "Free 30m",
                }}
              />

              <ProfileStats
                stats={{
                  followers: data.followersCount || 142,
                  following: data.followingCount || 89,
                  postsCount: 4,
                  role: data.role || "FOUNDER",
                }}
              />

              {primaryRole === "INVESTOR" && (
                <ProfileInvestorView
                  profile={{
                    bio: data.bio,
                    acceptingPitches: data.openToInvest,
                    preferences: {
                      stages: ["Pre-Seed", "Seed"],
                      geography: data.location || "North America",
                      checkSize: data.ticketSize || "$50k - $250k",
                      leadRole: "Leads or Co-Leads",
                      coInvest: true
                    }
                  }}
                />
              )}

              {primaryRole === "FOUNDER" && (
                <ProfileFounderView
                  profile={{
                    bio: data.bio,
                    startup: {
                      id: "preview-s1",
                      name: data.startupName || "Noventra Core",
                      tagline: data.startupTagline || "Building the future of startup ecosystems.",
                      stage: data.startupStage || "Seed Stage",
                      raised: data.startupRaised || "$1.2M Raised",
                    }
                  }}
                />
              )}

              {primaryRole === "DEVELOPER" && (
                <ProfileDeveloperView
                  profile={{
                    bio: data.bio,
                    githubHandle: data.githubHandle || "octocat",
                  }}
                />
              )}

              {primaryRole === "MENTOR" && (
                <ProfileMentorView
                  profile={{
                    bio: data.bio,
                    hourlyRate: data.sessionRate || "Free 30m Session"
                  }}
                />
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
