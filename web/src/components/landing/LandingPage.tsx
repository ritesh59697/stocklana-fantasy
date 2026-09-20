"use client";

import React, { useState } from "react";
import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import MarketThesisSection from "./MarketThesisSection";
import HowItWorksSection from "./HowItWorksSection";
import SupportedAssetsStrip from "./SupportedAssetsStrip";
import ProductPreviewSection from "./ProductPreviewSection";
import TechnologyTrustSection from "./TechnologyTrustSection";
import LandingFooter from "./LandingFooter";
import HowItWorksModal from "@/components/HowItWorksModal";

interface LandingPageProps {
  onEnterTournament: () => void;
}

export default function LandingPage({ onEnterTournament }: LandingPageProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#090b10] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-white/20 transition-colors duration-200">
      {/* 00 Navigation with Theme Toggle */}
      <LandingNavbar
        onEnterTournament={onEnterTournament}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
      />

      {/* 01 Hero (Dominant Typography, Panoramic Ticker, Editorial Metadata) */}
      <LandingHero
        onEnterTournament={onEnterTournament}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
      />

      {/* 02 Signature Market Concept ("THE MARKET IS YOUR PLAYING FIELD") */}
      <MarketThesisSection />

      {/* 03 How It Works (Horizontal Editorial Sequence) */}
      <HowItWorksSection />

      {/* 04 Supported Equities (Institutional Market Board) */}
      <SupportedAssetsStrip />

      {/* 05 Product Stage ("YOUR ARENA") */}
      <ProductPreviewSection onEnterTournament={onEnterTournament} />

      {/* 06 Architecture & Disclosures (Concise Tech Strip) */}
      <TechnologyTrustSection />

      {/* 07 Final Editorial CTA & Minimal Footer */}
      <LandingFooter
        onEnterTournament={onEnterTournament}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
      />

      {/* How It Works & Architecture Modal */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        onStartDrafting={() => {
          setShowHowItWorks(false);
          onEnterTournament();
        }}
      />
    </div>
  );
}
