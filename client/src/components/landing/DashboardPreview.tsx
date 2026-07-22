"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion, easeInOutTransition, themeTokens } from "../../lib/design-system";
import { 
  Video, Sparkles, Shield, User, Briefcase, Building, 
  TrendingUp, ArrowUpRight, MessageSquare, Check, Bell
} from "lucide-react";

export default function DashboardPreview() {
  const isReduced = useReducedMotion();
  
  // Dynamic alerts list simulation state
  const [alerts, setAlerts] = useState([
    { id: 1, text: "Sequoia Partner matched with MedQuick.AI", type: "match", time: "Just now" },
    { id: 2, text: "New WebRTC Pitch room created by Marcus Labs", type: "room", time: "1 min ago" },
    { id: 3, text: "Groq AI pitch deck audit generated for Noventra", type: "ai", time: "3 mins ago" }
  ]);

  // Funding progress bar percentage loop
  const [fundingPercent, setFundingPercent] = useState(62);

  // SVG Chart path update loops
  const [chartPath, setChartPath] = useState(
    "M 0 80 Q 80 50 160 65 T 320 30 T 480 55 T 600 20"
  );

  useEffect(() => {
    if (isReduced) return;

    // 1. Loop funding percentage up and down
    const fundingInterval = setInterval(() => {
      setFundingPercent(prev => (prev >= 88 ? 62 : prev + 4));
    }, 3500);

    // 2. Loop dynamic chart paths
    const chartPaths = [
      "M 0 80 Q 80 50 160 65 T 320 30 T 480 55 T 600 20",
      "M 0 70 Q 80 80 160 40 T 320 55 T 480 20 T 600 45",
      "M 0 90 Q 80 60 160 70 T 320 40 T 480 30 T 600 15"
    ];
    let pathIdx = 0;
    const chartInterval = setInterval(() => {
      pathIdx = (pathIdx + 1) % chartPaths.length;
      setChartPath(chartPaths[pathIdx]);
    }, 4500);

    // 3. Loop sliding notifications alerts
    const feedTemplates = [
      { text: "a16z requested allocation details for MedQuick", type: "match" },
      { text: "Founder X launched Pitch Room for SaaS Builder", type: "room" },
      { text: "Groq cold email generated for Accel Partners", type: "ai" }
    ];
    let templateIdx = 0;
    const alertInterval = setInterval(() => {
      templateIdx = (templateIdx + 1) % feedTemplates.length;
      const newAlert = {
        id: Date.now(),
        text: feedTemplates[templateIdx].text,
        type: feedTemplates[templateIdx].type,
        time: "Just now"
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 2)]);
    }, 5500);

    return () => {
      clearInterval(fundingInterval);
      clearInterval(chartInterval);
      clearInterval(alertInterval);
    };
  }, [isReduced]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden select-none">
      
      {/* Top glossy visual reflections */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-80" />

      {/* Browser dot highlights */}
      <div className="flex gap-1.5 border-b border-slate-800/80 pb-3 mb-4 justify-between items-center">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-[10px] text-slate-500 font-bold bg-slate-950/80 border border-slate-800 px-3 py-0.5 rounded-lg">
          portal.founderx.com/dealflow
        </span>
        <div className="w-12" />
      </div>

      {/* Layout workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-left">
        
        {/* Left Side: Mock sidebar */}
        <div className="hidden lg:flex flex-col gap-2 border-r border-slate-800/50 pr-4">
          <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block mb-2 px-2">Navigation</span>
          {[
            { label: "Deal-Flow Feed", icon: TrendingUp, active: true },
            { label: "AI Pitch Builder", icon: Sparkles },
            { label: "Video Pitch Rooms", icon: Video },
            { label: "Platform Shop", icon: Briefcase }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <div 
                key={tab.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                  tab.active 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/35"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </div>
            );
          })}
        </div>

        {/* Center: Main dynamic charts dashboard */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            
            {/* Metric 1 */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800/60 rounded-2xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Capital Matched</span>
              <span className="text-base font-black text-slate-200 block mt-1">$4,840,000</span>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800/60 rounded-2xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Funding Progress</span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-base font-black text-slate-200">{fundingPercent}%</span>
                {/* Visual horizontal loading bar */}
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0 ml-2">
                  <motion.div 
                    className="h-full bg-blue-500" 
                    animate={{ width: `${fundingPercent}%` }} 
                    transition={isReduced ? {} : easeInOutTransition(0.4)}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* SVG Line Graph */}
          <div className="p-4 bg-slate-950/80 border border-slate-800/60 rounded-2xl relative h-36 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Investor Views Index</span>
            <div className="flex-1 relative flex items-end">
              <svg className="w-full h-20" viewBox="0 0 600 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={chartPath}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transition={isReduced ? { duration: 0 } : easeInOutTransition(0.8)}
                />
                <motion.path
                  d={`${chartPath} L 600 100 L 0 100 Z`}
                  fill="url(#chartGrad)"
                  transition={isReduced ? { duration: 0 } : easeInOutTransition(0.8)}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Live matches feed */}
        <div className="space-y-3">
          <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block px-1">Deal-Flow Alerts Feed</span>
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {alerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={isReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={easeInOutTransition(0.35)}
                  className="p-3 bg-slate-950/90 border border-slate-800/80 rounded-2xl flex items-start gap-2.5 shadow-lg relative"
                >
                  <div className="w-5 h-5 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    {alert.type === "match" ? <Briefcase className="w-3 h-3 text-blue-400" /> : alert.type === "room" ? <Video className="w-3 h-3 text-blue-400" /> : <Sparkles className="w-3 h-3 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-slate-300 font-bold block leading-snug truncate">{alert.text}</span>
                    <span className="text-[8px] text-slate-500 block mt-0.5">{alert.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
