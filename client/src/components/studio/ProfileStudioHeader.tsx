"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Save, CheckCircle2, RotateCcw, 
  Eye, Wand2, ShieldCheck, ArrowLeft, Loader2, Award 
} from "lucide-react";

interface ProfileStudioHeaderProps {
  autoSaveStatus: "saved" | "saving" | "unsaved";
  lastSavedTime?: string;
  completeness: number;
  onSaveDraft: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onAIGenerateHeadline: () => void;
  onAIGenerateBio: () => void;
  isPublishing?: boolean;
}

export default function ProfileStudioHeader({
  autoSaveStatus,
  lastSavedTime = "Just now",
  completeness,
  onSaveDraft,
  onPublish,
  onDiscard,
  onAIGenerateHeadline,
  onAIGenerateBio,
  isPublishing = false,
}: ProfileStudioHeaderProps) {
  const [showCompletenessSuggestions, setShowCompletenessSuggestions] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs py-3 px-4 sm:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Auto-Save Status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <Link href="/feed" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Feed</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0 border border-blue-100">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                  Profile Studio
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Workspace
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {autoSaveStatus === "saving" && (
                  <span className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                    <span>Auto Saving...</span>
                  </span>
                )}
                {autoSaveStatus === "saved" && (
                  <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Saved ({lastSavedTime})</span>
                  </span>
                )}
                {autoSaveStatus === "unsaved" && (
                  <span className="text-[11px] font-medium text-slate-400">
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: AI Helper Actions & Completeness Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          
          {/* AI Assistance Buttons */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAIGenerateHeadline}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white rounded-lg h-7 px-2.5 flex items-center gap-1"
              title="Generate optimized headline using AI"
            >
              <Wand2 className="w-3 h-3 text-blue-600" />
              <span>AI Headline</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAIGenerateBio}
              className="text-xs font-bold text-slate-700 hover:text-purple-600 hover:bg-white rounded-lg h-7 px-2.5 flex items-center gap-1"
              title="Generate bio using AI"
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>AI Bio</span>
            </Button>
          </div>

          {/* Completeness Badge */}
          <div className="relative">
            <button
              onClick={() => setShowCompletenessSuggestions(!showCompletenessSuggestions)}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-extrabold hover:bg-emerald-100 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completeness}% Complete</span>
            </button>

            {showCompletenessSuggestions && (
              <div className="absolute top-10 right-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Completeness Tips
                </h4>
                <div className="space-y-1 text-slate-600 font-medium">
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Add a high-res cover banner
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Add at least 3 skills
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Add startup or portfolio details
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connect GitHub or LinkedIn
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Primary Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDiscard}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 border-slate-200 rounded-xl px-3.5 h-9 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Discard</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            className="text-xs font-bold text-slate-800 border-slate-200 hover:bg-slate-50 rounded-xl px-4 h-9 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onPublish}
            disabled={isPublishing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-5 h-9 shadow-sm flex items-center gap-1.5"
          >
            {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Publish Changes</span>
          </Button>
        </div>

      </div>
    </header>
  );
}
