"use client";

import React, { useState } from "react";
import { X, SlidersHorizontal, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterState {
  industry: string;
  stage: string;
  location: string;
  hiringOnly: boolean;
  openToInvestOnly: boolean;
  remoteOnly: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export default function ExploreFiltersDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}: Props) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  if (!isOpen) return null;

  const industries = ["All", "AI & Machine Learning", "DevTools", "FinTech", "HealthTech", "SaaS", "Climate", "Robotics", "Web3"];
  const stages = ["All", "Pre-Seed", "Seed", "Series A", "Series B+", "Bootstrap"];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      industry: "",
      stage: "",
      location: "",
      hiringOnly: false,
      openToInvestOnly: false,
      remoteOnly: false,
    };
    setLocalFilters(reset);
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full p-6 space-y-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Advanced Discovery Filters</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Form Controls */}
        <div className="space-y-6 flex-1 overflow-y-auto pr-1 no-scrollbar">
          
          {/* Industry Vertical */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400">Industry Vertical</label>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => {
                const isSelected = (localFilters.industry || "All") === ind;
                return (
                  <button
                    key={ind}
                    onClick={() => setLocalFilters({ ...localFilters, industry: ind === "All" ? "" : ind })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Funding Stage */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400">Funding Stage</label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stg) => {
                const isSelected = (localFilters.stage || "All") === stg;
                return (
                  <button
                    key={stg}
                    onClick={() => setLocalFilters({ ...localFilters, stage: stg === "All" ? "" : stg })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {stg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Currently Hiring Teams Only</span>
              <input
                type="checkbox"
                checked={localFilters.hiringOnly}
                onChange={(e) => setLocalFilters({ ...localFilters, hiringOnly: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Actively Raising Capital Only</span>
              <input
                type="checkbox"
                checked={localFilters.openToInvestOnly}
                onChange={(e) => setLocalFilters({ ...localFilters, openToInvestOnly: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Remote Opportunities Only</span>
              <input
                type="checkbox"
                checked={localFilters.remoteOnly}
                onChange={(e) => setLocalFilters({ ...localFilters, remoteOnly: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1 text-xs font-bold border-slate-200 rounded-xl h-10"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-10 shadow-sm"
          >
            Apply Filters
          </Button>
        </div>

      </div>
    </div>
  );
}
