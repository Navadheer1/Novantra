"use client";

import React from "react";
import { Code2, GitBranch, Terminal, Cpu } from "lucide-react";

interface DeveloperSectionProps {
  data: {
    primaryStack?: string;
    githubHandle?: string;
    leetcodeHandle?: string;
    openSourceContribs?: number;
    lookingForRole?: string;
  };
  onChange: (field: string, value: any) => void;
}

export default function DeveloperStudioSection({ data, onChange }: DeveloperSectionProps) {
  return (
    <div className="space-y-6">
      
      <div>
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-black text-slate-900">Developer & Engineering Stack</h3>
        </div>
        <p className="text-xs text-slate-500">Configure your primary technology stack, code handles, and job preferences.</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Primary Tech Stack (comma separated)</label>
        <input
          type="text"
          placeholder="TypeScript, React, Next.js, Node.js, PostgreSQL, Docker"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          value={data.primaryStack || "TypeScript, React, Next.js, Node.js"}
          onChange={(e) => onChange("primaryStack", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Username</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
            <input
              type="text"
              placeholder="github_username"
              className="w-full pl-8 p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              value={data.githubHandle || ""}
              onChange={(e) => onChange("githubHandle", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">LeetCode Username</label>
          <input
            type="text"
            placeholder="leetcode_user"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            value={data.leetcodeHandle || ""}
            onChange={(e) => onChange("leetcodeHandle", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Engineering Roles You Are Open To</label>
        <input
          type="text"
          placeholder="Founding Engineer, Technical Co-Founder, Senior Full-Stack"
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          value={data.lookingForRole || "Founding Engineer & Co-Founder Roles"}
          onChange={(e) => onChange("lookingForRole", e.target.value)}
        />
      </div>

    </div>
  );
}
