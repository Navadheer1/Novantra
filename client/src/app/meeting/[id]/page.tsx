import { redirect } from "next/navigation";

export default async function MeetingIdRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  redirect(`/meet/${resolvedParams.id}`);
}
