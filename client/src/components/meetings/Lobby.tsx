"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Users, Loader2 } from "lucide-react";

interface LobbyProps {
  userName: string;
  setUserName: (name: string) => void;
  isLoggedIn: boolean;
  isHost: boolean;
  onJoin: (audioEnabled: boolean, videoEnabled: boolean) => void;
  joinStatus: "idle" | "waiting" | "rejected" | "full" | "error";
  errorMessage?: string;
}

export default function Lobby({
  userName,
  setUserName,
  isLoggedIn,
  isHost,
  onJoin,
  joinStatus,
  errorMessage
}: LobbyProps) {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startPreview() {
      try {
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
        }
        
        if (videoEnabled || audioEnabled) {
          const localStream = await navigator.mediaDevices.getUserMedia({
            video: videoEnabled,
            audio: audioEnabled
          });
          setStream(localStream);
          if (videoRef.current) {
            videoRef.current.srcObject = localStream;
          }
        } else {
          setStream(null);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      } catch (err) {
        console.error("Error accessing media devices in lobby:", err);
      }
    }

    startPreview();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [videoEnabled, audioEnabled]);

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleJoinClick = () => {
    if (!userName.trim()) return;
    onJoin(audioEnabled, videoEnabled);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-[80vh] gap-12 p-6 max-w-6xl mx-auto">
      {/* Left side: Camera Preview */}
      <div className="w-full lg:w-2/3 flex flex-col items-center">
        <div className="relative w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
          {videoEnabled && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
                <VideoOff className="w-10 h-10" />
              </div>
              <p className="text-sm">Camera is off</p>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-zinc-950/80 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-800">
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-all ${
                audioEnabled
                  ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
              title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
            >
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-all ${
                videoEnabled
                  ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
              title={videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Join Options */}
      <div className="w-full lg:w-1/3 flex flex-col bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to join?</h2>
        <p className="text-zinc-400 text-sm mb-6">
          {isHost ? "You are the host of this meeting." : "Set your display name and join request."}
        </p>

        {joinStatus === "idle" && (
          <div className="flex flex-col gap-4">
            {!isLoggedIn && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={30}
                  className="px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            )}
            
            {isLoggedIn && (
              <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl mb-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500">Joining as</span>
                  <span className="text-sm font-semibold text-white">{userName}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleJoinClick}
              disabled={!userName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all text-base mt-2"
            >
              {isHost ? "Start Meeting" : "Ask to Join"}
            </Button>
          </div>
        )}

        {joinStatus === "waiting" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Waiting for Host</h3>
            <p className="text-zinc-400 text-sm">
              You'll join the call as soon as the host admits you.
            </p>
          </div>
        )}

        {joinStatus === "rejected" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center mb-4 font-bold text-xl">
              ✕
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
            <p className="text-zinc-400 text-sm">
              The meeting host has declined your request to join.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-zinc-800 hover:bg-zinc-700 text-white w-full"
            >
              Try Again
            </Button>
          </div>
        )}

        {joinStatus === "full" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-900/20 text-yellow-500 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Meeting is Full</h3>
            <p className="text-zinc-400 text-sm">
              This meeting is full. The MVP supports up to 6 participants.
            </p>
            <Button
              onClick={() => window.close()}
              className="mt-6 bg-zinc-800 hover:bg-zinc-700 text-white w-full"
            >
              Close Tab
            </Button>
          </div>
        )}

        {joinStatus === "error" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center mb-4 font-bold text-xl">
              !
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Error joining meeting</h3>
            <p className="text-zinc-400 text-sm">
              {errorMessage || "An unexpected error occurred. Please try again."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-zinc-800 hover:bg-zinc-700 text-white w-full"
            >
              Reload Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
