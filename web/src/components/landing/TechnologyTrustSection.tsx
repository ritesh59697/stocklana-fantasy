"use client";

import React from "react";

export default function TechnologyTrustSection() {
  return (
    <section id="technology" className="w-full py-16 sm:py-20 border-b border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#08090d] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 font-mono">
        {/* Strip Header */}
        <span className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block mb-6">
          BUILT ON SOLANA
        </span>

        {/* Technical Stack Horizontal Strip */}
        <div className="py-5 border-y border-zinc-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-y-4 gap-x-8 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-zinc-950 dark:text-white tracking-tight">SOLANA</span>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">Devnet Base Layer</span>
          </div>

          <span className="hidden md:inline text-zinc-300 dark:text-zinc-700 select-none">·</span>

          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-zinc-950 dark:text-white tracking-tight">ANCHOR</span>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">Smart Contracts & PDA</span>
          </div>

          <span className="hidden md:inline text-zinc-300 dark:text-zinc-700 select-none">·</span>

          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-zinc-950 dark:text-white tracking-tight">PYTH</span>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">Live Market Feeds</span>
          </div>

          <span className="hidden md:inline text-zinc-300 dark:text-zinc-700 select-none">·</span>

          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-zinc-950 dark:text-white tracking-tight">TOKEN-2022</span>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">Equity Standard</span>
          </div>
        </div>

        {/* Integrations & Planned Tech */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">Kamino</span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span>Yield integration planned.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span>Devnet Program:</span>
            <a
              href="https://explorer.solana.com/address/hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway?cluster=devnet"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-900 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 underline underline-offset-4 transition-colors break-all"
            >
              hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway ↗
            </a>
          </div>
        </div>

        {/* Honest Disclosure */}
        <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-white/[0.04] flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1.5 shrink-0" />
          <p className="leading-relaxed">
            Leaderboard and prize settlement are currently demo functionality. On-chain settlement is planned for a future release.
          </p>
        </div>
      </div>
    </section>
  );
}
