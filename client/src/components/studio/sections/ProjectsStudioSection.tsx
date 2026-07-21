"use client";

import React, { useState } from "react";
import { FolderGit2, Plus, Trash2, ExternalLink, GitBranch, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
}

export default function ProjectsStudioSection({ projects, onChange }: ProjectsSectionProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTech, setNewTech] = useState("");
  const [newGithub, setNewGithub] = useState("");
  const [newLive, setNewLive] = useState("");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newTitle.trim(),
      description: newDesc.trim(),
      tech: newTech.split(",").map(t => t.trim()).filter(Boolean),
      githubUrl: newGithub.trim() || undefined,
      liveUrl: newLive.trim() || undefined,
      featured: true
    };

    onChange([item, ...projects]);
    setNewTitle("");
    setNewDesc("");
    setNewTech("");
    setNewGithub("");
    setNewLive("");
  };

  const handleRemoveProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Featured Projects</h3>
        <p className="text-xs text-slate-500">Showcase open source repositories, products, and tech builds.</p>
      </div>

      {/* Add Project Form */}
      <form onSubmit={handleAddProject} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-blue-600" /> Add New Project Card
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="Noventra Realtime Engine"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Technologies Used (comma separated)</label>
            <input
              type="text"
              placeholder="TypeScript, WebRTC, Node.js"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Short Description</label>
          <input
            type="text"
            placeholder="High-throughput signaling mesh for pitch sessions..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">GitHub Repo URL</label>
            <input
              type="text"
              placeholder="https://github.com/username/repo"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
              value={newGithub}
              onChange={(e) => setNewGithub(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Live Demo URL</label>
            <input
              type="text"
              placeholder="https://project.vercel.app"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
              value={newLive}
              onChange={(e) => setNewLive(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 h-9">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
          </Button>
        </div>
      </form>

      {/* Project List */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block">Existing Projects ({projects.length})</label>
        {projects.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center border">
            No projects added yet. Use the form above to add a project card.
          </p>
        ) : (
          projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex justify-between items-start gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-slate-900">{proj.name}</h4>
                  {proj.featured && (
                    <span className="text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.2 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600">{proj.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tech?.map((t) => (
                    <span key={t} className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveProject(proj.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Project"
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
