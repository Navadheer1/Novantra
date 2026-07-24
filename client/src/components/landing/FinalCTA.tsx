"use client";

import { Button } from "@/components/ui/button";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, ArrowRight, Globe, Share2, MessageSquare } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export function FinalCTA() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <footer className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
      {/* Final Call to Action Banner Box */}
      <div className="relative rounded-3xl glass-panel bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/90 border border-blue-200/90 p-8 sm:p-16 text-center overflow-hidden shadow-xl mb-20">
        {/* Background Light Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/15 rounded-full filter blur-[100px] pointer-events-none -z-10 animate-pulse-glow" />

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" /> Join the Top 1% of Founders
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Ready to Build & Raise <br />
            <span className="text-gradient-hero">Without Limits?</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto">
            Get started today on Noventra. Match with verified venture partners, build your dream team, launch products, and scale globally with AI precision.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoaded ? (
              <div className="h-14 w-48 bg-slate-100 rounded-2xl animate-pulse" />
            ) : !isSignedIn ? (
              <>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-600/25 border border-blue-500/20 hover:scale-[1.02] transition-all"
                  >
                    Launch Your Startup Free <Sparkles className="w-5 h-5 ml-2" />
                  </Button>
                </SignUpButton>
                <a href="#marketplace" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 glass-panel bg-white/80 hover:bg-white text-slate-800 font-bold text-base rounded-2xl border border-slate-200 hover:border-blue-400 transition-all shadow-xs"
                  >
                    Browse Co-Founders <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </>
            ) : (
              <Link href="/feed" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-600/25"
                >
                  Enter Workspace Feed <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Ecosystem Footer Links */}
      <div className="pt-12 border-t border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-8 text-left text-xs">
        {/* Brand Col */}
        <div className="col-span-2 space-y-4">
          <BrandLogo size={30} showText={true} textClassName="text-lg font-bold tracking-tight text-slate-900" />
          <p className="text-slate-600 leading-relaxed font-normal max-w-sm">
            The next-generation platform for founders, venture capitalists, and top engineering talent. Pitch, match, and scale globally.
          </p>
          <div className="flex items-center gap-3 text-slate-500">
            <a href="#" className="hover:text-blue-600 p-2 rounded-lg bg-white border border-slate-200 shadow-xs" aria-label="Global Network">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-blue-600 p-2 rounded-lg bg-white border border-slate-200 shadow-xs" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-blue-600 p-2 rounded-lg bg-white border border-slate-200 shadow-xs" aria-label="Community">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links Col 1 */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Platform</h4>
          <ul className="space-y-2 text-slate-600 font-medium">
            <li><a href="#product-showcase" className="hover:text-blue-600">Product Showcase</a></li>
            <li><a href="#ai-matching" className="hover:text-blue-600">Groq AI Copilot</a></li>
            <li><a href="#marketplace" className="hover:text-blue-600">Co-Founder Matcher</a></li>
            <li><a href="#dashboard" className="hover:text-blue-600">Deal-Flow Radar</a></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Ecosystem</h4>
          <ul className="space-y-2 text-slate-600 font-medium">
            <li><a href="#community" className="hover:text-blue-600">Global Hubs</a></li>
            <li><a href="#pricing" className="hover:text-blue-600">Pricing Tiers</a></li>
            <li><a href="#faq" className="hover:text-blue-600">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-600">Security Vault</a></li>
          </ul>
        </div>

        {/* Links Col 3 */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Legal & Trust</h4>
          <ul className="space-y-2 text-slate-600 font-medium">
            <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-600">Mutual NDA Vault</a></li>
            <li><a href="#" className="hover:text-blue-600">SOC2 Compliance</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>© 2026 Noventra Inc. All rights reserved. Designed for visionaries.</span>
        <span>Built with Next.js 16, Framer Motion & TailwindCSS</span>
      </div>
    </footer>
  );
}
