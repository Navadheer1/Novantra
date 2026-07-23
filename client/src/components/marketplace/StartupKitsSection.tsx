"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Layers, ShoppingCart, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export interface StartupKit {
  id: string;
  name: string;
  category: string;
  price: string;
  savings: string;
  includes: string[];
  badge?: string;
}

interface StartupKitsSectionProps {
  onBuyKit: (kit: StartupKit) => void;
}

export default function StartupKitsSection({ onBuyKit }: StartupKitsSectionProps) {
  const kits: StartupKit[] = [
    {
      id: "kit-restaurant",
      name: "Restaurant & Cloud Kitchen All-in-One Kit",
      category: "FoodTech / Hospitality",
      price: "$199 (₹15,000)",
      savings: "Save $800 vs individual assets",
      includes: ["Restaurant Website", "Admin Dashboard", "POS Engine", "Inventory Sync", "QR Ordering", "Customer Mobile App", "Kitchen Display KDS", "Analytics"],
      badge: "HOT BUNDLE"
    },
    {
      id: "kit-ai-saas",
      name: "AI SaaS Launchpad Bundle",
      category: "Artificial Intelligence",
      price: "$149 (₹11,500)",
      savings: "Save $450 vs individual assets",
      includes: ["Next.js 16 Boilerplate", "OpenAI GPT-4 Agent Pipeline", "Clerk Auth Setup", "Stripe Subscription Checkout", "Resend Email Flow", "Prisma Database ORM"],
      badge: "BESTSELLER"
    },
    {
      id: "kit-healthcare",
      name: "Healthcare Clinic & Telemedicine Kit",
      category: "HealthTech / EMR",
      price: "$249 (₹19,000)",
      savings: "Save $1,200 vs individual assets",
      includes: ["Patient Appointment Booking", "Doctor WebRTC Video Room", "E-Prescription POS", "EMR Database", "Patient Billing Portal"],
      badge: "HIPAA COMPLIANT"
    },
    {
      id: "kit-school",
      name: "School & EdTech Learning Management Kit",
      category: "EdTech",
      price: "$179 (₹13,900)",
      savings: "Save $600 vs individual assets",
      includes: ["LMS Video Course Player", "Student Quiz Engine", "Teacher Dashboard", "Fee Payment Gateway", "Parent Mobile App"],
      badge: "FEATURED"
    }
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              Complete Startup Bundles
            </span>
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Bundled Startup Kits (1-Click Launch)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Deploy entire multi-product stacks with a single bundled license.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kits.map((kit) => (
          <div key={kit.id} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-md">
                  {kit.category}
                </span>
                {kit.badge && (
                  <span className="text-[10px] font-black uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
                    {kit.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-foreground">{kit.name}</h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{kit.savings}</span>

              <div className="mt-4 pt-3 border-t border-border/60">
                <span className="text-[10px] font-black uppercase text-muted-foreground block mb-2">
                  Bundle Includes ({kit.includes.length} Integrated Assets):
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold text-foreground">
                  {kit.includes.map((inc, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {inc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Bundle Price</span>
                <strong className="text-xl font-black text-foreground">{kit.price}</strong>
              </div>

              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
                onClick={() => onBuyKit(kit)}
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" /> Acquire Complete Kit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
