"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import {
  FileText, Download, Copy, ShieldCheck, ArrowLeft, RefreshCw,
  AlertCircle, HelpCircle, Check, PlayCircle, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function PurchasesPage() {
  const { getToken } = useAuth();
  
  const [orders, setOrders] = useState<CheckoutInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refund states
  const [showRefundModal, setShowRefundModal] = useState<string | null>(null); // orderId
  const [refundReason, setRefundReason] = useState("");
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      // Load orders from local storage
      let localOrders: CheckoutInvoice[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("noventra_orders_history");
        if (stored) {
          try { localOrders = JSON.parse(stored); } catch (e) {}
        }
      }

      // Default pre-populated seed purchase for demonstration
      if (localOrders.length === 0) {
        localOrders = [
          {
            id: "order-seed-1",
            invoiceId: "INV-841920",
            subtotal: 49.00,
            discountAmount: 0,
            total: 49.00,
            couponCode: null,
            licenses: [
              {
                productId: "prod-next-saas",
                productTitle: "Next.js SaaS Boilerplate V2",
                licenseKey: "LIC-8C7F9A1B-E5F2",
                downloadUrl: "#"
              }
            ],
            createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
          }
        ];
        if (typeof window !== "undefined") {
          localStorage.setItem("noventra_orders_history", JSON.stringify(localOrders));
        }
      }

      setOrders(localOrders);
    } catch (err) {
      console.warn("Could not retrieve purchase logs.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundReason.trim() || !showRefundModal) return;

    const targetOrderId = showRefundModal;
    setRefundSuccess(targetOrderId);
    setTimeout(() => {
      setRefundSuccess(null);
      setShowRefundModal(null);
      setRefundReason("");
      
      // Update order status locally in memory
      setOrders(prev => {
        const updated = prev.map(o => o.id === targetOrderId ? { ...o, isRefunded: true } : o);
        if (typeof window !== "undefined") {
          localStorage.setItem("noventra_orders_history", JSON.stringify(updated));
        }
        return updated;
      });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-24">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs text-slate-400">Loading purchase histories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
      <Navbar />

      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Link */}
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace catalog
        </Link>

        <h1 className="text-xl font-black text-slate-900 mb-6">My Purchases Log</h1>

        {orders.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm shadow-slate-100/50">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No purchases found</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-normal">
              You haven't bought any assets or services yet. Browse the catalog to download resources.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                
                {/* Header Invoice info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <span className="text-xs font-black text-slate-800">Invoice: {order.invoiceId}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">Purchased on {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800 block">${order.total}</span>
                    </div>
                    {/* Refund or Payout tags */}
                    {(order as any).isRefunded ? (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-extrabold uppercase">
                        Refunded
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowRefundModal(order.id)}
                        className="text-[9px] font-extrabold text-slate-400 hover:text-rose-600 border border-slate-200 bg-white hover:bg-rose-50 px-2 py-0.5 rounded transition-all"
                      >
                        Request Refund
                      </button>
                    )}
                  </div>
                </div>

                {/* Items and Licenses lists */}
                <div className="divide-y divide-slate-50 bg-slate-50/50 rounded-2xl border border-slate-100">
                  {order.licenses.map(lic => (
                    <div key={lic.productId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{lic.productTitle}</span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">License:</span>
                          <div className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 font-mono text-[9px] text-slate-500 flex items-center gap-1 shadow-sm">
                            <span>{lic.licenseKey}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(lic.licenseKey)}
                              className="text-slate-400 hover:text-slate-600"
                              title="Copy License Key"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex gap-1.5">
                        <button
                          disabled={(order as any).isRefunded}
                          className={`px-3 py-1.5 font-bold rounded-xl text-[10px] shadow flex items-center justify-center gap-1.5 transition-all ${
                            (order as any).isRefunded
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" /> Download ZIP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Refund request Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl relative select-none animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowRefundModal(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Request Purchase Refund
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-normal font-normal">
              Refunds are subject to review. Please supply a clear reason describing any technical issues or product mismatches.
            </p>

            <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-1">Reason for Refund request:</label>
                <textarea
                  required
                  placeholder="Outline any installation issues or why you are requesting a refund..."
                  className="w-full h-24 rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-800 resize-none font-semibold"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>

              {refundSuccess === showRefundModal ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <Check className="w-4 h-4" /> Refund request submitted successfully.
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button type="button" onClick={() => setShowRefundModal(null)} className="flex-1 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded-xl py-2">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-rose-600 text-white hover:bg-rose-700 font-bold rounded-xl py-2 shadow-sm">Submit Request</Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
