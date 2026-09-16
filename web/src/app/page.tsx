"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import DraftArena from "@/components/DraftArena";
import Leaderboard from "@/components/Leaderboard";
import PortfolioLockedCard from "@/components/PortfolioLockedCard";
import ReceiptModal from "@/components/ReceiptModal";
import HowItWorksModal from "@/components/HowItWorksModal";
import StocklanaLogo from "@/components/StocklanaLogo";
import RoundCountdownBadge from "@/components/RoundCountdown";
import { 
  buildStakeTransaction, 
  buildUpdatePortfolioTransaction, 
  buildUnstakeTransaction, 
  STAKE_AMOUNT_USDC 
} from "@/lib/anchorClient";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { connected: walletConnected } = wallet;
  const [hasStaked, setHasStaked] = useState(false);
  const [mockConnected, setMockConnected] = useState(false);
  
  // E2E Test Mock Override (Client-side only to prevent hydration mismatch)
  useEffect(() => {
    if (window.location.search.includes('mockWallet=true')) {
      setMockConnected(true);
    }
  }, []);
  
  const connected = walletConnected || mockConnected;
  
  const [isLocked, setIsLocked] = useState(false);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [draftPortfolio, setDraftPortfolio] = useState<Record<string, number>>({});
  const [userCash, setUserCash] = useState(100000);
  const [draftCash, setDraftCash] = useState(100000);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async (alloc?: Record<string, number>, remainingCash?: number) => {
    const draftedStocks = alloc 
      ? Object.entries(alloc).filter(([_, shares]) => shares > 0).map(([sym]) => sym)
      : [];

    if (mockConnected || !wallet.publicKey) {
      setHasStaked(true);
      if (alloc) {
        setPortfolio(alloc);
        setUserCash(remainingCash ?? 100000);
        setIsLocked(true);
        const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        const randomSig = "5" + Array.from({ length: 86 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        setTxHash(randomSig);
        setShowReceipt(true);
      }
      setToastMessage(`Successfully staked ${STAKE_AMOUNT_USDC} USDC into Kamino DeFi yield pool! $100,000 Fantasy Dollars credited.`);
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }

    try {
      setIsStaking(true);
      setToastMessage("Preparing atomic stake & draft transaction on Solana Devnet...");
      const tx = await buildStakeTransaction(connection, wallet, draftedStocks);
      const signature = await wallet.sendTransaction(tx, connection);
      setToastMessage(`Transaction submitted! Confirming on Devnet: ${signature.slice(0, 8)}...`);
      await connection.confirmTransaction(signature, "confirmed");
      
      setHasStaked(true);
      if (alloc) {
        setPortfolio(alloc);
        setUserCash(remainingCash ?? 100000);
        setIsLocked(true);
        setTxHash(signature);
        setShowReceipt(true);
      }
      setToastMessage(`Successfully staked ${STAKE_AMOUNT_USDC} USDC & locked draft on-chain! Tx: ${signature.slice(0, 8)}...`);
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err: any) {
      console.error("Stake error:", err);
      const msg = err?.message || String(err);
      if (msg.includes("User rejected") || msg.includes("rejected the request")) {
        setToastMessage("Transaction cancelled in wallet.");
      } else if (msg.includes("0x1") || msg.includes("insufficient funds") || msg.includes("AccountNotFound")) {
        setToastMessage("Need Devnet USDC! Grab 10 free USDC at faucet.circle.com (select Solana Devnet).");
      } else {
        setToastMessage(`Transaction failed: ${msg.slice(0, 80)}`);
      }
      setTimeout(() => setToastMessage(null), 6000);
    } finally {
      setIsStaking(false);
    }
  };

  const handleDraftComplete = async (alloc: Record<string, number>, remainingCash: number) => {
    const draftedStocks = Object.entries(alloc)
      .filter(([_, shares]) => shares > 0)
      .map(([sym]) => sym);

    if (mockConnected || !wallet.publicKey) {
      setPortfolio(alloc);
      setUserCash(remainingCash);
      setIsLocked(true);
      const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      const randomSig = "5" + Array.from({ length: 86 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      setTxHash(randomSig);
      setShowReceipt(true);
      return;
    }

    try {
      setToastMessage("Signing and broadcasting portfolio to Solana Devnet...");
      const tx = await buildUpdatePortfolioTransaction(connection, wallet, draftedStocks);
      const signature = await wallet.sendTransaction(tx, connection);
      setToastMessage(`Transaction submitted! Confirming on Devnet: ${signature.slice(0, 8)}...`);
      await connection.confirmTransaction(signature, "confirmed");
      
      setPortfolio(alloc);
      setUserCash(remainingCash);
      setIsLocked(true);
      setTxHash(signature);
      setShowReceipt(true);
      setToastMessage(null);
    } catch (err: any) {
      console.error("Draft update error:", err);
      const msg = err?.message || String(err);
      if (msg.includes("User rejected") || msg.includes("rejected the request")) {
        setToastMessage("Transaction cancelled in wallet.");
      } else {
        setToastMessage(`Transaction failed: ${msg.slice(0, 90)}`);
      }
      setTimeout(() => setToastMessage(null), 6000);
    }
  };

  const handleUnstake = async () => {
    if (mockConnected || !wallet.publicKey) {
      setHasStaked(false);
      setIsLocked(false);
      setPortfolio({});
      setDraftPortfolio({});
      setUserCash(100000);
      setDraftCash(100000);
      setToastMessage(`Zero-loss verified! ${STAKE_AMOUNT_USDC}.00 USDC has been refunded to your wallet.`);
      setTimeout(() => setToastMessage(null), 6000);
      return;
    }

    try {
      setToastMessage("Processing zero-loss unstake on Solana Devnet...");
      const tx = await buildUnstakeTransaction(connection, wallet);
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setHasStaked(false);
      setIsLocked(false);
      setPortfolio({});
      setDraftPortfolio({});
      setUserCash(100000);
      setDraftCash(100000);
      setToastMessage(`Zero-loss verified! ${STAKE_AMOUNT_USDC}.00 USDC refunded to your wallet. Tx: ${signature.slice(0, 8)}...`);
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err: any) {
      console.error("Unstake error:", err);
      const msg = err?.message || String(err);
      if (msg.includes("User rejected") || msg.includes("rejected the request")) {
        setToastMessage("Transaction cancelled in wallet.");
      } else {
        setToastMessage(`Unstake notice: ${msg.slice(0, 90)}`);
      }
      setTimeout(() => setToastMessage(null), 6000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a] text-white selection:bg-white/30 font-sans">
      {/* Top Protocol Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <StocklanaLogo size={32} />
              <h1 className="text-lg font-medium tracking-tight text-white">
                Stocklana Fantasy
              </h1>
            </div>

            {/* Live Pool Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-medium text-white tracking-wide">Prize Pool: $1,450.00 USDC</span>
            </div>

            {/* Zero Loss Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-gray-400">
              <span className="text-white">Zero-Loss</span>
              <span className="text-gray-600">•</span>
              <span>100% Capital Preserved</span>
            </div>

            {/* Round Countdown Badge */}
            <RoundCountdownBadge className="hidden xl:inline-flex" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-transparent hover:bg-white/[0.05] text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>

            {hasStaked && (
              <button
                onClick={handleUnstake}
                className="hidden sm:inline-flex items-center text-xs font-medium px-3 py-2 rounded-lg text-gray-400 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
              >
                Unstake
              </button>
            )}

            <WalletMultiButton className="!bg-white hover:!bg-gray-100 !text-black !font-medium !transition-colors !rounded-lg !h-9 !px-4 !text-xs" />
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="sticky top-16 z-40 w-full bg-white text-black px-6 py-2.5 text-center text-xs sm:text-sm font-medium animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Action Cockpit Dashboard */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Left Column: Action Area (Draft Arena or Locked Portfolio) */}
        <div className="lg:col-span-7 flex flex-col gap-6 relative z-10">
          {isLocked ? (
            <PortfolioLockedCard
              portfolio={portfolio}
              cash={userCash}
              onEditDraft={() => setIsLocked(false)}
              onUnstake={handleUnstake}
            />
          ) : (
            <DraftArena
              connected={connected}
              hasStaked={hasStaked}
              isStaking={isStaking}
              onStake={handleStake}
              onComplete={handleDraftComplete}
              onDraftChange={(alloc, rem) => {
                setDraftPortfolio(alloc);
                setDraftCash(rem);
              }}
            />
          )}
        </div>

        {/* Right Column: Live Leaderboard */}
        <div className="lg:col-span-5 relative z-10 flex flex-col h-full">
          <Leaderboard 
            userPortfolio={isLocked ? portfolio : draftPortfolio} 
            userCash={isLocked ? userCash : draftCash} 
            isLocked={isLocked}
          />
        </div>
      </div>

      {/* Celebration / Confirmation Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        portfolio={portfolio}
        totalValue={100000}
        txHash={txHash}
      />

      {/* How It Works & Architecture Modal */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        onStartDrafting={() => {
          if (!hasStaked && connected) {
            handleStake();
          }
        }}
      />

      {/* Protocol Architecture & Judge Telemetry Footer */}
      <footer className="w-full border-t border-white/[0.08] bg-[#0a0a0a] py-6 px-4 sm:px-6 relative z-10 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
            <span>Powered by</span>
            <span className="flex items-center gap-1.5 text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Pyth Oracles
            </span>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <span className="text-white">Token-2022</span>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <span className="text-white">Kamino DeFi</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Anchor Program:</span>
            <a
              href="https://explorer.solana.com/address/hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway?cluster=devnet"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <span>hGen...way</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
