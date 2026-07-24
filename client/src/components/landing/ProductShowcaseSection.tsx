"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  ChevronUp,
  Bookmark,
  ExternalLink,
  Sparkles,
  Award,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface StartupProduct {
  id: string;
  name: string;
  tagline: string;
  category: string;
  upvotes: number;
  bookmarked: boolean;
  arr: string;
  growth: string;
  raised: string;
  stage: string;
  techStack: string[];
  logo: string;
  previewColor: string;
  badge: string;
}

export function ProductShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = useState("All Launches");
  
  const [products, setProducts] = useState<StartupProduct[]>([
    {
      id: "synapse-ai",
      name: "Synapse AI",
      tagline: "Autonomous multi-agent LLM inference orchestration runtime.",
      category: "AI Infrastructure",
      upvotes: 1420,
      bookmarked: false,
      arr: "$1.8M",
      growth: "+310% MoM",
      raised: "$3.2M Series A",
      stage: "Series A",
      techStack: ["Rust", "PyTorch", "CUDA", "C++"],
      logo: "SY",
      previewColor: "from-blue-600 to-indigo-600",
      badge: "Product of the Day #1",
    },
    {
      id: "medquick-ai",
      name: "MedQuick AI",
      tagline: "AI diagnostics & automated hospital claims billing platform.",
      category: "HealthTech",
      upvotes: 2180,
      bookmarked: true,
      arr: "$2.4M",
      growth: "+284% YoY",
      raised: "$4.0M Seed",
      stage: "Seed",
      techStack: ["Python", "TensorFlow", "React", "AWS"],
      logo: "MQ",
      previewColor: "from-emerald-600 to-teal-600",
      badge: "Featured VC Pick",
    },
    {
      id: "novapay",
      name: "NovaPay",
      tagline: "Cross-border enterprise treasury & stablecoin payment rails.",
      category: "FinTech",
      upvotes: 980,
      bookmarked: false,
      arr: "$950K",
      growth: "4x MoM",
      raised: "$1.8M Pre-Seed",
      stage: "Pre-Seed",
      techStack: ["Go", "Kubernetes", "PostgreSQL", "Solana"],
      logo: "NP",
      previewColor: "from-violet-600 to-purple-600",
      badge: "Fastest Growing",
    },
    {
      id: "ecogrid",
      name: "EcoGrid",
      tagline: "AI smart grid battery storage optimization for solar microgrids.",
      category: "CleanTech",
      upvotes: 1120,
      bookmarked: false,
      arr: "$620K",
      growth: "+190% YoY",
      raised: "YC W26 Batch",
      stage: "YC W26",
      techStack: ["Python", "TimescaleDB", "C++"],
      logo: "EG",
      previewColor: "from-amber-500 to-emerald-600",
      badge: "YC W26 Cohort",
    },
    {
      id: "atlas-robotics",
      name: "Atlas Robotics",
      tagline: "Spatial perception & motion control kernels for warehouse robots.",
      category: "Robotics",
      upvotes: 840,
      bookmarked: false,
      arr: "$410K",
      growth: "+140% MoM",
      raised: "$2.0M Seed",
      stage: "Seed",
      techStack: ["ROS 2", "C++", "NVIDIA Isaac"],
      logo: "AR",
      previewColor: "from-cyan-600 to-blue-700",
      badge: "DeepTech Highlight",
    },
  ]);

  const categories = ["All Launches", "AI Infrastructure", "HealthTech", "FinTech", "CleanTech", "Robotics"];

  const handleUpvote = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const handleBookmark = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
    );
  };

  const filteredProducts =
    selectedCategory === "All Launches"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="product-showcase" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Rocket className="w-3.5 h-3.5 text-blue-600" /> Featured Product Launches
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Discover Tomorrow's <span className="text-gradient-primary">Breakthrough Startups</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal max-w-2xl">
            Explore live product launches, test interactive demos, bookmark promising ventures, and connect directly with founding teams.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/90 border border-slate-200 p-1.5 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            viewport={{ once: true }}
            className="glass-panel bg-white/95 border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between text-left space-y-5 shadow-lg hover:border-blue-400 hover:shadow-xl transition-all group"
          >
            {/* Card Top: Logo, Name, Badge, Bookmark */}
            <div>
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${product.previewColor} text-white font-black text-lg flex items-center justify-center shadow-md`}
                  >
                    {product.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-blue-600 fill-blue-50" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">{product.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleBookmark(product.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      product.bookmarked
                        ? "bg-amber-50 border-amber-200 text-amber-600"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                    }`}
                    aria-label="Bookmark product"
                  >
                    <Bookmark className={`w-4 h-4 ${product.bookmarked ? "fill-amber-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Product Badge Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold mb-3">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>{product.badge}</span>
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-600 leading-relaxed font-normal min-h-[36px]">
                {product.tagline}
              </p>

              {/* Startup Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-center">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">ARR</span>
                  <span className="text-xs font-black text-slate-900">{product.arr}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Growth</span>
                  <span className="text-xs font-black text-emerald-600">{product.growth}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Stage</span>
                  <span className="text-xs font-black text-blue-600">{product.stage}</span>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-1.5">
                {product.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Upvote Button & View Profile */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleUpvote(product.id)}
                className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group/btn"
              >
                <ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                <span>Upvote</span>
                <span className="bg-slate-800 text-slate-200 group-hover/btn:bg-blue-700 text-[10px] font-mono px-2 py-0.5 rounded-md ml-1">
                  {product.upvotes}
                </span>
              </button>

              <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
