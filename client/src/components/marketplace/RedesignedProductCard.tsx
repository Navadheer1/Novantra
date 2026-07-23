"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, Star, Eye, ShoppingCart, Sparkles, Zap, CheckCircle2,
  Bookmark, UserPlus, Sliders, ExternalLink, Code2, Clock
} from "lucide-react";
import { SolutionProduct } from "./SolutionCard";

interface RedesignedProductCardProps {
  product: SolutionProduct;
  onInspect: (product: SolutionProduct) => void;
  onBuy: (product: SolutionProduct) => void;
  onCustomize: (product: SolutionProduct) => void;
  onHireCreator: (creatorName: string) => void;
}

export default function RedesignedProductCard({
  product,
  onInspect,
  onBuy,
  onCustomize,
  onHireCreator
}: RedesignedProductCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const sellerName = product.seller?.storeName || "Marcus Labs";
  const isVerified = product.seller?.isVerified !== false;
  const aiScore = product.seller?.trustScore || 98;

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* PREVIEW CONTAINER */}
        <div className="h-48 w-full bg-gradient-to-br from-primary/10 via-background to-purple-500/10 relative overflow-hidden">
          <img
            src={product.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

          {/* TOP BADGES OVERLAY */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-2.5 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Production Ready
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-background/90 text-foreground px-2 py-0.5 rounded-md border border-border/60 backdrop-blur-sm">
                Live Demo ✓
              </span>
            </div>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-1.5 rounded-xl bg-background/90 text-foreground hover:text-primary shadow-sm border border-border/60 backdrop-blur-md"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>

          {/* PRICE & AI SCORE OVERLAY */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
            <div className="bg-background/90 backdrop-blur-md border border-border/60 px-3 py-1 rounded-xl shadow-sm">
              <span className="text-[9px] font-bold uppercase text-muted-foreground block">Acquisition Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-foreground">
                  {product.price === 0 ? "FREE" : `$${product.price}`}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl font-black text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {aiScore}/100 Quality
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-bold text-foreground flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-primary" /> {sellerName}
            </span>
            {isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
          </div>

          <Link href={`/marketplace/product/${product.id}`}>
            <h3 className="text-base font-black text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold pt-1">
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating || 4.9} ({product.downloadsCount || 120})
            </span>
            <span className="text-[10px] text-muted-foreground font-bold">Updated Recently</span>
          </div>
        </div>
      </div>

      {/* ACTIONS FOOTER */}
      <div className="p-4 bg-muted/30 border-t border-border/60 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            className="w-full text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onBuy(product)}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Buy / Deploy
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold border-border"
            onClick={() => onInspect(product)}
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-primary" /> Inspect Architecture
          </Button>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-muted-foreground">
          <button
            onClick={() => onCustomize(product)}
            className="text-primary hover:underline font-bold flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" /> Customize Product
          </button>
          <button
            onClick={() => onHireCreator(sellerName)}
            className="text-purple-600 hover:underline font-bold flex items-center gap-1"
          >
            <UserPlus className="w-3 h-3" /> Hire Creator
          </button>
        </div>
      </div>
    </div>
  );
}
