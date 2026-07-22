"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/design-system";
import { Building2, Compass, Cpu, DollarSign, Globe, Shield } from "lucide-react";

export default function LogoMarquee() {
  const isReduced = useReducedMotion();

  const brands = [
    { name: "Y-Combinator", icon: Cpu },
    { name: "Sequoia Capital", icon: Building2 },
    { name: "Founders Fund", icon: DollarSign },
    { name: "Techstars Hub", icon: Compass },
    { name: "Andreessen Horowitz", icon: Shield },
    { name: "Accel Partners", icon: Globe }
  ];

  // Repeat items for seamless infinite scroll loops
  const doubleBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden relative select-none">
      
      {/* Edge gradient mask overlay */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 space-y-4">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-center block">
          TRUSTED BY LEADERS ACROSS THE STARTUP ECOSYSTEM
        </span>

        {isReduced ? (
          // Static layout for prefers-reduced-motion
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            {brands.map((brand, i) => {
              const Icon = brand.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 opacity-45 grayscale hover:grayscale-0 hover:opacity-90 transition-all duration-300">
                  <Icon className="w-5 h-5 text-slate-900" />
                  <span className="font-extrabold text-xs tracking-tight text-slate-900">{brand.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          // Infinite animated marquee
          <div className="relative flex items-center overflow-hidden py-3">
            <motion.div 
              animate={{ x: ["0%", "-33.33%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 22,
                  ease: "linear"
                }
              }}
              whileHover={{ animationPlayState: "paused" }}
              style={{ display: "flex", width: "max-content" }}
              className="gap-16 items-center cursor-pointer"
            >
              {doubleBrands.map((brand, i) => {
                const Icon = brand.icon;
                return (
                  <div 
                    key={i} 
                    className="flex items-center gap-2.5 opacity-40 grayscale hover:grayscale-0 hover:opacity-95 transition-all duration-300 group shrink-0"
                  >
                    <Icon className="w-5 h-5 text-slate-900 group-hover:scale-110 transition-transform text-blue-600" />
                    <span className="font-extrabold text-xs tracking-tight text-slate-900">{brand.name}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

    </section>
  );
}
