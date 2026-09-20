"use client";

import { useState, useEffect, useCallback } from "react";
import LandingPage from "@/components/landing/LandingPage";
import TournamentDashboard from "@/components/TournamentDashboard";

export default function Home() {
  const [view, setView] = useState<"landing" | "tournament">("landing");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      const search = window.location.search;
      if (search.includes("mockWallet=true") || search.includes("view=tournament") || search.includes("tab=arena")) {
        setView("tournament");
      }
    }
  }, []);

  // Listen to browser popstate (back / forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const search = window.location.search;
      if (search.includes("view=tournament") || search.includes("mockWallet=true") || search.includes("tab=arena")) {
        setView("tournament");
      } else {
        setView("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleEnterTournament = useCallback(() => {
    setView("tournament");
    if (typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("view", "tournament");
      window.history.pushState({ view: "tournament" }, "", currentUrl.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView("landing");
    if (typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("view");
      // preserve mockWallet param if test environment
      if (!currentUrl.searchParams.has("mockWallet")) {
        window.history.pushState({ view: "landing" }, "", currentUrl.pathname);
      } else {
        window.history.pushState({ view: "landing" }, "", currentUrl.toString());
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Prevent flash before mounted on client
  if (!hasMounted) {
    return (
      <main className="min-h-screen bg-[#090b10] text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>INITIALIZING STOCKLANA PROTOCOL...</span>
        </div>
      </main>
    );
  }

  if (view === "tournament") {
    return <TournamentDashboard onBackToLanding={handleBackToLanding} />;
  }

  return <LandingPage onEnterTournament={handleEnterTournament} />;
}
