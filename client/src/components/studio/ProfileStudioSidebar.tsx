"use client";

import React from "react";
import { 
  User, Shield, Briefcase, Building2, Layers, 
  Code2, Users, Tag, FolderGit2, Share2, Image as ImageIcon, 
  CheckCircle2, Lock, Bell, Sparkles, GraduationCap, Award 
} from "lucide-react";

export type StudioSection = 
  | "general"
  | "personal"
  | "professional"
  | "role"
  | "founder"
  | "investor"
  | "developer"
  | "mentor"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "achievements"
  | "social"
  | "media"
  | "verification"
  | "privacy"
  | "notifications";

interface ProfileStudioSidebarProps {
  activeSection: StudioSection;
  onSelectSection: (section: StudioSection) => void;
  userRoles: string[]; // e.g. ["FOUNDER", "INVESTOR"]
  sectionStatus?: Record<StudioSection, boolean>; // true if completed
}

export default function ProfileStudioSidebar({
  activeSection,
  onSelectSection,
  userRoles = ["FOUNDER"],
  sectionStatus = {} as any,
}: ProfileStudioSidebarProps) {
  const isFounder = userRoles.includes("FOUNDER");
  const isInvestor = userRoles.includes("INVESTOR");
  const isDeveloper = userRoles.includes("DEVELOPER");
  const isMentor = userRoles.includes("MENTOR");

  const sections: Array<{
    id: StudioSection;
    label: string;
    icon: any;
    badge?: string;
    isVisible?: boolean;
  }> = [
    { id: "general", label: "General & Branding", icon: Sparkles, isVisible: true },
    { id: "personal", label: "Personal Info", icon: User, isVisible: true },
    { id: "professional", label: "Professional Info", icon: Briefcase, isVisible: true },
    { id: "role", label: "Ecosystem Roles", icon: Layers, isVisible: true, badge: userRoles.length ? `${userRoles.length}` : undefined },
    { id: "founder", label: "Founder Startup", icon: Building2, isVisible: isFounder, badge: "Startup" },
    { id: "investor", label: "Investment Thesis", icon: Briefcase, isVisible: isInvestor, badge: "VC/Angel" },
    { id: "developer", label: "Developer Stack", icon: Code2, isVisible: isDeveloper, badge: "Dev" },
    { id: "mentor", label: "Mentorship Focus", icon: Users, isVisible: isMentor, badge: "Mentor" },
    { id: "skills", label: "Skills & Focus", icon: Tag, isVisible: true },
    { id: "projects", label: "Featured Projects", icon: FolderGit2, isVisible: true },
    { id: "experience", label: "Work Experience", icon: Briefcase, isVisible: true },
    { id: "education", label: "Education", icon: GraduationCap, isVisible: true },
    { id: "achievements", label: "Achievements", icon: Award, isVisible: true },
    { id: "social", label: "Social Links", icon: Share2, isVisible: true },
    { id: "media", label: "Media & Pitch Decks", icon: ImageIcon, isVisible: true },
    { id: "verification", label: "Verification", icon: Shield, isVisible: true },
    { id: "privacy", label: "Privacy & Visibility", icon: Lock, isVisible: true },
    { id: "notifications", label: "Notifications", icon: Bell, isVisible: true },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 rounded-[20px] p-3 shadow-xs space-y-1">
      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
        Studio Sections
      </div>

      <nav className="space-y-0.5">
        {sections.filter(s => s.isVisible !== false).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isComplete = sectionStatus[item.id];

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {item.badge && (
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isComplete && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-500"}`} />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
