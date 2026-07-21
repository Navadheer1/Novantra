"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DiscoverRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/startups");
  }, []);
  
  return (
    <div className="h-screen flex items-center justify-center text-muted-foreground text-sm font-semibold">
      Redirecting to Startups Directory...
    </div>
  );
}
