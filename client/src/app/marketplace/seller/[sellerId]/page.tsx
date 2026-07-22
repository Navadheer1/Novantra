"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import {
  Star, Eye, Download, ShieldCheck, ShoppingCart, ArrowLeft,
  Globe, Mail, UserPlus, Heart, MessageSquare,
  AlertCircle, Grid, PlayCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

interface SellerDetails {
  id: string;
  storeName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  description: string;
  website: string;
  socialLinks: { twitter?: string; github?: string };
  isVerified: boolean;
  trustScore: number;
  revenueTotal: number;
  followersCount: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  originalPrice: number | null;
  thumbnailUrl: string;
  rating: number;
  downloadsCount: number;
  isService?: boolean;
}

interface PageProps {
  params: Promise<{ sellerId: string }>;
}

export default function SellerStorePage({ params }: PageProps) {
  const { sellerId } = React.use(params);
  const { getToken } = useAuth();

  const [seller, setSeller] = useState<SellerDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Follow state toggle
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersOffset, setFollowersOffset] = useState(0);

  // Cart count
  const [cartItems, setCartItems] = useState<string[]>([]);

  const fetchSellerStore = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/marketplace/seller/${sellerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setSeller(data.seller);
        setProducts(data.products);
      } else {
        throw new Error("Failed to fetch store details");
      }
    } catch (err) {
      console.warn("REST API failed. Loading storefront in offline mock sandbox mode.");
      
      // Mock Fallbacks
      const mockSellers: Record<string, { seller: SellerDetails; products: Product[] }> = {
        "seller-marcus": {
          seller: {
            id: "seller-marcus",
            storeName: "Marcus Labs",
            logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
            bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&h=300&fit=crop",
            description: "Building next-generation developer tooling and production-grade templates. Designed for founders scaling applications fast.",
            website: "https://marcuslabs.dev",
            socialLinks: { twitter: "marcus_codes", github: "marcus-labs" },
            isVerified: true,
            trustScore: 98,
            revenueTotal: 14250.0,
            followersCount: 142
          },
          products: [
            { id: "prod-next-saas", title: "Next.js SaaS Boilerplate V2", description: "Complete Next.js boilerplate template preconfigured with Stripe and Clerk Auth.", category: "Next.js Projects", tags: ["Next.js", "SaaS", "Stripe"], price: 49.00, originalPrice: 99.00, thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", rating: 4.8, downloadsCount: 312 },
            { id: "prod-saas-mvp", title: "I will build your SaaS MVP in 14 days", description: "Skip developer hiring bottlenecks. Functional Next.js SaaS MVP built by a Lead Developer.", category: "Agencies", tags: ["Freelance", "Next.js", "MVP Builder"], price: 1999.00, originalPrice: 2499.00, thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=250&fit=crop", rating: 5.0, downloadsCount: 12, isService: true }
          ]
        },
        "seller-elena": {
          seller: {
            id: "seller-elena",
            storeName: "Elena UI/UX",
            logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            bannerUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&h=300&fit=crop",
            description: "Premium Figma kits, React design systems, and animated landing pages built for startup landing grids.",
            website: "https://elena.design",
            socialLinks: { twitter: "elena_uiux", github: "elena-designs" },
            isVerified: true,
            trustScore: 99,
            revenueTotal: 8430.0,
            followersCount: 96
          },
          products: [
            { id: "prod-figma-kit", title: "Vibrant UI - Figma Design System", description: "Figma UI kit built for dashboard SaaS layouts. Features 300+ components.", category: "UI Kits", tags: ["Figma", "UI Kit", "Design System"], price: 29.00, originalPrice: 49.00, thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop", rating: 4.9, downloadsCount: 184 }
          ]
        }
      };

      const matchedMock = mockSellers[sellerId as string];
      if (matchedMock) {
        setSeller(matchedMock.seller);
        setProducts(matchedMock.products);
      } else {
        setError("Seller store not found.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerStore();
  }, [sellerId]);

  // Load Cart items count
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

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersOffset(prev => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersOffset(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-24">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs text-slate-400">Loading storefront details...</span>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto py-24 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-sm font-bold text-slate-700">Failed to load seller storefront</h2>
          <p className="text-xs text-slate-400">{error || "Could not resolve parameters."}</p>
          <Link href="/marketplace" className="inline-block text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
      <Navbar />

      {/* Store Banner */}
      <div className="w-full h-56 bg-slate-200 overflow-hidden relative border-b border-slate-100">
        {seller.bannerUrl ? (
          <img src={seller.bannerUrl} alt={seller.storeName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>

      {/* Store Info Profile */}
      <section className="-mt-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            {/* Store Logo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow bg-slate-100 shrink-0">
              <img src={seller.logoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop"} alt={seller.storeName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h1 className="text-xl font-black text-slate-800">{seller.storeName}</h1>
                {seller.isVerified && (
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-500 fill-blue-50" /> Verified Seller
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 max-w-lg leading-relaxed font-normal">{seller.description}</p>
              
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start pt-1.5">
                <a href={seller.website} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all">
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
                {seller.socialLinks.twitter && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5 text-blue-400" /> @{seller.socialLinks.twitter}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Followers count and Follow CTAs */}
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-200/50 rounded-xl">
                <span className="text-base font-black text-slate-800 block">{seller.followersCount + followersOffset}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Followers</span>
              </div>
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-200/50 rounded-xl">
                <span className="text-base font-black text-slate-800 block">{seller.trustScore}%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Trust Score</span>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                onClick={handleFollowToggle}
                className={`flex-1 font-bold rounded-xl text-xs px-5 py-2.5 ${
                  isFollowing
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow"
                }`}
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                {isFollowing ? "Following" : "Follow Store"}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Store Catalog Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="border-b border-slate-200/70 pb-3.5 mb-6 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Grid className="w-4.5 h-4.5" /> Published Products ({products.length})
          </h2>
        </div>

        {/* Products Grid */}
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

                {/* Meta details */}
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {prod.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200/60 rounded text-[9px] font-semibold text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Price row */}
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
          {products.length === 0 && (
            <p className="col-span-full text-center italic text-slate-400 py-12">No products published by this store yet.</p>
          )}
        </div>
      </main>

    </div>
  );
}
