"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BackgroundSystem } from "@/components/landing/BackgroundSystem";
import { CursorSpotlight } from "@/components/landing/CursorSpotlight";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarketplaceBento } from "@/components/landing/MarketplaceBento";
import { AIMatchingSection } from "@/components/landing/AIMatchingSection";
import { InteractiveDashboardPreview } from "@/components/landing/InteractiveDashboardPreview";
import { CommunityNetworkSection } from "@/components/landing/CommunityNetworkSection";
import { SuccessStoriesSection } from "@/components/landing/SuccessStoriesSection";
import { SecurityTrustSection } from "@/components/landing/SecurityTrustSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // If user is logged in, allow them to view the landing page or navigate to workspace
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Optional auto-redirect if desired, or let logged-in users explore the landing page
    }
  }, [isLoaded, isSignedIn]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* Dynamic Background Mesh & Particles */}
      <BackgroundSystem />

      {/* Interactive Mouse Cursor Spotlight (Desktop only) */}
      <CursorSpotlight />

      {/* Floating Glass Navbar */}
      <Navbar />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Co-Founder & Talent Marketplace Bento Grid */}
      <MarketplaceBento />

      {/* 3. AI Pitch & VC Thesis Matching Engine */}
      <AIMatchingSection />

      {/* 4. Interactive Product Dashboard Preview */}
      <InteractiveDashboardPreview />

      {/* 5. Global Founder & VC Community Network */}
      <CommunityNetworkSection />

      {/* 6. Success Stories & Case Studies */}
      <SuccessStoriesSection />

      {/* 7. Security & Institutional Trust Vault */}
      <SecurityTrustSection />

      {/* 8. Transparent Pricing Tiers */}
      <PricingSection />

      {/* 9. Testimonials Marquee */}
      <TestimonialsSection />

      {/* 10. FAQ Accordion */}
      <FAQSection />

      {/* 11. Final Call to Action & Ecosystem Footer */}
      <FinalCTA />
    </main>
  );
}
