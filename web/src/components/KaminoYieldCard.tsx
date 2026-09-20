"use client";

import React, { useState, useEffect } from "react";

interface KaminoYieldCardProps {
  className?: string;
  onOpenTelemetry?: () => void;
}

export default function KaminoYieldCard({
  className = "",
  onOpenTelemetry,
}: KaminoYieldCardProps) {
  // Live micro-yield counter ticking upwards to simulate real DeFi streaming yield
  const [accruedYield, setAccruedYield] = useState(14.8214);

  useEffect(() => {
    // Stream micro-yield every 1.5 seconds (simulating 8.42% APY on pooled deposits)
    const interval = setInterval(() => {
      setAccruedYield((prev) => prev + 0.0004);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-100/90 dark:bg-white/[0.025] border border-zinc-200 dark:border-white/[0.08] text-xs font-mono text-zinc-700 dark:text-gray-300 relative overflow-hidden group transition-colors ${className}`}
    >
      {/* Left: Kamino Vault APY & Live Accrual Stream */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
          <span className="text-zinc-900 dark:text-white font-medium">Kamino Yield Engine</span>
        </div>

        <span className="text-zinc-300 dark:text-gray-700 hidden sm:inline">•</span>

        <div className="flex items-center gap-1.5">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">8.42% APY</span>
          <span className="text-zinc-500 dark:text-gray-500 hidden md:inline">
            (+$
            {accruedYield.toLocaleString(undefined, {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}{" "}
            USDC accrued this round)
          </span>
        </div>
      </div>

      {/* Right: Zero Loss Guarantee & Telemetry Trigger */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px]">
        <span className="text-zinc-500 dark:text-gray-400">100% Principal Safe</span>
        {onOpenTelemetry && (
          <button
            onClick={onOpenTelemetry}
            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400/90 dark:hover:text-cyan-300 underline transition-colors cursor-pointer"
          >
            Vault Telemetry ↗
          </button>
        )}
      </div>
    </div>
  );
}
