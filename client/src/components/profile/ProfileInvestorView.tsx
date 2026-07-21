"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, CheckCircle2, XCircle, Send, Globe, 
  MapPin, DollarSign, Layers, Compass, ArrowRight, ShieldCheck 
} from "lucide-react";
import EmptyState from "./EmptyState";

interface PortfolioCompany {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  stage: string;
  year: string;
  status: "Active" | "Exited" | "Acquired";
  description?: string;
}

interface RecentDeal {
  id: string;
  companyName: string;
  round: string;
  amount: string;
  date: string;
  coInvestors?: string[];
}

interface InvestorViewProps {
  profile: {
    bio: string | null;
    investmentThesis?: string;
    focusAreas?: string[];
    preferences?: {
      stages: string[];
      geography: string;
      checkSize: string;
      leadRole: string;
      coInvest: boolean;
    };
    portfolio?: PortfolioCompany[];
    recentDeals?: RecentDeal[];
    acceptingPitches?: boolean;
  };
  onPitchSubmit?: () => void;
}

export default function ProfileInvestorView({ profile, onPitchSubmit }: InvestorViewProps) {
  const thesis = profile.investmentThesis || 
    "We back visionary founders building generational software infrastructure, AI applications, and developer primitives. We believe in lean teams leveraging modern AI tooling to displace incumbents 10x faster.";

  const focusChips = profile.focusAreas?.length ? profile.focusAreas : [
    "AI & ML", "FinTech", "SaaS", "Developer Tools", "Healthcare", "Climate", "DeepTech", "EdTech"
  ];

  const prefs = profile.preferences || {
    stages: ["Pre-Seed", "Seed", "Series A"],
    geography: "North America & Remote Global",
    checkSize: "$100k – $500k",
    leadRole: "Leads or Co-Leads",
    coInvest: true
  };

  const defaultPortfolio: PortfolioCompany[] = [
    {
      id: "p1",
      name: "Acme AI Systems",
      industry: "AI / DevTools",
      stage: "Series A",
      year: "2024",
      status: "Active",
      description: "Autonomous LLM evaluation infrastructure for enterprise tech stacks."
    },
    {
      id: "p2",
      name: "PulseHealth",
      industry: "Healthcare Tech",
      stage: "Seed",
      year: "2023",
      status: "Active",
      description: "AI-native triage and patient workflow automation platform."
    },
    {
      id: "p3",
      name: "FinFlow Data",
      industry: "FinTech",
      stage: "Series B",
      year: "2022",
      status: "Acquired",
      description: "Cross-border payment clearing pipeline for digital commerce."
    }
  ];

  const portfolioList = profile.portfolio && profile.portfolio.length > 0 ? profile.portfolio : defaultPortfolio;

  const defaultDeals: RecentDeal[] = [
    { id: "d1", companyName: "Acme AI Systems", round: "Series A", amount: "$500k", date: "Q1 2026", coInvestors: ["Sequoia", "Accel"] },
    { id: "d2", companyName: "HyperCloud", round: "Seed", amount: "$250k", date: "Q4 2025", coInvestors: ["Y Combinator"] },
    { id: "d3", companyName: "NeuroLabs", round: "Pre-Seed", amount: "$150k", date: "Q3 2025", coInvestors: ["AngelList Syndicate"] },
  ];

  const dealList = profile.recentDeals && profile.recentDeals.length > 0 ? profile.recentDeals : defaultDeals;

  const isAccepting = profile.acceptingPitches !== false;

  return (
    <div className="space-y-6">
      
      {/* 1. Pitching Status Banner */}
      <div className={`p-6 rounded-[20px] border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        isAccepting 
          ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-950" 
          : "bg-amber-50/70 border-amber-200/80 text-amber-950"
      }`}>
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isAccepting ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
          }`}>
            {isAccepting ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-extrabold text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <span>{isAccepting ? "Currently Accepting Startup Pitches" : "Pitch Window Currently Paused"}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/80 border border-current">
                {isAccepting ? "Open" : "Selective"}
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {isAccepting 
                ? "Send your pitch deck and traction summary directly to this investor's inbox."
                : "This investor is focusing on existing portfolio support and direct warm intros."}
            </p>
          </div>
        </div>

        {isAccepting && onPitchSubmit && (
          <Button
            onClick={onPitchSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl px-5 h-10 shadow-sm shrink-0 flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Pitch Deck</span>
          </Button>
        )}
      </div>

      {/* 2. About & Investment Thesis */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">Background</span>
          <h3 className="text-lg font-black text-slate-900">About the Investor</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 whitespace-pre-line">
            {profile.bio || "Active early-stage investor with a track record of supporting seed-stage technology founders."}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-500 block mb-1">Core Philosophy</span>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-500" /> Investment Thesis
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-100 p-4 rounded-2xl italic leading-relaxed mt-2">
            "{thesis}"
          </p>
        </div>
      </div>

      {/* 3. Focus Areas Chips */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Focus Areas & Sectors</h3>
        <div className="flex flex-wrap gap-2">
          {focusChips.map((chip) => (
            <span
              key={chip}
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 text-xs px-3.5 py-1.5 rounded-xl font-bold transition-colors"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Investment Preferences Grid */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Investment Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Target Stages
            </span>
            <div className="flex flex-wrap gap-1 pt-1">
              {prefs.stages.map((stg) => (
                <span key={stg} className="bg-white text-slate-800 text-[11px] font-extrabold px-2 py-0.5 rounded border border-slate-200">
                  {stg}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Typical Check Size
            </span>
            <p className="text-xs font-black text-slate-900 pt-1">{prefs.checkSize}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Preferred Geography
            </span>
            <p className="text-xs font-black text-slate-900 pt-1">{prefs.geography}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Lead Dynamics
            </span>
            <p className="text-xs font-black text-slate-900 pt-1">{prefs.leadRole}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-sky-500" /> Co-Investment Strategy
            </span>
            <p className="text-xs font-black text-slate-900 pt-1">
              {prefs.coInvest ? "Open to Syndicates & Syndicated Checks" : "Solo Lead Only"}
            </p>
          </div>

        </div>
      </div>

      {/* 5. Portfolio Companies Cards */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Portfolio Companies</h3>
            <p className="text-xs text-slate-500">Selected startup investments & syndicate allocations</p>
          </div>
          <Link href="/startups">
            <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl border-slate-200">
              Browse All Startups →
            </Button>
          </Link>
        </div>

        {portfolioList.length === 0 ? (
          <EmptyState
            icon="portfolio"
            title="No Portfolio Companies Listed"
            description="This investor hasn't added public portfolio records yet."
            actionLabel="Browse Promising Startups"
            actionHref="/startups"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center border border-blue-100 text-sm">
                      {item.name[0]}
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      item.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-purple-50 text-purple-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 mt-3">{item.name}</h4>
                  <p className="text-[11px] font-semibold text-slate-400">{item.industry}</p>
                  
                  {item.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] font-semibold text-slate-500">
                  <span>{item.stage}</span>
                  <span>Invested {item.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Recent Investment Timeline */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-5">
        <h3 className="text-base font-black text-slate-900">Recent Deals Timeline</h3>
        <div className="relative border-l-2 border-blue-100 ml-3 pl-6 space-y-6">
          {dealList.map((deal) => (
            <div key={deal.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white shadow-sm" />
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span>{deal.companyName}</span>
                    <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {deal.round}
                    </span>
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Co-Investors: {deal.coInvestors?.join(", ") || "Syndicate"}
                  </p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 block">
                    {deal.amount} Allocation
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">{deal.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
