"use client";

import React, { useState } from "react";
import { Briefcase, Plus, Trash2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  years: string;
  description: string;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onChange: (experiences: ExperienceItem[]) => void;
}

export default function ExperienceStudioSection({ experiences, onChange }: ExperienceSectionProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [description, setDescription] = useState("");

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const item: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      years: years.trim() || "2022 - Present",
      description: description.trim(),
    };

    onChange([item, ...experiences]);
    setCompany("");
    setRole("");
    setYears("");
    setDescription("");
  };

  const handleRemoveExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Work Experience & Track Record</h3>
        <p className="text-xs text-slate-500">Document your career history, leadership positions, and previous companies.</p>
      </div>

      <form onSubmit={handleAddExperience} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Work Position
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Organization</label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe, Linear, Google"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Role / Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Staff Engineer, VP Product"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Duration / Dates</label>
            <input
              type="text"
              placeholder="2022 - 2025"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Key Responsibilities / Impact</label>
          <input
            type="text"
            placeholder="Led engineering team of 12, scaled infrastructure to 10M requests/day..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 h-9">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Experience
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block">Experience History ({experiences.length})</label>
        {experiences.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border">
            No work experience items added yet. Use the form above to add a role.
          </p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-slate-900">{exp.role}</h4>
                  <span className="text-[10px] text-slate-400">@ {exp.company}</span>
                </div>
                <p className="text-[11px] font-semibold text-blue-600">{exp.years}</p>
                {exp.description && <p className="text-xs text-slate-600 mt-1">{exp.description}</p>}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveExperience(exp.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
