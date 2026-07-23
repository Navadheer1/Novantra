"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, ChevronLeft, ChevronRight, Download, Calendar, CheckCircle2 } from "lucide-react";

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  startupName: string;
  onRequestMeeting?: () => void;
}

export default function PitchDeckModal({
  isOpen,
  onClose,
  startupName,
  onRequestMeeting
}: PitchDeckModalProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 10;

  if (!isOpen) return null;

  const deckSlides = [
    { title: "Executive Summary & Problem Statement", content: "Current solutions are slow, fragmented, and lack automated intelligence." },
    { title: "The Solution: " + startupName, content: "Unified AI-powered platform delivering 3x faster workflows and 60% cost reduction." },
    { title: "Market Opportunity & TAM", content: "Addressing a $14.2B global TAM with 22% CAGR." },
    { title: "Product Architecture & Demo", content: "Proprietary real-time engine built on microservices with zero-friction integration." },
    { title: "Traction & Revenue Metrics", content: "$14.5k MRR, +24% MoM growth, 98% retention rate across 45 enterprise pilots." },
    { title: "Business & Monetization Model", content: "B2B SaaS subscription tiers + transaction volume commission." },
    { title: "Go-to-Market Strategy", content: "Direct enterprise sales force + developer community ecosystem product-led growth." },
    { title: "Competitive Advantage Moat", content: "Proprietary AI model, patent pending workflow, 12-month tech advantage." },
    { title: "Founding Team & Advisors", content: "Repeat founders with previous successful SaaS exit and ex-Big Tech leads." },
    { title: "The Ask: Seed Investment Round", content: "Seeking $500,000 for 18-month runway expansion into Product & Sales." },
  ];

  const slide = deckSlides[currentSlide - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-black text-foreground">{startupName} — Investment Pitch Deck</h3>
              <p className="text-xs text-muted-foreground font-semibold">Verified Due-Diligence Document</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SLIDE VIEWER CONTAINER */}
        <div className="p-8 flex-1 flex flex-col justify-between bg-gradient-to-br from-background via-muted/20 to-emerald-950/5 min-h-[320px]">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              <span>Slide {currentSlide} of {totalSlides}</span>
              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Confidential Investor Deck
              </span>
            </div>

            <h2 className="text-2xl font-black text-foreground mb-4">{slide.title}</h2>
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm text-sm text-foreground leading-relaxed font-medium">
              {slide.content}
            </div>
          </div>

          {/* NAVIGATION CONTROLS */}
          <div className="flex items-center justify-between pt-6 border-t border-border/60">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentSlide === 1}
                onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentSlide === totalSlides}
                onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold"
                onClick={() => alert("Downloading PDF Pitch Deck for " + startupName)}
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                onClick={() => {
                  onClose();
                  if (onRequestMeeting) onRequestMeeting();
                }}
              >
                <Calendar className="w-3.5 h-3.5 mr-1" /> Request Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
