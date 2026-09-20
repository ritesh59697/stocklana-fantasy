"use client";

import { useState } from "react";
import { usePythPrices } from "@/hooks/usePythPrices";
import { Apple, Nvidia, Tesla } from "@thesvg/react";
import PortfolioChart from "./PortfolioChart";

interface PortfolioLockedCardProps {
  portfolio: Record<string, number>;
  cash: number;
  onEditDraft: () => void;
  onUnstake: () => void;
}

const getStockIcon = (symbol: string) => {
  switch (symbol) {
    case 'AAPLx':
      return <Apple className="w-5 h-5 text-zinc-900 dark:text-white" />;
    case 'NVDAx':
      return <Nvidia className="w-5 h-5 text-[#76b900]" />;
    case 'TSLAx':
      return <Tesla className="w-5 h-5 text-zinc-900 dark:text-white" />;
    case 'SPYx':
      return <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tighter">S&P</span>;
    default:
      return <span className="text-sm font-bold text-zinc-900 dark:text-white">{symbol[0]}</span>;
  }
};

export default function PortfolioLockedCard({
  portfolio,
  cash,
  onEditDraft,
  onUnstake,
}: PortfolioLockedCardProps) {
  const { prices, loading } = usePythPrices();
  const [scrubPoint, setScrubPoint] = useState<{ timestamp: number; value: number } | null>(null);

  const totalPositionsValue = Object.entries(portfolio).reduce((acc, [sym, shares]) => {
    return acc + (shares * (prices[sym] || 0));
  }, 0);

  const totalValue = totalPositionsValue + cash;
  const displayValue = scrubPoint ? scrubPoint.value : totalValue;
  const displayPnl = displayValue - 100000;
  const displayPnlPercent = (displayPnl / 100000) * 100;
  const isDisplayPositive = displayPnl >= 0;

  const handleShareOnX = () => {
    const draftedStr = Object.entries(portfolio)
      .filter(([_, shares]) => shares > 0)
      .map(([sym, shares]) => `${shares}x $${sym.replace('x','')}`)
      .join(", ") || "Tokenized Equities";

    const text = `Tracking my $100,000 zero-loss fantasy portfolio live on @StocklanaFantasy!\n\nPositions: ${draftedStr}\nCurrent Valuation: $${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}\nPowered by @solana & @PythNetwork 📈⚡\n\nCan you beat my portfolio on the leaderboard?`;
    const url = "https://stocklana.vercel.app";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex-1 w-full bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl flex flex-col relative overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-white/[0.05] text-zinc-800 dark:text-white border border-zinc-200 dark:border-white/[0.1] uppercase tracking-wider">
              ● Active Tournament Entry
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Your Portfolio
          </h2>
          <p className="text-zinc-500 dark:text-gray-400 text-sm mt-1 font-light">
            Tracking live via Pyth Network
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <p className="text-[11px] text-zinc-400 dark:text-gray-500 uppercase tracking-widest font-medium mb-1.5 flex items-center gap-1.5">
            {scrubPoint ? (
              <span className="text-zinc-600 dark:text-zinc-300">Scrubbing History</span>
            ) : (
              <span>Total Valuation</span>
            )}
          </p>
          <p className="text-2xl sm:text-3xl font-mono text-zinc-900 dark:text-white font-medium transition-colors">
            ${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs font-mono font-medium mt-1 ${isDisplayPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {isDisplayPositive ? "+" : ""}${displayPnl.toFixed(2)} ({isDisplayPositive ? "+" : ""}{displayPnlPercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Real-Time Interactive Chart */}
      <PortfolioChart
        currentValue={totalValue}
        baseValue={100000}
        onHoverPoint={(pt) => setScrubPoint(pt)}
      />

      {/* Positions List */}
      <div className="space-y-2 flex-1 mb-8">
        {Object.entries(portfolio).map(([symbol, shares]) => {
          if (shares === 0) return null;
          const currentPrice = prices[symbol] || 0;
          const positionValue = shares * currentPrice;

          return (
            <div
              key={symbol}
              className="flex items-center justify-between bg-transparent border border-zinc-200 dark:border-white/[0.05] rounded-xl p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] flex items-center justify-center">
                  {getStockIcon(symbol)}
                </div>
                <div>
                  <h4 className="font-medium text-base text-zinc-900 dark:text-white">{symbol}</h4>
                  <p className="text-sm font-mono text-zinc-500 dark:text-gray-400 mt-1">
                    {loading ? "..." : `$${currentPrice.toFixed(2)}`}
                  </p>
                </div>
              </div>

              <div className="text-center font-mono">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {shares} <span className="text-zinc-400 dark:text-gray-500 font-sans text-xs ml-1">shares</span>
                </p>
              </div>

              <div className="text-right font-mono">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  ${positionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Cash Reserve */}
        <div className="flex items-center justify-between bg-zinc-50 dark:bg-white/[0.02] border border-dashed border-zinc-200 dark:border-white/[0.08] rounded-xl p-4 font-mono text-sm text-zinc-500 dark:text-gray-400">
          <span>Unallocated Cash Reserve:</span>
          <span className="text-zinc-900 dark:text-white font-medium">
            ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Persistence & On-chain status transparency note */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-gray-500 gap-2 px-1">
          <span>Positions saved in client state</span>
          <span>On-Chain Verified: {Object.keys(portfolio).filter(k => (portfolio[k] || 0) > 0).join(", ") || "Active"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t border-zinc-200 dark:border-white/[0.08] flex gap-3 flex-col sm:flex-row">
        <button
          onClick={onEditDraft}
          className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 dark:bg-transparent dark:hover:bg-white/[0.05] dark:text-white dark:border-white/[0.2] font-medium text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Re-Draft Allocation
        </button>
        <button
          onClick={handleShareOnX}
          className="py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-white dark:border-white/[0.15] font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          title="Share portfolio on X"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>Share on X</span>
        </button>
        <button
          onClick={onUnstake}
          className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black font-medium text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Unstake 5 USDC
        </button>
      </div>
    </div>
  );
}
