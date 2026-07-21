"use client";

import React from "react";
import { Newspaper, Clock, ExternalLink, ArrowRight } from "lucide-react";

interface Props {
  news: any[];
}

export default function NewsAndUpdates({ news = [] }: Props) {
  if (!news || news.length === 0) return null;

  return (
    <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-sky-600" /> Startup News & Ecosystem Dispatch
        </h3>
        <span className="text-xs font-semibold text-muted-foreground">Curated Insights</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-muted/30 border border-border/60 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                <span className="uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-black">
                  {item.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.time}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-foreground leading-snug hover:text-sky-600 transition-all">
                {item.title}
              </h4>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.snippet}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] font-bold text-sky-600">
              <span>{item.source} • {item.readTime}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
