"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, Building2, Globe, Heart, Rocket } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      label: "Funding Facilitated",
      value: "$2.4B+",
      change: "Direct deal-flow",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Verified Founders",
      value: "120K+",
      change: "Global builder network",
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Accredited Investors",
      value: "45K+",
      change: "Top tier VCs & Angels",
      icon: Building2,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      label: "Product Followers",
      value: "1.3M+",
      change: "Early adopters",
      icon: Heart,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      label: "Countries Connected",
      value: "180",
      change: "Global tech hubs",
      icon: Globe,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    },
    {
      label: "Teams Created",
      value: "320K+",
      change: "Co-founders matched",
      icon: Rocket,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      <div className="glass-panel bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-left">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="space-y-2 border-r border-slate-100 last:border-0 pr-4 last:pr-0"
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-slate-800 block">{stat.label}</span>
                <span className="text-[10px] text-slate-500 block font-medium">{stat.change}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
