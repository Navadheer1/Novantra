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
  TrendingUp,
  Award,
  Layers,
  Search,
} from "lucide-react";

export function HeroSection() {
  const { isSignedIn, isLoaded } = useAuth();

  // Subtle 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), { damping: 25, stiffness: 120 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-6, 6]), { damping: 25, stiffness: 120 });

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
    <section className="relative pt-32 md:pt-44 pb-20 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-20">
      
      {/* Living Startup Ecosystem Background Lines & Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Soft Blue Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-sky-400/15 rounded-full blur-[120px]" />
        
        {/* SVG Animated Funding & Network Connection Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heroLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M 100 200 C 300 100, 500 300, 900 150 C 1100 80, 1300 250, 1500 200"
            fill="none"
            stroke="url(#heroLineGrad)"
            strokeWidth="2"
            strokeDasharray="8 8"
            className="animate-pulse"
          />
          <path
            d="M 50 450 C 350 350, 650 500, 1000 380 C 1250 300, 1450 450, 1600 400"
            fill="none"
            stroke="url(#heroLineGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>

        {/* AI Recommendation Floating Particles */}
        <motion.div
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-36 left-[15%] w-3 h-3 rounded-full bg-blue-500 blur-[1px]"
        />
        <motion.div
          animate={{ y: [10, -10, 10], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-48 right-[18%] w-4 h-4 rounded-full bg-emerald-400 blur-[1px]"
        />
      </div>

      {/* Announcement Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel bg-white/80 border border-blue-200/80 text-xs sm:text-sm text-slate-700 shadow-sm mb-8 group cursor-pointer hover:border-blue-400 transition-all"
      >
        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
        <span className="font-semibold text-slate-900">Noventra 2.0 Ecosystem</span>
        <span className="text-slate-300">|</span>
        <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          The Operating System for Startups <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </motion.div>

      {/* Cinematic Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 max-w-5xl leading-[1.06] text-balance"
      >
        Where Visionaries <br />
        <span className="text-gradient-hero">Build, Launch, Fund & Scale</span>
      </motion.h1>

      {/* Supporting Copy */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed font-normal text-balance"
      >
        Noventra is where startups are discovered, funded, built, and scaled. Connect with verified venture partners, recruit elite technical co-founders, launch products, and raise rounds with AI precision.
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
                Explore Platform Preview <Play className="w-4 h-4 ml-2 fill-slate-800" />
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

      {/* Social Proof Avatars & Stats */}
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
            +120k
          </div>
        </div>
        <span>Joined by founders & VCs from YC, Sequoia & Techstars</span>
      </motion.div>

    </section>
  );
}
