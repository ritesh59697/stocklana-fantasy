"use client";

import React from "react";
import StocklanaLogo from "@/components/StocklanaLogo";

interface LandingFooterProps {
  onEnterTournament: () => void;
  onOpenHowItWorks: () => void;
}

export default function LandingFooter({
  onEnterTournament,
  onOpenHowItWorks,
}: LandingFooterProps) {
  return (
    <footer className="relative w-full bg-zinc-100 dark:bg-[#08090d] text-zinc-600 dark:text-zinc-400 font-mono text-xs transition-colors duration-200 overflow-hidden">
      {/* Subtle Market Grid Continuation */}
      <div 
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Dramatic Final CTA Section */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-32 sm:py-48 lg:py-56 text-center flex flex-col items-center">
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tighter text-zinc-950 dark:text-white max-w-5xl leading-[0.92]">
          READY TO PLAY<br />THE MARKET?
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 mt-8 font-light font-sans tracking-tight">
          Build your roster.
        </p>

        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onEnterTournament}
            className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-semibold text-sm tracking-tight active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-black/5 dark:shadow-white/5"
          >
            <span>ENTER TOURNAMENT</span>
            <span className="font-mono">→</span>
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 border border-zinc-300 dark:bg-transparent dark:hover:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white dark:border-white/[0.12] text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            REVIEW RULES
          </button>
        </div>
      </div>

      {/* Minimal Bottom Bar */}
      <div className="relative z-10 border-t border-zinc-200/80 dark:border-white/[0.06] py-8 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <StocklanaLogo size={22} withBadge={false} />
          <span className="text-zinc-900 dark:text-white font-medium">Stocklana Fantasy</span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span>Built on Solana</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-600 dark:text-zinc-400">
          <a
            href="https://explorer.solana.com/address/hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway?cluster=devnet"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            Program: hGen...way ↗
          </a>
          <a
            href="https://github.com/ritesh59697/stocklana-fantasy"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
