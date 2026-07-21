"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Code2, FolderGit2, GitBranch, ExternalLink, Award, 
  Terminal, Cpu, Database, Cloud, Sparkles, CheckCircle2 
} from "lucide-react";
import EmptyState from "./EmptyState";

interface TechCategory {
  category: string;
  skills: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
}

interface DeveloperProps {
  profile: {
    bio: string | null;
    techStack?: TechCategory[];
    projects?: Project[];
    githubHandle?: string;
    openSourceContribs?: number;
    lookingForRole?: string;
    hackathons?: Array<{ name: string; prize: string; year: string }>;
  };
}

export default function ProfileDeveloperView({ profile }: DeveloperProps) {
  const techCategories: TechCategory[] = profile.techStack || [
    { category: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit"] },
    { category: "Backend & APIs", skills: ["Node.js", "Express", "Python", "GraphQL", "REST"] },
    { category: "Databases & Cloud", skills: ["PostgreSQL", "Prisma", "Redis", "AWS S3", "Docker"] },
    { category: "AI & ML Tooling", skills: ["LangChain", "OpenAI API", "Vector DBs (Pinecone)"] }
  ];

  const defaultProjects: Project[] = [
    {
      id: "p1",
      name: "Noventra Realtime Engine",
      description: "Low-latency WebRTC and Socket.io signaling mesh built for peer-to-peer pitch sessions.",
      tech: ["TypeScript", "Socket.io", "WebRTC", "Redis"],
      githubUrl: "https://github.com",
      liveUrl: "https://noventra.io",
      stars: 142
    },
    {
      id: "p2",
      name: "Prisma Vector Extension",
      description: "Open-source plugin to query high-dimensional embeddings directly within PostgreSQL.",
      tech: ["Rust", "PostgreSQL", "Prisma"],
      githubUrl: "https://github.com",
      stars: 89
    }
  ];

  const projectList = profile.projects && profile.projects.length > 0 ? profile.projects : defaultProjects;

  const hackathons = profile.hackathons || [
    { name: "Global AI Hackathon 2025", prize: "🥇 1st Place Winner", year: "2025" },
    { name: "ETHDenver Buildathon", prize: "🚀 Best Infrastructure Track", year: "2024" }
  ];

  return (
    <div className="space-y-6">

      {/* About Developer */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-500" /> Engineer Overview
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {profile.bio || "Full-stack software architect specializing in scalable web systems, realtime communication, and AI infrastructure."}
        </p>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-sky-900">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Open To:</strong> {profile.lookingForRole || "Founding Engineer & Co-Founder Opportunities"}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase bg-sky-600 text-white px-2.5 py-1 rounded-full shrink-0">
            Available
          </span>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-5">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" /> Technical Proficiency & Stack
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techCategories.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" /> {cat.category}
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-white text-slate-800 text-xs px-2.5 py-1 rounded-lg font-bold border border-slate-200 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-500" /> Featured Engineering Projects
          </h3>
          {profile.githubHandle && (
            <a href={`https://github.com/${profile.githubHandle}`} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline" className="text-xs font-semibold rounded-xl border-slate-200 flex items-center gap-1.5 h-8">
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </Button>
            </a>
          )}
        </div>

        {projectList.length === 0 ? (
          <EmptyState
            icon="projects"
            title="No Featured Projects Yet"
            description="Projects and open source repositories will appear here once added."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projectList.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-sky-500" /> {proj.name}
                    </h4>
                    {proj.stars !== undefined && (
                      <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ⭐ {proj.stars}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {proj.tech.map((t) => (
                      <span key={t} className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 font-bold hover:text-slate-900 flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5" /> Code
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 ml-auto">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hackathons & Awards */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Hackathons & Awards
        </h3>

        <div className="space-y-3">
          {hackathons.map((h, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 flex justify-between items-center text-xs">
              <div>
                <h5 className="font-extrabold text-slate-900 text-xs">{h.name}</h5>
                <span className="text-[11px] font-bold text-amber-700 mt-0.5 block">{h.prize}</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-white px-2 py-1 rounded border text-slate-400">
                {h.year}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
