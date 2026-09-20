"use client";

import { usePythPrices } from "@/hooks/usePythPrices";
import { useEffect, useState, useMemo } from "react";

export default function Leaderboard({ 
  userPortfolio,
  userCash = 100000,
  isLocked = false,
}: { 
  userPortfolio: Record<string, number>;
  userCash?: number;
  isLocked?: boolean;
}) {
  const { prices, loading, status, error, isSimulated } = usePythPrices();

  // Opponent realistic mock data
  const opponents: Array<{ 
    name: string; 
    portfolio: Record<string, number>; 
    cash: number;
    pnl: string;
    pnlPositive: boolean;
  }> = useMemo(() => [
    { name: "0xC44...99aF", portfolio: { AAPLx: 350, NVDAx: 150, TSLAx: 0, SPYx: 0 }, cash: 5000, pnl: "+2.47%", pnlPositive: true },
    { name: "0x89f...E311", portfolio: { NVDAx: 450, TSLAx: 80, SPYx: 50, AAPLx: 0 }, cash: 1020, pnl: "+0.65%", pnlPositive: true },
    { name: "0xA1b...4c2D", portfolio: { AAPLx: 120, NVDAx: 200, TSLAx: 50, SPYx: 10 }, cash: 2540, pnl: "-1.12%", pnlPositive: false },
  ], []);

  const calculateTotalValue = (portfolio: Record<string, number | undefined>, cashBalance: number) => {
    const assetsValue = Object.entries(portfolio).reduce((acc, [sym, shares]) => {
      return acc + ((shares || 0) * (prices[sym] || 0));
    }, 0);
    return assetsValue + cashBalance;
  };

  const hasDrafted = Object.values(userPortfolio).some(shares => (shares || 0) > 0);
  const userTotalValue = hasDrafted ? calculateTotalValue(userPortfolio, userCash) : 100000;
  const userPnl = userTotalValue - 100000;
  const userPnlPercent = (userPnl / 100000) * 100;

  const leaderboardData = [
    {
      name: "You",
      value: userTotalValue,
      isUser: true,
      unranked: !hasDrafted,
      pnl: `${userPnlPercent >= 0 ? "+" : ""}${userPnlPercent.toFixed(2)}%`,
      pnlPositive: userPnlPercent >= 0,
    },
    ...opponents.map(opp => ({ 
      name: opp.name, 
      value: calculateTotalValue(opp.portfolio, opp.cash), 
      isUser: false, 
      unranked: false,
      pnl: opp.pnl,
      pnlPositive: opp.pnlPositive,
    }))
  ].sort((a, b) => {
    if (a.unranked) return 1;
    if (b.unranked) return -1;
    return b.value - a.value;
  });

  return (
    <div className="flex-1 w-full bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl flex flex-col relative overflow-hidden transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="mb-2">
            <h2 className="text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">Live Leaderboard</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-gray-400 text-xs font-mono">
            {status === "live" ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Live Pyth Hermes Feeds
              </span>
            ) : status === "simulation" ? (
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                ● [DEMO SIMULATION] Synthetic Feeds
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20" title={error || "Price feed unavailable"}>
                ⚠ Pyth Feed Offline (Reference Baseline)
              </span>
            )}
            <span className="text-zinc-300 dark:text-gray-700">•</span>
            <span className="text-zinc-500 dark:text-gray-400">Off-Chain Scoring Demo</span>
          </div>
        </div>

        <div className="text-right">
          {isLocked ? (
            <span className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
              Rank Active
            </span>
          ) : hasDrafted ? (
            <span className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-gray-300 border border-zinc-200 dark:border-white/[0.1] font-medium">
              Live Preview
            </span>
          ) : (
            <span className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.02] text-zinc-500 dark:text-gray-500 border border-zinc-200 dark:border-white/[0.05]">
              Awaiting Draft
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {leaderboardData.map((player, idx) => {
          const isTop = idx === 0 && !player.unranked;
          return (
            <div 
              key={player.name} 
              className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-xl border transition-all duration-300 ${
                player.isUser 
                  ? player.unranked
                    ? "bg-transparent border-zinc-200 dark:border-white/[0.05]"
                    : isLocked 
                      ? "bg-zinc-100 dark:bg-white/[0.05] border-zinc-300 dark:border-white/[0.15] z-10"
                      : "bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.08] z-10"
                  : isTop
                    ? "bg-amber-500/[0.03] dark:bg-gradient-to-r dark:from-amber-500/5 dark:via-transparent dark:to-transparent border-amber-500/20"
                    : "bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-white/[0.02] hover:border-zinc-200 dark:hover:border-white/[0.05]"
              }`}
            >
              {player.isUser && isLocked && (
                <div className="absolute -inset-[1px] rounded-xl border border-emerald-500/30 animate-pulse pointer-events-none" />
              )}
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                  player.unranked
                    ? "bg-zinc-100 dark:bg-white/[0.02] text-zinc-400 dark:text-gray-600 border border-zinc-200 dark:border-white/[0.05]"
                    : isTop 
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20" 
                      : idx === 1 
                        ? "bg-zinc-100 dark:bg-gray-300/10 text-zinc-600 dark:text-gray-400 border border-zinc-300 dark:border-gray-400/20" 
                        : idx === 2 
                          ? "bg-amber-700/10 text-amber-700 dark:text-amber-600 border border-amber-700/20" 
                          : "bg-zinc-100 dark:bg-white/[0.03] text-zinc-500 dark:text-gray-500"
                }`}>
                  {player.unranked ? "—" : `#${idx + 1}`}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm sm:text-base font-mono ${
                      player.isUser 
                        ? (player.unranked ? "text-zinc-500 dark:text-gray-400 font-medium" : "text-zinc-900 dark:text-white font-medium") 
                        : "text-zinc-700 dark:text-gray-300 font-medium"
                    }`}>
                      {player.name}
                    </h3>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                      player.pnlPositive 
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
                        : "text-rose-600 dark:text-red-400 bg-rose-500/10"
                    }`}>
                      {player.pnl}
                    </span>
                  </div>

                  {player.isUser && (
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider mt-1.5 inline-block font-medium ${
                      player.unranked 
                        ? "bg-zinc-100 dark:bg-white/[0.05] text-zinc-500 dark:text-gray-400" 
                        : isLocked
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-zinc-200 dark:bg-white/[0.08] text-zinc-900 dark:text-white"
                    }`}>
                      {player.unranked ? "Draft to rank" : isLocked ? "Portfolio Locked" : "Previewing Draft"}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-zinc-400 dark:text-gray-500 uppercase tracking-widest mb-1 font-medium">
                  Total Value
                </p>
                <p className={`text-base sm:text-xl font-mono font-medium tracking-tight ${
                  player.isUser 
                    ? player.unranked 
                      ? "text-zinc-400 dark:text-gray-500" 
                      : "text-zinc-900 dark:text-white" 
                    : "text-zinc-700 dark:text-gray-300"
                }`}>
                  ${player.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-white/[0.05] text-[11px] font-mono text-zinc-500 dark:text-gray-500 text-center">
        Note: Leaderboard & ranking are computed client-side for demo. Final on-chain settlement planned for future release.
      </div>
    </div>
  );
}
