"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ArrowRight, Layers, Zap, ShoppingCart } from "lucide-react";

export interface BuildStackRecommendation {
  title: string;
  category: string;
  timeSaved: string;
}

export default function AIBuildAssistant({ onDeployStack }: { onDeployStack: (stackName: string) => void }) {
  const [selectedPreset, setSelectedPreset] = useState("Restaurant Startup");

  const buildPresets: Record<string, { desc: string; stack: BuildStackRecommendation[] }> = {
    "Restaurant Startup": {
      desc: "Complete end-to-end stack for modern cloud kitchens & dining establishments.",
      stack: [
        { title: "Restaurant Website & Menu", category: "Web Frontend", timeSaved: "12 hrs" },
        { title: "Point of Sale (POS) Engine", category: "Backend Engine", timeSaved: "24 hrs" },
        { title: "Inventory & Stock Tracking", category: "Database & Admin", timeSaved: "16 hrs" },
        { title: "Kitchen Display System (KDS)", category: "Hardware Display", timeSaved: "18 hrs" },
        { title: "QR Table Ordering App", category: "Mobile Web", timeSaved: "14 hrs" },
        { title: "Customer Loyalty & Payments", category: "Stripe / UPI Gateway", timeSaved: "10 hrs" }
      ]
    },
    "AI SaaS Platform": {
      desc: "Production Next.js 16 stack with OpenAI API wrapper, Clerk Auth & Stripe Billing.",
      stack: [
        { title: "Next.js 16 App Router Core", category: "Full-Stack Boilerplate", timeSaved: "20 hrs" },
        { title: "OpenAI GPT-4 Agent Pipeline", category: "AI Integration", timeSaved: "28 hrs" },
        { title: "Stripe Subscription Webhooks", category: "Billing Engine", timeSaved: "16 hrs" },
        { title: "Resend Email Workflows", category: "Notifications", timeSaved: "8 hrs" },
        { title: "Prisma PostgreSQL Schema", category: "Database ORM", timeSaved: "14 hrs" }
      ]
    },
    "Healthcare & Clinic": {
      desc: "HIPAA-compliant telemedicine, patient scheduling & prescription portal.",
      stack: [
        { title: "Patient Booking Portal", category: "Web App", timeSaved: "18 hrs" },
        { title: "Doctor Video Consultation Room", category: "WebRTC Video", timeSaved: "32 hrs" },
        { title: "E-Prescriptions & Pharmacy POS", category: "Backend API", timeSaved: "22 hrs" },
        { title: "Patient Records (EMR)", category: "Secure Database", timeSaved: "24 hrs" }
      ]
    },
    "E-Commerce & D2C Store": {
      desc: "High-converting storefront, inventory sync, logistics tracking & checkout.",
      stack: [
        { title: "Next.js Headless Storefront", category: "Frontend", timeSaved: "16 hrs" },
        { title: "Inventory & Warehouse Sync", category: "Admin Console", timeSaved: "20 hrs" },
        { title: "Shipping & Logistics Integration", category: "API Webhooks", timeSaved: "14 hrs" }
      ]
    }
  };

  const currentPresetData = buildPresets[selectedPreset] || buildPresets["Restaurant Startup"];

  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Build Faster Assistant
            </span>
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Intelligent Tech Stack Recommender
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Select what you are building to instantly generate the complete production stack.
          </p>
        </div>

        {/* PRESET SELECTOR */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {Object.keys(buildPresets).map((preset) => (
            <button
              key={preset}
              onClick={() => setSelectedPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedPreset === preset
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* RECOMMENDED STACK GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground">{currentPresetData.desc}</p>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-500" /> Total Dev Time Saved: ~100+ Hours
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentPresetData.stack.map((item, i) => (
            <div key={i} className="bg-muted/30 border border-border/80 p-3.5 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-foreground">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-semibold">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Saves {item.timeSaved}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-end">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md"
            onClick={() => onDeployStack(selectedPreset)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Deploy Complete {selectedPreset} Solution Bundle
          </Button>
        </div>
      </div>
    </div>
  );
}
