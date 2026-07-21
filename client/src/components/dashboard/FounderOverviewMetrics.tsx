"use client";

import { motion } from "framer-motion";
import {
  Building2,
  DollarSign,
  Zap,
  Heart,
  Inbox,
  Video,
  Bell,
  Globe,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";

interface StatsData {
  totalStartups: number;
  revenue: string;
  fundingRaised: string;
  investorInterest: string;
  applications: number;
  activeMeetingsCount: number;
  notificationsCount: number;
  profileViews: number;
  growthRate: string;
}

interface Props {
  stats: StatsData;
}

export default function FounderOverviewMetrics({ stats }: Props) {
  const cards = [
    {
      title: "My Startups",
      value: stats.totalStartups,
      growth: "+1 Active",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      sparkline: "M0,20 Q10,12 20,16 T40,5 T60,14 T80,4 T100,8"
    },
    {
      title: "Revenue (MRR)",
      value: stats.revenue || "$42,500",
      growth: "+18.4%",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      sparkline: "M0,25 Q15,18 30,20 T60,10 T90,5 T100,2"
    },
    {
      title: "Funding Raised",
      value: stats.fundingRaised || "$1.4M",
      growth: "Seed Closed",
      icon: Zap,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      sparkline: "M0,28 L30,22 L50,15 L70,8 L100,3"
    },
    {
      title: "Investor Interest",
      value: stats.investorInterest || "94%",
      growth: "+12 VCs",
      icon: Heart,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      sparkline: "M0,22 Q20,15 40,18 T70,8 T100,5"
    },
    {
      title: "Pending Applications",
      value: stats.applications || 4,
      growth: "High Demand",
      icon: Inbox,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      sparkline: "M0,18 Q20,24 40,14 T80,8 T100,12"
    },
    {
      title: "Meetings Today",
      value: stats.activeMeetingsCount || 2,
      growth: "Pitch Syncs",
      icon: Video,
      color: "text-sky-600 bg-sky-50 border-sky-100",
      sparkline: "M0,26 L25,18 L50,22 L75,10 L100,6"
    },
    {
      title: "Notifications",
      value: stats.notificationsCount || 12,
      growth: "4 Unread",
      icon: Bell,
      color: "text-violet-600 bg-violet-50 border-violet-100",
      sparkline: "M0,20 Q25,28 50,12 T100,8"
    },
    {
      title: "Profile Views",
      value: stats.profileViews || 482,
      growth: "+24.8%",
      icon: Globe,
      color: "text-teal-600 bg-teal-50 border-teal-100",
      sparkline: "M0,24 Q20,16 40,20 T70,6 T100,2"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Founder Performance Metrics
        </h2>
        <span className="text-xs font-semibold text-slate-500">Live Analytics Feed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const CardIcon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/80 p-5 rounded-[20px] shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <CardIcon className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <ArrowUpRight className="w-3 h-3" /> {card.growth}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xs font-bold text-slate-500">{card.title}</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>

                  {/* Sparkline Graph */}
                  <svg className="w-16 h-8 text-blue-500/80 stroke-current fill-none overflow-visible" viewBox="0 0 100 30">
                    <path
                      d={card.sparkline}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
