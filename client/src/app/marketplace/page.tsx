"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/apiConfig";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle2, Flame, Rocket, Sparkles, Star, ThumbsUp, Layers } from "lucide-react";

import ShopLeftSidebar from "@/components/marketplace/ShopLeftSidebar";
import ShopTopSearch from "@/components/marketplace/ShopTopSearch";
import AppStoreProductCard from "@/components/marketplace/AppStoreProductCard";
import AppStoreCollections from "@/components/marketplace/AppStoreCollections";
import ShopRightPanel from "@/components/marketplace/ShopRightPanel";

import SolutionInspectorModal from "@/components/marketplace/SolutionInspectorModal";
import CustomizationModal from "@/components/marketplace/CustomizationModal";
import { SolutionProduct } from "@/components/marketplace/SolutionCard";

export default function MarketplacePage() {
  const { getToken } = useAuth();

  // Data & Loading State
  const [products, setProducts] = useState<SolutionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App Store Navigation State
  const [activeSection, setActiveSection] = useState("discover"); // discover | collections | category | creators | library
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Wishlist & Recently Viewed State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<SolutionProduct[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<SolutionProduct | null>(null);

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

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    triggerToast(
      wishlistIds.includes(productId) ? "Removed from Wishlist" : "Saved to My Library Wishlist!"
    );
  };

  const handleInspect = (prod: SolutionProduct) => {
    setInspectingProduct(prod);
    setRecentlyViewed((prev) => [prod, ...prev.filter((p) => p.id !== prod.id)]);
  };

  const handleBuy = (prod: SolutionProduct) => {
    setPurchasedIds((prev) => [...prev, prod.id]);
    triggerToast(`Acquisition initiated for ${prod.title}! Check your library access.`);
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
        setProducts(data.length > 0 ? data : getFallbackProducts());
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
      id: "prod-nova-crm",
      sellerId: "seller-marcus",
      title: "Nova CRM & LeadPulse AI Engine",
      description: "Autonomous pipeline scoring and Stripe revenue attribution. Includes real-time lead routing and email sequence automation.",
      category: "SaaS",
      tags: ["SaaS", "CRM", "Stripe", "AI"],
      price: 79.0,
      originalPrice: 120.0,
      type: "DIGITAL_DOWNLOAD",
      status: "ACTIVE",
      version: "2.0.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      rating: 4.9,
      downloadsCount: 1840,
      techStack: ["Next.js 16", "TypeScript", "Prisma", "Stripe"],
      features: ["Pipeline scoring", "Stripe webhook sync", "Autonomous outreach"],
      seller: { id: "seller-marcus", storeName: "Marcus Labs", logoUrl: null, isVerified: true, trustScore: 99 }
    },
    {
      id: "prod-hospital-os",
      sellerId: "seller-elena",
      title: "HospitalOS v3 - Clinical Workflow Engine",
      description: "HIPAA-compliant patient portal, EHR sync APIs, and intelligent doctor schedule optimizer built for healthcare startups.",
      category: "SaaS",
      tags: ["Healthcare", "EHR", "HIPAA", "API"],
      price: 149.0,
      originalPrice: 199.0,
      type: "DIGITAL_DOWNLOAD",
      status: "ACTIVE",
      version: "3.1.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
      rating: 4.8,
      downloadsCount: 920,
      techStack: ["React", "FHIR API", "PostgreSQL", "Tailwind"],
      features: ["HIPAA security vault", "FHIR EHR connector", "Patient messaging"],
      seller: { id: "seller-elena", storeName: "HealthTech Systems", logoUrl: null, isVerified: true, trustScore: 98 }
    },
    {
      id: "prod-builder-kit",
      sellerId: "seller-alex",
      title: "BuilderKit - Next.js 16 SaaS Boilerplate",
      description: "Complete production-ready Next.js App Router boilerplate pre-configured with Clerk Auth, Prisma DB, Stripe payments, and Resend.",
      category: "Startup Kits",
      tags: ["Next.js", "SaaS", "Boilerplate"],
      price: 49.0,
      originalPrice: 99.0,
      type: "DIGITAL_DOWNLOAD",
      status: "ACTIVE",
      version: "2.4.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop",
      rating: 4.9,
      downloadsCount: 3200,
      techStack: ["Next.js 16", "Clerk", "Prisma", "Stripe"],
      features: ["Clerk auth ready", "Stripe subscription webhooks", "Tailwind dashboard"],
      seller: { id: "seller-alex", storeName: "Alex Works", logoUrl: null, isVerified: true, trustScore: 97 }
    },
    {
      id: "prod-ai-agent-suite",
      sellerId: "seller-alex",
      title: "AI Co-Founder & Pitch Deck Prompt Suite",
      description: "Production prompt engineering kit and API wrapper for OpenAI GPT-4. Generates financial projections & pitch deck copy automatically.",
      category: "AI Agents",
      tags: ["AI", "OpenAI", "Prompt Kit"],
      price: 0,
      originalPrice: 29.0,
      type: "FREE_ASSET",
      status: "ACTIVE",
      version: "1.0.0",
      thumbnailUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=250&fit=crop",
      rating: 4.7,
      downloadsCount: 1420,
      techStack: ["OpenAI API", "Python", "JSON Schemas"],
      features: ["15 Enterprise AI Prompts", "Slide text generator", "Financial modeler"],
      seller: { id: "seller-alex", storeName: "Alex Works", logoUrl: null, isVerified: true, trustScore: 97 }
    }
  ];

  // Filter products by selected category or section
  const filteredProducts = products.filter((p) => {
    if (activeSection === "library") return wishlistIds.includes(p.id) || purchasedIds.includes(p.id);
    if (selectedCategory === "ALL") return true;
    return p.category?.toUpperCase().replace(/\s+/g, "_") === selectedCategory || p.tags?.some(t => t.toUpperCase() === selectedCategory);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3-COLUMN APP STORE FOR STARTUPS LAYOUT */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-6 items-start">
          
          {/* 1. PERSISTENT LEFT SIDEBAR */}
          <div className="lg:sticky lg:top-20">
            <ShopLeftSidebar
              activeSection={activeSection}
              onSelectSection={(sec) => setActiveSection(sec)}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveSection("category");
              }}
              wishlistCount={wishlistIds.length}
              purchasesCount={purchasedIds.length}
            />
          </div>

          {/* 2. CENTER PRODUCT FEED (DISCOVERY ENGINE) */}
          <div className="space-y-6 min-w-0">
            {/* Top Natural Language Search & AI Matcher */}
            <ShopTopSearch
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              onSelectTag={(tag) => setSearchQuery(tag)}
            />

            {/* FEED SECTION CONTENT */}
            {activeSection === "collections" ? (
              <AppStoreCollections
                onSelectCollection={(colId) => {
                  triggerToast(`Showing collection: ${colId}`);
                  setSelectedCategory("ALL");
                  setActiveSection("discover");
                }}
              />
            ) : activeSection === "library" ? (
              <div className="space-y-4">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>My Library</span>
                  <span className="text-xs font-normal text-slate-400">({filteredProducts.length} Saved & Purchased)</span>
                </h2>
                {filteredProducts.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-slate-200/60 text-center text-xs text-slate-500 font-medium">
                    No items saved to your library yet. Browse products and click the bookmark icon to save them here!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((prod) => (
                      <AppStoreProductCard
                        key={prod.id}
                        product={prod}
                        onInspect={handleInspect}
                        onBuy={handleBuy}
                        onHoverProduct={setHoveredProduct}
                        isWishlisted={wishlistIds.includes(prod.id)}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* DISCOVER STREAM: Featured Today -> Recommended -> Collections -> Trending -> New Launches */
              <div className="space-y-8">
                {/* A. FEATURED TODAY */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>Featured Today</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Curated Daily</span>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {products.slice(0, 2).map((prod) => (
                        <AppStoreProductCard
                          key={prod.id}
                          product={prod}
                          onInspect={handleInspect}
                          onBuy={handleBuy}
                          onHoverProduct={setHoveredProduct}
                          isWishlisted={wishlistIds.includes(prod.id)}
                          onToggleWishlist={toggleWishlist}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* B. RECOMMENDED FOR YOU */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span>Recommended For You</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Based on your founder profile</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.slice(2, 4).map((prod) => (
                      <AppStoreProductCard
                        key={prod.id}
                        product={prod}
                        onInspect={handleInspect}
                        onBuy={handleBuy}
                        onHoverProduct={setHoveredProduct}
                        isWishlisted={wishlistIds.includes(prod.id)}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>
                </div>

                {/* C. CURATED COLLECTIONS */}
                <AppStoreCollections
                  onSelectCollection={(colId) => triggerToast(`Filtering by collection: ${colId}`)}
                />

                {/* D. TRENDING & NEW LAUNCHES STREAM */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                      <Rocket className="w-4 h-4 text-blue-600" />
                      <span>Recently Launched</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Showing {filteredProducts.length} tools</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((prod) => (
                      <AppStoreProductCard
                        key={prod.id}
                        product={prod}
                        onInspect={handleInspect}
                        onBuy={handleBuy}
                        onHoverProduct={setHoveredProduct}
                        isWishlisted={wishlistIds.includes(prod.id)}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. CONTEXTUAL RIGHT UTILITY PANEL */}
          <div className="lg:sticky lg:top-20">
            <ShopRightPanel
              hoveredProduct={hoveredProduct}
              onInspectProduct={handleInspect}
              onBuyProduct={handleBuy}
              trendingProducts={products}
              recentlyViewed={recentlyViewed}
            />
          </div>
        </div>
      </main>

      {/* QUICK PREVIEW & CODE INSPECTOR MODAL */}
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
        onSubmitRequest={({ budget, timeline }) =>
          triggerToast(`Customization ticket ($${budget}, ${timeline}) sent to creator!`)
        }
      />
    </div>
  );
}
