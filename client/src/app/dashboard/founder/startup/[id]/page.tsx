"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Video, Users, Briefcase, Building2 } from "lucide-react";

export default function StartupManagement() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [startup, setStartup] = useState<any>(null);
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartupData();
  }, [id]);

  const fetchStartupData = async () => {
    try {
      const token = await getToken();
      // For now we fetch all startups for the founder and filter by ID
      // In a real app we'd have a specific GET /api/startups/:id endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/startups/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const found = data.find((s: any) => s.id === id);
        setStartup(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startMeeting = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ startupId: id })
      });
      if (res.ok) {
        const data = await res.json();
        setMeeting(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center min-h-[50vh] flex items-center justify-center">Loading Management Portal...</div>;
  if (!startup) return <div className="p-8 text-center text-red-500">Startup not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            {startup.logo ? (
              <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building2 className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{startup.name} Portal</h1>
            <p className="text-muted-foreground">Manage your team, investors, and operations.</p>
          </div>
        </div>
        <Button onClick={startMeeting} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Video className="w-5 h-5 mr-2" />
          Start Meeting Room
        </Button>
      </div>

      {meeting && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Meeting Room Active</h3>
            <p className="text-blue-700 text-sm">Your meeting room is ready. Share the link or click join.</p>
          </div>
          <a href={`/meeting/${meeting.meetingCode}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-blue-600 hover:bg-blue-700">Join Meeting</Button>
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Team Members</h2>
          </div>
          
          {startup.teamMembers?.length === 0 ? (
            <p className="text-muted-foreground italic text-center py-4">No team members yet. Accept requests in your mailbox.</p>
          ) : (
            <ul className="space-y-3">
              {startup.teamMembers?.map((member: any) => (
                <li key={member.id} className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
                  <span className="font-semibold">{member.user?.name}</span>
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{member.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Connected VCs / Investors</h2>
          </div>
          
          {startup.connectedVCs?.length === 0 ? (
            <p className="text-muted-foreground italic text-center py-4">No investors connected yet.</p>
          ) : (
            <ul className="space-y-3">
              {startup.connectedVCs?.map((vc: any) => (
                <li key={vc.id} className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
                  <span className="font-semibold">VC ID: {vc.vcId}</span>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">Connected</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
