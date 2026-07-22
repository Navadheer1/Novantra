"use client";

import { useEffect, useState } from "react";

// Hook to check prefers-reduced-motion for accessibility compliance
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reducedMotion;
}

// Reusable animation configurations
export const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 1
};

export const slowSpringTransition = {
  type: "spring" as const,
  stiffness: 50,
  damping: 20
};

export const easeInOutTransition = (duration = 0.6) => ({
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration
});

// Reusable styling preset tokens
export const themeTokens = {
  glassCard: "bg-white/60 backdrop-blur-md border border-white/30 shadow-sm",
  whiteCard: "bg-white border border-slate-200/60 shadow-sm rounded-3xl",
  gradientText: "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700",
  primaryGradient: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
  buttonShine: "relative overflow-hidden after:absolute after:inset-0 after:bg-white/10 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-1000"
};
