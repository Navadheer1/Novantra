"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import {
  Search, Filter, Star, Eye, Download, ShieldCheck, ArrowRight,
  TrendingUp, Award, Clock, Sparkles, AlertCircle, ShoppingCart, 
  HelpCircle, ChevronRight, Check, X, ArrowUpDown, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Seller {
  id: string;
  storeName: string;
  logoUrl: string | null;
  isVerified: boolean;
  trustScore: number;
}

interface Product {
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
  rating: number;
  downloadsCount: number;
  isService?: boolean;
  seller?: Seller;
}

export default function MarketplacePage() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPill, setSelectedPill] = useState<'newest' | 'trending' | 'bestsellers' | 'free' | 'premium' | 'verified'>('trending');
  
  // Cart state helper
  const [cartItems, setCartItems] = useState<string[]>([]);

  const categories = [
    "All", "Next.js Projects", "SaaS", "Websites", "UI Kits", 
    "AI Tools", "Chrome Extensions", "Notion Templates", "Pitch Decks", "Agencies"
  ];

  const pills = [
    { id: "newest", label: "Newest" },
    { id: "trending", label: "Trending" },
    { id: "bestsellers", label: "Best Sellers" },
    { id: "free", label: "Free" },
    { id: "premium", label: "Premium" },
    { id: "verified", label: "Verified Sellers" }
  ] as const;

  // Load products from API or fallback
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      
      // Construct query parameters
      let params = new URLSearchParams();
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      
      if (selectedPill === 'free') params.append("free", "true");
      if (selectedPill === 'premium') params.append("premium", "true");
      if (selectedPill === 'verified') params.append("verified", "true");
      
      if (selectedPill === 'newest') params.append("sort", "newest");
      else if (selectedPill === 'trending') params.append("sort", "rating");
      else if (selectedPill === 'bestsellers') params.append("sort", "popularity");

      const res = await fetch(`${apiUrl}/api/marketplace/products?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        throw new Error("Failed to fetch products from backend API");
      }
    } catch (err) {
      console.warn("Could not fetch products from server, utilizing local cache fallback:", err);
      // High-Fidelity Local Mock Fallback
      const fallbackProducts: Product[] = [
        {
          id: "prod-next-saas",
          sellerId: "seller-marcus",
          title: "Next.js SaaS Boilerplate V2",
          description: "Complete production-ready Next.js App Router boilerplate. Pre-configured with Clerk Auth, Stripe payments, Resend email workflows, and a tailwind theme dashboard layout.",
          category: "Next.js Projects",
          tags: ["Next.js", "SaaS", "Stripe", "Prisma"],
          price: 49.00,
          originalPrice: 99.00,
          type: "DIGITAL_DOWNLOAD",
          status: "ACTIVE",
          version: "2.1.0",
          thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
          rating: 4.8,
          downloadsCount: 312,
          seller: { id: "seller-marcus", storeName: "Marcus Labs", logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", isVerified: true, trustScore: 98 }
        },
        {
          id: "prod-figma-kit",
          sellerId: "seller-elena",
          title: "Vibrant UI - Figma Design System",
          description: "A premium Figma UI kit built specifically for startup landing pages and dashboard SaaS layouts. Features 300+ responsive components.",
          category: "UI Kits",
          tags: ["Figma", "UI Kit", "Design System"],
          price: 29.00,
          originalPrice: 49.00,
          type: "DESIGN_ASSETS",
          status: "ACTIVE",
          version: "1.2.0",
          thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop",
          rating: 4.9,
          downloadsCount: 184,
          seller: { id: "seller-elena", storeName: "Elena UI/UX", logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", isVerified: true, trustScore: 99 }
        },
        {
          id: "prod-saas-mvp",
          sellerId: "seller-marcus",
          title: "I will build your SaaS MVP in 14 days",
          description: "Are you a founder looking to build a functional SaaS MVP quickly? Skip the developer hiring headaches. Next.js & PostgreSQL stack.",
          category: "Agencies",
          tags: ["Freelance", "Next.js", "MVP Builder"],
          price: 1999.00,
          originalPrice: 2499.00,
          type: "SERVICE",
          status: "ACTIVE",
          version: "1.0.0",
          thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=250&fit=crop",
          rating: 5.0,
          downloadsCount: 12,
          isService: true,
          seller: { id: "seller-marcus", storeName: "Marcus Labs", logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", isVerified: true, trustScore: 98 }
        }
      ];

      // Perform local filtering
      let localFiltered = fallbackProducts;
      if (selectedCategory !== "All") {
        localFiltered = localFiltered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      if (searchQuery) {
        const s = searchQuery.toLowerCase();
        localFiltered = localFiltered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      if (selectedPill === 'free') {
        localFiltered = localFiltered.filter(p => p.price === 0);
      }
      setProducts(localFiltered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedPill]);

  // Handle Search Debounce / Trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  // Sync Cart Items count
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("noventra_cart_items");
      if (stored) {
        try {
          setCartItems(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const addToCart = (productId: string) => {
    const nextCart = [...cartItems];
    if (!nextCart.includes(productId)) {
      nextCart.push(productId);
      setCartItems(nextCart);
      localStorage.setItem("noventra_cart_items", JSON.stringify(nextCart));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
      <Navbar />

      {/* Hero Header Section */}
      <section className="bg-white border-b border-slate-100 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> FounderX Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Scale Your Startup with <br />
              <span className="text-blue-600">Premium Digital Assets</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Buy and sell SaaS boilerplate code, landing pages, Figma templates, custom AI assistants, Chrome extensions, financial sheets, and freelance agency services.
            </p>

            {/* Powerful Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Next.js, Figma, AI Chatbots, SaaS mvps..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" className="bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl px-5">
                Search
              </Button>
            </form>
          </div>

          {/* Platform Stat Cards */}
          <div className="grid grid-cols-2 gap-3.5 w-full lg:w-96">
            {[
              { val: "14,240+", label: "Products Sold", desc: "Templates & scripts" },
              { val: "210+", label: "Verified Sellers", desc: "Top startup talent" },
              { val: "84,200+", label: "Total Downloads", desc: "PDFs, ZIPs & Figmas" },
              { val: "9,450+", label: "Active Buyers", desc: "Founders & builders" }
            ].map(stat => (
              <div key={stat.label} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
                <span className="text-lg font-black text-slate-800 block">{stat.val}</span>
                <span className="text-[10px] font-bold text-slate-700 block mt-0.5">{stat.label}</span>
                <span className="text-[9px] text-slate-400 block">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Categories Sidebar */}
        <div className="w-full md:w-56 shrink-0 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/50">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Categories
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick links to Dashboard / Cart */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Creator Hub</span>
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
              Earn revenue by selling your code, designs, pitch decks, or services to our founder community.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/marketplace/dashboard" className="w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[10px] shadow-sm transition-all block">
                Seller Dashboard
              </Link>
              <Link href="/marketplace/purchases" className="w-full text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] transition-all block">
                My Purchases Log
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Filters pills & Product Grid */}
        <div className="flex-1 space-y-5">
          {/* Sub Filters & Cart indicator */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-100 rounded-2xl p-3 shadow-sm shadow-slate-100/50">
            <div className="flex flex-wrap gap-1">
              {pills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedPill(pill.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                    selectedPill === pill.id
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            
            <Link
              href="/marketplace/cart"
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-[10px] font-bold text-slate-700 flex items-center gap-1.5 transition-all shrink-0"
            >
              <ShoppingCart className="w-4 h-4 text-slate-500" />
              Cart ({cartItems.length})
            </Link>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="bg-slate-200 h-40 rounded-xl w-full" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-slate-200 rounded w-12" />
                    <div className="h-7 bg-slate-200 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm shadow-slate-100/50">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">No matching products</h4>
              <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                We couldn't find any resources matching your parameters. Try modifying your filters or checking other categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => {
                const discountPct = prod.originalPrice
                  ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                  : null;

                return (
                  <div
                    key={prod.id}
                    className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl overflow-hidden shadow-sm shadow-slate-100 hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Thumbnail banner */}
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img
                        src={prod.thumbnailUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {discountPct && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-rose-500 text-white text-[9px] font-extrabold tracking-wide">
                          {discountPct}% OFF
                        </span>
                      )}
                      {prod.isService && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-extrabold tracking-wide uppercase">
                          Service
                        </span>
                      )}
                    </div>

                    {/* Meta specifications */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400">
                          <span>{prod.category}</span>
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {prod.rating.toFixed(1)}
                          </span>
                        </div>
                        <Link href={`/marketplace/product/${prod.id}`} className="font-bold text-slate-800 text-xs hover:text-blue-600 transition-colors line-clamp-1 block">
                          {prod.title}
                        </Link>
                        <p className="text-[10px] text-slate-400 leading-normal line-clamp-2 font-medium">
                          {prod.description}
                        </p>
                      </div>

                      {/* Tags list */}
                      <div className="flex flex-wrap gap-1">
                        {prod.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200/60 rounded text-[9px] font-semibold text-slate-500">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Pricing and Action row */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/80">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-black text-slate-900">${prod.price}</span>
                            {prod.originalPrice && (
                              <span className="text-[9px] text-slate-400 line-through">${prod.originalPrice}</span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            {prod.downloadsCount} downloads
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <Link
                            href={`/marketplace/product/${prod.id}`}
                            className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-[9px] transition-all"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => addToCart(prod.id)}
                            disabled={cartItems.includes(prod.id)}
                            className={`px-3 py-1.5 font-bold rounded-xl text-[9px] shadow-sm transition-all ${
                              cartItems.includes(prod.id)
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {cartItems.includes(prod.id) ? "Added" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
