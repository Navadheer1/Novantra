"use client";

import React from "react";
import StudioOverviewContent from "@/components/studio/StudioOverviewContent";

interface CreatorStudioWorkspaceProps {
  onSelectVideo?: (videoId: string | null) => void;
}

export default function CreatorStudioWorkspace({ onSelectVideo }: CreatorStudioWorkspaceProps) {
  return (
    <div className="w-full space-y-6">
      <StudioOverviewContent />
    </div>
  );
}
