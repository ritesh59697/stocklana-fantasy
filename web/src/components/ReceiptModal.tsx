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

  const handleShareOnX = () => {
    const draftedStr = Object.entries(portfolio)
      .filter(([_, shares]) => shares > 0)
      .map(([sym, shares]) => `${shares}x $${sym.replace('x','')}`)
      .join(", ") || "Tokenized Equities";

    const text = `Just locked my $100,000 zero-loss fantasy stock draft on @StocklanaFantasy!\n\nPortfolio: ${draftedStr}\nStaked: 5.00 USDC in Kamino DeFi Vault\nOracles: @PythNetwork sub-second price feeds 📈⚡\n\nCan you beat my portfolio on @solana?`;
    const url = "https://stocklana.vercel.app";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0b0c10] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden ring-1 ring-zinc-950/5 dark:ring-white/5 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-emerald-50 dark:bg-zinc-800 border border-emerald-200 dark:border-zinc-700/80 flex items-center justify-center text-emerald-600 dark:text-zinc-100">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white mb-1.5 tracking-tight">Portfolio Locked On-Chain!</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          Your fantasy portfolio is officially locked into the tournament.
        </p>

        {/* Receipt Details Box */}
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/70 rounded-xl p-4 text-left font-mono text-xs space-y-2.5 mb-6">
          <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
            <span className="text-[11px]">Collateral Staked</span>
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">5.00 USDC (Zero Loss)</span>
          </div>
          <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
            <span className="text-[11px]">Virtual Allocation</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
            <span className="text-[11px]">Drafted Positions</span>
            <span className="text-zinc-800 dark:text-zinc-200">
              {Object.entries(portfolio)
                .filter(([_, shares]) => shares > 0)
                .map(([sym, shares]) => `${shares} ${sym}`)
                .join(", ") || "None"}
            </span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800/60 pt-2 flex justify-between items-center text-zinc-500 dark:text-zinc-400">
            <span className="text-[11px]">Solana Tx Signature</span>
            <a 
              href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white underline font-mono text-[11px] truncate max-w-[150px]"
            >
              {txHash.slice(0, 8)}...{txHash.slice(-6)}
            </a>
          </div>
        </div>

        {/* Action Buttons: Viral X Share + View Leaderboard */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleShareOnX}
            className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white font-medium rounded-xl dark:border-zinc-700/80 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold rounded-xl transition-all text-xs cursor-pointer active:scale-[0.99]"
          >
            View Live Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

