import { redirect } from "next/navigation";

export default async function CommunicationsMeetingRedirectPage({ params }: { params: Promise<{ meetingCode: string }> }) {
  const resolvedParams = await params;
  redirect(`/meet/${resolvedParams.meetingCode}`);
}
