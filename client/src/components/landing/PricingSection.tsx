"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

export function PricingSection() {
  const { isSignedIn, isLoaded } = useAuth();
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: "Founder Starter",
      priceMonthly: "$0",
      priceAnnual: "$0",
      period: "forever free",
      desc: "Essential tools for early-stage founders building their first pitch deck.",
      popular: false,
      buttonText: "Start Building Free",
      features: [
        "1 Active Pitch Deck Profile",
        "Co-Founder Marketplace Browsing",
        "Basic Groq AI Pitch Analysis",
        "Standard WebRTC 1-on-1 Rooms",
        "Community Discord & Events",
      ],
    },
    {
      name: "Growth Founder",
      priceMonthly: "$49",
      priceAnnual: "$39",
      period: "per month, billed annually",
      desc: "For stealth & seed-stage teams raising capital and scaling hiring.",
      popular: true,
      buttonText: "Get Growth Pass",
      features: [
        "Unlimited Active Pitch Decks",
        "Direct VC Deal-Flow Dispatch",
        "Groq Llama 3 Real-time Pitch Copilot",
        "Priority Investor Thesis Matching",
        "One-Click Mutual NDA Vaults",
        "Co-Founder Equity SAFE Generator",
      ],
    },
    {
      name: "VC & Investor Pro",
      priceMonthly: "$199",
      priceAnnual: "$159",
      period: "per seat/month, billed annually",
      desc: "For accredited angels, family offices, and VC partners seeking proprietary deal flow.",
      popular: false,
      buttonText: "Join Investor Network",
      features: [
        "Full Ecosystem Deal-Flow Access",
        "Custom Investment Thesis Filtering",
        "Automated Term Sheet Generator",
        "WebRTC Room Co-Hosting Controls",
        "Unfiltered Direct Founder DMs",
        "Dedicated Portfolio Manager",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Transparent Pricing
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Invest in Your <span className="text-gradient-primary">Startup's Speed</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          Simple pricing with zero hidden commission or carry fees. Choose the plan that fits your stage.
        </p>

        {/* Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-full shadow-sm">
          <button
            onClick={() => setAnnual(false)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
              !annual ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              annual ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`glass-panel rounded-3xl p-8 flex flex-col justify-between text-left relative transition-all duration-300 ${
              tier.popular
                ? "bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 scale-[1.03] z-10"
                : "bg-white/90 border border-slate-200/90 hover:border-blue-300 shadow-sm"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular for Founders
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
              <p className="text-xs text-slate-500 mt-2 min-h-[36px] font-normal">{tier.desc}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  {annual ? tier.priceAnnual : tier.priceMonthly}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {tier.priceMonthly === "$0" ? "forever" : annual ? "/mo billed annually" : "/month"}
                </span>
              </div>

              {/* Checklist */}
              <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Included Features:
                </span>
                {tier.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              {!isLoaded ? (
                <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse" />
              ) : !isSignedIn ? (
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className={`w-full h-12 rounded-2xl font-bold text-xs ${
                      tier.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
                    }`}
                  >
                    {tier.buttonText}
                  </Button>
                </SignUpButton>
              ) : (
                <Link href="/feed" className="w-full">
                  <Button
                    size="lg"
                    className={`w-full h-12 rounded-2xl font-bold text-xs ${
                      tier.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    Access Workspace
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
