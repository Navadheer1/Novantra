"use client";

import React from "react";
import { Building2, Briefcase, Code2, Users, GraduationCap, Sparkles, Check } from "lucide-react";

interface RoleSectionProps {
  userRoles: string[]; // e.g. ["FOUNDER", "INVESTOR"]
  onToggleRole: (role: string) => void;
  primaryRole: string;
  onSetPrimaryRole: (role: string) => void;
}

export default function RoleStudioSection({
  userRoles,
  onToggleRole,
  primaryRole,
  onSetPrimaryRole,
}: RoleSectionProps) {
  const availableRoles = [
    {
      id: "FOUNDER",
      title: "Startup Founder",
      desc: "Building a company, raising capital, hiring talent, or shipping product.",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "INVESTOR",
      title: "VC / Angel Investor",
      desc: "Investing checks, evaluating pitch decks, managing portfolio companies.",
      icon: Briefcase,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "DEVELOPER",
      title: "Software Engineer",
      desc: "Building full-stack software, open source, or joining startup teams.",
      icon: Code2,
      color: "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      id: "MENTOR",
      title: "Ecosystem Mentor",
      desc: "Providing 1:1 guidance, pitch reviews, or advisory support to founders.",
      icon: Users,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      id: "STUDENT",
      title: "Student / Explorer",
      desc: "Participating in hackathons, exploring co-founder roles, or learning.",
      icon: GraduationCap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Ecosystem Roles & Persona</h3>
        <p className="text-xs text-slate-500">Select all roles that apply to unlock role-specific studio sections.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableRoles.map((role) => {
          const Icon = role.icon;
          const isSelected = userRoles.includes(role.id);

          return (
            <div
              key={role.id}
              onClick={() => onToggleRole(role.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "border-blue-600 bg-blue-50/40 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{role.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{role.desc}</p>
              </div>

              {isSelected && (
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700">Unlocked Studio Section</span>
                  {primaryRole !== role.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetPrimaryRole(role.id);
                      }}
                      className="text-[10px] font-black uppercase text-blue-600 hover:underline"
                    >
                      Make Primary
                    </button>
                  )}
                  {primaryRole === role.id && (
                    <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded">
                      Primary Display Role
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
