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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gray-900/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.15)] text-left overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-base"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            ● Protocol Architecture & Rules
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Stocklana Fantasy Works
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            The zero-loss fantasy stock trading dApp on Solana.
          </p>
        </div>

        {/* 3-Step Lifecycle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Step 1 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-white mb-1.5">Stake 100 USDC</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Deposit collateral into the Anchor vault. Funds generate DeFi yield in Kamino. 
                <span className="text-emerald-400 font-semibold block mt-1">Zero principal risk.</span>
              </p>
            </div>
            <span className="text-[10px] font-mono text-gray-500 mt-3 pt-2 border-t border-white/5">
              Unstake Anytime
            </span>
          </div>

          {/* Step 2 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-white mb-1.5">Draft $100k xStocks</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive $100,000 in virtual capital to draft Token-2022 equities: AAPLx, NVDAx, TSLAx, SPYx.
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400/80 mt-3 pt-2 border-t border-white/5">
              SPL Token-2022
            </span>
          </div>

          {/* Step 3 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-white mb-1.5">Win the Yield</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pyth Network oracles update portfolio valuations live. The top ranked traders win the collective DeFi yield pool.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-3 pt-2 border-t border-white/5">
              $1,450.00 Prize Pool
            </span>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Principal Risk</span>
            <span className="text-emerald-400 font-bold">0% (Zero Loss)</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Oracle Speed</span>
            <span className="text-cyan-400 font-bold">Sub-Second Pyth</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Asset Standard</span>
            <span className="text-white font-bold">Token-2022</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Network</span>
            <span className="text-purple-400 font-bold">Solana Devnet</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            if (onStartDrafting) onStartDrafting();
          }}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
        >
          Got It, Enter Tournament →
        </button>
      </div>
    </div>
  );
}
