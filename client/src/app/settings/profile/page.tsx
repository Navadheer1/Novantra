"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProfileStudioHeader from "@/components/studio/ProfileStudioHeader";
import ProfileStudioSidebar, { StudioSection } from "@/components/studio/ProfileStudioSidebar";
import ProfileLivePreview from "@/components/studio/ProfileLivePreview";

// Studio Sections
import GeneralStudioSection from "@/components/studio/sections/GeneralStudioSection";
import PersonalStudioSection from "@/components/studio/sections/PersonalStudioSection";
import ProfessionalStudioSection from "@/components/studio/sections/ProfessionalStudioSection";
import RoleStudioSection from "@/components/studio/sections/RoleStudioSection";
import FounderStudioSection from "@/components/studio/sections/FounderStudioSection";
import InvestorStudioSection from "@/components/studio/sections/InvestorStudioSection";
import DeveloperStudioSection from "@/components/studio/sections/DeveloperStudioSection";
import MentorStudioSection from "@/components/studio/sections/MentorStudioSection";
import SkillsStudioSection from "@/components/studio/sections/SkillsStudioSection";
import ProjectsStudioSection, { ProjectItem } from "@/components/studio/sections/ProjectsStudioSection";
import ExperienceStudioSection, { ExperienceItem } from "@/components/studio/sections/ExperienceStudioSection";
import EducationStudioSection, { EducationItem } from "@/components/studio/sections/EducationStudioSection";
import AchievementsStudioSection, { AchievementItem } from "@/components/studio/sections/AchievementsStudioSection";
import SocialStudioSection from "@/components/studio/sections/SocialStudioSection";
import MediaStudioSection from "@/components/studio/sections/MediaStudioSection";
import VerificationStudioSection from "@/components/studio/sections/VerificationStudioSection";
import PrivacyStudioSection from "@/components/studio/sections/PrivacyStudioSection";
import NotificationsStudioSection from "@/components/studio/sections/NotificationsStudioSection";

const LOCAL_STORAGE_KEY = "noventra_profile_studio_draft_v1";

interface ProfileStudioPageProps {
  hideNavbar?: boolean;
}

