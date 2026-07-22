"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../../lib/design-system";

export default function BackgroundEffects() {
  const isReduced = useReducedMotion();
  const [isTouch, setIsTouch] = useState(true);

  // Spotlight coordinates utilizing spring animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch-capable devices to disable mouse spotlights
    const touchMediaQuery = window.matchMedia("(pointer: coarse)");
    setIsTouch(touchMediaQuery.matches);

    const handleTouchChange = (e: MediaQueryListEvent) => {
      setIsTouch(e.matches);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    touchMediaQuery.addEventListener("change", handleTouchChange);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      touchMediaQuery.removeEventListener("change", handleTouchChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none select-none">
      
      {/* 1. Subtle noise texture layer */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. Gradient mesh glowing blobs (frozen if prefers-reduced-motion is active) */}
      {!isReduced ? (
        <>
          {/* Top-left blue blob */}
          <motion.div 
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[-15%] left-[-15%] w-[65%] h-[65%] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0,transparent_60%)] filter blur-3xl"
          />
          {/* Top-right indigo blob */}
          <motion.div 
            animate={{
              x: [0, -40, 25, 0],
              y: [0, 30, -40, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[10%] right-[-15%] w-[55%] h-[55%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_65%)] filter blur-3xl"
          />
          {/* Bottom blue blob */}
          <motion.div 
            animate={{
              x: [0, 20, -30, 0],
              y: [0, 40, -20, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-[5%] left-[15%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04)_0,transparent_55%)] filter blur-3xl"
          />
        </>
      ) : (
        <>
          {/* Static fallbacks for reduced motion */}
          <div className="absolute top-[-15%] left-[-15%] w-[65%] h-[65%] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0,transparent_60%)] filter blur-3xl" />
          <div className="absolute top-[10%] right-[-15%] w-[55%] h-[55%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_65%)] filter blur-3xl" />
          <div className="absolute bottom-[5%] left-[15%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04)_0,transparent_55%)] filter blur-3xl" />
        </>
      )}

      {/* 3. Sleek background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

      {/* 4. Cursor Spotlight (only active on non-touch screens with animations enabled) */}
      {!isReduced && !isTouch && (
        <motion.div
          className="fixed w-[450px] h-[450px] rounded-full pointer-events-none mix-blend-screen opacity-45 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: springX,
            top: springY,
            background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(99,102,241,0) 70%)",
            filter: "blur(20px)"
          }}
        />
      )}

    </div>
  );
}
