"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-primary/5 via-background to-primary/10">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="mb-8 text-center">
          <span className="text-3xl font-black tracking-wider text-primary">NOVENTRA</span>
          <p className="text-sm text-muted-foreground mt-2 font-semibold">Join the professional startup ecosystem.</p>
        </div>
        <div className="bg-card p-4 rounded-2xl shadow-xl border border-border/60">
          <SignUp 
            routing="hash" 
            signInUrl="/auth/login" 
          />
        </div>
      </div>
    </div>
  );
}
