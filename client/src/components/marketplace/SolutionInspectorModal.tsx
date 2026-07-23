"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Code2, CheckCircle2, ShieldCheck, Download, ExternalLink, Play, Terminal, Zap, Star } from "lucide-react";
import { SolutionProduct } from "./SolutionCard";

interface SolutionInspectorModalProps {
  product: SolutionProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAcquire: (product: SolutionProduct) => void;
}

export default function SolutionInspectorModal({
  product,
  isOpen,
  onClose,
  onAcquire
}: SolutionInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "setup" | "features" | "seller">("overview");

  if (!isOpen || !product) return null;

  const stackChips = product.techStack || product.tags || ["Next.js 16", "TypeScript", "Tailwind CSS", "Prisma"];
  const featuresList = product.features || [
    "Clerk Auth & Custom Auth Session ready",
    "Stripe Subscription Checkout flow & webhooks",
    "Interactive Dashboard analytics template",
    "Resend transactional emails ready",
    "SEO Metadata & Sitemap generators"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                {product.title}
                <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                  v{product.version || "1.0"}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Solution Architecture & Code Inspector</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB-NAV TABS */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-border/80 bg-background text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveTab("setup")}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === "setup" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Terminal & Setup Guide
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === "features" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Key Capabilities ({featuresList.length})
          </button>
          <button
            onClick={() => setActiveTab("seller")}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === "seller" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Verified Builder Specs
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-sm font-black text-foreground">Solution Summary</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {product.description}
                  </p>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300 block">
                      Production Engineering Impact
                    </span>
                    <p className="text-xs font-bold text-foreground">
                      Accelerates Time-to-Market by <strong>~80 Hours</strong>. Fully typed, zero deprecation warnings, ready for Vercel deployment.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/40 border border-border/80 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-muted-foreground">Category</span>
                    <span className="text-foreground">{product.category}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="text-amber-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {product.rating || 4.8}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-muted-foreground">Deployments</span>
                    <span className="text-foreground">{product.downloadsCount || 140} Deploys</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border/60">
                    <span className="text-muted-foreground">License</span>
                    <span className="text-emerald-600 font-extrabold">Commercial Developer License</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                  Technical Stack Chips
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {stackChips.map((tech, i) => (
                    <span key={i} className="text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TERMINAL SETUP GUIDE */}
          {activeTab === "setup" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Terminal className="w-4 h-4 text-primary" /> Instant Deployment Commands
              </div>
              <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
                <p className="text-slate-400"># 1. Clone repository & install dependencies</p>
                <p className="text-emerald-400">git clone https://github.com/noventra-exchange/{product.id}.git</p>
                <p className="text-emerald-400">npm install</p>
                <br />
                <p className="text-slate-400"># 2. Configure Database & Auth Environment</p>
                <p className="text-emerald-400">npx prisma db push</p>
                <br />
                <p className="text-slate-400"># 3. Launch Development Engine</p>
                <p className="text-emerald-400">npm run dev</p>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES */}
          {activeTab === "features" && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-muted-foreground mb-2">Built-in Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {featuresList.map((feat, i) => (
                  <div key={i} className="bg-muted/30 border border-border p-3 rounded-xl flex items-start gap-2 text-xs font-bold text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SELLER */}
          {activeTab === "seller" && (
            <div className="bg-muted/40 border border-border p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-lg">
                  {product.seller?.storeName?.slice(0, 2).toUpperCase() || "ML"}
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground flex items-center gap-1.5">
                    {product.seller?.storeName || "Marcus Labs"}
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </h4>
                  <p className="text-xs text-muted-foreground">Certified Noventra Ecosystem Builder</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Trust Score</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {product.seller?.trustScore || 98}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground font-bold">Investment Required:</span>
            <span className="text-xl font-black text-foreground">
              {product.price === 0 ? "FREE" : `$${product.price}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-bold">
              Close Inspector
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
              onClick={() => {
                onClose();
                onAcquire(product);
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              {product.price === 0 ? "Download Free Asset" : "Acquire & Deploy Solution"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
