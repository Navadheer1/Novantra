"use client";

import React from "react";

export type PitchStatusType =
  | "DRAFT"
  | "SUBMITTED"
  | "VIEWED"
  | "INTERESTED"
  | "MEETING_REQUESTED"
  | "DUE_DILIGENCE"
  | "PARTNER_REVIEW"
  | "TERM_SHEET"
  | "INVESTED"
  | "REJECTED"
  | "WITHDRAWN"
  | "ARCHIVED";

interface PitchStatusBadgeProps {
  status: PitchStatusType | string;
  className?: string;
}

export default function PitchStatusBadge({ status, className = "" }: PitchStatusBadgeProps) {
  const normalized = (status || "SUBMITTED").toUpperCase() as PitchStatusType;

  const styles: Record<PitchStatusType, { label: string; bg: string; text: string; border: string }> = {
    DRAFT: {
      label: "Draft",
      bg: "bg-slate-500/10",
      text: "text-slate-600 dark:text-slate-400",
      border: "border-slate-500/20",
    },
    SUBMITTED: {
      label: "Submitted",
      bg: "bg-blue-500/10",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-500/20",
    },
    VIEWED: {
      label: "Viewed by VC",
      bg: "bg-indigo-500/10",
      text: "text-indigo-700 dark:text-indigo-300",
      border: "border-indigo-500/20",
    },
    INTERESTED: {
      label: "VC Interested",
      bg: "bg-amber-500/10",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-500/20",
    },
    MEETING_REQUESTED: {
      label: "Meeting Requested",
      bg: "bg-purple-500/10",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-500/20",
    },
    DUE_DILIGENCE: {
      label: "Due Diligence",
      bg: "bg-cyan-500/10",
      text: "text-cyan-700 dark:text-cyan-300",
      border: "border-cyan-500/20",
    },
    PARTNER_REVIEW: {
      label: "Partner Review",
      bg: "bg-teal-500/10",
      text: "text-teal-700 dark:text-teal-300",
      border: "border-teal-500/20",
    },
    TERM_SHEET: {
      label: "Term Sheet Issued",
      bg: "bg-orange-500/10",
      text: "text-orange-700 dark:text-orange-300",
      border: "border-orange-500/20",
    },
    INVESTED: {
      label: "Invested ✓",
      bg: "bg-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-300 font-extrabold",
      border: "border-emerald-500/30",
    },
    REJECTED: {
      label: "Passed / Declined",
      bg: "bg-rose-500/10",
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-500/20",
    },
    WITHDRAWN: {
      label: "Withdrawn by Founder",
      bg: "bg-neutral-500/10",
      text: "text-neutral-500",
      border: "border-neutral-500/20",
    },
    ARCHIVED: {
      label: "Archived",
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/20",
    },
  };

  const current = styles[normalized] || styles.SUBMITTED;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      {current.label}
    </span>
  );
}
