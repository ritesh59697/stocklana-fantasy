"use client";

import React, { useMemo } from "react";
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

export default function MarketThesisSection() {
  const { prices, status } = usePythPrices();

  // Equal weight portfolio distribution for the signature visual
  const allocationData = useMemo(() => {
    const symbols = Object.keys(TOKENIZED_STOCKS);
    const targetPerStock = 25000;
    return symbols.map((sym) => {
      const price = prices[sym] || 0;
      const shares = price > 0 ? Math.floor(targetPerStock / price) : 0;
      const total = shares * price;
      return {
        symbol: sym,
        name: TOKENIZED_STOCKS[sym]?.name || sym,
        price,
        shares,
        total,
        weight: 25,
      };
    });
  }, [prices]);

  return (
    <section id="market" className="w-full py-24 sm:py-36 lg:py-44 border-b border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#08090d] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Split Layout: Large Typography Left + Seamless Integrated Market Trajectory Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Signature Typography */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tighter text-zinc-950 dark:text-white leading-[0.94]">
              THE MARKET<br />
              IS YOUR<br />
              <span className="text-zinc-400 dark:text-zinc-500 font-light">PLAYING FIELD.</span>
            </h2>

            <p className="mt-8 sm:mt-10 text-base sm:text-lg text-zinc-700 dark:text-zinc-300 font-light leading-relaxed max-w-lg">
              No artificial algorithms. No synthetic memecoins. Stocklana translates live Wall Street equity movements directly into competitive fantasy tournament scoring.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col gap-3.5 text-xs font-mono text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Zero-loss principal held in Anchor smart vault</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Pyth Hermes live sub-second market data</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>SPL Token-2022 tokenized equities standard</span>
              </div>
            </div>
          </div>

          {/* Right Column: Seamless Integrated Performance Curve (No Boxed Card!) */}
          <div className="lg:col-span-6 flex flex-col pt-2 lg:pt-4">
            <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-1">
                  Model Portfolio Performance
                </span>
                <span className="text-3xl sm:text-5xl font-mono text-zinc-950 dark:text-white font-medium tracking-tight">
                  $100,000.00
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-1">
                  Feed Status
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {status === "live" ? "● PYTH ACTIVE" : "● BASELINE REF"}
                </span>
              </div>
            </div>

            {/* Trajectory Canvas (Integrated into Composition) */}
            <div className="relative w-full h-52 sm:h-64 lg:h-72 overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 160">
                <defs>
                  <linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <pattern id="marketGrid" width="50" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" className="stroke-zinc-200/80 dark:stroke-white/[0.04]" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Grid */}
                <rect width="500" height="160" fill="url(#marketGrid)" />

                {/* Baseline $100K Guideline */}
                <line x1="0" y1="110" x2="500" y2="110" className="stroke-zinc-300 dark:stroke-white/[0.12]" strokeDasharray="4 4" strokeWidth="1" />
                <text x="8" y="104" className="fill-zinc-500 dark:fill-white/40" fontSize="9" fontFamily="monospace">
                  BASE $100,000.00
                </text>

                {/* Shaded Area */}
                <path
                  d="M 0 110 Q 90 120, 170 95 T 320 65 T 440 35 L 500 28 L 500 160 L 0 160 Z"
                  fill="url(#marketFill)"
                />

                {/* Trajectory Stroke */}
                <path
                  d="M 0 110 Q 90 120, 170 95 T 320 65 T 440 35 L 500 28"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Live Head Pulse */}
                <circle cx="500" cy="28" r="4" fill="#10b981" />
                <circle cx="500" cy="28" r="8" fill="#10b981" opacity="0.35" className="animate-ping" />
              </svg>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <span>INITIAL CAPITAL: $100,000.00</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+1.42% TOURNAMENT DELTA</span>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Allocation Wall */}
        <div className="mt-20 pt-10 border-t border-zinc-200/80 dark:border-white/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-medium">
              Roster Weight Allocation
            </span>
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
              4 of 5 Slots Filled • 100% Capital Deployed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allocationData.map((item) => (
              <div key={item.symbol} className="flex flex-col py-2 border-b sm:border-b-0 sm:border-r border-zinc-200/80 dark:border-white/[0.06] last:border-r-0 pr-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-zinc-200/70 dark:bg-white/[0.06] flex items-center justify-center">
                      {getStockIcon(item.symbol)}
                    </div>
                    <span className="text-sm font-bold text-zinc-950 dark:text-white font-mono">{item.symbol}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">25.0%</span>
                </div>

                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-xl font-medium text-zinc-950 dark:text-white tracking-tight">
                    {item.price > 0 ? `$${item.price.toFixed(2)}` : "Unavailable"}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.shares} shares</span>
                </div>

                {/* Minimalist Progress Meter */}
                <div className="w-full bg-zinc-200 dark:bg-white/[0.08] h-1 rounded-full overflow-hidden mt-3">
                  <div className="bg-emerald-500 h-full w-1/4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
