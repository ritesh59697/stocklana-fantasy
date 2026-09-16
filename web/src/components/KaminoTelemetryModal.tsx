"use client";

import React from "react";

interface KaminoTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KaminoTelemetryModal({
  isOpen,
  onClose,
}: KaminoTelemetryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#0b0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-left overflow-hidden ring-1 ring-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-all cursor-pointer group"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
              Solana DeFi Integration
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Kamino DeFi Yield Telemetry
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            How Stocklana Fantasy generates zero-risk prize pools through collateral yield.
          </p>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
          <div className="bg-zinc-900/50 border border-zinc-800 p-3.5 rounded-xl">
            <div className="text-zinc-500 text-[10px] uppercase mb-1">Current APY</div>
            <div className="text-emerald-400 font-semibold text-base">8.42%</div>
            <div className="text-zinc-500 text-[10px] mt-0.5">Kamino JupSOL/USDC</div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-3.5 rounded-xl">
            <div className="text-zinc-500 text-[10px] uppercase mb-1">Active Pool TVL</div>
            <div className="text-white font-semibold text-base">$17,250.00</div>
            <div className="text-zinc-500 text-[10px] mt-0.5">3,450 Stakers</div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-3.5 rounded-xl col-span-2 sm:col-span-1">
            <div className="text-zinc-500 text-[10px] uppercase mb-1">Weekly Prize Pool</div>
            <div className="text-cyan-400 font-semibold text-base">$1,450.00</div>
            <div className="text-zinc-500 text-[10px] mt-0.5">100% Yield Funded</div>
          </div>
        </div>

        {/* Zero-Loss Mechanics Explainer */}
        <div className="space-y-3 bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 text-xs font-mono mb-6">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
              1
            </span>
            <div>
              <span className="text-white font-medium">Principal Isolation:</span>
              <p className="text-zinc-400 text-[11px] mt-0.5 font-sans">
                Your 5 USDC stake is deposited directly into the program vault PDA. It is never used to buy volatile stocks on a DEX.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
              2
            </span>
            <div>
              <span className="text-white font-medium">Virtual Synthetic Market:</span>
              <p className="text-zinc-400 text-[11px] mt-0.5 font-sans">
                Players trade with $100,000 in virtual drafting capital against real-time Pyth oracles. If stock prices crash, your principal is unaffected.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
              3
            </span>
            <div>
              <span className="text-white font-medium">Yield-Only Tournament Rewards:</span>
              <p className="text-zinc-400 text-[11px] mt-0.5 font-sans">
                Only the accrued Kamino DeFi yield is distributed to leaderboard winners. Stakers withdraw 100% of their principal at any time.
              </p>
            </div>
          </div>
        </div>

        {/* On-Chain Vault Anchor Contract Reference */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 mb-6">
          <span>Vault PDA Token Account:</span>
          <a
            href="https://explorer.solana.com/address/38dPemtnG74ruDjMUduHQprjFdkAXA9xxU16j86FJF2k?cluster=devnet"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            38dPemtn...JF2k ↗
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-xl transition-all cursor-pointer text-xs"
        >
          Close Telemetry
        </button>
      </div>
    </div>
  );
}
