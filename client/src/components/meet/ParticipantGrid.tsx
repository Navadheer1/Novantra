"use client";

import React from "react";
import ParticipantTile from "./ParticipantTile";
import { ParticipantMediaState } from "@/hooks/useNoventraMeet";

interface ParticipantGridProps {
  localParticipant: ParticipantMediaState;
  remoteParticipants: ParticipantMediaState[];
  pinnedSocketId: string | null;
  onPin: (socketId: string | null) => void;
}

export default function ParticipantGrid({
  localParticipant,
  remoteParticipants,
  pinnedSocketId,
  onPin,
}: ParticipantGridProps) {
  const allParticipants = [localParticipant, ...remoteParticipants];
  const pinnedParticipant = allParticipants.find((p) => p.socketId === pinnedSocketId);

  // If someone is pinned or screen sharing, use Spotlight + Sidebar Grid layout
  if (pinnedParticipant || allParticipants.some((p) => p.isScreenSharing)) {
    const spotlight = pinnedParticipant || allParticipants.find((p) => p.isScreenSharing) || localParticipant;
    const sideGrid = allParticipants.filter((p) => p.socketId !== spotlight.socketId);

    return (
      <div className="flex-1 w-full h-full flex flex-col lg:flex-row gap-4 p-4 min-h-[500px]">
        {/* Spotlight Main Tile */}
        <div className="flex-1 w-full h-full min-h-[360px]">
          <ParticipantTile
            participant={spotlight}
            isLocal={spotlight.socketId === localParticipant.socketId}
            isPinned={true}
            onPin={() => onPin(null)}
          />
        </div>

        {/* Side Strip */}
        <div className="w-full lg:w-72 shrink-0 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[650px]">
          {sideGrid.map((p) => (
            <div key={p.socketId} className="w-48 lg:w-full aspect-video shrink-0">
              <ParticipantTile
                participant={p}
                isLocal={p.socketId === localParticipant.socketId}
                isPinned={false}
                onPin={() => onPin(p.socketId)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Equal Responsive Grid Layout
  const gridCols =
    allParticipants.length === 1
      ? "grid-cols-1 max-w-4xl"
      : allParticipants.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-5xl"
      : allParticipants.length <= 4
      ? "grid-cols-1 sm:grid-cols-2 max-w-6xl"
      : "grid-cols-2 lg:grid-cols-3 max-w-[1500px]";

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center p-4">
      <div className={`grid ${gridCols} gap-4 w-full h-full min-h-[500px] mx-auto`}>
        {allParticipants.map((p) => (
          <div key={p.socketId} className="w-full h-full min-h-[220px]">
            <ParticipantTile
              participant={p}
              isLocal={p.socketId === localParticipant.socketId}
              isPinned={false}
              onPin={() => onPin(p.socketId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
