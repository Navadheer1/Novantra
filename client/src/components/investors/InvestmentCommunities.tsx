"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Sparkles, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

interface Community {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  activeDiscussionsCount: number;
  upcomingEventsCount: number;
  description: string;
}

interface InvestmentCommunitiesProps {
  onActionSuccess: (msg: string) => void;
}

export default function InvestmentCommunities({ onActionSuccess }: InvestmentCommunitiesProps) {
  const communities: Community[] = [
    {
      id: "comm-1",
      name: "AI & Foundation Model Investors",
      category: "Artificial Intelligence",
      membersCount: 340,
      activeDiscussionsCount: 18,
      upcomingEventsCount: 3,
      description: "Dedicated hub for angels & VCs deploying capital into GenAI, LLM infrastructure, and autonomous agent frameworks."
    },
    {
      id: "comm-2",
      name: "SaaS & B2B Software Collective",
      category: "Enterprise Software",
      membersCount: 520,
      activeDiscussionsCount: 42,
      upcomingEventsCount: 5,
      description: "Discussing PLG metrics, net dollar retention, pricing benchmarks, and co-investing in B2B SaaS startups."
    },
    {
      id: "comm-3",
      name: "ClimateTech & Sustainability Angels",
      category: "Clean Energy & Climate",
      membersCount: 210,
      activeDiscussionsCount: 12,
      upcomingEventsCount: 2,
      description: "Evaluating carbon accounting, grid decarbonization, renewable energy, and sustainable hardware startups."
    },
    {
      id: "comm-4",
      name: "Fintech & Payments Innovators",
      category: "Financial Technology",
      membersCount: 410,
      activeDiscussionsCount: 29,
      upcomingEventsCount: 4,
      description: "Exploring embedded finance, cross-border payments, neobanking infrastructure, and regulatory compliance."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 via-card to-background p-6 rounded-2xl border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Investor Sector Hubs
            </span>
            <span className="text-[10px] font-bold text-muted-foreground font-semibold">Peer Discussions & Office Hours</span>
          </div>
          <h2 className="text-xl font-black text-foreground">Specialized Investment Communities</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect with sector specialists, share deal flow, and attend private investor office hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((comm) => (
          <div key={comm.id} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-md">
                  {comm.category}
                </span>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-500" /> {comm.membersCount} Members
                </span>
              </div>

              <h3 className="text-lg font-black text-foreground">{comm.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                {comm.description}
              </p>

              <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground pt-3 mt-3 border-t border-border/60">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> {comm.activeDiscussionsCount} Threads
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" /> {comm.upcomingEventsCount} Office Hours
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => onActionSuccess(`Joined ${comm.name} Community!`)}
              >
                Join Community
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-purple-500/30 text-purple-700 dark:text-purple-300"
                onClick={() => onActionSuccess(`Viewing deal flow threads for ${comm.name}`)}
              >
                View Deal Flow
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
