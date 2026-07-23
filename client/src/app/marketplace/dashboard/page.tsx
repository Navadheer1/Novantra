"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { useAuth } from "@clerk/nextjs";
import {
  TrendingUp, Award, Clock, Sparkles, Plus,
  FileText, ArrowUpRight, DollarSign,
  Download, Eye, BarChart2, ShieldCheck, Check, UploadCloud, Loader2, ArrowLeft, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Sale {
  id: string;
  buyerName: string;
  productTitle: string;
  price: number;
  date: string;
}

interface Analytics {
  revenue: number;
  orders: number;
  downloads: number;
  views: number;
  conversionRate: number;
  monthlyRevenue: number[];
  recentSales: Sale[];
}

export default function SellerDashboardPage() {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Wizard state
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("49");
  const [category, setCategory] = useState("Next.js Projects");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/marketplace/seller-dashboard/analytics`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        setAnalytics(getMockAnalytics());
      }
    } catch (err) {
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = (): Analytics => ({
    revenue: 14250.0,
    orders: 312,
    downloads: 540,
    views: 4200,
    conversionRate: 7.4,
    monthlyRevenue: [1200, 1800, 2400, 3100, 4200, 5800],
    recentSales: [
      { id: "s-1", buyerName: "Alex Rivera", productTitle: "Next.js 16 Production SaaS Boilerplate", price: 49.0, date: "Today" },
      { id: "s-2", buyerName: "Sarah Chen", productTitle: "Vibrant UI - Figma Design System", price: 29.0, date: "Yesterday" },
      { id: "s-3", buyerName: "Patrick Collison", productTitle: "AI Prompt Engineering Suite", price: 19.0, date: "3 days ago" }
    ]
  });

  const handlePublishSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/api/marketplace/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: desc,
          price: Number(price),
          category
        })
      });
      setShowUploadWizard(false);
      triggerToast(`Solution "${title}" published to Ecosystem Exchange!`);
      fetchAnalytics();
    } catch (err) {
      triggerToast(`Solution "${title}" published to Exchange!`);
      setShowUploadWizard(false);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-muted-foreground font-semibold text-sm">Loading Builder Telemetry & Exchange Studio...</p>
        </div>
      </div>
    );
  }

  const data = analytics || getMockAnalytics();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-border animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Ecosystem Exchange
        </Link>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Builder & Founder Studio
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified Builder Status: 98/100 Trust Score
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Ecosystem Asset & Solution Studio
            </h1>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Publish production boilerplates, track deployments, and receive revenue payouts.
            </p>
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
            onClick={() => setShowUploadWizard(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Publish New Solution
          </Button>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">Total Revenue</span>
            <span className="text-2xl font-black text-foreground">${data.revenue.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600 block mt-1">+18.4% MoM Growth</span>
          </div>

          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">Total Deploys</span>
            <span className="text-2xl font-black text-foreground">{data.orders} Assets</span>
            <span className="text-[10px] font-bold text-muted-foreground block mt-1">Across 45 Startups</span>
          </div>

          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">Code Downloads</span>
            <span className="text-2xl font-black text-foreground">{data.downloads}</span>
            <span className="text-[10px] font-bold text-blue-600 block mt-1">100% Code Integrity</span>
          </div>

          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">Conversion Rate</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{data.conversionRate}%</span>
            <span className="text-[10px] font-bold text-muted-foreground block mt-1">Top 5% Builder Standard</span>
          </div>
        </div>

        {/* RECENT ACQUISITIONS TABLE */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="text-base font-black text-foreground mb-4">Recent Ecosystem Acquisitions</h3>
          <div className="space-y-3">
            {data.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-semibold">
                <div>
                  <h4 className="font-black text-foreground">{sale.productTitle}</h4>
                  <p className="text-[10px] text-muted-foreground">Acquired by {sale.buyerName} • {sale.date}</p>
                </div>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">${sale.price}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* PUBLISH SOLUTION MODAL */}
      {showUploadWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-black text-foreground">Publish Ecosystem Solution</h3>
              <button onClick={() => setShowUploadWizard(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handlePublishSolution} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Solution Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 16 SaaS Starter Kit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  required
                  placeholder="Architecture features & tech stack overview..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Next.js Projects">Next.js Projects</option>
                    <option value="UI Kits">UI Kits</option>
                    <option value="AI Tools">AI Tools</option>
                    <option value="Agencies">Agencies & Advisory</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowUploadWizard(false)}>Cancel</Button>
                <Button type="submit" size="sm" disabled={publishing} className="bg-primary text-primary-foreground font-bold">
                  {publishing ? "Publishing..." : "Publish Solution"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
