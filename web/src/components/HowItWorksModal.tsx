"use client";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDrafting?: () => void;
}

export default function HowItWorksModal({
  isOpen,
  onClose,
  onStartDrafting,
}: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0b0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-left overflow-hidden ring-1 ring-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-all cursor-pointer group"
          aria-label="Close"
        >
          <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-7">
          <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
            Protocol Architecture &amp; Rules
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            How Stocklana Fantasy Works
          </h2>
          <p className="text-sm text-zinc-400 mt-1.5">
            A zero-loss fantasy stock trading protocol powered by Solana &amp; Pyth Network.
          </p>
        </div>

        {/* 3-Step Lifecycle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {/* Step 1 */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-zinc-500 font-semibold">
                  01
                </span>
                <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded">
                  Zero Loss
                </span>
              </div>
              <h3 className="font-semibold text-sm text-white mb-1.5">Stake 5 USDC</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Deposit principal into the Anchor smart vault. Collateral accumulates yield in Kamino liquidity pools.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
              Unstake anytime
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-zinc-500 font-semibold">
                  02
                </span>
                <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded">
                  Token-2022
                </span>
              </div>
              <h3 className="font-semibold text-sm text-white mb-1.5">Draft xStocks</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Draft a virtual portfolio of equities (AAPLx, NVDAx, TSLAx) using $100k tournament capital.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
              SPL Token-2022
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-zinc-500 font-semibold">
                  03
                </span>
                <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded">
                  Yield Pool
                </span>
              </div>
              <h3 className="font-semibold text-sm text-white mb-1.5">Win the Yield</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pyth sub-second oracles update valuations. Top ranked traders win the weekly DeFi yield prize pool.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-300 font-medium">
              $1,450.00 weekly pool
            </div>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="bg-zinc-900/40 border border-zinc-800/70 rounded-xl p-3.5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="space-y-0.5">
            <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Risk Profile</span>
            <div className="text-xs text-zinc-200 font-medium">
              Zero Loss (0%)
            </div>
          </div>
          <div className="space-y-0.5 sm:border-l sm:border-zinc-800/60 sm:pl-3">
            <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Oracle Feed</span>
            <div className="text-xs text-zinc-200 font-medium">
              Pyth Real-Time
            </div>
          </div>
          <div className="space-y-0.5 sm:border-l sm:border-zinc-800/60 sm:pl-3">
            <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Token Type</span>
            <div className="text-xs text-zinc-200 font-medium">
              SPL Token-2022
            </div>
          </div>
          <div className="space-y-0.5 sm:border-l sm:border-zinc-800/60 sm:pl-3">
            <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Deployment</span>
            <div className="text-xs text-zinc-200 font-medium">
              Solana Devnet
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            if (onStartDrafting) onStartDrafting();
          }}
          className="w-full py-3.5 px-6 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-xl transition-all shadow-md shadow-white/5 flex items-center justify-center gap-2 cursor-pointer text-sm active:scale-[0.99]"
        >
          <span>Enter Tournament</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}


