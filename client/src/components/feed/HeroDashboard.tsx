"use client";

import { motion } from "framer-motion";
import { Users, Eye, Rocket, MessageSquare, UserCheck, Calendar, DollarSign, Briefcase, Sparkles, ArrowUpRight, Hand } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroDashboardProps {
  userName?: string;
  userRole?: string | null;
}

export default function HeroDashboard({ userName = "Builder", userRole }: HeroDashboardProps) {
  const router = useRouter();

  // Time of day greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const metrics = [
    {
      id: "connections",
      label: "Connections",
      value: "142",
      badge: "+12 this week",
      badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600",
      link: "/messages",
    },
    {
      id: "views",
      label: "Profile Views",
      value: "890",
      badge: "+24% growth",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: Eye,
      iconBg: "bg-emerald-50 text-emerald-600",
      link: `/profile`,
    },
    {
      id: "followers",
      label: "Startup Followers",
      value: "1.4k",
      badge: "Trending",
      badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
      icon: Rocket,
      iconBg: "bg-purple-50 text-purple-600",
      link: "/startups",
    },
    {
      id: "messages",
      label: "Messages",
      value: "4",
      badge: "Unread",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
      icon: MessageSquare,
      iconBg: "bg-amber-50 text-amber-600",
      link: "/messages",
    },
    {
      id: "requests",
      label: "Pending Requests",
      value: "3",
      badge: "Action needed",
      badgeColor: "bg-rose-50 text-rose-600 border-rose-200",
      icon: UserCheck,
      iconBg: "bg-rose-50 text-rose-600",
      link: "/inbox",
    },
    {
      id: "meetings",
      label: "Meetings Today",
      value: "2",
      badge: "Next @ 4 PM",
      badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-200",
      icon: Calendar,
      iconBg: "bg-indigo-50 text-indigo-600",
      link: "/meet",
    },
    {
      id: "funding",
      label: "Funding Deals",
      value: "12",
      badge: "High Match",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600",
      link: "/investors",
    },
    {
      id: "jobs",
      label: "Job Matches",
      value: "8",
      badge: "Top Talent",
      badgeColor: "bg-sky-50 text-sky-600 border-sky-200",
      icon: Briefcase,
      iconBg: "bg-sky-50 text-sky-600",
      link: "/explore",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{timeGreeting}, {userName}</span>
              <Hand className="w-6 h-6 text-amber-500 transition-transform duration-150 group-hover:scale-110" />
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200/60">
              <Sparkles className="w-3 h-3 mr-1 text-blue-600" /> Startup OS
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Continue building your startup. Here is your real-time ecosystem command center.
          </p>
        </div>

        {userRole && (
          <div className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-700">
            {userRole} Account
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.button
              key={metric.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.2 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              onClick={() => router.push(metric.link)}
              className="group text-left p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-blue-400/50 hover:bg-white hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${metric.iconBg}`}>
                    <Icon className="w-4 h-4 transition-transform duration-150 group-hover:scale-110" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight">{metric.value}</div>
                <div className="text-[11px] font-bold text-slate-500 truncate mt-0.5">{metric.label}</div>
              </div>

              <div className="mt-2.5">
                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-extrabold rounded-md border ${metric.badgeColor}`}>
                  {metric.badge}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
