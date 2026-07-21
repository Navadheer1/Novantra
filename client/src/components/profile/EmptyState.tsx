"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Building2, Briefcase, FileText, FolderGit2, 
  Sparkles, Award, MessageSquare, Plus, ArrowRight 
} from "lucide-react";

interface EmptyStateProps {
  icon?: "startup" | "portfolio" | "posts" | "projects" | "achievements" | "mentorship" | "general";
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon = "general",
  title,
  description,
  actionLabel,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case "startup":
        return <Building2 className="w-8 h-8 text-blue-600" />;
      case "portfolio":
        return <Briefcase className="w-8 h-8 text-sky-500" />;
      case "posts":
        return <FileText className="w-8 h-8 text-indigo-500" />;
      case "projects":
        return <FolderGit2 className="w-8 h-8 text-emerald-500" />;
      case "achievements":
        return <Award className="w-8 h-8 text-amber-500" />;
      case "mentorship":
        return <MessageSquare className="w-8 h-8 text-purple-500" />;
      default:
        return <Sparkles className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[20px] p-8 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
      {/* Visual Badge Backdrop */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
          {getIcon()}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
          <Plus className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="max-w-md space-y-1.5">
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>

      {actionLabel && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs px-5 h-9 shadow-sm flex items-center gap-1.5">
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={onActionClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs px-5 h-9 shadow-sm flex items-center gap-1.5"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
