"use client";

import React from "react";
import Link from "next/link";
import { User, UserPlus, Briefcase, MapPin, ExternalLink, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { getApiUrl } from "@/lib/apiConfig";

interface Props {
  founders: any[];
  investors: any[];
  recommendedPeople: any[];
}

export default function DiscoverPeople({ founders = [], investors = [], recommendedPeople = [] }: Props) {
  const { getToken } = useAuth();

  const handleFollowAction = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/${userId}/follow`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        alert("Follow status updated!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Active Founders Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Founders to Follow
          </h3>
          <span className="text-xs font-semibold text-muted-foreground">Ecosystem Builders</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {founders.slice(0, 4).map((f) => (
            <div
              key={f.id}
              className="bg-card border border-border/80 p-3.5 rounded-2xl shadow-sm hover:border-primary/50 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                  {f.avatarUrl ? (
                    <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10">
                      {f.name[0]}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-sm text-foreground truncate">{f.name}</h4>
                  <p className="text-[11px] text-muted-foreground truncate">{f.location || "Founder"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/profile/${f.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 px-2 font-bold text-xs">
                    View
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="h-8 px-2.5 font-bold text-xs flex items-center gap-1"
                  onClick={(e) => handleFollowAction(f.id, e)}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Follow
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discover Active VCs & Angel Investors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600" /> Investors Open to Pitch
          </h3>
          <Link href="/investors" className="text-xs font-bold text-emerald-600 hover:underline">
            View All VCs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {investors.slice(0, 4).map((inv) => (
            <div
              key={inv.id}
              className="bg-card border border-emerald-500/20 p-3.5 rounded-2xl shadow-sm hover:border-emerald-500 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-full bg-muted overflow-hidden shrink-0 border border-emerald-300">
                  {inv.avatarUrl ? (
                    <img src={inv.avatarUrl} alt={inv.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-emerald-700 bg-emerald-100">
                      {inv.name[0]}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-foreground truncate">{inv.name}</h4>
                    <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      VC
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold truncate">
                    Ticket: {inv.ticketSize || "$50k - $250k"}
                  </p>
                </div>
              </div>

              <Link href={`/profile/${inv.id}`}>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-3">
                  Pitch
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
