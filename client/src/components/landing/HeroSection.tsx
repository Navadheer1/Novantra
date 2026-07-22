"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Sparkles,
  Play,
  CheckCircle2,
  Globe2,
} from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const { isSignedIn, isLoaded } = useAuth();

  // Subtle 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), { damping: 20, stiffness: 100 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { damping: 20, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-20">
      {/* Announcement Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel bg-white/80 border border-blue-200/80 text-xs sm:text-sm text-slate-700 shadow-sm mb-8 group cursor-pointer hover:border-blue-400 transition-all"
      >
        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
        <span className="font-semibold text-slate-900">Noventra 2.0 Engine Live</span>
        <span className="text-slate-300">|</span>
        <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          AI Pitch Matching & WebRTC Rooms <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </motion.div>

      {/* Cinematic Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 max-w-5xl leading-[1.08] text-balance"
      >
        Where Visionaries <br />
        <span className="text-gradient-hero">Build, Pitch & Raise</span>
      </motion.h1>

      {/* Supporting Copy */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed font-normal text-balance"
      >
        The unified ecosystem connecting elite founders, verified venture capitalists, and top engineering talent. Pitch live in WebRTC rooms, generate AI deal-flow, and close rounds faster.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
      >
        {!isLoaded ? (
          <div className="h-14 w-48 bg-slate-200 rounded-2xl animate-pulse" />
        ) : !isSignedIn ? (
          <>
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-600/25 border border-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Launch Your Startup <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </SignUpButton>
            <a href="#dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 glass-panel bg-white/80 hover:bg-white text-slate-800 font-bold text-base rounded-2xl border border-slate-200 hover:border-blue-400 transition-all shadow-sm"
              >
                Explore Product Preview <Play className="w-4 h-4 ml-2 fill-slate-800" />
              </Button>
            </a>
          </>
        ) : (
          <Link href="/feed" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all"
            >
              Enter Noventra Workspace <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        )}
      </motion.div>

      {/* Social Proof Avatars / Stats Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-600 font-medium"
      >
        <div className="flex items-center -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
            alt="Founder"
            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
            alt="VC Partner"
            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Engineer"
            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            +4k
          </div>
        </div>
        <span>Joined by founders from YC, Sequoia & Techstars</span>
      </motion.div>

      {/* Hero Interactive 3D Mockup Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="mt-14 w-full relative max-w-5xl group perspective-1000"
      >
        {/* Soft Ambient Glow behind mockup */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-500" />

        {/* Floating Founder Card - Left */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute -left-12 top-16 z-30 glass-panel bg-white/95 p-4 rounded-2xl border border-slate-200/80 shadow-xl items-center gap-3.5 w-64 text-left"
        >
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop"
            alt="Elena Vance"
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/30"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900">Elena Vance</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
            </div>
            <span className="text-[10px] text-slate-500 block font-medium">Founder @ NeuralAI</span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-1 inline-block">
              +$1.8M Raised • Seed
            </span>
          </div>
        </motion.div>

        {/* Floating Investor Card - Right */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute -right-12 bottom-20 z-30 glass-panel bg-white/95 p-4 rounded-2xl border border-slate-200/80 shadow-xl items-center gap-3.5 w-70 text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-lg shrink-0">
            SQ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">Sequoia Partner Match</span>
              <span className="text-[9px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded border border-blue-200">
                98% Fit
              </span>
            </div>
            <span className="text-[10px] text-slate-600 block mt-0.5">Term Sheet Requested</span>
            <span className="text-[10px] text-slate-500 block">AI Infrastructure • $5M Cap</span>
          </div>
        </motion.div>

        {/* Main Dashboard Canvas Frame */}
        <div className="relative rounded-3xl glass-panel bg-white/95 border border-slate-200/90 shadow-2xl p-3 sm:p-5 overflow-hidden">
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-600" /> noventra.io/live-room/synapse-ai
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" /> Live WebRTC Session
              </span>
            </div>
          </div>

          {/* Interactive Screen Preview */}
          <div className="aspect-[16/9] bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 text-left shadow-inner">
            {/* Grid Pattern inside preview */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            {/* Video Streams Simulated Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 z-10">
              {/* Speaker 1: Founder */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop"
                  alt="Founder Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="text-[11px] text-white font-semibold">Elena (Founder)</span>
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                    Speaking
                  </span>
                </div>
              </div>

              {/* Speaker 2: VC 1 */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
                  alt="VC Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="text-[11px] text-white font-semibold">Marcus (a16z Partner)</span>
                  <span className="text-[9px] text-slate-400 font-bold">Muted</span>
                </div>
              </div>

              {/* Pitch Slide & Live Metrics Panel */}
              <div className="hidden md:flex flex-col justify-between p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Live Deck Stream
                  </span>
                  <h4 className="text-white font-bold text-sm mt-0.5">Synapse AI — Slide 4/12</h4>
                  <p className="text-[10px] text-slate-400 mt-1">ARR: $1.2M • MoM Growth: 34% • LTV/CAC: 4.8x</p>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Round Progress</span>
                    <span className="text-blue-400 font-bold">$1.8M / $2.5M</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[72%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Real-time AI Copilot Footer Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 border border-slate-800 p-3 rounded-xl z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                    Groq Llama 3 AI Pitch Assistant
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    "Investor interest score elevated. Focus on unit economics for the next 2 minutes."
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold">
                  2 VC Requests Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
