"use client";

import React, { useState } from "react";
import { Award, Plus, Trash2, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  year: string;
}

interface AchievementsSectionProps {
  achievements: AchievementItem[];
  onChange: (achievements: AchievementItem[]) => void;
}

export default function AchievementsStudioSection({ achievements, onChange }: AchievementsSectionProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const item: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      year: year.trim() || "2025",
    };

    onChange([item, ...achievements]);
    setTitle("");
    setDescription("");
    setYear("");
  };

  const handleRemoveAchievement = (id: string) => {
    onChange(achievements.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Achievements & Accolades</h3>
        <p className="text-xs text-slate-500">Showcase awards, hackathon wins, grants, and community recognitions.</p>
      </div>

      <form onSubmit={handleAddAchievement} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Achievement
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Achievement / Award Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 🥇 1st Place Winner - Global AI Hackathon 2025"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Year</label>
            <input
              type="text"
              placeholder="2025"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Description / Category</label>
          <input
            type="text"
            placeholder="Awarded for autonomous agent infrastructure built on Next.js & WebRTC..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 h-9">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Achievement
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block">Accolades List ({achievements.length})</label>
        {achievements.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border">
            No achievements added yet. Use the form above to add an award.
          </p>
        ) : (
          achievements.map((ach) => (
            <div key={ach.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-slate-900">{ach.title}</h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {ach.year}
                  </span>
                </div>
                {ach.description && <p className="text-xs text-slate-600 mt-1">{ach.description}</p>}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveAchievement(ach.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Achievement"
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
