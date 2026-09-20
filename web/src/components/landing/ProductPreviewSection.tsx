"use client";

import React from "react";
import { Apple, Nvidia, Tesla } from "@thesvg/react";

interface ProductPreviewSectionProps {
  onEnterTournament: () => void;
}

export default function ProductPreviewSection({ onEnterTournament }: ProductPreviewSectionProps) {
  return (
    <section id="arena" className="w-full py-24 sm:py-36 lg:py-44 border-b border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-[#090b10] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-20">
          <div>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tighter text-zinc-950 dark:text-white leading-none">
              YOUR ARENA
            </h2>
            <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 font-light mt-4 tracking-tight">
              Draft. Lock. Compete.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono mt-3">
              See the arena before entering: full portfolio roster, live price feeds, and tournament standings.
            </p>
          </div>

          <button
            onClick={onEnterTournament}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-semibold text-xs tracking-tight transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto shadow-md shadow-black/5"
          >
            <span>ENTER TOURNAMENT</span>
            <span className="font-mono text-zinc-400 dark:text-zinc-600">→</span>
          </button>
        </div>

        {/* Immersive Full-Width Product Stage */}
        <div className="w-full border border-zinc-200/90 dark:border-white/[0.1] rounded-2xl bg-zinc-50 dark:bg-[#0b0d13] overflow-hidden shadow-2xl shadow-black/5 dark:shadow-2xl dark:shadow-black/70">
          {/* Terminal Titlebar */}
          <div className="h-12 px-6 bg-zinc-100 dark:bg-[#07080c] border-b border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
              </div>
              <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300 font-medium ml-2">
                STOCKLANA TERMINAL // LIVE TOURNAMENT COCKPIT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.08] text-xs font-mono text-zinc-800 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Prize Pool: $1,450.00 USDC</span>
              </div>
              <span className="hidden sm:inline text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800/80 px-2 py-0.5 rounded">
                Round #1 Active
              </span>
            </div>
          </div>

          {/* Cockpit Stage Inner Grid */}
          <div className="p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-[#090b10]">
            {/* Left Col: Draft Portfolio Stage */}
            <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-white/[0.06] pb-8 lg:pb-0 lg:pr-8">
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight">
                      Draft Portfolio
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                      Equally weighted 4-asset roster (99.4% capital deployed)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 dark:text-zinc-400 block">
                      Purchasing Power
                    </span>
                    <span className="text-xl sm:text-2xl font-mono text-zinc-950 dark:text-white font-medium">
                      $100,000.00
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800/80 h-1.5 rounded-full overflow-hidden mb-6">
                  <div className="bg-emerald-500 h-full rounded-full w-[99.4%]" />
                </div>

                {/* Asset Rows */}
                <div className="flex flex-col divide-y divide-zinc-200 dark:divide-white/[0.04]">
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-transparent flex items-center justify-center">
                        <Apple className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">AAPLx</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 font-mono">109 shares</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">$24,786.60</span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-transparent flex items-center justify-center">
                        <Nvidia className="w-3.5 h-3.5 text-[#76b900]" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">NVDAx</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 font-mono">209 shares</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">$24,912.80</span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-transparent flex items-center justify-center">
                        <Tesla className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">TSLAx</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 font-mono">112 shares</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">$24,841.60</span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-transparent flex items-center justify-center">
                        <span className="text-[10px] font-bold text-zinc-900 dark:text-white">S&P</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">SPYx</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 font-mono">44 shares</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">$24,855.60</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <span>Remaining Cash: $603.40</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready to Lock</span>
              </div>
            </div>

            {/* Right Col: Leaderboard Preview Stage */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight">
                      Leaderboard
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                      Tournament standings preview
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                    Demo Mode
                  </span>
                </div>

                {/* Standings Rows */}
                <div className="flex flex-col divide-y divide-zinc-200 dark:divide-white/[0.04]">
                  <div className="py-3 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-amber-600 dark:text-amber-400">1</span>
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">0x8a2f...4d91</span>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">+$1,420.50 (+1.42%)</span>
                  </div>

                  <div className="py-3 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-zinc-500 dark:text-zinc-400">2</span>
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">0x3e1b...99c4</span>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">+$980.20 (+0.98%)</span>
                  </div>

                  {/* Active Entry */}
                  <div className="py-3 px-2 rounded bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-between font-mono border border-emerald-200 dark:border-transparent">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-emerald-600 dark:text-emerald-400">3</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-900 dark:text-white font-bold">You</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">ACTIVE</span>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">+$740.00 (+0.74%)</span>
                  </div>

                  <div className="py-3 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-zinc-500 dark:text-zinc-400">4</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">0x91d2...c770</span>
                    </div>
                    <span className="text-xs text-rose-600 dark:text-rose-400">-$320.10 (-0.32%)</span>
                  </div>
                </div>
              </div>

              {/* Honest Demo Disclosure */}
              <div className="mt-8 p-4 rounded-xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/[0.06] text-xs text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
                <span className="text-zinc-900 dark:text-zinc-200 font-semibold">Demo Transparency Notice:</span> Leaderboard and prize settlement are currently demo functionality. On-chain settlement is planned for a future release.
              </div>
            </div>
          </div>

          {/* Stage Bottom Action Bar */}
          <div className="p-6 bg-zinc-100 dark:bg-[#07080c] border-t border-zinc-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
              Zero-loss principal held securely in Solana Devnet smart vault
            </span>

            <button
              onClick={onEnterTournament}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-semibold text-xs tracking-tight transition-colors cursor-pointer"
            >
              <span>ENTER TOURNAMENT →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
