"use client";

import React, { useState } from "react";
import {
  Compass,
  FolderHeart,
  Grid,
  Users,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Bot,
  Laptop,
  Smartphone,
  Palette,
  LayoutTemplate,
  Cpu,
  Package,
  Code,
  Building2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

interface ShopLeftSidebarProps {
  activeSection: string;
  onSelectSection: (sec: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  wishlistCount: number;
  purchasesCount: number;
}

export default function ShopLeftSidebar({
  activeSection,
  onSelectSection,
  selectedCategory,
  onSelectCategory,
  wishlistCount,
  purchasesCount,
}: ShopLeftSidebarProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const categories = [
    { label: "AI Agents", id: "AI_AGENTS", icon: Bot },
    { label: "SaaS", id: "SAAS", icon: Laptop },
    { label: "Mobile Apps", id: "MOBILE_APPS", icon: Smartphone },
    { label: "UI Kits", id: "UI_KITS", icon: Palette },
    { label: "Templates", id: "TEMPLATES", icon: LayoutTemplate },
    { label: "APIs & Tools", id: "APIS", icon: Cpu },
    { label: "Startup Kits", id: "STARTUP_KITS", icon: Package },
    { label: "Developers", id: "DEVELOPERS", icon: Code },
    { label: "Agencies", id: "AGENCIES", icon: Building2 },
  ];

  return (
    <aside className="w-full space-y-6 select-none">
      {/* Primary App Store Navigation */}
      <div className="space-y-1">
        <button
          onClick={() => {
            onSelectSection("discover");
            onSelectCategory("ALL");
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === "discover" && selectedCategory === "ALL"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </div>
        </button>

        <button
          onClick={() => onSelectSection("collections")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === "collections"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FolderHeart className="w-4 h-4" />
            <span>Collections</span>
          </div>
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
            Featured
          </span>
        </button>

        {/* Expandable Categories Section */}
        <div>
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Grid className="w-4 h-4" />
              <span>Categories</span>
            </div>
            {categoriesOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {categoriesOpen && (
            <div className="pl-4 mt-1 space-y-0.5 border-l-2 border-slate-100 ml-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectSection("category");
                      onSelectCategory(cat.id);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{cat.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => onSelectSection("creators")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === "creators"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4" />
            <span>Creators</span>
          </div>
        </button>

        <button
          onClick={() => onSelectSection("library")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === "library"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4" />
            <span>My Library</span>
          </div>
          <div className="flex items-center gap-1">
            {wishlistCount > 0 && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                {wishlistCount}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Pro Creator Badge / Publisher Studio CTA */}
      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 space-y-2">
        <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Publisher Studio</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium leading-tight">
          List your SaaS, kit, or AI agent on Noventra Shop.
        </p>
        <button
          onClick={() => alert("Publisher Studio onboarding opening...")}
          className="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all shadow-sm"
        >
          Publish Product
        </button>
      </div>
    </aside>
  );
}
