"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePythPrices, TOKENIZED_STOCKS } from "@/hooks/usePythPrices";
import { Apple, Nvidia, Tesla } from "@thesvg/react";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

import KaminoYieldCard from "./KaminoYieldCard";

interface DraftArenaProps {
  connected: boolean;
  hasStaked: boolean;
  isStaking?: boolean;
  onStake: (portfolio: Record<string, number>, remainingCash: number) => void;
  onComplete: (portfolio: Record<string, number>, remainingCash: number) => void;
  onDraftChange?: (portfolio: Record<string, number>, remainingCash: number) => void;
  onOpenKaminoTelemetry?: () => void;
}

const getStockIcon = (symbol: string) => {
  switch (symbol) {
    case 'AAPLx':
      return <Apple className="w-5 h-5 text-zinc-900 dark:text-white" />;
    case 'NVDAx':
      return <Nvidia className="w-5 h-5 text-[#76b900]" />; // Nvidia green
    case 'TSLAx':
      return <Tesla className="w-5 h-5 text-zinc-900 dark:text-white" />;
    case 'SPYx':
      return <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tighter">S&P</span>;
    default:
      return <span className="text-sm font-bold text-zinc-900 dark:text-white">{symbol[0]}</span>;
  }
};

export default function DraftArena({
  connected,
  hasStaked,
  isStaking,
  onStake,
  onComplete,
  onDraftChange,
  onOpenKaminoTelemetry,
}: DraftArenaProps) {
  const { prices, loading } = usePythPrices();
  const [allocation, setAllocation] = useState<Record<string, number>>({
    AAPLx: 0,
    NVDAx: 0,
    TSLAx: 0,
    SPYx: 0,
  });
  const budget = 100000;

  const totalSpent = Object.entries(allocation).reduce((acc, [symbol, shares]) => {
    return acc + (shares * (prices[symbol] || 0));
  }, 0);

  const remaining = budget - totalSpent;
  const progressPercent = Math.min(100, (totalSpent / budget) * 100);

  useEffect(() => {
    onDraftChange?.(allocation, remaining);
  }, [allocation, remaining, onDraftChange]);

  const handleBuy = (symbol: string, amount: number = 1) => {
    if (!prices[symbol]) return;
    const price = prices[symbol];
    const maxAffordable = Math.floor(remaining / price);
    const sharesToAdd = Math.min(amount, maxAffordable);
    if (sharesToAdd > 0) {
      setAllocation(prev => ({ ...prev, [symbol]: (prev[symbol] || 0) + sharesToAdd }));
    }
  };

  const handleSell = (symbol: string, amount: number = 1) => {
    const current = allocation[symbol] || 0;
    const sharesToRemove = Math.min(amount, current);
    if (sharesToRemove > 0) {
      setAllocation(prev => ({ ...prev, [symbol]: current - sharesToRemove }));
    }
  };

  const handleAutoBalance = () => {
    const symbols = Object.keys(TOKENIZED_STOCKS);
    const targetPerStock = budget / symbols.length;
    const newAlloc: Record<string, number> = {};
    symbols.forEach(sym => {
      const price = prices[sym] || 100;
      newAlloc[sym] = Math.floor(targetPerStock / price);
    });
    setAllocation(newAlloc);
  };

  const handleReset = () => {
    setAllocation({ AAPLx: 0, NVDAx: 0, TSLAx: 0, SPYx: 0 });
  };

  return (
    <div className="flex-1 w-full bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl flex flex-col relative overflow-hidden transition-colors">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Draft Portfolio
          </h2>
          <p className="text-zinc-500 dark:text-gray-400 text-sm mt-1 font-light">
            Select your tokenized equities to build your roster.
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <p className="text-[11px] text-zinc-400 dark:text-gray-500 uppercase tracking-widest font-medium mb-1.5">
            Purchasing Power
          </p>
          <p className="text-2xl sm:text-3xl font-mono text-zinc-900 dark:text-white font-medium">
            ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Preview Pill or Staking Guarantee Banner */}
      {!connected ? (
        <div className="mb-6 flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] text-xs font-mono text-zinc-600 dark:text-gray-300">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
            <span className="font-medium text-zinc-900 dark:text-white">Interactive Sandbox</span>
            <span className="text-zinc-500 hidden md:inline font-light">• Draft allocation before connecting</span>
          </div>
          <span className="text-zinc-900 dark:text-white text-xs font-medium">$1,450 Prize Pool</span>
        </div>
      ) : !hasStaked ? (
        <KaminoYieldCard className="mb-6" onOpenTelemetry={onOpenKaminoTelemetry} />
      ) : null}

      {/* Budget Progress Bar & Quick Presets */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-2">
            <span>Allocated</span>
            <span className={`font-medium ${progressPercent > 95 ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-gray-300"}`}>
              {progressPercent.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAutoBalance}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              Equal Split
            </button>
            {totalSpent > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/[0.05] rounded-full overflow-hidden">
          <div 
            className="h-full bg-zinc-900 dark:bg-white transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stock Tickers List */}
      <div className="space-y-2 flex-1">
        {Object.values(TOKENIZED_STOCKS).map(stock => {
          const symbol = stock.symbol;
          const price = prices[symbol];
          const shares = allocation[symbol] || 0;
          const value = shares * (price || 0);
          const canBuy = remaining >= (price || Infinity);

          return (
            <div 
              key={symbol} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.05]"
            >
              {/* Token Icon & Info */}
              <div className="flex items-center gap-4 min-w-[220px]">
                <div className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] flex items-center justify-center">
                  {getStockIcon(symbol)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-zinc-900 dark:text-white">{stock.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-gray-400 font-mono">
                      {symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-zinc-500 dark:text-gray-400 font-mono text-sm">
                      {price ? `$${price.toFixed(2)}` : "Fetching..."}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Position Display */}
              <div className="flex items-center justify-between sm:justify-center flex-1">
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white font-mono">
                    {shares} <span className="text-zinc-400 dark:text-gray-500 font-sans text-xs ml-1">shares</span>
                  </span>
                  <span className="text-zinc-500 dark:text-gray-400 text-xs font-mono">
                    ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-1.5 items-center">
                <button 
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/[0.03] text-zinc-700 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white border border-zinc-200/60 dark:border-transparent transition-colors disabled:opacity-30 flex items-center justify-center text-lg font-light cursor-pointer"
                  onClick={() => handleSell(symbol, 1)}
                  disabled={shares === 0 || loading}
                >
                  −
                </button>
                <button 
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/[0.03] text-zinc-700 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white border border-zinc-200/60 dark:border-transparent transition-colors disabled:opacity-30 flex items-center justify-center text-lg font-light cursor-pointer"
                  onClick={() => handleBuy(symbol, 1)}
                  disabled={!canBuy || loading}
                >
                  +
                </button>
                <button 
                  className="px-3 h-8 rounded-full bg-zinc-100 dark:bg-white/[0.03] text-zinc-700 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-white/[0.1] hover:text-zinc-900 dark:hover:text-white border border-zinc-200/60 dark:border-transparent transition-colors disabled:opacity-30 flex items-center justify-center text-xs font-medium cursor-pointer ml-1"
                  onClick={() => handleBuy(symbol, 10)}
                  disabled={!canBuy || loading}
                >
                  +10
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Bottom Action Button */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/[0.08] flex flex-col gap-4">
        {!connected ? (
          <WalletMultiButton className="!w-full !py-4 !h-auto !justify-center !text-sm !font-medium !rounded-xl !bg-zinc-900 hover:!bg-zinc-800 !text-white dark:!bg-white dark:hover:!bg-gray-100 dark:!text-black !transition-colors cursor-pointer">
            Connect Wallet to Enter
          </WalletMultiButton>
        ) : !hasStaked ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (totalSpent === 0 || isStaking) return;
                onStake(allocation, remaining);
              }}
              disabled={totalSpent === 0 || isStaking}
              className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black font-medium rounded-xl transition-colors text-sm disabled:opacity-40 disabled:hover:bg-zinc-900 dark:disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isStaking ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  Staking 5 USDC & Locking Draft...
                </>
              ) : totalSpent === 0 ? (
                "Draft at Least 1 Stock to Enter"
              ) : (
                "Stake 5 USDC & Lock Draft"
              )}
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 dark:text-gray-500 font-mono px-1">
              <span>Deposits into Anchor Vault • Unstake anytime</span>
              <div className="flex items-center gap-3">
                <a 
                  href="https://faucet.solana.com/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white underline transition-colors inline-flex items-center gap-1"
                >
                  Devnet SOL Faucet ↗
                </a>
                <a 
                  href="https://faucet.circle.com/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400/90 dark:hover:text-cyan-300 underline transition-colors inline-flex items-center gap-1"
                >
                  Circle USDC Faucet ↗
                </a>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black font-medium rounded-xl transition-colors text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            onClick={() => onComplete(allocation, remaining)}
            disabled={totalSpent === 0}
          >
            Lock Portfolio On-Chain
          </button>
        )}
      </div>
    </div>
  );
}
