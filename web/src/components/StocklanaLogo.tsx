"use client";

import React from "react";

interface StocklanaLogoProps {
  size?: number;
  className?: string;
  withBadge?: boolean;
}

/**
 * Bespoke Stocklana Fantasy Brandmark
 * Combines Solana's iconic speed chevrons with an ascending stock market "S" monogram.
 * Pure vector SVG, zero-slop, matte obsidian finish with crisp precision geometry.
 */
export default function StocklanaLogo({
  size = 32,
  className = "",
  withBadge = true,
}: StocklanaLogoProps) {
  return (
    <div className={`inline-flex items-center justify-center shrink-0 group ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200 group-hover:scale-105"
      >
        {withBadge && (
          <rect
            width="32"
            height="32"
            rx="8"
            fill="#111114"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
        )}

        {/* Top Solana-Ascend Speed Chevron: Sweeps right with 45° chamfer */}
        <path
          d="M8.5 12C8.5 9.79086 10.2909 8 12.5 8H21.2C22.25 8 22.95 9.07 22.56 10.04L21.46 12.78C21.21 13.41 20.61 13.82 19.93 13.82H13.5C12.4 13.82 11.5 14.72 11.5 15.82V16H8.5V12Z"
          fill="#FFFFFF"
        />

        {/* Bottom Solana-Ascend Speed Chevron: Sweeps left with matching parallel chamfer */}
        <path
          d="M23.5 20C23.5 22.2091 21.7091 24 19.5 24H10.8C9.75 24 9.05 22.93 9.44 21.96L10.54 19.22C10.79 18.59 11.39 18.18 12.07 18.18H18.5C19.6 18.18 20.5 17.28 20.5 16.18V16H23.5V20Z"
          fill="#FFFFFF"
        />

        {/* Central Kinetic Velocity Spark / Market Candlestick Axis */}
        <path
          d="M13.5 16H18.5"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
