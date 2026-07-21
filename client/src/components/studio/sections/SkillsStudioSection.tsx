"use client";

import React, { useState } from "react";
import { Tag, Plus, X, Sparkles, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsStudioSection({ skills, onChange }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");

  const suggestedSkills = [
    "React", "Next.js", "TypeScript", "AI Infrastructure", "Fundraising", 
    "Pitch Decks", "Product Management", "Go-To-Market", "Cap Table", "Web3", "Python"
  ];

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Skills & Focus Areas</h3>
        <p className="text-xs text-slate-500">Add core competencies, technologies, and ecosystem focus areas.</p>
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type a skill (e.g. Next.js, Fundraising, GTM)..."
            className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill(newSkill);
              }
            }}
          />
        </div>

        <Button
          type="button"
          onClick={() => handleAddSkill(newSkill)}
          disabled={!newSkill.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 flex items-center gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </Button>
      </div>

      {/* Active Skills List */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">Your Profile Skills ({skills.length})</label>
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 min-h-[80px]">
          {skills.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No skills added yet. Select from suggestions below or type a custom skill.</span>
          ) : (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-extrabold text-slate-900 group"
              >
                <GripVertical className="w-3 h-3 text-slate-300 cursor-grab opacity-60 group-hover:opacity-100" />
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Quick Autocomplete Suggestions */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Suggested Skills
        </label>

        <div className="flex flex-wrap gap-1.5">
          {suggestedSkills.map((s) => {
            const isAdded = skills.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={isAdded}
                onClick={() => handleAddSkill(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  isAdded
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
              >
                {isAdded ? `✓ ${s}` : `+ ${s}`}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
