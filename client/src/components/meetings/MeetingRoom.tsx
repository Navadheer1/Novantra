"use client";

import { useEffect, useRef } from "react";
import { RemoteStreamInfo } from "@/hooks/useWebRTC";
import { MicOff, ScreenShare } from "lucide-react";

interface MeetingRoomProps {
  localStream: MediaStream | null;
  remoteStreams: RemoteStreamInfo[];
  userName: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
}

// Sub-component for individual video tile
function VideoTile({
  stream,
  name,
  isLocal,
  audioEnabled,
  videoEnabled,
  isScreenSharing
}: {
  stream: MediaStream | null;
  name: string;
  isLocal: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg aspect-video flex items-center justify-center">
      {videoEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // local stream muted to prevent feedback loop
          className={`w-full h-full object-cover ${
            isLocal && !isScreenSharing ? "transform -scale-x-100" : ""
          }`}
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-300 font-bold text-xl flex items-center justify-center border border-zinc-700 shadow-inner">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-zinc-500 text-xs font-medium">Camera off</span>
        </div>
      )}

      {/* Name and Indicators overlay */}
      <div className="absolute bottom-3 left-3 bg-zinc-950/75 border border-zinc-800 backdrop-blur-md py-1.5 px-3 rounded-xl text-xs font-semibold text-white flex items-center gap-2 max-w-[85%]">
        {!audioEnabled && (
          <div className="bg-red-600 p-0.5 rounded-full" title="Muted">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
        <span className="truncate">{name} {isLocal && "(You)"}</span>
        {isScreenSharing && (
          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-md text-[9px] font-semibold flex items-center gap-0.5">
            <ScreenShare className="w-2.5 h-2.5" />
            Presenting
          </span>
        )}
      </div>
    </div>
  );
}

export default function MeetingRoom({
  localStream,
  remoteStreams,
  userName,
  audioEnabled,
  videoEnabled,
  isScreenSharing
}: MeetingRoomProps) {
  
  // Total participants in grid = local user + remote users
  const totalTiles = 1 + remoteStreams.length;

  // Compute grid column styling depending on how many tiles we render
  let gridStyle = "grid-cols-1 max-w-3xl";
  if (totalTiles === 2) {
    gridStyle = "grid-cols-1 md:grid-cols-2 max-w-5xl";
  } else if (totalTiles >= 3 && totalTiles <= 4) {
    gridStyle = "grid-cols-2 max-w-5xl";
  } else if (totalTiles >= 5) {
    gridStyle = "grid-cols-2 lg:grid-cols-3 max-w-6xl";
  }

  return (
    <div className="flex-1 bg-zinc-950 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
      <div className={`grid gap-6 w-full mx-auto ${gridStyle}`}>
        {/* Local Video Tile */}
        <VideoTile
          stream={localStream}
          name={userName}
          isLocal={true}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          isScreenSharing={isScreenSharing}
        />

        {/* Remote Video Tiles */}
        {remoteStreams.map((remote) => (
          <VideoTile
            key={remote.socketId}
            stream={remote.stream}
            name={remote.name}
            isLocal={false}
            audioEnabled={remote.audioEnabled}
            videoEnabled={remote.videoEnabled}
            isScreenSharing={remote.isScreenSharing}
          />
        ))}
      </div>
    </div>
  );
}
