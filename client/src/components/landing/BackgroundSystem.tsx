"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundSystem() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Light Base Background */}
      <div className="absolute inset-0 bg-[#F8FAFC]" />

      {/* 2. Light Mesh Gradient 1 (Soft Blue Ambient Accent) */}
      <div className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,rgba(37,99,235,0.02)_50%,transparent_70%)] filter blur-[90px] animate-aurora opacity-80 pointer-events-none" />

      {/* 3. Light Mesh Gradient 2 (Indigo Accent) */}
      <div className="absolute top-[25%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0,rgba(124,58,237,0.01)_45%,transparent_70%)] filter blur-[110px] animate-aurora opacity-70 pointer-events-none" style={{ animationDelay: "-8s" }} />

      {/* 4. White Radial Volumetric Lighting Cone for Content Readability */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[600px] bg-gradient-to-b from-white/70 via-blue-50/20 to-transparent filter blur-2xl opacity-80 pointer-events-none" />

      {/* 5. Subtle Noise Layer */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
