"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BackgroundSystem } from "@/components/landing/BackgroundSystem";
import { CursorSpotlight } from "@/components/landing/CursorSpotlight";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ProductShowcaseSection } from "@/components/landing/ProductShowcaseSection";
import { StartupJourneyTimeline } from "@/components/landing/StartupJourneyTimeline";
import { FounderFeedSection } from "@/components/landing/FounderFeedSection";
import { MarketplaceBento } from "@/components/landing/MarketplaceBento";
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

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Optional auto-redirect if desired, or let logged-in users explore the landing page
    }
  }, [isLoaded, isSignedIn]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* Dynamic Background Mesh & Particles */}
      <BackgroundSystem />

      {/* Interactive Mouse Cursor Spotlight */}
      <CursorSpotlight />

      {/* Floating Glass Navbar */}
      <Navbar />

      {/* 1. Living Hero Section & Layered Startup Canvas */}
      <HeroSection />

      {/* 2. Social Proof Animated Counter Metrics */}
      <StatsSection />

      {/* 3. Featured Product Launches (Product Hunt / App Store Style) */}
      <ProductShowcaseSection />

      {/* 4. Startup Journey Timeline (Idea to IPO Roadmap) */}
      <StartupJourneyTimeline />

      {/* 5. Live Founder & Investor Social Network Activity Feed */}
      <FounderFeedSection />

      {/* 6. Co-Founder & Talent Marketplace Bento Grid */}
      <MarketplaceBento />

      {/* 7. Interactive Product Command Center & Analytics */}
      <InteractiveDashboardPreview />

      {/* 9. Global Founder & VC Community Network Map */}
      <CommunityNetworkSection />

      {/* 10. Success Stories & Proven Case Studies */}
      <SuccessStoriesSection />

      {/* 11. Security & Institutional Trust Vault */}
      <SecurityTrustSection />

      {/* 12. Transparent Pricing Tiers */}
      <PricingSection />

      {/* 13. Testimonials Marquee */}
      <TestimonialsSection />

      {/* 14. FAQ Accordion */}
      <FAQSection />

      {/* 15. Final Call to Action & Ecosystem Footer */}
      <FinalCTA />
    </main>
  );
}
