"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerificationStudioSection() {
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  const verifications = [
    { id: "identity", title: "Identity Verification", desc: "Government ID or Passport check for ecosystem trust.", status: "Verified", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { id: "startup", title: "Startup Incorporation Check", desc: "Verify Delaware C-Corp or official business incorporation.", status: "Pending Review", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
    { id: "investor", title: "Accredited Investor Badge", desc: "Verify SEC accredited investor status for syndicate checks.", status: "Not Verified", badgeColor: "bg-slate-100 text-slate-600 border-slate-200" },
    { id: "university", title: "University / Alumni Badge", desc: "Verify Stanford / MIT / IIT alumni affiliation.", status: "Not Verified", badgeColor: "bg-slate-100 text-slate-600 border-slate-200" },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-base font-black text-slate-900">Verification & Badges</h3>
        <p className="text-xs text-slate-500">Request ecosystem verification badges for identity, startup, and investor status.</p>
      </div>

      <div className="space-y-3">
        {verifications.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${item.badgeColor}`}>
                  {requested[item.id] ? "Request Sent" : item.status}
                </span>
              </div>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>

            {item.status === "Not Verified" && !requested[item.id] && (
              <Button
                type="button"
                size="sm"
                onClick={() => setRequested(prev => ({ ...prev, [item.id]: true }))}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-8 px-4 shrink-0 flex items-center gap-1"
              >
                <span>Request Badge</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
