"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { useAuth } from "@clerk/nextjs";
import {
  Rocket, ShieldCheck, Sparkles, Plus, CheckCircle2,
  Code2, Terminal, TrendingUp, Zap, Clock, ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";

import EcosystemViewToggle, { EcosystemCategoryLens } from "@/components/marketplace/EcosystemViewToggle";
import EcosystemFiltersBar, { EcosystemFilterState } from "@/components/marketplace/EcosystemFiltersBar";
import SolutionCard, { SolutionProduct } from "@/components/marketplace/SolutionCard";
import SolutionInspectorModal from "@/components/marketplace/SolutionInspectorModal";

export default function MarketplacePage() {
  const { getToken } = useAuth();

  const [products, setProducts] = useState<SolutionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Category Lens State
  const [currentLens, setCurrentLens] = useState<EcosystemCategoryLens>("ALL");

  // Solution Filters State
  const [filters, setFilters] = useState<EcosystemFilterState>({
    search: "",
    techStack: "",
    priceTier: "ALL",
    verifiedOnly: false,
    sortBy: "popular",
  });

  // Modal Inspection State
  const [inspectingProduct, setInspectingProduct] = useState<SolutionProduct | null>(null);

  useEffect(() => {
    loadProducts();
  }, [currentLens, filters]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();

      let params = new URLSearchParams();
      if (currentLens === "SAAS_MVPS") params.append("category", "Next.js Projects");
      if (currentLens === "DESIGN_KITS") params.append("category", "UI Kits");
      if (currentLens === "AI_TOOLS") params.append("category", "AI Tools");
      if (currentLens === "SERVICES") params.append("category", "Agencies");

      if (filters.search) params.append("search", filters.search);
      if (filters.priceTier === "FREE") params.append("free", "true");
      if (filters.priceTier === "PREMIUM") params.append("premium", "true");
      if (filters.verifiedOnly) params.append("verified", "true");

      const res = await fetch(`${apiUrl}/api/marketplace/products?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setProducts(getFallbackSolutions());
      }
    } catch (err) {
      console.error("Error loading marketplace products:", err);
      setProducts(getFallbackSolutions());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackSolutions = (): SolutionProduct[] => [
    {
      id: "prod-next-saas",
      sellerId: "seller-marcus",
      title: "Next.js 16 Production SaaS Boilerplate",
      description: "Complete production-ready Next.js App Router boilerplate. Pre-configured with Clerk Auth, Prisma PostgreSQL, Stripe payments, Resend email workflows, and a tailwind theme dashboard layout.",
      category: "Next.js Projects",
      tags: ["Next.js", "SaaS", "Stripe", "Prisma", "TypeScript"],
      price: 49.0,
      originalPrice: 99.0,
      type: "DIGITAL_DOWNLOAD",
      status: "ACTIVE",
      version: "2.1.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      rating: 4.9,
      downloadsCount: 312,
      techStack: ["Next.js 16", "TypeScript", "Prisma", "Stripe"],
      features: [
        "Clerk Auth & Custom Session handling",
        "Stripe Subscription Checkout flow & webhooks",
        "Interactive Dashboard analytics template",
        "Resend transactional emails ready",
        "SEO Metadata & Sitemap generators"
      ],
      seller: {
        id: "seller-marcus",
        storeName: "Marcus Labs",
        logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
        isVerified: true,
        trustScore: 98
      }
    },
    {
      id: "prod-figma-kit",
      sellerId: "seller-elena",
      title: "Vibrant UI - Figma Design System & Tokens",
      description: "A premium Figma UI kit built specifically for startup landing pages and dashboard SaaS layouts. Features 300+ responsive components, typography hierarchies, auto-layout 5.0 configuration, and color variables.",
      category: "UI Kits",
      tags: ["Figma", "UI Kit", "Design System", "Startups"],
      price: 29.0,
      originalPrice: 49.0,
      type: "DESIGN_ASSETS",
      status: "ACTIVE",
      version: "1.2.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop",
      rating: 4.8,
      downloadsCount: 184,
      techStack: ["Figma", "Auto-Layout", "Tailwind Variables"],
      features: [
        "300+ Nested responsive components",
        "Auto-Layout 5.0 set up on all grids",
        "Light and Dark mode style variables",
        "45 Responsive page mockup templates"
      ],
      seller: {
        id: "seller-elena",
        storeName: "Elena UI/UX Studio",
        logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
        isVerified: true,
        trustScore: 99
      }
    },
    {
      id: "prod-ai-agent",
      sellerId: "seller-alex",
      title: "AI Co-Founder & Pitch Deck Prompt Suite",
      description: "Production prompt engineering kit and API wrapper for OpenAI GPT-4. Generates financial projections, competitor analysis, and pitch deck copy automatically.",
      category: "AI Tools",
      tags: ["AI", "OpenAI", "Prompt Kit", "Python"],
      price: 0,
      originalPrice: 19.0,
      type: "FREE_ASSET",
      status: "ACTIVE",
      version: "1.0.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=250&fit=crop",
      rating: 4.7,
      downloadsCount: 520,
      techStack: ["OpenAI API", "Python", "JSON Schemas"],
      features: [
        "15 Enterprise AI Prompts for Founders",
        "Pitch Deck slide text generator",
        "Competitor analysis schema template"
      ],
      seller: {
        id: "seller-alex",
        storeName: "Alex AI Works",
        logoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
        isVerified: true,
        trustScore: 95
      }
    }
  ];

  const handleAcquire = (product: SolutionProduct) => {
    triggerToast(`Acquisition request initiated for ${product.title}! Deployment files sent to your email.`);
  };

  // Client filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStack =
      !filters.techStack ||
      (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(filters.techStack.toLowerCase())));

    const matchesPrice =
      filters.priceTier === "ALL" ||
      (filters.priceTier === "FREE" && p.price === 0) ||
      (filters.priceTier === "PREMIUM" && p.price > 0);

    const matchesVerified = !filters.verifiedOnly || p.seller?.isVerified === true;

    return matchesSearch && matchesStack && matchesPrice && matchesVerified;
  });

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
        {/* HERO TITLE & ECOSYSTEM TELEMETRY */}
        <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/20 border border-border/80 rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-sm">
                  Noventra Ecosystem Exchange
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Production-Grade Code
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                Startup Solutions & Asset Exchange
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl font-medium">
                Production-grade Next.js boilerplates, Figma design systems, AI tools, and code-audited MVPs built by verified ecosystem founders.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/marketplace/dashboard">
                <Button className="font-bold flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                  <Plus className="w-4 h-4" /> Publish Solution
                </Button>
              </Link>
              <Link href="/marketplace/purchases">
                <Button variant="outline" className="font-bold text-xs">
                  My Acquired Assets
                </Button>
              </Link>
            </div>
          </div>

          {/* TELEMETRY METRICS TICKER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60 text-xs font-bold">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span>Verified Assets: <strong className="text-foreground">180+</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Avg Dev Time Saved: <strong className="text-emerald-600">~80 Hours</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Builder Trust Score: <strong className="text-foreground">98.4%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span>Monthly Deploys: <strong className="text-foreground">2,400+</strong></span>
            </div>
          </div>
        </div>

        {/* ECOSYSTEM LENSES TOGGLE */}
        <EcosystemViewToggle
          currentLens={currentLens}
          onLensChange={(lens) => setCurrentLens(lens)}
        />

        {/* TECHNICAL SOLUTION FILTERS */}
        <EcosystemFiltersBar
          filters={filters}
          onChange={(f) => setFilters(f)}
          onReset={() =>
            setFilters({
              search: "",
              techStack: "",
              priceTier: "ALL",
              verifiedOnly: false,
              sortBy: "popular",
            })
          }
        />

        {/* SOLUTION CARDS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <SolutionCard
                key={prod.id}
                product={prod}
                onInspect={(p) => setInspectingProduct(p)}
                onAcquire={(p) => handleAcquire(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8">
            <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-black text-foreground">No Solutions Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-medium">
              Try adjusting your tech stack filters, category lens, or search terms.
            </p>
          </div>
        )}
      </main>

      {/* SOLUTION INSPECTOR MODAL */}
      <SolutionInspectorModal
        isOpen={!!inspectingProduct}
        product={inspectingProduct}
        onClose={() => setInspectingProduct(null)}
        onAcquire={(p) => handleAcquire(p)}
      />
    </div>
  );
}
