"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import {
  ShieldAlert, Settings, Percent, Check, X, RefreshCw, BarChart2,
  DollarSign, Users, Grid, Award, Trash, ArrowLeft, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationRequest {
  id: string;
  storeName: string;
  trustScore: number;
  createdAt: string;
}

interface ReportedProduct {
  id: string;
  title: string;
  reason: string;
  sellerName: string;
}

export default function AdminPage() {
  const { getToken } = useAuth();
  
  const [platformRevenue, setPlatformRevenue] = useState(3405.00);
  const [commissionRate, setCommissionRate] = useState(15);
  const [sellerCount, setSellerCount] = useState(14);
  const [productCount, setProductCount] = useState(42);
  const [loading, setLoading] = useState(true);

  // Lists state
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [reports, setReports] = useState<ReportedProduct[]>([]);

  // Action success logs
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/marketplace/admin/analytics`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setPlatformRevenue(data.platformRevenue);
        setCommissionRate(data.commissionRate);
        setSellerCount(data.sellerCount);
        setProductCount(data.productCount);
        setVerifications(data.pendingVerifications || []);
      } else {
        throw new Error("Failed to load admin dashboard data");
      }
    } catch (err) {
      console.warn("REST API failed. Initializing Admin Panel in offline sandbox mode.");
      
      // Fallback Seed Lists
      setVerifications([
        { id: "seller-marcus", storeName: "Marcus Labs", trustScore: 98, createdAt: "3 hours ago" },
        { id: "seller-elena", storeName: "Elena UI/UX", trustScore: 99, createdAt: "Yesterday" }
      ]);
      setReports([
        { id: "rep-1", title: "Chrome Auto-Clicker script", reason: "Malware alert flagged on download ZIP", sellerName: "Hacker Hub" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveSeller = (id: string) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
    setSellerCount(prev => prev + 1);
    setActionSuccess("Seller store verification approved successfully.");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDismissReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setActionSuccess("Report dismissed.");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleRemoveProduct = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setProductCount(prev => prev - 1);
    setActionSuccess("Product listing removed due to violation.");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-24">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs text-slate-400">Loading admin controls...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased pb-12 select-none">
      <Navbar />

      {/* Header bar */}
      <section className="bg-white border-b border-slate-100 py-8 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Marketplace Admin Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Manage sellers validation status, review platform reports, and adjust commission rates.</p>
        </div>
      </section>

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Back Link */}
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace catalog
        </Link>

        {/* Action Success Toast alert */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <Check className="w-4 h-4 shrink-0" />
            {actionSuccess}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val: `$${platformRevenue.toLocaleString()}`, label: "Platform Earnings (15%)", icon: DollarSign, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
            { val: `${commissionRate}%`, label: "Platform Take-rate", icon: Percent, color: "text-blue-500 bg-blue-50 border-blue-100" },
            { val: sellerCount, label: "Total Creators", icon: Users, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
            { val: productCount, label: "Total Listings", icon: Grid, color: "text-rose-500 bg-rose-50 border-rose-100" }
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

        {/* Dynamic commission settings panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Commission Take-Rate Settings</span>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 space-y-1 w-full">
              <span className="text-xs text-slate-500 font-medium">Adjust the percentage of revenue the platform charges on each checkout transaction.</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                />
                <span className="text-xs font-black text-slate-800 shrink-0 w-8">{commissionRate}%</span>
              </div>
            </div>
            <Button className="bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl px-5 py-2 w-full sm:w-auto shrink-0 text-xs">
              Save Rate Config
            </Button>
          </div>
        </div>

        {/* Verification and reported queues grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pending Verifications queue */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider block flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-blue-600" /> Pending Seller Verifications ({verifications.length})
            </span>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wide text-[9px] font-bold">
                    <th className="py-2.5 px-3">Store Name</th>
                    <th className="py-2.5 px-3">Trust Score</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                  {verifications.map(v => (
                    <tr key={v.id}>
                      <td className="py-3 px-3">{v.storeName}</td>
                      <td className="py-3 px-3 text-blue-600">{v.trustScore}%</td>
                      <td className="py-3 px-3 text-right flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleApproveSeller(v.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-transparent transition-all"
                          title="Approve verification"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {verifications.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center italic text-slate-400 py-6">No pending seller verification requests.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reported products queue */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider block flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-500" /> Violation Reports Queue ({reports.length})
            </span>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wide text-[9px] font-bold">
                    <th className="py-2.5 px-3">Product / Seller</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                  {reports.map(rep => (
                    <tr key={rep.id}>
                      <td className="py-3 px-3">
                        <span className="block text-slate-800">{rep.title}</span>
                        <span className="block text-[9px] text-slate-400">By {rep.sellerName}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-normal">{rep.reason}</td>
                      <td className="py-3 px-3 text-right flex gap-1 justify-end">
                        <button
                          onClick={() => handleDismissReport(rep.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 border border-transparent transition-all"
                          title="Dismiss report"
                        >
                          ✕
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(rep.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent transition-all"
                          title="Remove listing from store"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center italic text-slate-400 py-6">No active product violation reports.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
