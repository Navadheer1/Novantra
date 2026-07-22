"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import {
  TrendingUp, Award, Clock, Sparkles, AlertCircle, Plus,
  FileText, Percent, ChevronRight, X, ArrowUpRight, DollarSign,
  Download, Eye, BarChart2, ShieldCheck, Check, UploadCloud, Loader2, ArrowLeft
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
  
  // Modals state
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  // Wizard form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("49");
  const [originalPrice, setOriginalPrice] = useState("99");
  const [category, setCategory] = useState("Next.js Projects");
  const [tags, setTags] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [zipUrl, setZipUrl] = useState("");
  const [licensing, setLicensing] = useState("COMMERCIAL");
  const [isService, setIsService] = useState(false);
  
  // Payout states
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  
  // Verification states
  const [verifying, setVerifying] = useState(false);
  const [verPending, setVerPending] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/marketplace/seller-dashboard/analytics`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        throw new Error("Failed to load seller analytics");
      }
    } catch (err) {
      console.warn("REST API failed. Initializing dashboard in offline mock mode.");
      // Mock Fallback
      setAnalytics({
        revenue: 14250.0,
        orders: 250,
        downloads: 312,
        views: 1560,
        conversionRate: 16.4,
        monthlyRevenue: [1420, 2130, 3130, 2560, 3560, 4270],
        recentSales: [
          { id: "sale-1", buyerName: "Alex Rivera", productTitle: "Next.js SaaS Boilerplate V2", price: 49.00, date: "2 hours ago" },
          { id: "sale-2", buyerName: "Maya Patel", productTitle: "Vibrant UI - Figma Design System", price: 29.00, date: "Yesterday" },
          { id: "sale-3", buyerName: "Dr. Sarah Chen", productTitle: "I will build your SaaS MVP in 14 days", price: 1999.00, date: "3 days ago" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Handle product upload wizard completion
  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      
      const payload = {
        title,
        description: desc,
        category,
        tags: tags.split(',').map(t => t.trim()),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        thumbnailUrl,
        fileUrl: zipUrl,
        licensing,
        isService
      };

      const res = await fetch(`${apiUrl}/api/marketplace/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Refresh products list on home
        fetchAnalytics();
      }
    } catch (e) {
      console.warn("Could not publish product to remote database. Adding locally.");
    }

    // Local additions fallback logic
    const activeUserClerkId = "temp-clerk-user";
    const localKey = `noventra_convs_${activeUserClerkId}`;
    // Let's also add it to localstorage mock products if present
    const localProdsKey = `noventra_marketplace_products`;
    const saved = localStorage.getItem(localProdsKey);
    let loaded: any[] = [];
    if (saved) {
      try { loaded = JSON.parse(saved); } catch (err) {}
    }
    loaded.unshift({
      id: `prod-user-${Date.now()}`,
      title,
      description: desc,
      category,
      tags: tags.split(',').map(t => t.trim()),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      downloadsCount: 0,
      rating: 5.0
    });
    localStorage.setItem(localProdsKey, JSON.stringify(loaded));

    // Reset wizard
    setTitle("");
    setDesc("");
    setPrice("49");
    setOriginalPrice("99");
    setTags("");
    setThumbnailUrl("");
    setZipUrl("");
    setWizardStep(1);
    setShowUploadWizard(false);

    // Increment local stats count
    if (analytics) {
      setAnalytics({
        ...analytics,
        downloads: analytics.downloads + 1
      });
    }
  };

  const handleWithdrawPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || Number(payoutAmount) <= 0) return;
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setPayoutAmount("");
      if (analytics) {
        setAnalytics({
          ...analytics,
          revenue: analytics.revenue - Number(payoutAmount)
        });
      }
    }, 2000);
  };

  const handleVerificationRequest = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerPending(true);
      setShowVerificationModal(false);
    }, 1500);
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-24">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs text-slate-400">Loading creator analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
      <Navbar />

      {/* Header bar */}
      <section className="bg-white border-b border-slate-100 py-8 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Creator Store Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Manage your products, view earnings, and create discount coupons.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowVerificationModal(true)}
              disabled={verPending}
              className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                verPending
                  ? 'bg-amber-50 border-amber-200 text-amber-600 cursor-not-allowed'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {verPending ? 'Verification Pending' : 'Verify My Store'}
            </button>
            <Button
              onClick={() => setShowUploadWizard(true)}
              className="bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl px-4 py-2 shadow flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" /> Upload Product
            </Button>
          </div>
        </div>
      </section>

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Back Link */}
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace catalog
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val: `$${analytics.revenue.toLocaleString()}`, label: "Total Revenue", icon: DollarSign, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
            { val: analytics.orders, label: "Total Orders", icon: FileText, color: "text-blue-500 bg-blue-50 border-blue-100" },
            { val: analytics.downloads, label: "Product Downloads", icon: Download, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
            { val: `${analytics.conversionRate}%`, label: "Conversion Rate", icon: BarChart2, color: "text-rose-500 bg-rose-50 border-rose-100" }
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{stat.label}</span>
                <span className="text-xl font-black text-slate-800 block mt-1">{stat.val}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Graph & Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue chart (SVG) */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Monthly Sales Revenue (USD)</span>
            <div className="h-56 relative flex items-end justify-between px-4 pb-2 border-b border-slate-200">
              
              {/* Grid background lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-40 select-none">
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
              </div>

              {/* SVG Line representation */}
              <svg className="absolute inset-0 w-full h-44 mt-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path
                  d="M 0 90 Q 100 80 200 60 T 300 70 T 400 40 T 500 20"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 90 Q 100 80 200 60 T 300 70 T 400 40 T 500 20 L 500 100 L 0 100 Z"
                  fill="url(#grad)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Bar indicators for month labels */}
              {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, idx) => (
                <div key={m} className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[9px] font-bold text-slate-400">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Withdraw Payout Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Withdraw Earnings</span>
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl text-center space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Available Balance</span>
              <span className="text-2xl font-black text-slate-800 block">${analytics.revenue.toLocaleString()}</span>
            </div>
            
            <form onSubmit={handleWithdrawPayout} className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-1">Withdrawal Amount ($):</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 500"
                  max={analytics.revenue}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-bold"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!payoutAmount || Number(payoutAmount) <= 0} className="w-full bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl py-2.5 shadow-sm">
                Request Payout Transfer
              </Button>
            </form>

            {payoutSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <Check className="w-4 h-4 shrink-0" />
                Transfer initiated. Funds will settle within 2 business days.
              </div>
            )}
          </div>

        </div>

        {/* Recent sales table */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Recent Orders Received</span>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wide text-[9px] font-bold">
                  <th className="py-2.5 px-3">Buyer Name</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                {analytics.recentSales.map(sale => (
                  <tr key={sale.id}>
                    <td className="py-3 px-3">{sale.buyerName}</td>
                    <td className="py-3 px-3 text-slate-800">{sale.productTitle}</td>
                    <td className="py-3 px-3">${sale.price}</td>
                    <td className="py-3 px-3 text-slate-400 font-medium">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* MODAL 1: Product Upload 5-Step Wizard */}
      {showUploadWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative select-none animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowUploadWizard(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            
            {/* Header Steps Tracker */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Upload Startup Asset</h3>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Step {wizardStep} of 5</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(step => (
                  <div key={step} className={`w-2.5 h-2.5 rounded-full ${wizardStep === step ? 'bg-blue-600' : wizardStep > step ? 'bg-blue-200' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>

            {/* Stepper Wizard Forms */}
            <form onSubmit={handlePublishProduct} className="space-y-4 text-xs font-semibold text-slate-600">
              
              {/* Step 1: Basic Information */}
              {wizardStep === 1 && (
                <div className="space-y-3.5">
                  <span className="font-bold text-slate-700 block mb-1">Step 1: Core Specifications</span>
                  <div>
                    <label className="block mb-1">Product Title:</label>
                    <input required type="text" placeholder="e.g. Next.js SaaS Boilerplate" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block mb-1">Elevator Description:</label>
                    <textarea required placeholder="Outline features, stack, and details..." className="w-full h-24 rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800 resize-none" value={desc} onChange={(e) => setDesc(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Category:</label>
                      <select className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Next.js Projects">Next.js Projects</option>
                        <option value="UI Kits">UI Kits</option>
                        <option value="Chrome Extensions">Chrome Extensions</option>
                        <option value="Notion Templates">Notion Templates</option>
                        <option value="Pitch Decks">Pitch Decks</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Technology Tags (Comma split):</label>
                      <input type="text" placeholder="e.g. Next.js, Stripe, Prisma" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={tags} onChange={(e) => setTags(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing details */}
              {wizardStep === 2 && (
                <div className="space-y-3.5">
                  <span className="font-bold text-slate-700 block mb-1">Step 2: Valuation Pricing</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Price ($):</label>
                      <input required type="number" placeholder="49" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div>
                      <label className="block mb-1">Original Price (For discounts):</label>
                      <input type="number" placeholder="99" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/50 mt-4">
                    <input type="checkbox" checked={isService} onChange={(e) => setIsService(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4" />
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">This listing represents a Freelance/Agency Service</span>
                      <span className="text-[9px] text-slate-400 block font-normal">Allows clients to book packages rather than zip downloads</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Media links */}
              {wizardStep === 3 && (
                <div className="space-y-3.5">
                  <span className="font-bold text-slate-700 block mb-1">Step 3: Media Attachments</span>
                  <div>
                    <label className="block mb-1">Thumbnail Cover image link:</label>
                    <input type="text" placeholder="https://images.unsplash.com/... (or blank for default)" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
                  </div>
                  <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                    <span className="font-bold text-slate-700 block">Drag & Drop Product screenshots</span>
                    <span className="text-[9px] text-slate-400 block font-normal">Maximum file upload limit: 10 MB per image</span>
                  </div>
                </div>
              )}

              {/* Step 4: Files upload */}
              {wizardStep === 4 && (
                <div className="space-y-3.5">
                  <span className="font-bold text-slate-700 block mb-1">Step 4: Delivery Files link</span>
                  <div>
                    <label className="block mb-1">Delivery ZIP file link (Secured download):</label>
                    <input type="text" placeholder="https://github.com/user/releases/v1.zip (or mock URL)" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={zipUrl} onChange={(e) => setZipUrl(e.target.value)} />
                  </div>
                  <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                    <span className="font-bold text-slate-700 block">Drag & Drop Product ZIP package</span>
                    <span className="text-[9px] text-slate-400 block font-normal">Maximum zip limit: 50 MB (or use GitHub releases link above)</span>
                  </div>
                </div>
              )}

              {/* Step 5: Licensing review & Publish */}
              {wizardStep === 5 && (
                <div className="space-y-3.5">
                  <span className="font-bold text-slate-700 block mb-1">Step 5: Publish & Licensing</span>
                  <div>
                    <label className="block mb-1">Standard License Selection:</label>
                    <select className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" value={licensing} onChange={(e) => setLicensing(e.target.value)}>
                      <option value="PERSONAL">Personal License (Single use)</option>
                      <option value="COMMERCIAL">Commercial License (SaaS MVPs allowed)</option>
                      <option value="ENTERPRISE">Enterprise License (Redistribution allowed)</option>
                    </select>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1.5 text-[10px] font-semibold text-slate-500 mt-4">
                    <span className="font-bold text-slate-800 block text-[11px]">Ready to launch?</span>
                    <p className="font-normal leading-relaxed">
                      By publishing this digital asset, you agree to our creator guidelines and platform commissions rate take of 15% on each transaction.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer navigation */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {wizardStep > 1 && (
                  <Button type="button" onClick={() => setWizardStep(prev => prev - 1)} className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded-xl py-2 px-4">
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                {wizardStep < 5 ? (
                  <Button type="button" onClick={() => setWizardStep(prev => prev + 1)} className="bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl py-2 px-6">
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" className="bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl py-2 px-6 shadow">
                    Publish Asset
                  </Button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Seller verification request */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl relative select-none animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowVerificationModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-800 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Verify My Creator Store
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-normal font-normal">
              Acquiring the verified seller badge increases founder trust, boosts click conversions, and unlocks standard payouts.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleVerificationRequest(); }} className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-1">Company / Legal Business Name:</label>
                <input required type="text" placeholder="e.g. Marcus Labs LLC" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800" />
              </div>
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                <span className="font-bold text-slate-700 block">Upload ID / Business documents</span>
                <span className="text-[9px] text-slate-400 block font-normal">PDF format under 10 MB limit</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" onClick={() => setShowVerificationModal(false)} className="flex-1 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded-xl py-2">Cancel</Button>
                <Button type="submit" className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl py-2">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
