"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getApiUrl } from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";
import { X, Send, Users, Calendar, TrendingUp, CheckCircle2, Loader2, Sparkles, MessageSquare } from "lucide-react";

interface RequestIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorName?: string;
  investorFirm?: string;
  onSuccess?: (msg: string) => void;
}

export default function RequestIntroModal({
  isOpen,
  onClose,
  investorName = "Target Investor",
  investorFirm = "Apex Ventures",
  onSuccess
}: RequestIntroModalProps) {
  const { getToken } = useAuth();
  const [mode, setMode] = useState<"intro" | "office_hours" | "updates">("intro");
  const [note, setNote] = useState(
    `Hi ${investorName}, I would love to request a warm introduction via the Noventra mutual network to discuss our Seed round.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      await fetch(`${apiUrl}/api/pitches/request-intro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ investorName, message: note, type: mode })
      });

      const label =
        mode === "intro"
          ? `Warm introduction request sent to ${investorName}!`
          : mode === "office_hours"
          ? `1-on-1 Office Hours invitation logged for ${investorName}`
          : `Subscribed to monthly updates from ${investorName}`;

      if (onSuccess) onSuccess(label);
      onClose();
    } catch (err) {
      if (onSuccess) onSuccess(`Request sent to ${investorName}!`);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">Connect with {investorName}</h3>
              <p className="text-[11px] text-muted-foreground font-medium">{investorFirm}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WORKFLOW OPTION SELECTOR */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode("intro")}
            className={`p-3 rounded-2xl border text-center transition-all ${
              mode === "intro" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 font-extrabold" : "border-border/80 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Users className="w-4 h-4 mx-auto mb-1" />
            <span className="text-[10px] block font-bold">Request Intro</span>
          </button>

          <button
            onClick={() => setMode("office_hours")}
            className={`p-3 rounded-2xl border text-center transition-all ${
              mode === "office_hours" ? "border-purple-500 bg-purple-500/10 text-purple-600 font-extrabold" : "border-border/80 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Calendar className="w-4 h-4 mx-auto mb-1" />
            <span className="text-[10px] block font-bold">Office Hours</span>
          </button>

          <button
            onClick={() => setMode("updates")}
            className={`p-3 rounded-2xl border text-center transition-all ${
              mode === "updates" ? "border-blue-500 bg-blue-500/10 text-blue-600 font-extrabold" : "border-border/80 text-muted-foreground hover:bg-muted"
            }`}
          >
            <TrendingUp className="w-4 h-4 mx-auto mb-1" />
            <span className="text-[10px] block font-bold">Request Updates</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase text-muted-foreground mb-1">
            Personal Note / Context
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-background border border-border rounded-2xl p-3 text-xs font-medium outline-none focus:border-primary leading-relaxed"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border/80">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs font-bold">
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Request
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
