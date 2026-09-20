"use client";

import React from "react";
import { usePythPrices, TOKENIZED_STOCKS } from "@/hooks/usePythPrices";
import { Apple, Nvidia, Tesla } from "@thesvg/react";

interface LandingHeroProps {
  onEnterTournament: () => void;
  onOpenHowItWorks: () => void;
}

const getStockIcon = (symbol: string) => {
  switch (symbol) {
    case "AAPLx":
      return <Apple className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />;
    case "NVDAx":
      return <Nvidia className="w-3.5 h-3.5 text-[#76b900]" />;
    case "TSLAx":
      return <Tesla className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />;
    case "SPYx":
      return <span className="text-[10px] font-bold text-zinc-900 dark:text-white tracking-tighter">S&P</span>;
    default:
      return <span className="text-xs font-bold text-zinc-900 dark:text-white">{symbol[0]}</span>;
  }
};

export default function LandingHero({
  onEnterTournament,
  onOpenHowItWorks,
}: LandingHeroProps) {
  const { prices, status } = usePythPrices();

  return (
    <section className="relative w-full pt-20 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-zinc-200/80 dark:border-white/[0.06] transition-colors duration-200">
      {/* Subtle Financial Coordinate Grid in Background */}
      <div 
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-8 sm:mb-12 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-900 dark:text-zinc-300 font-semibold">Stocklana Fantasy</span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span>Zero-Loss Equity Tournaments</span>
        </div>

        {/* Huge Typographic Headline */}
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-[0.92] text-left">
            <span className="sr-only">Fantasy trading for real markets.</span>
            <span className="block text-zinc-950 dark:text-white">FANTASY TRADING</span>
            <span className="block text-zinc-400 dark:text-zinc-500 font-light mt-2 sm:mt-3">FOR REAL MARKETS.</span>
          </h1>

          {/* Extremely Short Editorial Supporting Copy */}
          <p className="mt-8 sm:mt-12 text-lg sm:text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 font-light max-w-2xl leading-relaxed tracking-tight">
            Build a $100K virtual portfolio. Draft tokenized equities. Compete on real market movement.
          </p>

          {/* Action Row */}
          <div className="mt-10 sm:mt-14 mb-16 sm:mb-24 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onEnterTournament}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-semibold text-sm tracking-tight active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-black/5 dark:shadow-white/5"
            >
              <span>ENTER TOURNAMENT</span>
              <span className="text-zinc-400 dark:text-zinc-600 font-mono">→</span>
            </button>

            <button
              onClick={onOpenHowItWorks}
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 dark:bg-transparent dark:hover:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white dark:border-white/[0.12] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              HOW IT WORKS
            </button>
          </div>
        </div>

        {/* Panoramic Live Market Ticker Tape */}
        <div className="pt-8 sm:pt-10 border-t border-zinc-200/80 dark:border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-medium">
              Live Pyth Ticker
            </span>
            {status === "live" ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PYTH LIVE
              </span>
            ) : status === "simulation" ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                DEMO SIMULATION
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                BASELINE REF
              </span>
            )}
          </div>

          {/* Ticker Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1 lg:max-w-3xl">
            {Object.keys(TOKENIZED_STOCKS).map((symbol) => {
              const price = prices[symbol];
              return (
                <div key={symbol} className="flex items-center gap-2.5 font-mono">
                  <div className="w-5 h-5 rounded bg-zinc-100 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.08] flex items-center justify-center shrink-0">
                    {getStockIcon(symbol)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white tracking-tight">{symbol}</span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300">
                      {price > 0 ? `$${price.toFixed(2)}` : "Unavailable"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single Technical Specification Line (Replacing 4 separate stat cards) */}
        <div className="mt-8 pt-8 border-t border-zinc-200/80 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs sm:text-sm font-mono tracking-wider">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-950 dark:text-white text-sm sm:text-base">$100K</span>
            <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-widest text-[11px]">Virtual Capital</span>
          </div>

          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 select-none">·</span>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-950 dark:text-white text-sm sm:text-base">5 USDC</span>
            <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-widest text-[11px]">Entry Stake</span>
          </div>

          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 select-none">·</span>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-950 dark:text-white text-sm sm:text-base">Up to 5</span>
            <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-widest text-[11px]">Assets</span>
          </div>

          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 select-none">·</span>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-950 dark:text-white text-sm sm:text-base">Pyth</span>
            <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-widest text-[11px]">Market Data</span>
          </div>
        </div>
      </div>
    </section>
  );
}
