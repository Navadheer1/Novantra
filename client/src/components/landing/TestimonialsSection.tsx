"use client";

import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Noventra completely changed how we raised our Seed round. The Groq AI copilot helped us refine our narrative, and we connected with Sequoia in 4 days.",
      author: "Alex Rivera",
      role: "CEO @ AI Flow",
      fund: "Raised $2.4M",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    },
    {
      quote: "As a VC partner, Noventra saves our team hundreds of hours of deal screening. The AI matches are incredibly high signal.",
      author: "David Vance",
      role: "Partner @ Lightspeed",
      fund: "Active Investor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    },
    {
      quote: "Found my technical co-founder on Noventra after searching for 6 months on LinkedIn. The complementary skill scoring was spot on.",
      author: "Samantha Wu",
      role: "Co-Founder @ BioHealth AI",
      fund: "Pre-Seed YC W26",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    },
    {
      quote: "The interactive pitching experience is lightyears ahead of static PDF decks. Instant slide sync, real-time AI copilot, and direct investor engagement.",
      author: "Liam O'Connor",
      role: "Founder @ Quantum Compute",
      fund: "Raised $4.1M Series A",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-2">
          Endorsed by Top Innovators
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Trusted by <span className="text-gradient-hero">Founders & Investors</span>
        </h2>
      </div>

      {/* Infinite Marquee Track */}
      <div className="flex overflow-hidden relative w-full">
        <div className="flex gap-6 animate-marquee">
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel bg-white/90 border border-slate-200/90 p-6 rounded-3xl w-80 sm:w-96 text-left flex flex-col justify-between shrink-0 shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-normal italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.author}</h4>
                  <span className="text-[10px] text-slate-500 block">{item.role}</span>
                  <span className="text-[9px] text-emerald-700 font-bold">{item.fund}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
