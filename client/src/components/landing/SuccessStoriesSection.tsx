"use client";

import { motion } from "framer-motion";
import { Award, DollarSign, Clock, Users } from "lucide-react";

export function SuccessStoriesSection() {
  const metrics = [
    { label: "Venture Capital Raised", value: "$140M+", icon: DollarSign, change: "+240% YoY" },
    { label: "Founder-VC Matches", value: "850+", icon: Users, change: "98% Fit Score" },
    { label: "Avg Time to Term Sheet", value: "14 Days", icon: Clock, change: "vs 4 Months Industry Avg" },
    { label: "Co-Founder Success Rate", value: "94%", icon: Award, change: "Multi-year Retention" },
  ];

  const stories = [
    {
      company: "Synapse AI",
      stage: "Series A — $3.2M",
      founder: "Elena Vance (Ex-Google)",
      vc: "Sequoia Capital Lead",
      quote: "We generated our entire pitch deck strategy and found our lead investor on Noventra in less than two weeks. Zero warm intro friction.",
      metrics: "ARR grew from $100k to $1.4M in 8 months",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    },
    {
      company: "Payload Security",
      stage: "Seed — $1.8M",
      founder: "Marcus Thorne (Ex-Stripe)",
      vc: "a16z & Founders Fund",
      quote: "The seamless product workspace made pitching effortless. Investors reviewed our live terminal demo and traction metrics without friction or software installs.",
      metrics: "Closed 100% of target allocation",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel bg-white/90 border border-slate-200/90 p-6 rounded-3xl text-left shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">{metric.value}</span>
              <span className="text-xs text-slate-600 font-bold mt-1 block">{metric.label}</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-2 inline-block">
                {metric.change}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Case Studies Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Proven Success <span className="text-gradient-gold">Case Studies</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          Real stories from founders who raised capital and hired world-class co-founders on Noventra.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div
            key={story.company}
            className="glass-panel bg-white/95 border border-slate-200/90 p-8 rounded-3xl flex flex-col justify-between text-left space-y-6 shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{story.company}</h3>
                <span className="text-xs text-emerald-700 font-extrabold">{story.stage}</span>
              </div>
              <span className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
                {story.vc}
              </span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed italic">"{story.quote}"</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={story.avatar}
                  alt={story.founder}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{story.founder}</span>
                  <span className="text-[10px] text-slate-500">{story.metrics}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
