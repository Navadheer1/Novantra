"use client";

import React from "react";
import PitchComposerModal from "@/components/pitches/PitchComposerModal";

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorName: string;
}

export default function PitchInvestorModal({ isOpen, onClose, investorName }: PitchModalProps) {
  return (
    <PitchComposerModal
      isOpen={isOpen}
      onClose={onClose}
      investorName={investorName}
    />
  );
}
