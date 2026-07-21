"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Sub-components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSnapshot from "@/components/profile/ProfileSnapshot";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileInvestorView from "@/components/profile/ProfileInvestorView";
import ProfileFounderView from "@/components/profile/ProfileFounderView";
import ProfileDeveloperView from "@/components/profile/ProfileDeveloperView";
import ProfileMentorView from "@/components/profile/ProfileMentorView";
import ProfileActivity from "@/components/profile/ProfileActivity";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ScheduleMeetingModal from "@/components/profile/ScheduleMeetingModal";
import PitchInvestorModal from "@/components/profile/PitchInvestorModal";

interface ProfileUser {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  location: string | null;
  openToInvest: boolean;
  ticketSize: string | null;
  investmentInterests: string[];
  portfolioCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isMutual: boolean;
  startups: any[];
  posts: any[];
}

export default function ProfilePage() {
  const { id: profileId } = useParams() as { id: string };
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    if (clerkLoaded && profileId) {
      loadProfileData();
    }
  }, [clerkLoaded, profileId, clerkUser?.id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      if (clerkUser?.id) {
        const meRes = await fetch(`${apiUrl}/api/users/clerk/${clerkUser.id}`);
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUserId(meData.id);
        }
      }

      const res = await fetch(`${apiUrl}/api/users/profile/${profileId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;
    try {
      const token = await getToken();
      const res = await fetch(`${getApiUrl()}/api/users/${profile.id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: data.followed,
                followersCount: data.followed
                  ? prev.followersCount + 1
                  : Math.max(0, prev.followersCount - 1),
              }
            : null
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-semibold text-sm">Retrieving Noventra ecosystem profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-400">
            404
          </div>
          <h2 className="text-2xl font-black text-slate-900">Profile Not Found</h2>
          <p className="text-slate-500 text-sm max-w-md">
            The profile you are trying to view does not exist or may have been removed.
          </p>
          <Link href="/feed">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-6 py-2.5 shadow-sm">
              Return to Feed
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === profile.id;
  const userRole = (profile.role || "USER").toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* 1. Profile Header */}
        <ProfileHeader
          profile={{
            id: profile.id,
            name: profile.name,
            role: profile.role || "Ecosystem Member",
            headline: profile.bio || undefined,
            avatarUrl: profile.avatarUrl,
            location: profile.location,
            isFollowing: profile.isFollowing,
            isMutual: profile.isMutual,
            openToInvest: profile.openToInvest,
          }}
          isOwnProfile={isOwnProfile}
          onFollow={handleFollow}
          onEdit={() => router.push("/settings/profile")}
          onScheduleMeeting={() => setIsMeetingOpen(true)}
          onPitchInvestor={() => setIsPitchOpen(true)}
        />

        {/* 2. Role Snapshot Card */}
        <ProfileSnapshot
          role={profile.role || "FOUNDER"}
          data={{
            checkSize: profile.ticketSize || undefined,
            portfolioCount: profile.portfolioCount,
            openToInvest: profile.openToInvest,
            location: profile.location || undefined,
            startupName: profile.startups?.[0]?.name,
            startupStage: profile.startups?.[0]?.stage,
          }}
        />

        {/* 3. Core Profile Stats Bar */}
        <ProfileStats
          stats={{
            followers: profile.followersCount,
            following: profile.followingCount,
            postsCount: profile.posts?.length || 0,
            role: profile.role || "FOUNDER",
          }}
        />

        {/* 4. Main Body + Ecosystem Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Left Column (Role View & Activity) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dynamic Role-Based View */}
            {userRole === "INVESTOR" && (
              <ProfileInvestorView
                profile={{
                  bio: profile.bio || null,
                  acceptingPitches: profile.openToInvest,
                  preferences: {
                    stages: ["Pre-Seed", "Seed"],
                    geography: profile.location || "North America",
                    checkSize: profile.ticketSize || "$50k - $250k",
                    leadRole: "Leads or Co-Leads",
                    coInvest: true,
                  },
                }}
              />
            )}

            {userRole === "FOUNDER" && (
              <ProfileFounderView
                profile={{
                  bio: profile.bio || null,
                  startup: profile.startups?.[0]
                    ? {
                        id: profile.startups[0].id,
                        name: profile.startups[0].name,
                        tagline: profile.startups[0].tagline || "Building stealth technology.",
                        stage: profile.startups[0].stage || "Seed Stage",
                        raised: profile.startups[0].raised || "$1.2M Raised",
                      }
                    : undefined,
                }}
              />
            )}

            {userRole === "DEVELOPER" && (
              <ProfileDeveloperView
                profile={{
                  bio: profile.bio || null,
                }}
              />
            )}

            {userRole === "MENTOR" && (
              <ProfileMentorView
                profile={{
                  bio: profile.bio || null,
                }}
              />
            )}

            {/* Fallback View */}
            {userRole !== "INVESTOR" && userRole !== "FOUNDER" && userRole !== "DEVELOPER" && userRole !== "MENTOR" && (
              <div className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-xs space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900">About</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {profile.bio || "No biography provided yet."}
                </p>
              </div>
            )}

            {/* Activity & Media Tabs */}
            <ProfileActivity
              posts={profile.posts || []}
              userName={profile.name}
            />

          </div>

          {/* Right Column: Contextual Ecosystem Sidebar */}
          <div className="space-y-6">
            <ProfileSidebar role={profile.role || "USER"} />
          </div>

        </div>

      </main>

      {/* Interactive Modals */}
      <ScheduleMeetingModal
        isOpen={isMeetingOpen}
        onClose={() => setIsMeetingOpen(false)}
        targetName={profile.name}
      />

      <PitchInvestorModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        investorName={profile.name}
      />
    </div>
  );
}
