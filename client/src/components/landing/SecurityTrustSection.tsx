"use client";

import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";

export function SecurityTrustSection() {
  const securityFeatures = [
    {
      title: "SOC2 Type II Certified",
      desc: "Bank-grade encryption protecting pitch decks, financial caps, and proprietary AI models.",
      icon: ShieldCheck,
    },
    {
      title: "End-to-End Encrypted WebRTC",
      desc: "Live pitch room streams use WebRTC DTLS/SRTP encryption. Zero video recording without founder consent.",
      icon: Lock,
    },
    {
      title: "Stealth Mode & One-Click NDAs",
      desc: "Keep your startup hidden from competitors until verified investors sign your mutual NDA.",
      icon: EyeOff,
    },
    {
      title: "Accredited Investor Vetting",
      desc: "Strict KYC & SEC accreditation verification for all participating venture partners and angels.",
      icon: FileText,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      <div className="glass-panel bg-white/95 border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-left relative overflow-hidden shadow-xl">
        <div className="max-w-3xl mb-12">
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-2">
            Enterprise-Grade Protection
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Institutional Trust & <span className="text-gradient-cyan">Security Standard</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base font-normal">
            Your intellectual property, cap tables, and financial projections are protected by multi-tenant isolation and strict NDA vaults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="glass-card bg-white border border-slate-200 p-6 rounded-2xl space-y-3 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
