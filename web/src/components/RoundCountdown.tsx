"use client";

import React, { useState, useEffect } from "react";

export function useRoundCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "14",
    minutes: "38",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Friday 20:00 UTC (Wall Street Market Close settlement)
      const target = new Date();
      const day = now.getUTCDay();
      // Distance to next Friday
      const diffDays = (5 - day + 7) % 7 || 7;
      target.setUTCDate(now.getUTCDate() + diffDays);
      target.setUTCHours(20, 0, 0, 0);

      const diff = Math.max(0, target.getTime() - now.getTime());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

export default function RoundCountdownBadge({ className = "" }: { className?: string }) {
  const t = useRoundCountdown();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-gray-400 ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 text-gray-500 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-gray-400">Round 1 Ends:</span>
      <span className="text-white font-medium">
        {t.days}d {t.hours}h {t.minutes}m {t.seconds}s
      </span>
    </div>
  );
}
