import { useState, useEffect } from "react";
import { HermesClient } from "@pythnetwork/hermes-client";

export interface StockMetadata {
  symbol: string;
  name: string;
  category: string;
  standard: string;
  pythFeedId: string;
}

export const TOKENIZED_STOCKS: Record<string, StockMetadata> = {
  AAPLx: {
    symbol: "AAPLx",
    name: "Apple Inc.",
    category: "Mega-Cap Tech",
    standard: "Token-2022",
    pythFeedId: "49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688",
  },
  NVDAx: {
    symbol: "NVDAx",
    name: "NVIDIA Corp.",
    category: "AI & Chips",
    standard: "Token-2022",
    pythFeedId: "24a68280be3e8db74e92a2a0753232c941e7845dc670987178ee9eb637568578",
  },
  TSLAx: {
    symbol: "TSLAx",
    name: "Tesla Inc.",
    category: "EV & Autonomous",
    standard: "Token-2022",
    pythFeedId: "16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1",
  },
  SPYx: {
    symbol: "SPYx",
    name: "S&P 500 Index",
    category: "Macro Benchmark",
    standard: "Token-2022",
    pythFeedId: "19e09bb805456ada3979a7d1cbb4b6d63babc3a0f8e8a9509f68afa5c4c11cd5",
  },
};

export const STOCKS = Object.fromEntries(
  Object.entries(TOKENIZED_STOCKS).map(([k, v]) => [k, v.pythFeedId])
);

export const FEED_ID_TO_SYMBOL = Object.fromEntries(
  Object.entries(STOCKS).map(([k, v]) => [v, k])
);

export type PythFeedStatus = "live" | "unavailable" | "simulation";

// Reference baseline stock prices used only if network is offline
export const REFERENCE_BASELINE_PRICES: Record<string, number> = {
  AAPLx: 227.40,
  NVDAx: 119.20,
  TSLAx: 221.80,
  SPYx: 564.90,
};

export function usePythPrices() {
  const [prices, setPrices] = useState<Record<string, number>>(REFERENCE_BASELINE_PRICES);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PythFeedStatus>("unavailable");
  const [error, setError] = useState<string | null>(null);
  const [simulationEnabled, setSimulationEnabled] = useState(false);

  useEffect(() => {
    const connection = new HermesClient("https://hermes.pyth.network", {});
    const feedIds = Object.values(STOCKS);

    let active = true;

    const fetchPrices = async () => {
      try {
        const response = await connection.getLatestPriceUpdates(feedIds);
        if (!active) return;
        
        if (response && response.parsed && response.parsed.length > 0) {
          const newPrices: Record<string, number> = {};
          for (const update of response.parsed) {
            const id = update.id.replace(/^0x/, "");
            const symbol = FEED_ID_TO_SYMBOL[id] || FEED_ID_TO_SYMBOL[update.id];
            if (symbol) {
              const priceVal = Number(update.price.price) * Math.pow(10, update.price.expo);
              newPrices[symbol] = priceVal;
            }
          }
          if (Object.keys(newPrices).length > 0) {
            setPrices(newPrices);
            setStatus("live");
            setError(null);
            setLoading(false);
            return;
          }
        }
        throw new Error("Empty price feed response");
      } catch (err: any) {
        if (!active) return;
        setLoading(false);

        // If explicitly requested by user in demo simulation mode, simulate with labeled status
        if (simulationEnabled) {
          setStatus("simulation");
          setError(null);
          setPrices(prev => {
            const updated: Record<string, number> = {};
            for (const [sym, basePrice] of Object.entries(prev)) {
              const delta = (Math.random() - 0.49) * 0.003 * basePrice;
              updated[sym] = Math.round((basePrice + delta) * 100) / 100;
            }
            return updated;
          });
        } else {
          // Honest failure state - never silently fake prices
          setStatus("unavailable");
          setError(err?.message || "Pyth Hermes network feed unreachable");
        }
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000); // 3-second polling for live feeds

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [simulationEnabled]);

  return { 
    prices, 
    loading, 
    status, 
    error,
    isSimulated: status === "simulation",
    simulationEnabled,
    setSimulationEnabled,
  };
}

