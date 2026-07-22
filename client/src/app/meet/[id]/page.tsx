"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PreJoinScreen from "@/components/meet/PreJoinScreen";
import MeetingHeader from "@/components/meet/MeetingHeader";
import MeetingToolbar from "@/components/meet/MeetingToolbar";
import ParticipantGrid from "@/components/meet/ParticipantGrid";
import ParticipantsPanel from "@/components/meet/ParticipantsPanel";
import SettingsModal from "@/components/meet/SettingsModal";
import ContextualRightPanel, { WorkspaceMode } from "@/components/meet/ContextualRightPanel";
import MeetingEndSummaryModal from "@/components/meet/MeetingEndSummaryModal";
import PitchModeView from "@/components/meet/modes/PitchModeView";
import CanvasModeView from "@/components/meet/modes/CanvasModeView";
import CodeViewerModeView from "@/components/meet/modes/CodeViewerModeView";
import DueDiligenceModeView from "@/components/meet/modes/DueDiligenceModeView";
import { useNoventraMeet } from "@/hooks/useNoventraMeet";
import { apiFetch } from "@/lib/apiConfig";

export default function CanonicalMeetingRoomPage() {
  const params = useParams() as { id?: string; meetingCode?: string; roomId?: string };
  const meetingCode = params.id || params.meetingCode || params.roomId || "";
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [dbUser, setDbUser] = useState<{ id: string; name: string; role?: string } | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  
  // Lifecycle & UI states
  const [joined, setJoined] = useState(false);
  const [ended, setEnded] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceMode>("VIDEO");
  const [panelOpen, setPanelOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

      const res = await apiFetch(`/api/meetings/code/${meetingCode}`, { token });

      if (res.status === 404) {
        setNotFoundError(`Meeting room "${meetingCode}" was not found or has expired.`);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setNotFoundError(errJson.error || "Failed to load meeting room details from server.");
        return;
      }

      const data = await res.json();
      const mData = data.meeting || data;
      setMeetingDetails(mData);

      // Preload workspace mode based on meeting type
      if (mData.meetingType === "PITCH") setActiveWorkspace("PITCH");
      else if (mData.meetingType === "CANVAS") setActiveWorkspace("CANVAS");
      else if (mData.meetingType === "INTERVIEW") setActiveWorkspace("CODE");
      else if (mData.meetingType === "DD_ROOM") setActiveWorkspace("DILIGENCE");
    } catch (err: any) {
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
    setStartTime(Date.now());
  };

  const handleSelectWorkspace = (mode: WorkspaceMode) => {
    setActiveWorkspace(mode);
    setPanelOpen(true);
  };

  const handleLeaveCall = () => {
    if (startTime) {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }
    setEnded(true);
  };

  const handleRejoin = () => {
    setEnded(false);
    setJoined(true);
    setStartTime(Date.now());
  };

  // 1. Loading State
  if (loading || !clerkLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-900 space-y-4 antialiased font-sans">
        <div className="w-14 h-14 rounded-[20px] bg-blue-50 border border-blue-200/80 flex items-center justify-center shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-slate-900">Loading Noventra Meeting Room</h3>
          <p className="text-xs text-slate-500 font-mono">Code: {meetingCode}</p>
        </div>
      </div>
    );
  }

  // 2. 404 / Error State
  if (notFoundError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-900 space-y-5 antialiased font-sans">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-600" />
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Meeting Room Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{notFoundError}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={loadMeetingData}
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-[20px] h-10 px-4 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/communications")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-[20px] h-10 px-5 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub</span>
          </Button>
        </div>
      </div>
    );
  }

  // 3. Post-Meeting End Summary Screen
  if (ended) {
    return (
      <MeetingEndSummaryModal
        meetingCode={meetingCode}
        title={meetingDetails?.title || "Noventra Session"}
        durationSeconds={sessionDuration}
        participants={meet.participants.map((p) => ({ name: p.name, role: p.role }))}
        onRejoin={handleRejoin}
        onBackToHub={() => router.push("/communications")}
      />
    );
  }

  // 4. Pre-Join Preview Screen
  if (!joined) {
    return (
      <PreJoinScreen
        meetingCode={meetingCode}
        userName={dbUser?.name || "Noventra User"}
        onJoin={handlePreJoinSubmit}
      />
    );
  }

  // 5. Waiting Room Screen
  if (meet.inWaitingRoom) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.06),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(96,165,250,0.05),transparent_50%)] flex flex-col items-center justify-center p-6 text-center text-slate-900 space-y-4 antialiased font-sans">
        <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center animate-pulse shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Waiting for Host Admittance</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          You are in the waiting room for <strong className="text-slate-900 font-mono">{meetingCode}</strong>. The host will admit you shortly.
        </p>
      </div>
    );
  }

  // Derived Local Participant
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

  // Connected count strictly represents connected users (local + remote peers)
  const connectedCount = meet.participants.length + 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.06),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(96,165,250,0.05),transparent_50%)] text-slate-900 flex flex-col antialiased relative overflow-hidden select-none font-sans">
      
      {/* Top Header */}
      <MeetingHeader
        title={meetingDetails?.title || meetingDetails?.startup?.name || "Noventra Meeting"}
        meetingCode={meetingCode}
        participantCount={connectedCount}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Glassmorphism Floating Reactions Layer */}
      <div className="absolute inset-x-0 bottom-24 pointer-events-none z-50 flex justify-center gap-4">
        {meet.reactions.map((rx) => (
          <div
            key={rx.id}
            className="animate-bounce bg-white/75 backdrop-blur-[18px] border border-white/45 shadow-[0_12px_40px_rgba(15,23,42,0.10)] px-4 py-2 rounded-full flex items-center gap-2 text-slate-900"
          >
            <span className="text-lg">{rx.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{rx.senderName}</span>
          </div>
        ))}
      </div>

      {/* Main Collaboration Stage Layout */}
      <main className="flex-1 w-full flex overflow-hidden relative">
        
        {/* Workspace Display Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {activeWorkspace === "VIDEO" && (
            <ParticipantGrid
              localParticipant={localParticipant}
              remoteParticipants={meet.participants}
              pinnedSocketId={meet.pinnedSocketId}
              meetingCode={meetingCode}
              onPin={meet.setPinnedSocketId}
            />
          )}

          {activeWorkspace === "PITCH" && <PitchModeView />}
          {activeWorkspace === "CANVAS" && <CanvasModeView />}
          {activeWorkspace === "CODE" && <CodeViewerModeView />}
          {activeWorkspace === "DILIGENCE" && <DueDiligenceModeView />}
          {activeWorkspace === "NOTES" && (
            <ParticipantGrid
              localParticipant={localParticipant}
              remoteParticipants={meet.participants}
              pinnedSocketId={meet.pinnedSocketId}
              meetingCode={meetingCode}
              onPin={meet.setPinnedSocketId}
            />
          )}
        </div>

        {/* Dynamic Contextual Right Panel */}
        {panelOpen && (
          <ContextualRightPanel
            mode={activeWorkspace}
            meetingCode={meetingCode}
            chatMessages={meet.chatMessages}
            onSendMessage={meet.sendChatMessage}
            onClose={() => setPanelOpen(false)}
          />
        )}

        {/* Glassmorphism Participants Panel */}
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

      {/* Floating Glass Bottom Dock Toolbar */}
      <MeetingToolbar
        micOn={meet.micEnabled}
        camOn={meet.cameraEnabled}
        screenSharing={meet.screenSharing}
        blurOn={meet.backgroundBlur}
        handRaised={meet.handRaised}
        unreadChatCount={meet.unreadChatCount}
        participantCount={connectedCount}
        chatOpen={panelOpen && activeWorkspace === "VIDEO"}
        participantsOpen={participantsOpen}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        onToggleMic={meet.toggleMic}
        onToggleCam={meet.toggleCamera}
        onToggleScreenShare={meet.toggleScreenShare}
        onToggleBlur={() => meet.setBackgroundBlur(!meet.backgroundBlur)}
        onToggleHand={meet.toggleRaiseHand}
        onSendEmoji={meet.sendEmojiReaction}
        onToggleChat={() => {
          if (panelOpen && activeWorkspace === "VIDEO") {
            setPanelOpen(false);
          } else {
            setActiveWorkspace("VIDEO");
            setPanelOpen(true);
            meet.setUnreadChatCount(0);
          }
          if (participantsOpen) setParticipantsOpen(false);
        }}
        onToggleParticipants={() => {
          setParticipantsOpen(!participantsOpen);
          if (panelOpen) setPanelOpen(false);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onLeave={handleLeaveCall}
      />

      {/* Audio/Video Glass Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        backgroundBlur={meet.backgroundBlur}
        onToggleBlur={() => meet.setBackgroundBlur(!meet.backgroundBlur)}
      />

    </div>
  );
}
