"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle2, Rocket, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import ShopRoleToggle, { ShopRoleLens } from "@/components/marketplace/ShopRoleToggle";
import ShopHero from "@/components/marketplace/ShopHero";
import AIBuildAssistant from "@/components/marketplace/AIBuildAssistant";
import StartupKitsSection, { StartupKit } from "@/components/marketplace/StartupKitsSection";
import CreatorSpotlightSection, { CreatorProfile } from "@/components/marketplace/CreatorSpotlightSection";
import InnovationShowcaseSection, { HardwareInnovation } from "@/components/marketplace/InnovationShowcaseSection";
import VisualCategoryGrid from "@/components/marketplace/VisualCategoryGrid";
import CuratedCollections from "@/components/marketplace/CuratedCollections";
import CustomizationModal from "@/components/marketplace/CustomizationModal";
import ShopFeedTicker from "@/components/marketplace/ShopFeedTicker";
import RedesignedProductCard from "@/components/marketplace/RedesignedProductCard";
import SolutionInspectorModal from "@/components/marketplace/SolutionInspectorModal";
import { SolutionProduct } from "@/components/marketplace/SolutionCard";

export default function MarketplacePage() {
  const { getToken } = useAuth();

  const [products, setProducts] = useState<SolutionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Role Perspective Lens
  const [roleView, setRoleView] = useState<ShopRoleLens>("FOUNDER");

  // Search & Category Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modals state
  const [inspectingProduct, setInspectingProduct] = useState<SolutionProduct | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<{ title: string; creator: string } | null>(null);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory]);

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
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`${apiUrl}/api/marketplace/products?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setProducts(getFallbackProducts());
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts(getFallbackProducts());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackProducts = (): SolutionProduct[] => [
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
      features: ["Clerk Auth pre-configured", "Stripe Checkout & Webhooks", "Resend Transactional Emails"],
      seller: { id: "seller-marcus", storeName: "Marcus Labs", logoUrl: null, isVerified: true, trustScore: 98 }
    },
    {
      id: "prod-figma-kit",
      sellerId: "seller-elena",
      title: "Vibrant UI - Figma Design System & Tokens",
      description: "A premium Figma UI kit built specifically for startup landing pages and dashboard SaaS layouts. Features 300+ responsive components and typography hierarchies.",
      category: "UI Kits",
      tags: ["Figma", "UI Kit", "Design System"],
      price: 29.0,
      originalPrice: 49.0,
      type: "DESIGN_ASSETS",
      status: "ACTIVE",
      version: "1.2.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop",
      rating: 4.8,
      downloadsCount: 184,
      techStack: ["Figma", "Auto-Layout 5.0", "Variables"],
      features: ["300+ Nested components", "Auto-Layout grids", "Dark mode variables"],
      seller: { id: "seller-elena", storeName: "Elena UI/UX", logoUrl: null, isVerified: true, trustScore: 99 }
    },
    {
      id: "prod-ai-agent",
      sellerId: "seller-alex",
      title: "AI Co-Founder & Pitch Deck Prompt Suite",
      description: "Production prompt engineering kit and API wrapper for OpenAI GPT-4. Generates financial projections, competitor analysis, and pitch deck copy automatically.",
      category: "AI Tools",
      tags: ["AI", "OpenAI", "Prompt Kit"],
      price: 0,
      originalPrice: 19.0,
      type: "FREE_ASSET",
      status: "ACTIVE",
      version: "1.0.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=250&fit=crop",
      rating: 4.7,
      downloadsCount: 520,
      techStack: ["OpenAI API", "Python", "JSON Schemas"],
      features: ["15 Enterprise AI Prompts", "Slide text generator", "Competitor analysis schema"],
      seller: { id: "seller-alex", storeName: "Alex AI Works", logoUrl: null, isVerified: true, trustScore: 95 }
    }
  ];

  const handleBuy = (prod: SolutionProduct) => {
    triggerToast(`Acquisition initiated for ${prod.title}! Check your email for code access.`);
  };

  const handleBuyKit = (kit: StartupKit) => {
    triggerToast(`Startup Bundle "${kit.name}" acquired! All ${kit.includes.length} assets un-archived.`);
  };

  const handleHireCreator = (creator: CreatorProfile | string) => {
    const cName = typeof creator === "string" ? creator : creator.name;
    triggerToast(`Custom work request ticket opened with ${cName}!`);
  };

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
        {/* 1. PREMIUM HERO */}
        <ShopHero
          onSearch={(q) => setSearchQuery(q)}
          onSelectSuggestion={(cat) => setSelectedCategory(cat)}
          onOpenSellModal={() => triggerToast("Publisher studio opening...")}
        />

        {/* 2. ROLE PERSPECTIVE TOGGLE */}
        <ShopRoleToggle
          currentRole={roleView}
          onRoleChange={(r) => setRoleView(r)}
        />

        {/* 3. LIVE ECOSYSTEM FEED TICKER */}
        <ShopFeedTicker />

        {/* 4. AI BUILD ASSISTANT */}
        <AIBuildAssistant
          onDeployStack={(stackName) => triggerToast(`Complete ${stackName} tech stack deployed to your repository!`)}
        />

        {/* 5. STARTUP KITS (1-CLICK BUNDLES) */}
        <StartupKitsSection
          onBuyKit={handleBuyKit}
        />

        {/* 6. CREATOR SPOTLIGHT */}
        <CreatorSpotlightSection
          onHireCreator={(c) => handleHireCreator(c)}
        />

        {/* 7. INNOVATION SHOWCASE (HARDWARE & ROBOTICS) */}
        <InnovationShowcaseSection
          onInspectInnovation={(hw) => triggerToast(`Inspecting CAD & PCB files for ${hw.title}`)}
        />

        {/* 8. VISUAL CATEGORIES GRID */}
        <VisualCategoryGrid
          onSelectCategory={(catName) => setSelectedCategory(catName)}
        />

        {/* 9. CURATED COLLECTIONS */}
        <CuratedCollections
          onSelectCollection={(colId) => triggerToast(`Filtered collection: ${colId}`)}
        />

        {/* 10. PRODUCT CARDS GRID */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Featured Startup Products & Assets
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              Showing {products.length} Production Ready Items
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-card border border-border rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((prod) => (
                <RedesignedProductCard
                  key={prod.id}
                  product={prod}
                  onInspect={(p) => setInspectingProduct(p)}
                  onBuy={(p) => handleBuy(p)}
                  onCustomize={(p) => setCustomizingProduct({ title: p.title, creator: p.seller?.storeName || "Marcus Labs" })}
                  onHireCreator={(cName) => handleHireCreator(cName)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* SOLUTION INSPECTOR MODAL */}
      <SolutionInspectorModal
        isOpen={!!inspectingProduct}
        product={inspectingProduct}
        onClose={() => setInspectingProduct(null)}
        onAcquire={(p) => handleBuy(p)}
      />

      {/* CUSTOMIZATION MODAL */}
      <CustomizationModal
        isOpen={!!customizingProduct}
        productTitle={customizingProduct?.title}
        creatorName={customizingProduct?.creator}
        onClose={() => setCustomizingProduct(null)}
        onSubmitRequest={({ requirements, budget, timeline }) =>
          triggerToast(`Customization request ($${budget}, ${timeline}) sent to ${customizingProduct?.creator}!`)
        }
      />
    </div>
  );
}
