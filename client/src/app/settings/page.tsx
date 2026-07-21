"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileStudioPage from "./profile/page";
import AccountSettingsSection from "@/components/settings/AccountSettingsSection";
import ContentSettingsSection, { ContentFilter } from "@/components/settings/ContentSettingsSection";
import StartupsSettingsSection from "@/components/settings/StartupsSettingsSection";
import MeetingsSettingsSection from "@/components/settings/MeetingsSettingsSection";
import NotificationsSettingsSection from "@/components/settings/NotificationsSettingsSection";

import {
  User,
  Shield,
  FileText,
  Building2,
  Video,
  Bell,
  Sparkles,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type PrimarySettingsTab =
  | "profile"
  | "account"
  | "content"
  | "startups"
  | "meetings"
  | "notifications";

function SettingsContentWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get("tab") as PrimarySettingsTab) || "profile";
  const filterParam = (searchParams.get("filter") as ContentFilter) || "liked";

  const [activeTab, setActiveTab] = useState<PrimarySettingsTab>(tabParam);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const setTab = (t: PrimarySettingsTab) => {
    setActiveTab(t);
    router.push(`/settings?tab=${t}`);
  };

  const tabs: { id: PrimarySettingsTab; label: string; icon: any }[] = [
    { id: "profile", label: "Profile Studio", icon: User },
    { id: "account", label: "Account & System", icon: Shield },
    { id: "content", label: "Content & Feed Sync", icon: FileText },
    { id: "startups", label: "Startups", icon: Building2 },
    { id: "meetings", label: "Meetings & WebRTC", icon: Video },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  if (activeTab === "profile") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
        <Navbar />

        {/* Render Top Settings Tab Bar above Profile Studio */}
        <div className="bg-white border-b border-slate-200 sticky top-16 z-30 px-6 py-3 shadow-2xs">
          <div className="max-w-[1600px] mx-auto flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tb) => {
              const TbIcon = tb.icon;
              const isActive = activeTab === tb.id;
              return (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <TbIcon className="w-4 h-4" />
                  {tb.label}
                </button>
              );
            })}
          </div>
        </div>
        <ProfileStudioPage hideNavbar={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      <Navbar />

      {/* Settings Top Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                Noventra Settings Center
                <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Configure your account, profile studio, feed content sync, registered startups, and notification controls.
              </p>
            </div>
          </div>

          {/* Primary Tab Pill Bar */}
          <div className="flex gap-2 overflow-x-auto mt-6 pt-2 border-t border-slate-100 no-scrollbar">
            {tabs.map((tb) => {
              const TbIcon = tb.icon;
              const isActive = activeTab === tb.id;
              return (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <TbIcon className="w-4 h-4" />
                  {tb.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Tab Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-8 shadow-xs min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "account" && <AccountSettingsSection />}
              {activeTab === "content" && <ContentSettingsSection initialFilter={filterParam} />}
              {activeTab === "startups" && <StartupsSettingsSection />}
              {activeTab === "meetings" && <MeetingsSettingsSection />}
              {activeTab === "notifications" && <NotificationsSettingsSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function SettingsCenterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold">Loading Settings Center...</p>
      </div>
    }>
      <SettingsContentWrapper />
    </Suspense>
  );
}
