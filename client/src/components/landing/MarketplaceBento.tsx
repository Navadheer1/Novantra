"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Briefcase,
} from "lucide-react";

export function MarketplaceBento() {
  const [selectedRole, setSelectedRole] = useState("All Roles");

  const talentProfiles = [
    {
      name: "Sophia Chen",
      title: "Co-Founder / AI Architect",
      prevCompany: "Ex-Google DeepMind",
      equity: "15% - 25%",
      skills: ["PyTorch", "Rust", "LLMs", "Distributed Systems"],
      location: "San Francisco, CA",
      verified: true,
      matchScore: 98,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    },
    {
      name: "Marcus Vance",
      title: "Founding Engineer (Backend)",
      prevCompany: "Ex-Stripe Staff Engineer",
      equity: "5% - 10%",
      skills: ["Go", "Kubernetes", "PostgreSQL", "Fintech"],
      location: "New York, NY",
      verified: true,
      matchScore: 96,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    {
      name: "Aria Montgomery",
      title: "Head of Product Design",
      prevCompany: "Ex-Framer & Linear",
      equity: "8% - 12%",
      skills: ["Design Systems", "Figma", "Design Ops", "Frontend"],
      location: "London, UK",
      verified: true,
      matchScore: 94,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
  ];

  return (
    <section id="marketplace" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Users className="w-3.5 h-3.5" /> Co-Founder & Talent Marketplace
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Find Your Missing <span className="text-gradient-primary">Co-Founder & Talent</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          Connect with pre-vetted engineers, product leaders, and domain experts ready to build high-growth startups with equity alignment.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        
        {/* Main Bento Feature Card: Interactive Talent Explorer (Spans 3 cols) */}
        <div className="md:col-span-2 lg:col-span-3 glass-panel bg-white/90 border border-slate-200/90 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg group">
          {/* Card Header & Filter Bar */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Live Marketplace</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Top Matched Founders & Builders</h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 border border-slate-200 p-1 rounded-xl">
                {["All Roles", "Technical Co-Founder", "Product Design", "Growth"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      selectedRole === role
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Talent Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {talentProfiles.map((talent, idx) => (
                <motion.div
                  key={talent.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card bg-white/90 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={talent.avatar}
                        alt={talent.name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-bold text-slate-900">{talent.name}</h4>
                          {talent.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block">{talent.prevCompany}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      {talent.matchScore}% Match
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">{talent.title}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                      <Briefcase className="w-3 h-3 text-slate-400" /> Target Equity:{" "}
                      <span className="text-emerald-600 font-bold">{talent.equity}</span>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {talent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button className="w-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 group/btn">
                    <span>Request Intro</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Metric Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>⚡ Over 1,200+ verified talent profiles available</span>
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              View All Marketplace Profiles →
            </span>
          </div>
        </div>

        {/* Bento Card 2: AI Complementary Skill Graph */}
        <div className="glass-panel bg-white/90 border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Skill Matrix Match</h3>
            <p className="text-xs text-slate-500 mt-1">
              AI analyzes personality traits, technical stacks, and risk profiles to predict co-founder longevity.
            </p>
          </div>

          <div className="my-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Technical Synergy</span>
                <span className="text-indigo-600 font-bold">99%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[99%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Equity Alignment</span>
                <span className="text-blue-600 font-bold">95%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[95%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Time Commitment</span>
                <span className="text-emerald-600 font-bold">100% Full-time</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[100%]" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-[11px] text-indigo-700 flex items-center gap-2">
            <Zap className="w-4 h-4 shrink-0 text-indigo-600" />
            <span>Highest compatibility match in FinTech & AI infra</span>
          </div>
        </div>

        {/* Bento Card 3: Background & Equity Verification */}
        <div className="glass-panel bg-white/90 border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">100% Verified Identity</h3>
            <p className="text-xs text-slate-500 mt-1">
              Every founder and builder is background-checked with work history verified from LinkedIn, GitHub, and past employers.
            </p>
          </div>

          <div className="my-4 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>GitHub Code Contribution Audit</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Accredited Investor Verification</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Standardized FAST & SAFE Contracts</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
