import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export default async function DashboardRedirect() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch role from database via backend API to avoid Clerk session template dependency/caching
  let role: string | undefined = undefined;
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/users/clerk/${userId}`, {
      cache: "no-store"
    });
    if (res.ok) {
      const user = await res.json();
      role = user.role?.toLowerCase(); // e.g. "founder", "vc", "user"
    }
  } catch (err) {
    console.error("Error fetching user role from database:", err);
  }

  console.log(`[Dashboard Redirect] User ${userId} has role: ${role}`);

  if (!role) {
    redirect("/onboarding");
  }

  switch (role) {
    case "founder":
      redirect("/dashboard/founder");
    case "investor":
      redirect("/dashboard/vc");
    case "user":
      redirect("/dashboard/user");
    default:
      redirect("/onboarding");
  }
}
