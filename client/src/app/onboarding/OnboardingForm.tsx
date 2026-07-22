"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Users } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function OnboardingForm() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleSelect = async (role: string) => {
    try {
      setLoading(role);
      console.log(`[OnboardingForm] Selecting role: ${role}`);

      const token = await getToken();
      const apiUrl = getApiUrl();
      
      // 1. Call role update API securely
      const roleRes = await fetch(`${apiUrl}/api/users/role`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });

      if (!roleRes.ok) {
        throw new Error("Failed to update role in backend database.");
      }

      console.log(`[OnboardingForm] Backend role update succeeded. Reloading Clerk session...`);
      
      // 2. Force Clerk session reload to update claims/metadata
      await user?.reload();

      // 3. Refetch login sync to synchronize profiles
      await fetch(`${apiUrl}/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName
        })
      });

      console.log(`[OnboardingForm] Onboarding complete. Redirecting...`);
      router.push("/dashboard");
    } catch (error) {
      console.error("[OnboardingForm] Onboarding failed:", error);
      alert("Failed to sync role. Please make sure your database connection is active and valid.");
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button 
        variant="outline" 
        size="lg" 
        className="h-16 flex items-center justify-start px-6 gap-4 text-lg hover:border-primary hover:bg-primary/5"
        onClick={() => handleRoleSelect("founder")}
        disabled={!!loading}
      >
        <Building2 className="w-6 h-6 text-primary" />
        <div className="flex flex-col items-start">
          <span>Founder</span>
          <span className="text-sm text-muted-foreground font-normal">I want to launch and build startups</span>
        </div>
      </Button>

      <Button 
        variant="outline" 
        size="lg" 
        className="h-16 flex items-center justify-start px-6 gap-4 text-lg hover:border-primary hover:bg-primary/5"
        onClick={() => handleRoleSelect("investor")}
        disabled={!!loading}
      >
        <Briefcase className="w-6 h-6 text-primary" />
        <div className="flex flex-col items-start">
          <span>VC / Investor</span>
          <span className="text-sm text-muted-foreground font-normal">I want to discover and fund startups</span>
        </div>
      </Button>

      <Button 
        variant="outline" 
        size="lg" 
        className="h-16 flex items-center justify-start px-6 gap-4 text-lg hover:border-primary hover:bg-primary/5"
        onClick={() => handleRoleSelect("user")}
        disabled={!!loading}
      >
        <Users className="w-6 h-6 text-primary" />
        <div className="flex flex-col items-start">
          <span>Talent / User</span>
          <span className="text-sm text-muted-foreground font-normal">I want to join a startup team</span>
        </div>
      </Button>
    </div>
  );
}
