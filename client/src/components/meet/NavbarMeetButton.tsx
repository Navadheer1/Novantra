"use client";

import React from "react";
import Link from "next/link";
import { Video } from "lucide-react";

export default function NavbarMeetButton() {
  return (
    <Link
      href="/communications"
      className="relative group flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-150 border border-slate-200/60 shrink-0"
      title="Communications Hub & Meetings"
    >
      <Video className="w-4.5 h-4.5 group-hover:scale-110 transition-transform text-blue-600" />
      
      {/* Live status pulse badge */}
      <span className="absolute top-1 right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
    </Link>
  );
}
