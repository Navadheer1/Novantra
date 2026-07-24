"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, BookOpen, Tv, FileText, ExternalLink, UserPlus } from "lucide-react";
import { InvestorCardData } from "./FounderInvestorCard";

interface UserInvestorCardProps {
  investor: InvestorCardData;
  onActionSuccess: (msg: string) => void;
}

export default function UserInvestorCard({ investor, onActionSuccess }: UserInvestorCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Link href={`/profile/${investor.id}`} className="w-12 h-12 rounded-2xl border-2 border-purple-500/20 bg-background shadow-md overflow-hidden shrink-0 flex items-center justify-center font-black text-lg text-purple-600 hover:border-purple-500 hover:scale-105 transition-all">
            {investor.avatarUrl ? (
              <img src={investor.avatarUrl} alt={investor.name} className="w-full h-full object-cover" />
            ) : (
              investor.name.slice(0, 2).toUpperCase()
            )}
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link href={`/profile/${investor.id}`}>
                <h3 className="text-base font-black text-foreground hover:text-purple-600 hover:underline transition-colors cursor-pointer">{investor.name}</h3>
              </Link>
              {investor.verified !== false && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-xs font-bold text-muted-foreground">{investor.firmName || "Partner @ Noventra Capital"}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium mb-3">
          {investor.thesisSummary || "Investing in software pioneers and sharing key takeaways on startup scaling, venture mechanics, and tech leadership."}
        </p>

        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 space-y-1.5 text-xs font-semibold">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 block">
            Public Content & Talks
          </span>
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1"><Tv className="w-3.5 h-3.5 text-purple-500" /> 12 Keynotes & Talks</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-purple-500" /> 8 Articles Published</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2">
        <Button
          size="sm"
          className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => {
            setIsFollowing(!isFollowing);
            onActionSuccess(isFollowing ? `Unfollowed ${investor.name}` : `Following ${investor.name}!`);
          }}
        >
          <UserPlus className="w-3.5 h-3.5 mr-1" />
          {isFollowing ? "Following ✓" : "Follow Content"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-bold border-purple-500/30 text-purple-700 dark:text-purple-300"
          onClick={() => onActionSuccess(`Opening public talks & portfolio for ${investor.name}`)}
        >
          <BookOpen className="w-3.5 h-3.5 mr-1" /> View Talks
        </Button>
      </div>
    </div>
  );
}
