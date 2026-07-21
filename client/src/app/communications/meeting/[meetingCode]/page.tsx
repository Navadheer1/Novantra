"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { Loader2, AlertCircle, RefreshCw, Plus, ArrowLeft, Grid, Briefcase, Layers, Code2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import PreJoinScreen from "@/components/meet/PreJoinScreen";
import MeetingHeader from "@/components/meet/MeetingHeader";
import MeetingToolbar from "@/components/meet/MeetingToolbar";
import ParticipantGrid from "@/components/meet/ParticipantGrid";
import ChatPanel from "@/components/meet/ChatPanel";
import ParticipantsPanel from "@/components/meet/ParticipantsPanel";
import SettingsModal from "@/components/meet/SettingsModal";
import PitchModeView from "@/components/meet/modes/PitchModeView";
import CanvasModeView from "@/components/meet/modes/CanvasModeView";
import CodeViewerModeView from "@/components/meet/modes/CodeViewerModeView";
import DueDiligenceModeView from "@/components/meet/modes/DueDiligenceModeView";
import { useNoventraMeet } from "@/hooks/useNoventraMeet";
import { getApiUrl, apiFetch } from "@/lib/apiConfig";

export default function MeetingRoomByCodePage() {
  const params = useParams() as { meetingCode?: string; id?: string; roomId?: string };
  const meetingCode = params.meetingCode || params.id || params.roomId || "";
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [dbUser, setDbUser] = useState<{ id: string; name: string; role?: string } | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  
  const [joined, setJoined] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [roomMode, setRoomMode] = useState<"GRID" | "PITCH" | "CANVAS" | "INTERVIEW" | "DD_ROOM">("GRID");

  useEffect(() => {
    if (clerkLoaded && meetingCode) {
      loadMeetingData();
    }
  }, [clerkLoaded, clerkUser?.id, meetingCode]);

  const loadMeetingData = async () => {
    try {
      setLoading(true);
      setNotFoundError(null);
      const token = await getToken();

      if (clerkUser?.id) {
        try {
          const uRes = await apiFetch(`/api/users/clerk/${clerkUser.id}`, { token });
          if (uRes.ok) {
            const uData = await uRes.json();
            setDbUser({ id: uData.id, name: uData.name, role: uData.role });
          } else {
            setDbUser({ id: clerkUser.id, name: clerkUser.fullName || "Noventra User" });
          }
        } catch (e) {
          setDbUser({ id: clerkUser.id, name: clerkUser.fullName || "Noventra User" });
        }
      }

      console.log(`[Meeting Room] Fetching meeting details for code: ${meetingCode}`);
      const res = await apiFetch(`/api/meetings/code/${meetingCode}`, { token });

      if (res.status === 404) {
        console.warn(`[Meeting Room] Backend confirmed 404: Meeting code ${meetingCode} does not exist.`);
        setNotFoundError(`Meeting room "${meetingCode}" was not found in database or has expired.`);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setNotFoundError(errJson.error || "Failed to load meeting room details from server.");
        return;
      }

      const data = await res.json();
      console.log("[Meeting Room] Loaded meeting data from backend:", data);
      const mData = data.meeting || data;
      setMeetingDetails(mData);

      if (mData.meetingType && mData.meetingType !== "GENERAL") {
        setRoomMode(mData.meetingType);
      }
    } catch (err: any) {
      console.error("[Meeting Room Error]:", err);
      setNotFoundError("Network error connecting to backend meeting server.");
    } finally {
      setLoading(false);
    }
  };

  const meet = useNoventraMeet(meetingCode, dbUser);

  const handlePreJoinSubmit = (micOn: boolean, camOn: boolean, blurOn: boolean) => {
    if (!micOn) meet.toggleMic();
    if (!camOn) meet.toggleCamera();
    if (blurOn) meet.setBackgroundBlur(true);
    setJoined(true);
  };

  // 1. Loading State
  if (loading || !clerkLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 antialiased">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shadow-lg">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-white">Loading Noventra Meeting Room</h3>
          <p className="text-xs text-slate-400 font-mono">Code: {meetingCode}</p>
        </div>
      </div>
    );
  }

  // 2. Verified 404 Not Found / Error Screen
  if (notFoundError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-5 antialiased">
        <div className="w-16 h-16 rounded-full bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-black tracking-tight">Meeting Room Unavailable</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{notFoundError}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={loadMeetingData}
            variant="outline"
            className="border-slate-800 text-slate-300 hover:bg-slate-900 font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/communications")}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub</span>
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/communications")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl h-10 px-5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Meeting</span>
          </Button>
        </div>
      </div>
    );
  }

  // 3. Pre-Join Preview Screen
  if (!joined) {
    return (
      <PreJoinScreen
        meetingCode={meetingCode}
        userName={dbUser?.name || "Noventra User"}
        onJoin={handlePreJoinSubmit}
      />
    );
  }

  // 4. Waiting Room View
  if (meet.inWaitingRoom) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center animate-pulse">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Waiting for Host Admittance</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          You are in the waiting room for <strong className="text-white font-mono">{meetingCode}</strong>. The host will admit you shortly.
        </p>
      </div>
    );
  }

  const localParticipant = {
    socketId: "local",
    userId: dbUser?.id || "local",
    name: dbUser?.name || "You",
    role: dbUser?.role || "USER",
    isHost: meet.isHost,
    audioEnabled: meet.micEnabled,
    videoEnabled: meet.cameraEnabled,
    isScreenSharing: meet.screenSharing,
    isHandRaised: meet.handRaised,
    isSpeaking: false,
    stream: meet.localStream,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased relative overflow-hidden select-none">
      
      {/* 1. Top Header */}
      <MeetingHeader
        title={meetingDetails?.title || meetingDetails?.startup?.name || "Noventra Room"}
        meetingCode={meetingCode}
        participantCount={meet.participants.length + 1}
      />

      {/* Mode Switcher Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-center gap-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setRoomMode("GRID")}
          className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
            roomMode === "GRID" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Grid className="w-3.5 h-3.5" /> Video Grid
        </button>

        <button
          onClick={() => setRoomMode("PITCH")}
          className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
            roomMode === "PITCH" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Pitch Mode
        </button>

        <button
          onClick={() => setRoomMode("CANVAS")}
          className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
            roomMode === "CANVAS" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" /> Canvas
        </button>

        <button
          onClick={() => setRoomMode("INTERVIEW")}
          className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
            roomMode === "INTERVIEW" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-sky-400" /> Code Viewer
        </button>

        <button
          onClick={() => setRoomMode("DD_ROOM")}
          className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
            roomMode === "DD_ROOM" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Due Diligence
        </button>
      </div>

      {/* 2. Floating Emoji Reactions Animation Layer */}
      <div className="absolute inset-x-0 bottom-24 pointer-events-none z-50 flex justify-center gap-4">
        {meet.reactions.map((rx) => (
          <div
            key={rx.id}
            className="animate-bounce bg-slate-900/90 border border-white/20 px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1 text-base"
          >
            <span>{rx.emoji}</span>
            <span className="text-[10px] font-bold text-slate-300">{rx.senderName}</span>
          </div>
        ))}
      </div>

      {/* 3. Main Stage Layout (Video Grid or Specialized Mode + Optional Sidebars) */}
      <main className="flex-1 w-full flex overflow-hidden relative">
        
        {roomMode === "GRID" && (
          <ParticipantGrid
            localParticipant={localParticipant}
            remoteParticipants={meet.participants}
            pinnedSocketId={meet.pinnedSocketId}
            onPin={meet.setPinnedSocketId}
          />
        )}

        {roomMode === "PITCH" && <PitchModeView />}
        {roomMode === "CANVAS" && <CanvasModeView />}
        {roomMode === "INTERVIEW" && <CodeViewerModeView />}
        {roomMode === "DD_ROOM" && <DueDiligenceModeView />}

        {/* Right Sidebars */}
        {chatOpen && (
          <ChatPanel
            messages={meet.chatMessages}
            onSendMessage={meet.sendChatMessage}
            onClose={() => setChatOpen(false)}
          />
        )}

        {participantsOpen && (
          <ParticipantsPanel
            meetingCode={meetingCode}
            localParticipant={localParticipant}
            remoteParticipants={meet.participants}
            waitingUsers={meet.waitingUsers}
            isHost={meet.isHost}
            onAdmit={meet.admitUser}
            onReject={meet.rejectUser}
            onClose={() => setParticipantsOpen(false)}
          />
        )}

      </main>

      {/* 4. Bottom Floating Glass Toolbar */}
      <MeetingToolbar
        micOn={meet.micEnabled}
        camOn={meet.cameraEnabled}
        screenSharing={meet.screenSharing}
        blurOn={meet.backgroundBlur}
        handRaised={meet.handRaised}
        unreadChatCount={meet.unreadChatCount}
        participantCount={meet.participants.length + 1}
        chatOpen={chatOpen}
        participantsOpen={participantsOpen}
        onToggleMic={meet.toggleMic}
        onToggleCam={meet.toggleCamera}
        onToggleScreenShare={meet.toggleScreenShare}
        onToggleBlur={() => meet.setBackgroundBlur(!meet.backgroundBlur)}
        onToggleHand={meet.toggleRaiseHand}
        onSendEmoji={meet.sendEmojiReaction}
        onToggleChat={() => {
          setChatOpen(!chatOpen);
          if (!chatOpen) meet.setUnreadChatCount(0);
          if (participantsOpen) setParticipantsOpen(false);
        }}
        onToggleParticipants={() => {
          setParticipantsOpen(!participantsOpen);
          if (chatOpen) setChatOpen(false);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onLeave={() => router.push("/communications")}
      />

      {/* 5. Device Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        backgroundBlur={meet.backgroundBlur}
        onToggleBlur={() => meet.setBackgroundBlur(!meet.backgroundBlur)}
      />

    </div>
  );
}
