"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileEditRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings/profile");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <p className="text-slate-500 font-semibold text-xs animate-pulse">Launching Profile Studio...</p>
    </div>
  );
}
