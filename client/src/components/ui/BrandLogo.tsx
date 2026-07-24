"use client";

import React from "react";

export interface BrandLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  animated?: boolean;
  variant?: "blue" | "white" | "dark" | "auto";
}

/**
 * Official Noventra Brand Logo: Infinite Nexus
 * A continuous ribbon forming an abstract infinity loop with a subtle hidden "N".
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 32,
  className = "",
  showText = false,
  textClassName = "",
  animated = false,
  variant = "auto",
}) => {
  // Determine fill color class or hex based on variant
  let colorClass = "text-[#2563EB] dark:text-[#3B82F6]";
  if (variant === "blue") colorClass = "text-[#2563EB]";
  if (variant === "white") colorClass = "text-white";
  if (variant === "dark") colorClass = "text-slate-900";

  const numericSize = typeof size === "number" ? size : parseInt(size as string, 10) || 32;
  const height = numericSize;
  const width = numericSize * 2; // 2:1 aspect ratio for Infinite Nexus logo

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Infinite Nexus Official Vector Logo */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform duration-180 ease-out hover:scale-[1.03] hover:opacity-95 ${colorClass} ${
          animated ? "animate-pulse" : ""
        }`}
        aria-label="Noventra Infinite Nexus Logo"
      >
        {/* Infinite Nexus Interwoven Ribbon Geometry */}
        <g fill="currentColor">
          {/* Left Loop Outer Arc to Left Vertical N Stem */}
          <path
            d="M 50 10 
               C 27.91 10 10 27.91 10 50 
               C 10 72.09 27.91 90 50 90 
               C 58.5 90 66.4 87.3 72.9 82.7 
               L 61.2 73.1 
               C 57.9 75.6 54.1 77 50 77 
               C 35.09 77 23 64.91 23 50 
               C 23 35.09 35.09 23 50 23 
               C 54.1 23 57.9 24.4 61.2 26.9 
               L 72.9 17.3 
               C 66.4 12.7 58.5 10 50 10 Z"
          />

          {/* Right Loop Outer Arc to Right Vertical N Stem */}
          <path
            d="M 150 10 
               C 141.5 10 133.6 12.7 127.1 17.3 
               L 138.8 26.9 
               C 142.1 24.4 145.9 23 150 23 
               C 164.91 23 177 35.09 177 50 
               C 177 64.91 164.91 77 150 77 
               C 145.9 77 142.1 75.6 138.8 73.1 
               L 127.1 82.7 
               C 133.6 87.3 141.5 90 150 90 
               C 172.09 90 190 72.09 190 50 
               C 190 27.91 172.09 10 150 10 Z"
          />

          {/* N Left Vertical Stem */}
          <path
            d="M 42 22 L 58 22 L 58 78 L 42 78 Z"
          />

          {/* N Right Vertical Stem */}
          <path
            d="M 142 22 L 158 22 L 158 78 L 142 78 Z"
          />

          {/* N Diagonal Crossing Band */}
          <path
            d="M 45 16 
               L 65 16 
               L 155 84 
               L 135 84 Z"
          />
        </g>
      </svg>

      {/* Brand Typography */}
      {showText && (
        <span
          className={`font-sans font-semibold tracking-tight text-slate-900 dark:text-white ${textClassName}`}
          style={{ fontSize: `${Math.max(numericSize * 0.55, 14)}px` }}
        >
          Noventra
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
