"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Activity,
  Clock,
  Eye,
  Download,
  Star,
  CheckCircle2,
  ShieldCheck,
  Code2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SolutionProduct } from "./SolutionCard";

interface ShopRightPanelProps {
  hoveredProduct: SolutionProduct | null;
  onInspectProduct: (p: SolutionProduct) => void;
  onBuyProduct: (p: SolutionProduct) => void;
  trendingProducts: SolutionProduct[];
  recentlyViewed: SolutionProduct[];
}

export default function ShopRightPanel({
  hoveredProduct,
  onInspectProduct,
  onBuyProduct,
  trendingProducts,
  recentlyViewed,
}: ShopRightPanelProps) {
  const organicActivity = [
    { id: "act1", icon: "🚀", text: "NovaCRM v2 released with Stripe webhooks" },
    { id: "act2", icon: "⭐", text: "BuilderKit reached 500 verified installs" },
    { id: "act3", icon: "💰", text: "HospitalOS acquired by HealthTech Syndicate" },
    { id: "act4", icon: "👨‍💻", text: "Elena published Vibrant UI Figma Kit v1.2" },
  ];

  return (
    <aside className="w-full space-y-4 select-none">
      <AnimatePresence mode="wait">
        {hoveredProduct ? (
          /* HOVER/SELECT STATE: QUICK PREVIEW PANEL */
          <motion.div
            key="quick-preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Quick Preview
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                v{hoveredProduct.version || "1.0"}
              </span>
            </div>

            {/* Media Thumbnail */}
            <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-100 relative">
              <img
                src={
                  hoveredProduct.thumbnailUrl ||
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
                }
                alt={hoveredProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white font-black text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                {hoveredProduct.price === 0 ? "FREE" : `$${hoveredProduct.price}`}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900">{hoveredProduct.title}</h3>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                {hoveredProduct.description}
              </p>
            </div>

            {/* Creator & Trust Score */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-bold text-slate-700 truncate">
                  {hoveredProduct.seller?.storeName || "Marcus Labs"}
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                Verified
              </span>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-1">
                {(hoveredProduct.techStack || ["Next.js", "TypeScript", "Stripe"]).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                onClick={() => onBuyProduct(hoveredProduct)}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Acquire & Install Solution
              </button>

              <button
                onClick={() => onInspectProduct(hoveredProduct)}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <Code2 className="w-3.5 h-3.5" /> Inspect Code Architecture
              </button>
            </div>
          </motion.div>
        ) : (
          /* IDLE STATE: TRENDING + LIVE ACTIVITY + RECENTLY VIEWED */
          <motion.div
            key="idle-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="space-y-4"
          >
            {/* 1. Trending Today */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>Trending Today</span>
                </div>
              </div>

              <div className="space-y-2">
                {trendingProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => onInspectProduct(prod)}
                    className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {prod.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" /> {prod.rating || 4.9}
                        </span>
                        <span>•</span>
                        <span>{prod.downloadsCount || 120} sales</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-900 shrink-0">
                      {prod.price === 0 ? "FREE" : `$${prod.price}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Latest Organic Activity */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Latest Activity</span>
              </div>

              <div className="space-y-2">
                {organicActivity.map((act) => (
                  <div key={act.id} className="text-[11px] font-semibold text-slate-600 flex items-start gap-2 leading-snug">
                    <span className="shrink-0 text-xs">{act.icon}</span>
                    <span>{act.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recently Viewed</span>
                </div>

                <div className="space-y-1.5">
                  {recentlyViewed.slice(0, 2).map((rv) => (
                    <div
                      key={rv.id}
                      onClick={() => onInspectProduct(rv)}
                      className="p-1.5 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 truncate cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {rv.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
