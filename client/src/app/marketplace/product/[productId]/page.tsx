"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import {
  Star, Eye, Download, ShieldCheck, ShoppingCart, ArrowLeft,
  BookOpen, Code, Terminal, AlertCircle, Share2, HelpCircle,
  ExternalLink, Mail, UserPlus, Heart, MessageSquare, Loader2, Check
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

interface Review {
  id: string;
  userName: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  sellerReply: string | null;
  createdAt: string;
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
  videoDemoUrl: string | null;
  techStack: string[];
  features: string[];
  installGuide: string;
  licensing: string;
  fileUrl: string | null;
  externalUrl: string | null;
  rating: number;
  downloadsCount: number;
  isService?: boolean;
  servicePackages?: {
    basic: { price: number; deliveryDays: number; revisions: number; specs: string[] };
    standard: { price: number; deliveryDays: number; revisions: number; specs: string[] };
    premium: { price: number; deliveryDays: number; revisions: number; specs: string[] };
  };
  faqs?: Array<{ q: string; a: string }>;
  seller?: Seller;
  reviews?: Review[];
}

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { productId } = React.use(params);
  const { getToken } = useAuth();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab state: 'overview' | 'tech' | 'reviews' | 'install'
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'reviews' | 'install'>('overview');
  
  // Package tier state: 'basic' | 'standard' | 'premium'
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Cart helper
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [isInCart, setIsInCart] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/marketplace/products/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        throw new Error("Failed to fetch product from server");
      }
    } catch (err) {
      console.warn("REST API failed. Rendering details page in offline mock mode.");
      
      // Fallback details mock mapper
      const mockDataList: Record<string, ProductDetails> = {
        "prod-next-saas": {
          id: "prod-next-saas",
          sellerId: "seller-marcus",
          title: "Next.js SaaS Boilerplate V2",
          description: "Complete production-ready Next.js App Router boilerplate. Pre-configured with Clerk Auth, Prisma PostgreSQL, Stripe payments, Resend email workflows, and a tailwind theme dashboard layout. Build your SaaS MVP in hours instead of weeks.",
          category: "Next.js Projects",
          tags: ["Next.js", "SaaS", "Stripe", "Prisma", "TypeScript"],
          price: 49.00,
          originalPrice: 99.00,
          type: "DIGITAL_DOWNLOAD",
          status: "ACTIVE",
          version: "2.1.0",
          thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
          screenshots: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop"
          ],
          videoDemoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          techStack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Prisma ORM", "Stripe"],
          features: [
            "Clerk Auth pre-configured",
            "Stripe Subscription Checkout flow & webhooks",
            "Interactive Dashboard analytics template",
            "Resend transactional emails ready",
            "SEO Metadata & Sitemap generators"
          ],
          installGuide: "1. Clone repo\n2. Run `npm install`\n3. Copy `.env.example` to `.env` and fill variables\n4. Run `npx prisma db push`\n5. Run `npm run dev`",
          licensing: "COMMERCIAL",
          fileUrl: "#",
          externalUrl: "https://github.com/marcus-labs/next-saas-boilerplate",
          rating: 4.8,
          downloadsCount: 312,
          seller: { id: "seller-marcus", storeName: "Marcus Labs", logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", description: "Building developer tools and Next.js startup code.", website: "https://marcuslabs.dev", isVerified: true, trustScore: 98 },
          reviews: [
            { id: "rev-1", userName: "Sarah Chen", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", rating: 5, comment: "This saved me easily 40 hours of work setting up Stripe webhooks and Clerk custom claims. Highly recommend it!", sellerReply: "Thanks Sarah! Glad it saved you time.", createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString() }
          ],
          faqs: [
            { q: "Do you offer developer support?", a: "Yes, standard support is provided via email. Payout license keys grants you access to our Discord server." }
          ]
        },
        "prod-figma-kit": {
          id: "prod-figma-kit",
          sellerId: "seller-elena",
          title: "Vibrant UI - Figma Design System",
          description: "A premium Figma UI kit built specifically for startup landing pages and dashboard SaaS layouts. Features 300+ responsive components, typography hierarchies, auto-layout 5.0 configuration, variable color themes, and 45 custom screen templates.",
          category: "UI Kits",
          tags: ["Figma", "UI Kit", "Design System", "Startups"],
          price: 29.00,
          originalPrice: 49.00,
          type: "DESIGN_ASSETS",
          status: "ACTIVE",
          version: "1.2.0",
          thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=300&fit=crop",
          screenshots: [
            "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=400&fit=crop"
          ],
          videoDemoUrl: null,
          techStack: ["Figma", "Auto-Layout", "Variables"],
          features: [
            "300+ Nested responsive components",
            "Auto-Layout 5.0 set up on all grids",
            "Light and Dark mode style variables",
            "45 Responsive page mockup templates",
            "Free lifetime updates"
          ],
          installGuide: "1. Download the file\n2. Drag and drop the `.fig` file directly into your Figma workspace",
          licensing: "PERSONAL",
          fileUrl: "#",
          externalUrl: null,
          rating: 4.9,
          downloadsCount: 184,
          seller: { id: "seller-elena", storeName: "Elena UI/UX", logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", description: "Design systems and premium graphics templates.", website: "https://elena.design", isVerified: true, trustScore: 99 },
          reviews: [
            { id: "rev-2", userName: "Jason Sterling", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", rating: 4, comment: "Incredibly clean component libraries. Auto layout is perfectly configured.", sellerReply: "Variant updates are incoming in v1.3!", createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString() }
          ]
        },
        "prod-saas-mvp": {
          id: "prod-saas-mvp",
          sellerId: "seller-marcus",
          title: "I will build your SaaS MVP in 14 days",
          description: "Are you a founder looking to build a functional SaaS MVP quickly? Skip the developer hiring headaches. I specialize in building rapid, high-performance web applications using Next.js, Tailwind CSS, Clerk, and PostgreSQL. Let's get your product ready to launch in 2 weeks.",
          category: "Agencies",
          tags: ["Freelance", "Next.js", "MVP Builder", "SaaS Development"],
          price: 1999.00,
          originalPrice: 2499.00,
          type: "SERVICE",
          status: "ACTIVE",
          version: "1.0.0",
          thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=300&fit=crop",
          screenshots: [],
          videoDemoUrl: null,
          techStack: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
          features: [
            "Custom UI Design & Architecture mapping",
            "Core database modeling and schemas setup",
            "Authentication and User roles integration",
            "Stripe payment/sub gateways setup",
            "Deployment to Vercel/AWS"
          ],
          installGuide: "After purchase, you will receive a scheduler invite link. We will hold a 45-minute scope alignment kick-off call to kick off the development.",
          licensing: "CUSTOM",
          fileUrl: null,
          externalUrl: null,
          rating: 5.0,
          downloadsCount: 12,
          isService: true,
          servicePackages: {
            basic: { price: 1999, deliveryDays: 14, revisions: 3, specs: ["1-4 Core page layouts", "Clerk Authentication integration", "1 Payment gateway setup", "Deployment support"] },
            standard: { price: 2999, deliveryDays: 21, revisions: 5, specs: ["1-8 Core layouts", "Authentication + User roles DB setups", "Stripe payment subscription systems", "SendGrid email templates integration", "1 Custom API integration"] },
            premium: { price: 4499, deliveryDays: 30, revisions: 99, specs: ["Unlimited pages", "Complete database schemas & relationships", "Advanced billing subscriptions", "Multi-Agent AI / LLM workflows integration", "Full developer handoff & 30-day post launch support"] }
          },
          faqs: [
            { q: "What technologies do you build with?", a: "I build exclusively with Next.js, Node.js, Tailwind CSS, PostgreSQL, Prisma, and Clerk for authentication." },
            { q: "Do you offer post-launch maintenance?", a: "Yes, standard and premium packages include a support buffer, and custom retainers can be scheduled." }
          ],
          seller: { id: "seller-marcus", storeName: "Marcus Labs", logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", description: "Building developer tools and Next.js startup code.", website: "https://marcuslabs.dev", isVerified: true, trustScore: 98 }
        }
      };

      const matchedMock = mockDataList[productId as string];
      if (matchedMock) setProduct(matchedMock);
      else setError("Product details not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // Load and check Cart items
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("noventra_cart_items");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCartItems(parsed);
          setIsInCart(parsed.includes(productId));
        } catch (e) {}
      }
    }
  }, [productId]);

  // Toggle Cart Item
  const handleCartAction = () => {
    const nextCart = [...cartItems];
    if (isInCart) {
      const filtered = nextCart.filter(id => id !== productId);
      setCartItems(filtered);
      setIsInCart(false);
      localStorage.setItem("noventra_cart_items", JSON.stringify(filtered));
    } else {
      nextCart.push(productId as string);
      setCartItems(nextCart);
      setIsInCart(true);
      localStorage.setItem("noventra_cart_items", JSON.stringify(nextCart));
    }
  };

  // Submit Review Controller
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const token = await getToken();
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      
      const res = await fetch(`${apiUrl}/api/marketplace/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          productId,
          rating: newRating,
          comment: newComment
        })
      });

      if (res.ok) {
        const addedReview = await res.json();
        setProduct(prev => prev ? {
          ...prev,
          reviews: [addedReview, ...(prev.reviews || [])]
        } : null);
        setNewComment("");
      }
    } catch (err) {
      // Local addition fallback
      const mockNewReview: Review = {
        id: `rev-${Date.now()}`,
        userName: "You (Tester)",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
        rating: newRating,
        comment: newComment,
        sellerReply: null,
        createdAt: new Date().toISOString()
      };
      setProduct(prev => prev ? {
        ...prev,
        reviews: [mockNewReview, ...(prev.reviews || [])]
      } : null);
      setNewComment("");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-24">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs text-slate-400">Loading specs details...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto py-24 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-sm font-bold text-slate-700">Failed to load product</h2>
          <p className="text-xs text-slate-400">{error || "Could not resolve parameters."}</p>
          <Link href="/marketplace" className="inline-block text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Calculate pricing based on service package selection
  const priceToDisplay = product.isService && product.servicePackages
    ? product.servicePackages[selectedTier].price
    : product.price;

  const currentPkgDetails = product.isService && product.servicePackages
    ? product.servicePackages[selectedTier]
    : null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
      <Navbar />

      {/* Main Spec content layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Back Link */}
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace catalog
        </Link>

        {/* Dynamic header cards */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Block: Product Details (Carousel, Demo, description tabs) */}
          <div className="flex-1 space-y-6 w-full">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm shadow-slate-100/50 space-y-5">
              <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
                <div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{product.title}</h1>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">Version {product.version} • Released by {product.seller?.storeName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-800 block">${priceToDisplay}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through block">${product.originalPrice}</span>
                    )}
                  </div>
                  <Button
                    onClick={handleCartAction}
                    className={`font-bold rounded-xl text-xs px-5 py-2 ${
                      isInCart
                        ? "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow"
                    }`}
                  >
                    {isInCart ? "Remove from Cart" : "Add to Cart"}
                  </Button>
                </div>
              </div>

              {/* Main Banner Screenshot */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/50 bg-slate-50 aspect-video relative flex items-center justify-center">
                {product.videoDemoUrl ? (
                  <video src={product.videoDemoUrl} controls className="w-full h-full object-cover" poster={product.thumbnailUrl} />
                ) : (
                  <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            {/* Spec info tabs */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm shadow-slate-100/50 space-y-6">
              <div className="flex border-b border-slate-100">
                {([
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'tech', label: 'Tech Stack', icon: Code },
                  { id: 'install', label: 'Installation', icon: Terminal },
                  { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})`, icon: MessageSquare }
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all capitalize ${
                      activeTab === tab.id
                        ? "border-slate-900 text-slate-900 bg-slate-50/50"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab views */}
              <div className="text-xs text-slate-600 leading-relaxed font-semibold">
                
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm mb-1.5">Description</h3>
                      <p className="font-normal whitespace-pre-wrap">{product.description}</p>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm mb-1.5">Key Features</h3>
                      <ul className="list-disc pl-4 space-y-1 font-semibold text-slate-600">
                        {product.features?.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm mb-2">Technologies Used</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {product.techStack?.map(tech => (
                          <span key={tech} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm mb-1">Licensing & Terms</h3>
                      <p className="font-normal">License: <span className="font-bold text-slate-800">{product.licensing} LICENSE</span>. Allows redistribution limits as specified in standard licensing agreements.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'install' && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-800 text-sm">Step-by-Step Setup Guide</h3>
                    <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                      {product.installGuide}
                    </pre>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Submit Review Form */}
                    <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-3">
                      <span className="font-bold text-slate-700 block">Submit Verified Review</span>
                      <div className="flex gap-4 items-center">
                        <span className="text-[10px] text-slate-400">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Write your review experience..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 text-slate-800 font-semibold"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button type="submit" disabled={submittingReview} className="bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl px-5">
                          {submittingReview ? "Posting..." : "Post Review"}
                        </Button>
                      </div>
                    </form>

                    {/* Review entries */}
                    <div className="space-y-4">
                      {product.reviews?.map(rev => (
                        <div key={rev.id} className="border-b border-slate-100 pb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={rev.avatarUrl} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <span className="font-bold text-slate-800 block">{rev.userName}</span>
                                <span className="text-[8px] text-slate-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="font-normal text-slate-600 pl-10">"{rev.comment}"</p>
                          
                          {/* Seller reply */}
                          {rev.sellerReply && (
                            <div className="bg-slate-50 border border-slate-200/50 p-2.5 rounded-xl ml-10 text-[11px] space-y-1">
                              <span className="font-bold text-slate-800 block">Reply from Creator:</span>
                              <p className="font-normal text-slate-500">"{rev.sellerReply}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!product.reviews || product.reviews.length === 0) && (
                        <p className="text-center italic text-slate-400 py-6">No reviews logged yet. Be the first to leave a review!</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Right Block: Payout Selector (Packages specs & Seller profiles) */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            
            {/* Packages / Licensing Selector card */}
            {product.isService && product.servicePackages ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm shadow-slate-100/50 space-y-4">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Service Packages</span>
                
                {/* Tiers button */}
                <div className="flex bg-slate-100 p-1 rounded-xl gap-0.5">
                  {(['basic', 'standard', 'premium'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                        selectedTier === tier
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                {currentPkgDetails && (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-400 uppercase text-[9px]">{selectedTier} pricing</span>
                      <span className="text-base font-black text-slate-800">${currentPkgDetails.price}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/50 text-[10px] font-semibold text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Delivery Time:</span>
                        <span className="text-slate-800">{currentPkgDetails.deliveryDays} Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revisions:</span>
                        <span className="text-slate-800">{currentPkgDetails.revisions} Revisions</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold block mb-1">What's Included:</span>
                      {currentPkgDetails.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm shadow-slate-100/50 space-y-3.5 text-xs text-slate-600 font-semibold leading-normal">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Product Details</span>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">License Type:</span>
                    <span className="font-bold text-slate-800">{product.licensing} LICENSE</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Latest Version:</span>
                    <span className="font-bold text-slate-800">v{product.version}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Total Purchases:</span>
                    <span className="font-bold text-slate-800">{product.downloadsCount} purchases</span>
                  </div>
                </div>
              </div>
            )}

            {/* Seller profile card */}
            {product.seller && (
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm shadow-slate-100/50 space-y-4">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Creator Store</span>
                <div className="flex items-center gap-3">
                  <img src={product.seller.logoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"} alt={product.seller.storeName} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      {product.seller.storeName}
                      {product.seller.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />}
                    </h4>
                    <span className="text-[10px] text-slate-400">Trust Score: {product.seller.trustScore}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal font-normal">{product.seller.description}</p>
                
                <div className="flex gap-2">
                  <Link
                    href={`/marketplace/seller/${product.seller.id}`}
                    className="flex-1 text-center py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-[10px] transition-all block"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
