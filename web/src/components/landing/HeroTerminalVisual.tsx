"use client";

import React, { useMemo } from "react";
import { usePythPrices, TOKENIZED_STOCKS } from "@/hooks/usePythPrices";
import { Apple, Nvidia, Tesla } from "@thesvg/react";

const getStockIcon = (symbol: string) => {
  switch (symbol) {
    case "AAPLx":
      return <Apple className="w-3.5 h-3.5 text-white" />;
    case "NVDAx":
      return <Nvidia className="w-3.5 h-3.5 text-[#76b900]" />;
    case "TSLAx":
      return <Tesla className="w-3.5 h-3.5 text-white" />;
    case "SPYx":
      return <span className="text-[11px] font-bold text-white tracking-tighter">S&P</span>;
    default:
      return <span className="text-xs font-bold text-white">{symbol[0]}</span>;
  }
};

export default function HeroTerminalVisual() {
  const { prices, status } = usePythPrices();

  // 4 equal weight test assets to demonstrate the $100,000 portfolio
  const samplePortfolio = useMemo(() => {
    const symbols = Object.keys(TOKENIZED_STOCKS);
    const targetPerStock = 25000;
    return symbols.map((sym) => {
      const price = prices[sym] || 0;
      const shares = price > 0 ? Math.floor(targetPerStock / price) : 0;
      const value = shares * price;
      return { symbol: sym, price, shares, value };
    });
  }, [prices]);

  const totalCalculated = useMemo(() => {
    return samplePortfolio.reduce((acc, item) => acc + item.value, 0);
  }, [samplePortfolio]);

  const cashRemainder = Math.max(0, 100000 - totalCalculated);

  return (
    <div className="w-full rounded-2xl bg-[#0d0f15] border border-white/[0.1] shadow-2xl shadow-black/80 overflow-hidden font-mono flex flex-col relative text-zinc-300 select-none">
      {/* Terminal Title Bar */}
      <div className="h-10 px-4 bg-[#090b10] border-b border-white/[0.08] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
          </div>
          <span className="text-[11px] text-zinc-400 ml-2 tracking-wide font-mono">
            PORTFOLIO-ARENA // ROSTER-ALPHA
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === "live" ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PYTH LIVE</span>
            </div>
          ) : status === "simulation" ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>DEMO SIMULATION</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <span>BASELINE REF</span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Top Valuation Bar */}
      <div className="p-5 sm:p-6 bg-[#0c0e14] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
            Virtual Portfolio Valuation
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-sans">
              $100,000.00
            </span>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              Locked On-Chain
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] text-zinc-400 uppercase">Capital Pool</span>
            <span className="text-white font-medium">$100K Principal</span>
          </div>
          <div className="h-7 w-[1px] bg-white/[0.08]" />
          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] text-zinc-400 uppercase">Entry Stake</span>
            <span className="text-emerald-400 font-medium">5.00 USDC</span>
          </div>
        </div>
      </div>

      {/* Chart Visual Surface */}
      <div className="p-5 sm:p-6 bg-[#090b10] flex flex-col gap-4 relative">
        {/* Abstract Market Trajectory Line */}
        <div className="relative h-28 w-full overflow-hidden flex items-end">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <pattern id="gridLines" width="40" height="25" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid background */}
            <rect width="400" height="100" fill="url(#gridLines)" />

            {/* Area under curve */}
            <path
              d="M 0 75 Q 70 80, 130 60 T 260 40 T 360 25 L 400 20 L 400 100 L 0 100 Z"
              fill="url(#chartGlow)"
            />

            {/* Trajectory Stroke */}
            <path
              d="M 0 75 Q 70 80, 130 60 T 260 40 T 360 25 L 400 20"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Active Market Pulse Indicator */}
            <circle cx="400" cy="20" r="4" fill="#10b981" />
            <circle cx="400" cy="20" r="8" fill="#10b981" opacity="0.3" className="animate-ping" />
          </svg>

          {/* Watermark overlay */}
          <div className="absolute right-2 bottom-2 text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
            PYTH HERMES PROTOCOL FEED
          </div>
        </div>

        {/* 4 Asset Ticker Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/[0.06]">
          {samplePortfolio.map((item) => (
            <div
              key={item.symbol}
              className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.06] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center">
                    {getStockIcon(item.symbol)}
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {item.symbol}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">25%</span>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs font-mono text-zinc-200">
                  {item.price > 0 ? `$${item.price.toFixed(2)}` : "Unavailable"}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {item.shares} sh
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Footer Strip */}
      <div className="px-5 py-3 bg-[#0a0c12] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span>ROSTER: 4/5 ASSETS</span>
          <span className="text-zinc-600">•</span>
          <span>UNALLOCATED CASH: ${cashRemainder.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ZERO PRINCIPAL RISK</span>
        </div>
      </div>
    </div>
  );
}
