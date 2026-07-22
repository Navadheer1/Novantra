"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Noventra match founders with venture capital investors?",
      a: "Our Groq Llama 3 AI engine analyzes your deck metrics, current ARR, cap table structure, and sector thesis. It then cross-references this data with accredited investor profiles in our network to generate real-time match precision scores.",
    },
    {
      q: "Is my startup pitch deck kept confidential?",
      a: "Yes. Noventra incorporates SOC2 Type II bank-grade encryption and optional Stealth Mode. Investors must sign a mutual automated NDA before accessing proprietary pitch materials or cap tables.",
    },
    {
      q: "How do the live WebRTC Pitch Rooms work?",
      a: "WebRTC pitch rooms are browser-native video conference environments optimized for low-latency pitch presentations. They feature integrated deck slide sync, real-time AI copilot tips, live VC Q&A queues, and one-click term sheet triggers.",
    },
    {
      q: "Can I find technical co-founders or founding engineers on Noventra?",
      a: "Absolutely. Our Co-Founder & Talent Marketplace hosts over 1,200 verified engineers, product managers, and executives from top tech companies (ex-Google, Stripe, OpenAI) looking for equity-aligned early stage ventures.",
    },
    {
      q: "Does Noventra take any equity or success fee on rounds raised?",
      a: "Zero. Noventra operates on a clean subscription model with no carry, equity cut, or hidden transaction fees.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Everything You <span className="text-gradient-cyan">Need to Know</span>
        </h2>
      </div>

      {/* Accordions */}
      <div className="space-y-4 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-panel bg-white/90 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 flex items-center justify-between text-left text-slate-900 font-bold text-base sm:text-lg hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 font-normal">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
