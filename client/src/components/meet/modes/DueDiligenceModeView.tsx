"use client";

import React from "react";
import { ShieldCheck, FileText, Lock, Download, CheckCircle, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DueDiligenceModeView() {
  const documents = [
    { name: "Noventra_Cap_Table_2026.pdf", size: "1.2 MB", category: "Cap Table", date: "2026-07-15" },
    { name: "Financial_Projections_3Yr.xlsx", size: "3.4 MB", category: "Financials", date: "2026-07-18" },
    { name: "IP_Patent_Filing_Certificate.pdf", size: "850 KB", category: "Legal", date: "2026-06-28" },
    { name: "Customer_Cohort_Retention_Analysis.pdf", size: "2.1 MB", category: "Traction", date: "2026-07-20" },
  ];

  return (
    <div className="flex-1 w-full h-full p-4 flex flex-col bg-slate-950 text-white rounded-2xl space-y-4 overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-sm text-white">Investor Due Diligence Room</h3>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Encrypted Vault Access
        </span>
      </div>

      {/* Cap Table & Financial Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-bold text-[10px]">
            <span>FOUNDER SHARES</span>
            <PieChart className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="font-black text-lg text-white">72.5%</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-bold text-[10px]">
            <span>OPTION POOL</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="font-black text-lg text-emerald-400">12.5%</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-bold text-[10px]">
            <span>ANGEL / SAFE CONVERTIBLES</span>
            <FileText className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="font-black text-lg text-purple-400">$350k Raised</p>
        </div>
      </div>

      {/* Vault Documents Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Secure Due Diligence Documents ({documents.length})
        </h4>

        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-slate-200">{doc.name}</h5>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {doc.category} • {doc.size} • Uploaded {doc.date}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl h-8 px-3"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </Button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
