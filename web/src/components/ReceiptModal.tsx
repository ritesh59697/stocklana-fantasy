"use client";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Record<string, number>;
  totalValue: number;
  txHash: string;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  portfolio,
  totalValue,
  txHash,
}: ReceiptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gray-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Portfolio Locked On-Chain!</h3>
        <p className="text-sm text-gray-400 mb-6">
          Your fantasy portfolio is officially locked into the tournament.
        </p>

        {/* Receipt Box */}
        <div className="bg-black/50 border border-white/5 rounded-xl p-4 text-left font-mono text-xs space-y-2.5 mb-6">
          <div className="flex justify-between text-gray-400">
            <span>Staked Collateral:</span>
            <span className="text-emerald-400 font-bold">100.00 USDC (Zero Loss)</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Fantasy Allocation:</span>
            <span className="text-white font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Drafted Positions:</span>
            <span className="text-white">
              {Object.entries(portfolio)
                .filter(([_, shares]) => shares > 0)
                .map(([sym, shares]) => `${shares} ${sym}`)
                .join(", ") || "None"}
            </span>
          </div>
          <div className="border-t border-white/10 pt-2 flex justify-between text-gray-400">
            <span>Solana Tx Hash:</span>
            <span className="text-cyan-400 truncate max-w-[140px]">{txHash.slice(0, 8)}...{txHash.slice(-6)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          View Live Leaderboard
        </button>
      </div>
    </div>
  );
}
