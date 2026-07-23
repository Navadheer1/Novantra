"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { useAuth } from "@clerk/nextjs";
import {
  Star, Eye, Download, ShieldCheck, ShoppingCart, ArrowLeft,
  Code2, Terminal, Share2, ExternalLink, Loader2, CheckCircle2,
  Zap, Rocket, Sparkles, Building2, Check, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Seller {
  id: string;
  storeName: string;
  logoUrl: string | null;
  description: string;
  website: string;
  isVerified: boolean;
  trustScore: number;
}

interface ProductDetails {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  originalPrice: number | null;
  type: string;
  status: string;
  version: string;
  thumbnailUrl: string;
  screenshots: string[];
  techStack: string[];
  features: string[];
  installGuide: string;
  licensing: string;
  fileUrl: string | null;
  externalUrl: string | null;
  rating: number;
  downloadsCount: number;
  seller?: Seller;
}

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { productId } = React.use(params);
  const { getToken } = useAuth();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "setup" | "features" | "seller">("overview");

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/marketplace/products/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        setProduct(getFallbackDetails(productId));
      }
    } catch (err) {
      console.error("Error fetching product detail:", err);
      setProduct(getFallbackDetails(productId));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackDetails = (id: string): ProductDetails => ({
    id: id || "prod-next-saas",
    sellerId: "seller-marcus",
    title: "Next.js 16 Production SaaS Boilerplate",
    description: "Complete production-ready Next.js App Router boilerplate. Pre-configured with Clerk Auth, Prisma PostgreSQL, Stripe payments, Resend email workflows, and a tailwind theme dashboard layout. Build your SaaS MVP in hours instead of weeks.",
    category: "Next.js Projects",
    tags: ["Next.js", "SaaS", "Stripe", "Prisma", "TypeScript"],
    price: 49.0,
    originalPrice: 99.0,
    type: "DIGITAL_DOWNLOAD",
    status: "ACTIVE",
    version: "2.1.0",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop"
    ],
    techStack: ["Next.js 16", "TypeScript", "Prisma ORM", "Stripe", "Tailwind CSS"],
    features: [
      "Clerk Auth & Custom Session handling",
      "Stripe Subscription Checkout flow & webhooks",
      "Interactive Dashboard analytics template",
      "Resend transactional emails ready",
      "SEO Metadata & Sitemap generators"
    ],
    installGuide: "1. Clone repo\n2. Run `npm install`\n3. Copy `.env.example` to `.env` and fill variables\n4. Run `npx prisma db push`\n5. Run `npm run dev`",
    licensing: "Commercial Developer License",
    fileUrl: "#",
    externalUrl: "https://github.com/marcus-labs/next-saas-boilerplate",
    rating: 4.9,
    downloadsCount: 312,
    seller: {
      id: "seller-marcus",
      storeName: "Marcus Labs",
      logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
      description: "Building next-generation developer tooling and production-grade templates.",
      website: "https://marcuslabs.dev",
      isVerified: true,
      trustScore: 98
    }
  });

  const handleAcquire = () => {
    triggerToast(`Acquisition initiated for ${product?.title}! Deployment files sent to your account.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-muted-foreground font-semibold text-sm">Loading Solution Architecture Specs...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Code2 className="w-12 h-12 text-muted-foreground mb-3" />
          <h2 className="text-xl font-bold text-foreground">Solution Not Found</h2>
          <p className="text-muted-foreground text-xs mt-1 mb-6">The requested solution asset could not be found.</p>
          <Link href="/marketplace">
            <Button size="sm">Back to Ecosystem Exchange</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stackChips = product.techStack || product.tags || ["Next.js 16", "TypeScript", "Prisma"];

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
        {/* BACK BREADCRUMB */}
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Solution Exchange
        </Link>

        {/* HERO SPEC SHEET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Verified Builder Solution
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {stackChips.map((tech, i) => (
                  <span key={i} className="text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>

              {/* THUMBNAIL */}
              <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-border bg-muted/20 relative">
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* SUB-NAV SPECS TABS */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-border/80 text-xs font-bold pb-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                  }`}
                >
                  Solution Overview
                </button>
                <button
                  onClick={() => setActiveTab("setup")}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === "setup" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                  }`}
                >
                  Terminal Setup Guide
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === "features" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                  }`}
                >
                  Capabilities ({product.features?.length || 5})
                </button>
              </div>

              {activeTab === "overview" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {product.description}
                  </p>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300 block">
                      Engineering Time Saved
                    </span>
                    <p className="text-xs font-bold text-foreground">
                      Saves approximately <strong>80 Hours</strong> of setup, database configuration, and Stripe webhook engineering.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "setup" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Terminal className="w-4 h-4 text-primary" /> Setup Commands
                  </div>
                  <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
                    <pre className="whitespace-pre-wrap">{product.installGuide}</pre>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(product.features || []).map((feat, i) => (
                    <div key={i} className="bg-muted/40 border border-border p-3 rounded-xl flex items-start gap-2 text-xs font-bold text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR ACQUISITION CARD */}
          <div className="space-y-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground block mb-1">
                  Acquisition & License Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">
                    {product.price === 0 ? "FREE" : `$${product.price}`}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs font-bold">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">License</span>
                  <span className="text-emerald-600">{product.licensing || "Commercial Developer"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating || 4.8}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Total Deploys</span>
                  <span className="text-foreground">{product.downloadsCount || 140}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm h-12 shadow-md"
                onClick={handleAcquire}
              >
                <Download className="w-4 h-4 mr-2" />
                {product.price === 0 ? "Download Free Asset" : "Acquire & Deploy Solution"}
              </Button>

              {/* BUILDER BOX */}
              <div className="bg-muted/40 border border-border/80 rounded-xl p-4 space-y-2 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
                  Verified Builder
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-black text-foreground">{product.seller?.storeName || "Marcus Labs"}</span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {product.seller?.trustScore || 98}% Trust Score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
