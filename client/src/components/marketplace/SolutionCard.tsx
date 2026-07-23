"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Star,
  Download,
  Code2,
  ExternalLink,
  Sparkles,
  Zap,
  CheckCircle2,
  ShoppingCart,
  Eye,
  ChevronRight
} from "lucide-react";

export interface SolutionProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  originalPrice: number | null;
  type: string;
  status: string;
  version: string;
  thumbnailUrl: string;
  rating: number;
  downloadsCount: number;
  techStack?: string[];
  features?: string[];
  seller?: {
    id: string;
    storeName: string;
    logoUrl: string | null;
    isVerified: boolean;
    trustScore: number;
  };
}

interface SolutionCardProps {
  product: SolutionProduct;
  onInspect: (product: SolutionProduct) => void;
  onAcquire: (product: SolutionProduct) => void;
}

export default function SolutionCard({ product, onInspect, onAcquire }: SolutionCardProps) {
  const [isInCart, setIsInCart] = useState(false);

  const sellerName = product.seller?.storeName || "Noventra Certified Builder";
  const trustScore = product.seller?.trustScore || 98;
  const isVerified = product.seller?.isVerified !== false;

  const stackChips = product.techStack || product.tags || ["Next.js 16", "TypeScript", "Tailwind CSS"];

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* CARD THUMBNAIL & BADGES */}
        <div className="h-44 w-full bg-gradient-to-br from-primary/10 via-background to-secondary/20 relative overflow-hidden">
          <img
            src={product.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="text-[10px] font-extrabold uppercase bg-background/90 text-foreground px-2.5 py-1 rounded-md border border-border/60 shadow-sm backdrop-blur-sm">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-md shadow-sm">
                v{product.version || "1.0"}
              </span>
              {isVerified && (
                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              )}
            </div>
          </div>

          {/* Price & Rating Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
            <div className="bg-background/90 backdrop-blur-md border border-border/60 px-3 py-1 rounded-xl shadow-sm">
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Deployment Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-foreground">
                  {product.price === 0 ? "FREE" : `$${product.price}`}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 bg-background/90 backdrop-blur-md border border-border/60 px-2.5 py-1 rounded-xl shadow-sm text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-[10px] text-muted-foreground">({product.downloadsCount || 120})</span>
            </div>
          </div>
        </div>

        {/* BUILDER & TITLE INFO */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-bold text-foreground flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-primary" /> {sellerName}
            </span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
              {trustScore}% Builder Trust
            </span>
          </div>

          <Link href={`/marketplace/product/${product.id}`}>
            <h3 className="text-base font-black text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>

          {/* TECH STACK CHIPS */}
          <div className="flex flex-wrap gap-1 pt-1">
            {stackChips.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* DEV IMPACT TAG */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> Development Time Saved:
            </span>
            <span>~80 Hours MVP Dev</span>
          </div>
        </div>
      </div>

      {/* ACTIONS FOOTER */}
      <div className="p-4 bg-muted/30 border-t border-border/60 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-bold border-border hover:bg-background"
          onClick={() => onInspect(product)}
        >
          <Eye className="w-3.5 h-3.5 mr-1 text-primary" /> Inspect Architecture
        </Button>

        <Button
          size="sm"
          className="w-full text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => onAcquire(product)}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1" />
          {product.price === 0 ? "Get Asset" : "Acquire / Deploy"}
        </Button>
      </div>
    </div>
  );
}
