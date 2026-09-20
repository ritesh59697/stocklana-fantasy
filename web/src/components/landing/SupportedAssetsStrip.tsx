"use client";

import React from "react";
import { usePythPrices, TOKENIZED_STOCKS } from "@/hooks/usePythPrices";
import { Apple, Nvidia, Tesla } from "@thesvg/react";

const getStockIcon = (symbol: string) => {
  switch (symbol) {
    case "AAPLx":
      return <Apple className="w-4 h-4 text-zinc-900 dark:text-white" />;
    case "NVDAx":
      return <Nvidia className="w-4 h-4 text-[#76b900]" />;
    case "TSLAx":
      return <Tesla className="w-4 h-4 text-zinc-900 dark:text-white" />;
    case "SPYx":
      return <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-tighter">S&P</span>;
    default:
      return <span className="text-xs font-bold text-zinc-900 dark:text-white">{symbol[0]}</span>;
  }
};

export default function SupportedAssetsStrip() {
  const { prices, status } = usePythPrices();

  return (
    <section id="assets" className="w-full py-24 sm:py-36 lg:py-44 border-b border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#08090d] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-zinc-950 dark:text-white">
              Supported Tokenized Equities
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 mt-4 font-light max-w-xl leading-relaxed">
              Real-world equity assets quoted via Pyth Hermes oracles under Solana Token-2022 standards.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
            <span className="text-zinc-500 dark:text-zinc-400">Oracle:</span>
            {status === "live" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pyth Hermes Live
              </span>
            ) : status === "simulation" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Simulation Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                Baseline Reference Mode
              </span>
            )}
          </div>
        </div>

        {/* Financial Terminal Market Board */}
        <div className="w-full border-t border-zinc-300 dark:border-white/[0.1] overflow-x-auto">
          {/* Table Header Bar */}
          <div className="min-w-[680px] grid grid-cols-12 py-3 px-4 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-widest border-b border-zinc-200/80 dark:border-white/[0.06]">
            <div className="col-span-5">Ticker / Company</div>
            <div className="col-span-3">Sector Category</div>
            <div className="col-span-2">Standard</div>
            <div className="col-span-2 text-right">Market Price</div>
          </div>

          {/* Table Rows */}
          {Object.entries(TOKENIZED_STOCKS).map(([symbol, meta]) => {
            const price = prices[symbol];
            return (
              <div
                key={symbol}
                className="min-w-[680px] grid grid-cols-12 items-center py-6 sm:py-7 px-4 border-b border-zinc-200/80 dark:border-white/[0.06] hover:bg-zinc-100/60 dark:hover:bg-white/[0.02] transition-colors"
              >
                {/* Symbol & Name */}
                <div className="col-span-5 flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded bg-zinc-100 dark:bg-white/[0.05] border border-zinc-300 dark:border-white/[0.08] flex items-center justify-center shrink-0">
                    {getStockIcon(symbol)}
                  </div>
                  <div>
                    <div className="text-base font-bold text-zinc-950 dark:text-white font-mono tracking-tight">
                      {symbol}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 font-normal mt-0.5">
                      {meta.name}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-3 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                  {meta.category}
                </div>

                {/* Token Standard */}
                <div className="col-span-2">
                  <span className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] px-2.5 py-1 rounded border border-zinc-300 dark:border-white/[0.08]">
                    {meta.standard}
                  </span>
                </div>

                {/* Price Column */}
                <div className="col-span-2 text-right">
                  <span className="text-lg sm:text-xl font-mono font-semibold text-zinc-950 dark:text-white tracking-tight">
                    {price && price > 0 ? `$${price.toFixed(2)}` : "Unavailable"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Offline Disclaimer Notice */}
        {status !== "live" && (
          <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-6">
            Notice: Pyth feed is currently in baseline reference mode. Quoted prices reflect verified protocol reference benchmarks.
          </p>
        )}
      </div>
    </section>
  );
}
