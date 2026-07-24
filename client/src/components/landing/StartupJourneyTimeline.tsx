"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Code2,
  Users,
  Rocket,
  DollarSign,
  Globe2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function StartupJourneyTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "01",
      title: "Idea & Validation",
      icon: Lightbulb,
      tagline: "AI Market Research & Thesis Validation",
      desc: "Analyze tam size, competitor moats, and Groq Llama 3 thesis recommendations before writing code.",
      highlights: ["Sub-second TAM analysis", "Patent & competitor scan", "Automated executive summary"],
    },
    {
      id: "02",
      title: "Build Product",
      icon: Code2,
      tagline: "Developer Workspaces & Stack Integrations",
      desc: "Architect your core tech stack with pre-vetted developer tools, APIs, and AI copilot code auditing.",
      highlights: ["GitHub repo health audit", "SOC2 compliance templates", "System architecture blueprints"],
    },
    {
      id: "03",
      title: "Find Co-Founders",
      icon: Users,
      tagline: "Skill-Matrix Matching & Equity SAFEs",
      desc: "Connect with verified technical co-founders, CTOs, and product leaders with automated FAST contracts.",
      highlights: ["1,200+ verified talent profiles", "AI personality & skill matrix fit", "Standard SAFE equity templates"],
    },
    {
      id: "04",
      title: "Launch Product",
      icon: Rocket,
      tagline: "Ecosystem Discovery & Community Upvotes",
      desc: "Launch your product to 1.3M+ tech adopters, accredited investors, and ecosystem partners.",
      highlights: ["App Store & Product Hunt showcase", "Live user traction feeds", "Automated press & VC alerts"],
    },
    {
      id: "05",
      title: "Raise Funding",
      icon: DollarSign,
      tagline: "Direct VC Match & One-Click Term Sheets",
      desc: "Bypass warm intro gatekeepers. Match directly with Sequoia, a16z, and Lightspeed partner thesis filters.",
      highlights: ["98% thesis match precision", "Zero carry or broker fees", "Encrypted NDA deal-flow vaults"],
    },
    {
      id: "06",
      title: "Scale Globally",
      icon: Globe2,
      tagline: "Talent Hiring & Multi-Region Hubs",
      desc: "Expand your engineering hubs across 180 countries while managing multi-tenant team access.",
      highlights: ["Global hub connections", "Multi-region payroll & compliance", "Advisor & mentor network"],
    },
    {
      id: "07",
      title: "IPO / Acquisition",
      icon: TrendingUp,
      tagline: "Institutional Vaults & Strategic M&A",
      desc: "Manage cap tables, institutional audits, and secondary liquidity transactions seamlessly.",
      highlights: ["Institutional investor reporting", "M&A deal rooms & vaults", "Secondary market liquidity"],
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="journey" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> End-to-End Operating System
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          The Lifecycle of <span className="text-gradient-hero">World-Changing Startups</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          From initial napkin idea to global IPO — Noventra provides the software, intelligence, and network for every milestone.
        </p>
      </div>

      {/* Interactive Timeline Step Selector */}
      <div className="flex items-center justify-between overflow-x-auto pb-4 mb-10 gap-3 border-b border-slate-200 no-scrollbar">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                {step.id}
              </span>
              <Icon className="w-4 h-4" />
              <span>{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Feature Display Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="glass-panel bg-white/95 border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left"
        >
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold">
              <span>STAGE {current.id} OF 07</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {current.title}: <span className="text-blue-600">{current.tagline}</span>
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {current.desc}
            </p>

            <div className="space-y-2.5 pt-2">
              {current.highlights.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Graphic Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 text-white space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <span className="text-slate-400 font-mono">Stage Blueprint</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                Active Module
              </span>
            </div>

            <div className="space-y-3 py-2">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Stage Automation Status</span>
                <span className="text-blue-400 font-bold">Ready</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Ecosystem Network Access</span>
                <span className="text-emerald-400 font-bold">100% Unlocked</span>
              </div>
            </div>

            <button
              onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Next Stage Preview ({steps[(activeStep + 1) % steps.length].title})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
