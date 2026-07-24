"use client";

import React from "react";
import StudioLayout from "@/components/studio/StudioLayout";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function StudioRevenuePage() {
  const transactions = [
    { id: "tx-1", source: "Video Sponsorship (AWS for Startups)", amount: "₹25,000", date: "Jul 20, 2026", status: "Completed" },
    { id: "tx-2", source: "Investor Promotion Package", amount: "₹10,500", date: "Jul 18, 2026", status: "Pending" },
    { id: "tx-3", source: "Noventra Creator Rewards Program", amount: "₹7,000", date: "Jul 12, 2026", status: "Completed" },
  ];

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Revenue & Payouts</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monetization streams, startup sponsorship packages, and payout transactions.
          </p>
        </div>

        {/* REVENUE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Estimated Revenue</span>
            <div className="text-2xl font-black text-slate-900">₹42,500</div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +35% this month
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available for Payout</span>
            <div className="text-2xl font-black text-emerald-600">₹32,000</div>
            <button
              onClick={() => alert("Payout request submitted! Transferring to linked bank account.")}
              className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
            >
              Request Bank Payout
            </button>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Processing</span>
            <div className="text-2xl font-black text-amber-600">₹10,500</div>
            <p className="text-[11px] text-slate-400 font-medium">Releasing in 3 business days</p>
          </div>
        </div>

        {/* MONETIZATION SOURCES BREAKDOWN */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Revenue Stream Channels
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Monetization sources for FounderTV videos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { name: "Video Sponsorships", amount: "₹25,000", desc: "Corporate tech sponsors" },
              { name: "Investor Promotion", amount: "₹10,500", desc: "Featured pitch placements" },
              { name: "Creator Rewards", amount: "₹7,000", desc: "Ecosystem engagement bonus" },
              { name: "Premium Content", amount: "₹0", desc: "Paywalled technical courses" },
            ].map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <h4 className="font-bold text-slate-900">{s.name}</h4>
                <p className="text-base font-black text-blue-600">{s.amount}</p>
                <p className="text-[10px] text-slate-400 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSACTION HISTORY TABLE */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Transaction History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-3 font-extrabold">Source</th>
                  <th className="pb-3 font-extrabold">Date</th>
                  <th className="pb-3 font-extrabold">Amount</th>
                  <th className="pb-3 font-extrabold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-bold text-slate-900">{tx.source}</td>
                    <td className="py-3 text-slate-400 font-semibold">{tx.date}</td>
                    <td className="py-3 font-black text-slate-900">{tx.amount}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          tx.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </StudioLayout>
  );
}
