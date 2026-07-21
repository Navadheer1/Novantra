import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check database for existing role to prevent session token delay loops
  let role: string | undefined = undefined;
  try {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const apiUrl = rawApiUrl.replace(/\/$/, "");
    const res = await fetch(`${apiUrl}/api/users/clerk/${userId}`, {
      cache: "no-store"
    });
    if (res.ok) {
      const user = await res.json();
      role = user.role?.toLowerCase();
    }
  } catch (err) {
    console.error("Error checking user role:", err);
  }

  console.log(`[Onboarding Page] User ${userId} checked role: ${role}`);

  // If user already has a role, redirect to dashboard
  if (role) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-xl shadow-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to Noventra!</h1>
        <p className="text-muted-foreground mb-8">Please select your role to continue.</p>
        <OnboardingForm />
      </div>
    </div>
  );
}
