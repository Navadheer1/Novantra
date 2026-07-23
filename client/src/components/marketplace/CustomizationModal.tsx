"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, DollarSign, Clock, FileText, UploadCloud, Sparkles } from "lucide-react";

interface CustomizationModalProps {
  productTitle?: string;
  creatorName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (details: { requirements: string; budget: string; timeline: string }) => void;
}

export default function CustomizationModal({
  productTitle = "Next.js SaaS Solution",
  creatorName = "Marcus Labs",
  isOpen,
  onClose,
  onSubmitRequest
}: CustomizationModalProps) {
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("500");
  const [timeline, setTimeline] = useState("3 Days");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onSubmitRequest({ requirements, budget, timeline });
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-black text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" /> Request Custom Modification
            </h3>
            <p className="text-xs text-muted-foreground font-semibold">
              Direct custom work proposal to <strong>{creatorName}</strong> for <strong>{productTitle}</strong>
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1">Custom Scope & Requirements</label>
            <textarea
              required
              placeholder="Describe the feature additions, branding tweaks, or database integrations needed..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary h-24 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Proposed Budget ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Desired Timeline</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary font-bold"
                >
                  <option value="24 Hours">24 Hours (Urgent)</option>
                  <option value="3 Days">3 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="2 Weeks">2 Weeks</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-xl border border-dashed border-border text-center cursor-pointer hover:bg-muted">
            <UploadCloud className="w-5 h-5 text-primary mx-auto mb-1" />
            <span className="text-[11px] font-bold text-foreground block">Upload Specification Docs / Mockups</span>
            <span className="text-[10px] text-muted-foreground">PDF, Figma links, or ZIP up to 50MB</span>
          </div>

          <div className="pt-2 border-t border-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="font-bold">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Send className="w-3.5 h-3.5 mr-1" />
              {submitting ? "Sending Proposal..." : "Submit Customization Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
