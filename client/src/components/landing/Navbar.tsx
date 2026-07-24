"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/ui/BrandLogo";

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Platform", href: "#dashboard" },
    { name: "Marketplace", href: "#marketplace" },
    { name: "Launches", href: "#product-showcase" },
    { name: "Ecosystem", href: "#community" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? "glass-panel bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg py-3 px-6"
            : "bg-transparent py-2 px-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <BrandLogo size={36} showText={true} textClassName="text-xl font-bold tracking-tight text-slate-900" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 glass-pill px-4 py-1.5 rounded-full border border-slate-200/80 bg-white/70">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 px-3.5 py-1.5 rounded-full transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Bar & Live Status */}
          <div className="hidden md:flex items-center gap-4">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>2,480 Active</span>
            </div>

            {/* Auth Buttons */}
            {!isLoaded ? (
              <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse" />
            ) : !isSignedIn ? (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl hover:bg-slate-100/80 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="relative group bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-5 shadow-md shadow-blue-600/20"
                  >
                    <span>Get Started</span>
                    <Sparkles className="w-3.5 h-3.5 ml-1.5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </SignUpButton>
              </div>
            ) : (
              <Link href="/feed">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-5 shadow-md shadow-blue-600/20"
                >
                  Workspace Feed <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-blue-600 p-2 rounded-xl bg-white border border-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-3 max-w-7xl mx-auto rounded-2xl glass-panel bg-white/95 border border-slate-200/80 p-6 shadow-xl flex flex-col space-y-4"
          >
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-200 flex flex-col space-y-3">
              {!isLoaded ? null : !isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full justify-center border-slate-200 text-slate-700">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold">
                      Get Started Free
                    </Button>
                  </SignUpButton>
                </>
              ) : (
                <Link href="/feed" className="w-full">
                  <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    Go to Workspace Feed
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
