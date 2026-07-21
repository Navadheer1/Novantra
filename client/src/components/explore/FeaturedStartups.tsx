"use client";

import React from "react";
import Link from "next/link";
import { Building2, Users, Briefcase, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  featuredStartups: any[];
  hiringStartups: any[];
}

export default function FeaturedStartups({ featuredStartups = [], hiringStartups = [] }: Props) {
  return (
    <div className="space-y-6">
      
      {/* Featured Startups Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Featured Startups
          </h3>
          <Link href="/startups" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredStartups.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="bg-card border border-border/80 p-4 rounded-2xl shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0 border border-border flex items-center justify-center">
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-primary" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-sm text-foreground truncate">{s.name}</h4>
                    <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {s.stage}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.industry} • {s.location}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                {s.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <span className="text-muted-foreground flex items-center gap-1 font-semibold">
                  <Users className="w-3.5 h-3.5 text-primary" /> {s.teamSize || 1} Team Members
                </span>
                <Link href={`/startups/${s.id}`}>
                  <Button size="sm" variant="ghost" className="font-bold text-xs hover:bg-primary/10 hover:text-primary h-8 px-3">
                    View <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Startups Hiring Now Section */}
      {hiringStartups.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" /> Startups Hiring Now
            </h3>
            <span className="text-xs font-semibold text-muted-foreground">Open Roles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hiringStartups.slice(0, 4).map((s) => (
              <div
                key={`hiring-${s.id}`}
                className="bg-card border border-emerald-500/30 p-4 rounded-2xl shadow-sm hover:border-emerald-500 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border flex items-center justify-center">
                      {s.logo ? (
                        <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">{s.name}</h4>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {s.location || "Remote"}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Hiring
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Required Roles</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.requiredRoles.map((role: string) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <Link href={`/startups/${s.id}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-4">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
