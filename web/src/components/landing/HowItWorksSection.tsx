"use client";

import React from "react";

const STEPS = [
  {
    step: "01",
    title: "Stake",
    metric: "5 USDC",
    description: "Deposit 5 USDC entry principal into the Anchor vault. Zero loss of capital with 100% preservation.",
  },
  {
    step: "02",
    title: "Draft",
    metric: "$100K",
    description: "Allocate $100,000 virtual tournament capital across up to 5 supported tokenized equities.",
  },
  {
    step: "03",
    title: "Lock",
    metric: "FINAL",
    description: "Commit and lock your chosen roster on-chain before round kickoff to establish initial valuations.",
  },
  {
    step: "04",
    title: "Compete",
    metric: "MARKET",
    description: "Track live portfolio valuation powered by Pyth feeds and benchmark against the tournament leaderboard.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-24 sm:py-36 lg:py-44 border-b border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-[#090b10] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-start max-w-2xl mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-zinc-950 dark:text-white">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 mt-4 font-light leading-relaxed">
            A continuous four-stage lifecycle from entry deposit to live performance tracking.
          </p>
        </div>

        {/* Continuous Lifecycle Timeline (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="relative pl-12 md:pl-0">
          {/* Mobile Vertical Connecting Line */}
          <div className="md:hidden absolute left-4 top-4 bottom-4 w-[1px] bg-zinc-300 dark:bg-white/[0.12]" />

          {/* Desktop Horizontal Connecting Line */}
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-[1px] bg-zinc-300 dark:bg-white/[0.12] z-0" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
            {STEPS.map((s) => (
              <div key={s.step} className="relative flex flex-col items-start text-left">
                {/* Step Node Marker */}
                <div className="absolute -left-12 top-0 md:static w-8 h-8 md:w-12 md:h-12 rounded-full bg-white dark:bg-[#090b10] border border-zinc-300 dark:border-white/[0.16] flex items-center justify-center font-mono font-semibold text-xs md:text-sm text-zinc-950 dark:text-white md:mb-6 shrink-0 shadow-sm">
                  {s.step}
                </div>

                <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
                  <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight">
                    {s.title}
                  </h3>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                    {s.metric}
                  </span>
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-light leading-relaxed mt-3 max-w-xs">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
