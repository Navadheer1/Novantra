"use client";

import React, { useState } from "react";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  years: string;
}

interface EducationSectionProps {
  education: EducationItem[];
  onChange: (education: EducationItem[]) => void;
}

export default function EducationStudioSection({ education, onChange }: EducationSectionProps) {
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [years, setYears] = useState("");

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim()) return;

    const item: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: institution.trim(),
      degree: degree.trim() || "B.S. Computer Science",
      years: years.trim() || "2020 - 2024",
    };

    onChange([item, ...education]);
    setInstitution("");
    setDegree("");
    setYears("");
  };

  const handleRemoveEducation = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Education & Academic Background</h3>
        <p className="text-xs text-slate-500">Add universities, degrees, and academic affiliations.</p>
      </div>

      <form onSubmit={handleAddEducation} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Education
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">University / School</label>
            <input
              type="text"
              required
              placeholder="e.g. Stanford University, MIT"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Degree / Program</label>
            <input
              type="text"
              placeholder="e.g. B.S. Computer Science"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Graduation / Years</label>
            <input
              type="text"
              placeholder="2020 - 2024"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 h-9">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Education
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block">Education Records ({education.length})</label>
        {education.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border">
            No education records added yet. Use the form above to add your university or school.
          </p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex justify-between items-center gap-4">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">{edu.institution}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{edu.degree} • {edu.years}</p>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveEducation(edu.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Education"
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