export default function ProfileStudioPage({ hideNavbar = false }: ProfileStudioPageProps) {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<StudioSection>("general");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");
  const [isPublishing, setIsPublishing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    id: "user-123",
    name: "Navadheer Nayudu",
    firstName: "Navadheer",
    lastName: "Nayudu",
    username: "navadheer",
    role: "FOUNDER",
    userRoles: ["FOUNDER", "INVESTOR"],
    headline: "Building Noventra & Mediquick. Passionate about AI infrastructure.",
    bio: "Founding engineer & ecosystem builder. Working on modernizing startup fundraising and developer hiring.",
    avatarUrl: null as string | null,
    bannerGradient: "from-blue-600 via-indigo-600 to-sky-500",
    location: "San Francisco, CA",
    timezone: "PST (UTC-8)",
    languages: "English, Telugu",
    email: "navadheer@noventra.io",
    phone: "",
    openToInvest: true,
    ticketSize: "$50k - $250k",
    investmentInterests: "AI, DevTools, SaaS",
    investmentThesis: "Backing generational infrastructure & developer tools.",
    skills: ["React", "Next.js", "TypeScript", "Fundraising", "AI"],
    portfolioCount: 12,
    followersCount: 142,
    followingCount: 89,
    // Startup
    startupName: "Noventra Core",
    startupTagline: "The next-generation startup ecosystem platform.",
    startupStage: "Seed Stage",
    startupRaised: "$1.4M Seed Raised",
    industry: "AI & Software",
    mrr: "$42,000 MRR",
    currentUsers: "12,400 MAU",
    teamSize: 8,
    lookingFor: "Lead Investor & Staff AI Engineer",
    pitchDeckUrl: "https://docsend.com/view/example",
    // Developer
    primaryStack: "TypeScript, React, Next.js, Node.js",
    githubHandle: "navadheer",
    // Mentor
    expertiseTopics: "Fundraising, GTM, Product-Market Fit",
    sessionRate: "Pro-Bono (Free 30m)",
    // Projects, Experience, Education, Achievements
    projects: [
      {
        id: "p1",
        name: "Noventra Realtime Engine",
        description: "Low-latency WebRTC and Socket.io signaling mesh.",
        tech: ["TypeScript", "Socket.io", "WebRTC"],
        githubUrl: "https://github.com/noventra",
        featured: true,
      },
    ] as ProjectItem[],
    experiences: [
      {
        id: "e1",
        company: "Noventra",
        role: "Co-Founder & CTO",
        years: "2024 - Present",
        description: "Leading engineering and platform architecture.",
      },
    ] as ExperienceItem[],
    education: [
      {
        id: "ed1",
        institution: "Stanford University",
        degree: "B.S. Computer Science",
        years: "2020 - 2024",
      },
    ] as EducationItem[],
    achievements: [
      {
        id: "a1",
        title: "Global AI Hackathon 1st Place",
        description: "Awarded for autonomous developer workspace infrastructure.",
        year: "2025",
      },
    ] as AchievementItem[],
    socials: {
      github: "https://github.com/navadheer",
      twitter: "https://x.com/navadheer",
      linkedin: "https://linkedin.com/in/navadheer",
    } as Record<string, string>,
    media: {} as Record<string, string>,
    privacy: {} as Record<string, string>,
    notifications: {} as Record<string, boolean>,
  });

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  // Load User Data & Local Draft on Mount
  useEffect(() => {
    if (clerkLoaded) {
      fetchDBUser();
    }
  }, [clerkLoaded, clerkUser?.id]);

  const fetchDBUser = async () => {
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      if (!clerkUser?.id) return;

      const res = await fetch(`${apiUrl}/api/users/clerk/${clerkUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserId(data.id);
        
        // Restore from Local Draft if available
        const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localDraft) {
          try {
            const parsed = JSON.parse(localDraft);
            setForm((prev) => ({ ...prev, ...parsed, id: data.id, email: data.email }));
            return;
          } catch (e) {}
        }

        setForm((prev) => ({
          ...prev,
          id: data.id,
          name: data.name,
          role: data.role || "FOUNDER",
          userRoles: data.role ? [data.role] : ["FOUNDER"],
          avatarUrl: data.avatarUrl || null,
          bio: data.bio || prev.bio,
          location: data.location || prev.location,
          openToInvest: data.openToInvest ?? true,
          ticketSize: data.ticketSize || prev.ticketSize,
          skills: data.skills?.length ? data.skills : prev.skills,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-Save Handler to LocalStorage
  const triggerAutoSave = useCallback((updatedForm: typeof form) => {
    setAutoSaveStatus("saving");
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedForm));
      setTimeout(() => {
        setAutoSaveStatus("saved");
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }, 500);
    } catch (e) {
      setAutoSaveStatus("unsaved");
    }
  }, []);

  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const handleRoleToggle = (roleId: string) => {
    setForm((prev) => {
      const exists = prev.userRoles.includes(roleId);
      const updatedRoles = exists 
        ? prev.userRoles.filter(r => r !== roleId)
        : [...prev.userRoles, roleId];
      
      const newPrimary = updatedRoles.includes(prev.role) ? prev.role : (updatedRoles[0] || "USER");
      const updated = { ...prev, userRoles: updatedRoles, role: newPrimary };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      const res = await fetch(`${apiUrl}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          avatarUrl: form.avatarUrl,
          bio: form.bio,
          skills: form.skills,
          location: form.location,
          openToInvest: form.openToInvest,
          ticketSize: form.ticketSize,
          investmentInterests: form.investmentInterests.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setAutoSaveStatus("saved");
        router.push(`/profile/${userId || form.id}`);
      } else {
        alert("Failed to publish profile updates.");
      }
    } catch (err) {
      console.error(err);
      alert("Error publishing profile.");
    } finally {
      setIsPublishing(false);
    }
  };

  // AI Generators calling backend /api/ai/generate
  const handleAIGenerateHeadline = async () => {
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          promptType: "description",
          data: { industry: form.industry || "Technology", idea: form.headline || form.bio || "Building AI startup" },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          handleFieldChange("headline", json.result.split("\n")[0]);
          return;
        }
      }
    } catch (e) {}

    // Fallback
    const headlines = [
      `Founder & CEO @ ${form.startupName || "Noventra"} | Scaling AI Infrastructure`,
      `VC Investor backing Pre-Seed & Seed SaaS | Partner @ Noventra Syndicate`,
      `Senior Full-Stack Engineer | React, Next.js, Rust | Building Autonomous Agents`,
    ];
    handleFieldChange("headline", headlines[Math.floor(Math.random() * headlines.length)]);
  };

  const handleAIGenerateBio = async () => {
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          promptType: "profile_improvement",
          data: { role: form.role, bio: form.bio, skills: form.skills },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          handleFieldChange("bio", json.result);
          return;
        }
      }
    } catch (e) {}

    // Fallback
    const bioText = `Passionate ${form.role.toLowerCase()} driving innovation across the startup ecosystem. Focused on building high-scalability software, supporting early-stage founders, and creating generational value. Active member on Noventra.`;
    handleFieldChange("bio", bioText);
  };

  const calculateCompleteness = () => {
    let score = 30;
    if (form.name) score += 10;
    if (form.avatarUrl) score += 15;
    if (form.headline) score += 10;
    if (form.bio) score += 10;
    if (form.skills.length >= 3) score += 15;
    if (form.projects.length > 0) score += 10;
    return Math.min(100, score);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      {!hideNavbar && <Navbar />}

      {/* Studio Header Bar */}
      <ProfileStudioHeader
        autoSaveStatus={autoSaveStatus}
        lastSavedTime={lastSavedTime}
        completeness={calculateCompleteness()}
        onSaveDraft={() => triggerAutoSave(form)}
        onPublish={handlePublish}
        onDiscard={() => {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          fetchDBUser();
        }}
        onAIGenerateHeadline={handleAIGenerateHeadline}
        onAIGenerateBio={handleAIGenerateBio}
        isPublishing={isPublishing}
      />

      {/* Main Workspace 3-Column Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* 1. Left Navigation Sidebar */}
          <ProfileStudioSidebar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            userRoles={form.userRoles}
          />

          {/* 2. Center Editing Section Workspace */}
          <div className="flex-1 w-full bg-white border border-slate-200/80 rounded-[20px] p-6 sm:p-8 shadow-xs min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                {activeSection === "general" && (
                  <GeneralStudioSection data={form} onChange={handleFieldChange} />
                )}

                {activeSection === "personal" && (
                  <PersonalStudioSection data={form} onChange={handleFieldChange} />
                )}

                {activeSection === "professional" && (
                  <ProfessionalStudioSection
                    data={form}
                    onChange={handleFieldChange}
                    onAIGenerateHeadline={handleAIGenerateHeadline}
                    onAIGenerateBio={handleAIGenerateBio}
                  />
                )}

                {activeSection === "role" && (
                  <RoleStudioSection
                    userRoles={form.userRoles}
                    onToggleRole={handleRoleToggle}
                    primaryRole={form.role}
                    onSetPrimaryRole={(r) => handleFieldChange("role", r)}
                  />
                )}

                {activeSection === "founder" && (
                  <FounderStudioSection data={form} onChange={handleFieldChange} />
                )}

                {activeSection === "investor" && (
                  <InvestorStudioSection data={form} onChange={handleFieldChange} />
                )}

                {activeSection === "developer" && (
                  <DeveloperStudioSection data={form} onChange={handleFieldChange} />
                )}

                {activeSection === "mentor" && (
                  <MentorStudioSection data={form} onChange={handleFieldChange} />
                )}

                {activeSection === "skills" && (
                  <SkillsStudioSection
                    skills={form.skills}
                    onChange={(skills) => handleFieldChange("skills", skills)}
                  />
                )}

                {activeSection === "projects" && (
                  <ProjectsStudioSection
                    projects={form.projects}
                    onChange={(projects) => handleFieldChange("projects", projects)}
                  />
                )}

                {activeSection === "experience" && (
                  <ExperienceStudioSection
                    experiences={form.experiences}
                    onChange={(experiences) => handleFieldChange("experiences", experiences)}
                  />
                )}

                {activeSection === "education" && (
                  <EducationStudioSection
                    education={form.education}
                    onChange={(education) => handleFieldChange("education", education)}
                  />
                )}

                {activeSection === "achievements" && (
                  <AchievementsStudioSection
                    achievements={form.achievements}
                    onChange={(achievements) => handleFieldChange("achievements", achievements)}
                  />
                )}

                {activeSection === "social" && (
                  <SocialStudioSection
                    socials={form.socials}
                    onChange={(net, val) => handleFieldChange("socials", { ...form.socials, [net]: val })}
                  />
                )}

                {activeSection === "media" && (
                  <MediaStudioSection data={form} onChange={handleFieldChange} />
                )}

                {activeSection === "verification" && <VerificationStudioSection />}

                {activeSection === "privacy" && (
                  <PrivacyStudioSection
                    privacy={form.privacy}
                    onChange={(k, v) => handleFieldChange("privacy", { ...form.privacy, [k]: v })}
                  />
                )}

                {activeSection === "notifications" && (
                  <NotificationsStudioSection
                    notifications={form.notifications}
                    onChange={(k, v) => handleFieldChange("notifications", { ...form.notifications, [k]: v })}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. Right Sticky Live Profile Preview */}
          <div className="w-full lg:w-[480px] shrink-0">
            <ProfileLivePreview data={form} />
          </div>

        </div>
      </main>
    </div>
  );
}
