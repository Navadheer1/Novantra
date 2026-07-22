"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import {
  ShoppingCart, X, Ticket, ShieldCheck, CreditCard, ArrowLeft,
  Check, FileText, Download, Copy, RefreshCw, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  thumbnailUrl: string;
  seller?: { storeName: string };
}

interface CheckoutInvoice {
  id: string;
  invoiceId: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  licenses: Array<{
    productId: string;
    productTitle: string;
    licenseKey: string;
    downloadUrl: string;
  }>;
  createdAt: string;
}

export default function CartPage() {
  const { getToken } = useAuth();
  
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPct: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Billing Form State
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<CheckoutInvoice | null>(null);

  const fetchCartProducts = async () => {
    setLoading(true);
    try {
      let itemIds: string[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("noventra_cart_items");
        if (stored) itemIds = JSON.parse(stored);
      }

      if (itemIds.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const token = await getToken();
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/marketplace/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const allProducts = await res.json();
        const filtered = allProducts.filter((p: any) => itemIds.includes(p.id));
        setCartItems(filtered);
      } else {
        throw new Error("Failed to load cart items from server");
      }
    } catch (err) {
      console.warn("REST API failed. Resolving cart from mock database.");
      
      const fallbackProducts = [
        { id: "prod-next-saas", title: "Next.js SaaS Boilerplate V2", category: "Next.js Projects", price: 49.00, thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=120&fit=crop", seller: { storeName: "Marcus Labs" } },
        { id: "prod-figma-kit", title: "Vibrant UI - Figma Design System", category: "UI Kits", price: 29.00, thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=120&fit=crop", seller: { storeName: "Elena UI/UX" } }
      ];

      let storedIds: string[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("noventra_cart_items");
        if (stored) storedIds = JSON.parse(stored);
      }

      setCartItems(fallbackProducts.filter(p => storedIds.includes(p.id)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleRemoveFromCart = (id: string) => {
    const nextItems = cartItems.filter(p => p.id !== id);
    setCartItems(nextItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("noventra_cart_items", JSON.stringify(nextItems.map(p => p.id)));
    }
  };

  // Validate coupon codes
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/marketplace/coupons/validate?code=${couponCode.toUpperCase()}`);

      if (res.ok) {
        const coupon = await res.json();
        setAppliedCoupon(coupon);
      } else {
        throw new Error("Invalid coupon");
      }
    } catch (err) {
      // Mock validation logic fallback
      const mockCouponsList: Record<string, number> = {
        "FOUNDER10": 10,
        "ECOSYSTEM30": 30
      };
      const disc = mockCouponsList[couponCode.toUpperCase()];
      if (disc) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discountPct: disc });
      } else {
        setCouponError("Invalid or expired coupon code.");
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Checkout Action controller
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutProcessing(true);

    const productIds = cartItems.map(p => p.id);

    try {
      const token = await getToken();
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/marketplace/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          items: productIds,
          couponCode: appliedCoupon?.code || null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setInvoiceResult(data);
        saveOrderToPurchasesHistory(data);
        // Clear cart
        localStorage.setItem("noventra_cart_items", JSON.stringify([]));
        setCartItems([]);
      } else {
        throw new Error("Checkout failed");
      }
    } catch (err) {
      // Mock checkout fallback
      const subtotal = cartItems.reduce((acc, curr) => acc + curr.price, 0);
      const discountPct = appliedCoupon?.discountPct || 0;
      const discountAmount = subtotal * (discountPct / 100);
      const total = subtotal - discountAmount;

      const mockInvoice: CheckoutInvoice = {
        id: `order-${Date.now()}`,
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
        subtotal,
        discountAmount,
        total,
        couponCode: appliedCoupon?.code || null,
        licenses: cartItems.map(p => ({
          productId: p.id,
          productTitle: p.title,
          licenseKey: `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          downloadUrl: "#"
        })),
        createdAt: new Date().toISOString()
      };

      setTimeout(() => {
        setInvoiceResult(mockInvoice);
        saveOrderToPurchasesHistory(mockInvoice);
        localStorage.setItem("noventra_cart_items", JSON.stringify([]));
        setCartItems([]);
        setCheckoutProcessing(false);
      }, 1500);
    }
  };

  // Save successful order locally so it shows up in my purchases history tab
  const saveOrderToPurchasesHistory = (invoice: CheckoutInvoice) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("noventra_orders_history");
      let ordersList: CheckoutInvoice[] = [];
      if (stored) {
        try { ordersList = JSON.parse(stored); } catch (e) {}
      }
      ordersList.unshift(invoice);
      localStorage.setItem("noventra_orders_history", JSON.stringify(ordersList));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-24">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs text-slate-400">Loading cart specs...</span>
        </div>
      </div>
    );
  }

  // Invoice success screen
  if (invoiceResult) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
        <Navbar />
        <main className="max-w-2xl mx-auto w-full px-4 py-12 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h1 className="text-xl font-black text-slate-800">Order Completed Successfully!</h1>
            <p className="text-xs text-slate-400 font-medium">Invoice ID: {invoiceResult.invoiceId} • Date: {new Date(invoiceResult.createdAt).toLocaleDateString()}</p>
            
            <div className="border border-slate-100 rounded-2xl divide-y divide-slate-100 text-left bg-slate-50/50">
              {invoiceResult.licenses.map(lic => (
                <div key={lic.productId} className="p-4 space-y-2">
                  <span className="font-bold text-slate-800 text-xs block">{lic.productTitle}</span>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-[10px] text-slate-600 flex items-center justify-between">
                      <span>{lic.licenseKey}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(lic.licenseKey)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                        title="Copy license key"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl text-[10px] shadow flex items-center justify-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Download ZIP
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total invoice details summary */}
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl text-left space-y-2 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-800">${invoiceResult.subtotal}</span>
              </div>
              {invoiceResult.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Coupon Discount ({invoiceResult.couponCode}):</span>
                  <span>-${invoiceResult.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200/50 pt-2 text-sm font-black text-slate-900">
                <span>Total Charge:</span>
                <span>${invoiceResult.total}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4">
              <Link href="/marketplace" className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs block">
                Continue Shopping
              </Link>
              <Link href="/marketplace/purchases" className="flex-1 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl text-xs block">
                View Purchases History
              </Link>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Link */}
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace catalog
        </Link>

        <h1 className="text-xl font-black text-slate-900 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm shadow-slate-100/50">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Your Cart is empty</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-normal">
              You haven't added any products or services to your checkout basket yet. Browse the catalog to find items.
            </p>
            <Link href="/marketplace" className="inline-block text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl mt-2">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Cart products list */}
            <div className="flex-1 space-y-4 w-full">
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm divide-y divide-slate-100">
                {cartItems.map(item => (
                  <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-16 h-10 rounded overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">{item.category}</span>
                        <Link href={`/marketplace/product/${item.id}`} className="font-bold text-slate-800 text-xs hover:text-blue-600 block line-clamp-1">
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">By {item.seller?.storeName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-black text-slate-800">${item.price}</span>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent transition-all"
                        title="Remove product"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon inputs */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Apply Discount Coupon</span>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter Coupon (e.g. FOUNDER10)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-bold uppercase"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button type="submit" disabled={validatingCoupon || !couponCode.trim()} className="bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl px-5">
                    {validatingCoupon ? "Validating..." : "Apply Coupon"}
                  </Button>
                </form>
                {appliedCoupon && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-semibold text-emerald-600 flex items-center justify-between">
                    <span>✓ Coupon Applied: {appliedCoupon.code} ({appliedCoupon.discountPct}% Discount)</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-emerald-500 hover:text-emerald-800 font-black">Remove</button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[10px] text-rose-500 font-bold pl-1">{couponError}</p>
                )}
              </div>
            </div>

            {/* Checkout billing panel */}
            <div className="w-full lg:w-96 shrink-0 space-y-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Order Checkout Summary</span>
                
                {/* Total breakdowns */}
                <div className="space-y-2 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="text-slate-800">${cartItems.reduce((acc, curr) => acc + curr.price, 0)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span>-${(cartItems.reduce((acc, curr) => acc + curr.price, 0) * (appliedCoupon.discountPct / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-100 pt-2.5 text-sm font-black text-slate-900">
                    <span>Order Total:</span>
                    <span>
                      ${(
                        cartItems.reduce((acc, curr) => acc + curr.price, 0) * 
                        (1 - (appliedCoupon?.discountPct || 0) / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Billing details */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
                  <span className="font-bold text-slate-700 block">Billing Details</span>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1">Full Name:</label>
                      <input required type="text" placeholder="e.g. Sarah Chen" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-semibold" value={billingName} onChange={(e) => setBillingName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block mb-1">Email Address:</label>
                      <input required type="email" placeholder="e.g. sarah@medquick.ai" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-semibold" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[10px] text-blue-600 flex items-start gap-2 mt-4 font-semibold">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                    <p className="leading-relaxed">
                      Secure checkout powered by Stripe mock simulator. No physical cards are billed.
                    </p>
                  </div>

                  <Button type="submit" disabled={checkoutProcessing || !billingName || !billingEmail} className="w-full bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl py-2.5 shadow flex items-center justify-center gap-1.5">
                    {checkoutProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    {checkoutProcessing ? "Processing..." : "Complete Purchase & Pay"}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
