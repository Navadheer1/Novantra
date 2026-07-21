"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, Users } from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/feed");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
          The Professional <span className="text-primary">Startup Ecosystem</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with visionary founders, leading VCs, and top talent. Noventra is the platform to launch, fund, and build the future.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {!isLoaded ? (
            <div className="text-muted-foreground text-sm">Loading authentication...</div>
          ) : !isSignedIn ? (
            <>
              <SignUpButton mode="modal">
                <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                  Sign In
                </Button>
              </SignInButton>
            </>
          ) : (
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">For Founders</h3>
          <p className="text-muted-foreground">Create your startup profile, manage equity, hire talent, and pitch directly to leading investors.</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">For VCs</h3>
          <p className="text-muted-foreground">Discover promising startups, track their metrics, and request investment allocations easily.</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">For Talent</h3>
          <p className="text-muted-foreground">Find co-founder roles, internships, or full-time jobs at the most exciting early-stage startups.</p>
        </div>
      </div>
    </main>
  );
}
