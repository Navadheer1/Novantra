"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useWebRTC } from "@/hooks/useWebRTC";
import Lobby from "@/components/meetings/Lobby";
import MeetingRoom from "@/components/meetings/MeetingRoom";
import ControlsBar from "@/components/meetings/ControlsBar";
import ParticipantList from "@/components/meetings/ParticipantList";
import { Loader2 } from "lucide-react";

interface DBUser {
  id: string;
  name: string;
  role: string;
}

interface MeetingDetails {
  id: string;
  startupId: string;
  hostFounderId: string;
  meetingCode: string;
  startup: {
    name: string;
    logo: string | null;
  };
}

export default function MeetingPage() {
  const { id: meetingCode } = useParams() as { id: string };
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Custom user name state for unauthenticated guests
  const [guestName, setGuestName] = useState("");

  // 1. Fetch meeting info & sync user
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch meeting details
        const meetingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/meetings/code/${meetingCode}`
        );
        if (!meetingRes.ok) {
          throw new Error("Meeting not found or has already ended.");
        }
        const details: MeetingDetails = await meetingRes.json();
        setMeetingDetails(details);

        // Fetch DB User if Clerk is loaded and signed in
        if (clerkLoaded && clerkUser) {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/clerk/${clerkUser.id}`
          );
          if (userRes.ok) {
            const data: DBUser = await userRes.json();
            setDbUser(data);
          }
        }
      } catch (err: any) {
        console.error("Error loading meeting page:", err);
        setErrorMsg(err.message || "An error occurred loading the meeting.");
      } finally {
        setLoading(false);
      }
    }

    if (clerkLoaded) {
      loadData();
    }
  }, [meetingCode, clerkUser, clerkLoaded]);

  // Determine if the current user is the host
  const isHost = dbUser !== null && meetingDetails !== null && dbUser.id === meetingDetails.hostFounderId;
  const isLoggedIn = clerkUser !== null && clerkUser !== undefined;
  
  // Determine display name
  const displayName = isLoggedIn
    ? (dbUser?.name || clerkUser.fullName || clerkUser.firstName || "User")
    : guestName;

  // Initialize WebRTC hook
  const {
    localStream,
    remoteStreams,
    admittedUsers,
    waitingUsers,
    joinStatus,
    errorMessage,
    audioEnabled,
    videoEnabled,
    isScreenSharing,
    mySocketId,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    admitUser,
    rejectUser,
    leaveMeeting,
    joinMeeting
  } = useWebRTC(
    meetingCode,
    dbUser?.id || "guest-" + Math.random().toString(36).substr(2, 9),
    displayName,
    isHost
  );

  // Sync guest display name input if logged out
  const [inputName, setInputName] = useState("");

  const handleJoin = (audioOn: boolean, videoOn: boolean) => {
    let finalName = displayName;
    if (!isLoggedIn) {
      if (!inputName.trim()) return;
      setGuestName(inputName);
      finalName = inputName;
    }
    joinMeeting(audioOn, videoOn);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading || !clerkLoaded) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm">Configuring secure WebRTC connection...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center mb-4 font-bold text-2xl">
          ✕
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Meeting Unavailable</h2>
        <p className="text-zinc-400 text-sm max-w-md mb-6">{errorMsg}</p>
        <a href="/dashboard">
          <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-all">
            Return to Dashboard
          </button>
        </a>
      </div>
    );
  }

  const isJoined = mySocketId !== null;

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden text-white font-sans">
      {/* Top Header info (Only in meeting) */}
      {isJoined && (
        <div className="h-14 border-b border-zinc-800/80 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {meetingDetails?.startup.logo && (
              <img
                src={meetingDetails.startup.logo}
                alt={meetingDetails.startup.name}
                className="w-6 h-6 rounded-md object-cover"
              />
            )}
            <span className="font-semibold text-sm">
              {meetingDetails?.startup.name} Pitch Room
            </span>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 py-1 px-3 rounded-lg text-xs text-zinc-400 select-all cursor-pointer hover:bg-zinc-800/50 transition-all">
            Code: {meetingCode}
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {isJoined ? (
          <MeetingRoom
            localStream={localStream}
            remoteStreams={remoteStreams}
            userName={displayName}
            audioEnabled={audioEnabled}
            videoEnabled={videoEnabled}
            isScreenSharing={isScreenSharing}
          />
        ) : (
          <Lobby
            userName={isLoggedIn ? displayName : inputName}
            setUserName={setInputName}
            isLoggedIn={isLoggedIn}
            isHost={isHost}
            onJoin={handleJoin}
            joinStatus={joinStatus}
            errorMessage={errorMessage}
          />
        )}

        {/* Sidebar */}
        {isJoined && sidebarOpen && (
          <ParticipantList
            isHost={isHost}
            admittedUsers={admittedUsers}
            waitingUsers={waitingUsers}
            onAdmit={admitUser}
            onReject={rejectUser}
            onClose={toggleSidebar}
          />
        )}
      </div>

      {/* Bottom controls (Only in meeting) */}
      {isJoined && (
        <ControlsBar
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          isScreenSharing={isScreenSharing}
          participantCount={admittedUsers.length}
          waitingCount={waitingUsers.length}
          isHost={isHost}
          sidebarOpen={sidebarOpen}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          toggleScreenShare={toggleScreenShare}
          toggleSidebar={toggleSidebar}
          onLeave={leaveMeeting}
        />
      )}
    </div>
  );
}
