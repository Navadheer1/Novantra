"use client";

import { Rocket, Plus } from "lucide-react";

interface EmptyStateProps {
  category?: string;
  onActionClick: () => void;
}

export default function EmptyState({ category = "all", onActionClick }: EmptyStateProps) {
  return (
    <div className="bg-white border border-slate-200/80 p-12 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center space-y-4 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-sm">
        <Rocket className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="font-extrabold text-base text-slate-900">
          No posts in "{category.replace("_", " ")}" category yet
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Be the first founder, investor, or builder to share an update, product launch, or opportunity in this section!
        </p>
      </div>

      <button
        onClick={onActionClick}
        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create Ecosystem Post
      </button>
    </div>
  );
}
