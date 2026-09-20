"use client";

import React from "react";
import StocklanaLogo from "@/components/StocklanaLogo";
import ThemeToggle from "@/components/ThemeToggle";

interface LandingNavbarProps {
  onEnterTournament: () => void;
  onOpenHowItWorks: () => void;
}

export default function LandingNavbar({
  onEnterTournament,
  onOpenHowItWorks,
}: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#090b10]/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <StocklanaLogo size={28} />
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white uppercase">
              Stocklana
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tracking-wider uppercase">
              Fantasy
            </span>
          </div>
        </div>

        {/* Center Nav Anchors */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          <a
            href="#assets"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors py-1"
          >
            Assets
          </a>
          <a
            href="#arena"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors py-1"
          >
            Arena
          </a>
          <a
            href="#technology"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors py-1"
          >
            Technology
          </a>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          <button
            onClick={onEnterTournament}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-semibold text-xs tracking-tight active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <span>Enter Tournament</span>
            <span className="text-zinc-400 dark:text-zinc-600 font-mono">→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
