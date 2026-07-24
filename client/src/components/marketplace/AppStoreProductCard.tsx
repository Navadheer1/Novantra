"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  Bookmark,
  ThumbsUp,
  ExternalLink,
  ShieldCheck,
  Download,
  Eye,
} from "lucide-react";
import { SolutionProduct } from "./SolutionCard";

interface AppStoreProductCardProps {
  product: SolutionProduct;
  onInspect: (product: SolutionProduct) => void;
  onBuy: (product: SolutionProduct) => void;
  onHoverProduct?: (product: SolutionProduct | null) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export default function AppStoreProductCard({
  product,
  onInspect,
  onBuy,
  onHoverProduct,
  isWishlisted = false,
  onToggleWishlist,
}: AppStoreProductCardProps) {
  const [recommended, setRecommended] = useState(false);
  const [recommendCount, setRecommendCount] = useState(
    Math.floor((product.downloadsCount || 120) * 0.8)
  );

  const handleRecommend = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecommended(!recommended);
    setRecommendCount((prev) => (recommended ? prev - 1 : prev + 1));
  };

  const isFree = product.price === 0;

  return (
    <div
      onMouseEnter={() => onHoverProduct?.(product)}
      className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group relative select-none"
    >
      <div>
        {/* Product Media & Top Badges */}
        <div className="h-40 w-full bg-slate-100 rounded-xl overflow-hidden relative mb-3">
          <img
            src={
              product.thumbnailUrl ||
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
            }
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

          {/* Top Floating Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
            <span className="text-[9px] font-extrabold uppercase bg-white/90 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded-md shadow-xs border border-white/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist?.(product.id);
              }}
              className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:text-blue-600 shadow-xs backdrop-blur-md border border-white/40 transition-colors"
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  isWishlisted ? "fill-blue-600 text-blue-600" : ""
                }`}
              />
            </button>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm border ${
                isFree
                  ? "bg-emerald-500 text-white border-emerald-400"
                  : "bg-slate-900/90 text-white border-slate-700"
              }`}
            >
              {isFree ? "FREE" : `$${product.price}`}
            </span>
          </div>
        </div>

        {/* Product Details Header */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span className="truncate flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {product.seller?.storeName || "Marcus Labs"}
            </span>
            <span className="shrink-0">{product.category}</span>
          </div>

          <h3
            onClick={() => onInspect(product)}
            className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Ratings & Action Footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating || 4.9}</span>
            <span className="text-slate-400 font-normal">
              ({product.downloadsCount || 120} sales)
            </span>
          </div>

          {/* 👍 Recommend Counter */}
          <button
            onClick={handleRecommend}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
              recommended
                ? "bg-blue-50 text-blue-600"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${recommended ? "fill-blue-600" : ""}`} />
            <span>{recommendCount}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onInspect(product)}
            className="w-full py-1.5 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" /> Preview
          </button>

          <button
            onClick={() => onBuy(product)}
            className="w-full py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Acquire
          </button>
        </div>
      </div>
    </div>
  );
}
