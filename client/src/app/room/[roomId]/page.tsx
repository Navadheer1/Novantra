import { redirect } from "next/navigation";

export default async function RoomIdRedirectPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = await params;
  redirect(`/meet/${resolvedParams.roomId}`);
}
