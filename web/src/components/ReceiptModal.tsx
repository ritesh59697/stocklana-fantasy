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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#0c0d12] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center overflow-hidden ring-1 ring-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-36 bg-emerald-500/10 blur-3xl rounded-full" />
        
        {/* Success Icon */}
        <div className="mx-auto w-14 h-14 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1.5 tracking-tight">Portfolio Locked On-Chain!</h3>
        <p className="text-xs text-zinc-400 mb-6">
          Your fantasy portfolio is officially locked into the tournament.
        </p>

        {/* Receipt Details Box */}
        <div className="bg-zinc-900/40 border border-zinc-800/70 rounded-xl p-4 text-left font-mono text-xs space-y-2.5 mb-6">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[11px]">Collateral Staked</span>
            <span className="text-emerald-400 font-medium">100.00 USDC (Zero Loss)</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[11px]">Virtual Allocation</span>
            <span className="text-zinc-100 font-medium">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[11px]">Drafted Positions</span>
            <span className="text-zinc-200">
              {Object.entries(portfolio)
                .filter(([_, shares]) => shares > 0)
                .map(([sym, shares]) => `${shares} ${sym}`)
                .join(", ") || "None"}
            </span>
          </div>
          <div className="border-t border-zinc-800/60 pt-2 flex justify-between items-center text-zinc-400">
            <span className="text-[11px]">Solana Tx Signature</span>
            <a 
              href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} 
              target="_blank" 
              rel="noreferrer"
              className="text-cyan-400/90 hover:text-cyan-300 underline font-mono text-[11px] truncate max-w-[150px]"
            >
              {txHash.slice(0, 8)}...{txHash.slice(-6)}
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer text-sm active:scale-[0.99]"
        >
          View Live Leaderboard
        </button>
      </div>
    </div>
  );
}

