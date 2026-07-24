"use client";

import React from "react";
import { FolderHeart, Sparkles, Layers, Shield, ArrowRight, Check } from "lucide-react";

interface CollectionItem {
  id: string;
  title: string;
  count: number;
  badge: string;
  description: string;
  sampleItems: string[];
  gradient: string;
}

interface AppStoreCollectionsProps {
  onSelectCollection: (colId: string) => void;
}

export default function AppStoreCollections({ onSelectCollection }: AppStoreCollectionsProps) {
  const collections: CollectionItem[] = [
    {
      id: "essential-stack",
      title: "Essential Startup Stack",
      count: 12,
      badge: "Must Have",
      description: "Everything a pre-seed founder needs on Day 1: Auth, Payments, Boilerplate & Pitch Prompts.",
      sampleItems: ["Next.js SaaS", "Stripe Rails", "AI Pitch Prompt Suite"],
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      id: "healthcare-pack",
      title: "Healthcare Founder Pack",
      count: 8,
      badge: "Specialized",
      description: "HIPAA-compliant templates, EHR sync APIs, and clinical workflow UI kits.",
      sampleItems: ["HospitalOS v3", "MediFlow API", "Patient Care UI Kit"],
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      id: "saas-everything",
      title: "Everything for SaaS",
      count: 16,
      badge: "Popular",
      description: "Complete stack for launching B2B software products with high conversion rates.",
      sampleItems: ["Vibrant Figma Kit", "Prisma DB Engine", "Resend Workflows"],
      gradient: "from-purple-600 to-indigo-600",
    },
    {
      id: "free-ai-tools",
      title: "Best Free AI Tools",
      count: 32,
      badge: "100% Free",
      description: "Community-maintained prompt kits, agent wrappers, and open-source models.",
      sampleItems: ["AI Co-Founder Prompts", "OpenAgent UI", "Vector DB Starter"],
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderHeart className="w-4 h-4 text-blue-600" />
          <h2 className="font-bold text-sm text-slate-900">Curated Collections</h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Spotify-style stacks for founders</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {collections.map((col) => (
          <div
            key={col.id}
            onClick={() => onSelectCollection(col.id)}
            className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-extrabold uppercase text-white bg-gradient-to-r ${col.gradient} px-2 py-0.5 rounded-md shadow-xs`}>
                  {col.badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{col.count} Products</span>
              </div>

              <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                {col.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                {col.description}
              </p>

              {/* Sample Items List */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                {col.sampleItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
