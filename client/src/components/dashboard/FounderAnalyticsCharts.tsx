"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Zap, Eye, Heart, UserPlus } from "lucide-react";

export default function FounderAnalyticsCharts() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");

  const metrics = [
    { label: "Active MAU Growth", value: "12,480", change: "+24.2%", icon: Users },
    { label: "Funding Pipeline", value: "$1,450,000", change: "+18.0%", icon: Zap },
    { label: "Investor Profile Visits", value: "842", change: "+35.6%", icon: Eye },
    { label: "Talent Applications", value: "148", change: "+12.4%", icon: UserPlus },
  ];

  // SVG Chart Bars
  const barData = [
    { month: "Jan", mau: 35, funding: 20, views: 40 },
    { month: "Feb", mau: 48, funding: 35, views: 52 },
    { month: "Mar", mau: 62, funding: 45, views: 68 },
    { month: "Apr", mau: 74, funding: 60, views: 80 },
    { month: "May", mau: 89, funding: 75, views: 92 },
    { month: "Jun", mau: 100, funding: 95, views: 100 },
  ];

  return (
    <div id="startup-analytics" className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Startup Analytics & Traction Engine
          </h2>
          <p className="text-xs text-slate-500">Real-time metrics for MAU growth, investor visits, and follower engagement.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
          {(["7d", "30d", "90d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === t ? "bg-white text-blue-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const MIcon = m.icon;
          return (
            <div key={m.label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{m.label}</span>
                <MIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <h4 className="text-xl font-black text-slate-900">{m.value}</h4>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {m.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Bar Chart Visualizer */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between text-xs font-bold text-slate-600 border-b border-slate-100 pb-2">
          <span>Traction Bar Graph (MAU Growth & Investor Hits)</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block" /> MAU
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" /> Investor Visits
            </span>
          </div>
        </div>

        <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4">
          {barData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1.5 h-44">
                {/* MAU Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.mau}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-1/2 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg"
                />
                {/* Investor Visits Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.views}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
                  className="w-1/2 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
