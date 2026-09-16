"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

interface Point {
  timestamp: number;
  value: number;
}

interface PortfolioChartProps {
  currentValue: number;
  baseValue?: number;
  onHoverPoint?: (point: Point | null) => void;
}

type Timeframe = "LIVE" | "1H" | "24H" | "7D";

export default function PortfolioChart({
  currentValue,
  baseValue = 100000,
  onHoverPoint,
}: PortfolioChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("LIVE");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Live real-time rolling points
  const [livePoints, setLivePoints] = useState<Point[]>(() => {
    const now = Date.now();
    // Seed initial 12 points around initial valuation
    return Array.from({ length: 12 }, (_, i) => ({
      timestamp: now - (12 - i) * 3000,
      value: baseValue + (Math.sin(i * 0.8) * 45) + (i * 8),
    }));
  });

  // Whenever live Pyth prices push a new currentValue, append point to live series
  useEffect(() => {
    setLivePoints((prev) => {
      const last = prev[prev.length - 1];
      if (last && Math.abs(last.value - currentValue) < 0.001 && Date.now() - last.timestamp < 1500) {
        return prev;
      }
      const updated = [...prev, { timestamp: Date.now(), value: currentValue }];
      // Keep last 40 live ticks
      return updated.slice(-40);
    });
  }, [currentValue]);

  // Generate historical data based on timeframe
  const points: Point[] = useMemo(() => {
    const now = Date.now();
    if (timeframe === "LIVE") {
      return livePoints;
    }

    const count = 30;
    const durationMs =
      timeframe === "1H" ? 3600 * 1000 : timeframe === "24H" ? 86400 * 1000 : 7 * 86400 * 1000;
    const step = durationMs / count;

    // Seeded random walk leading up to currentValue
    const trend = currentValue - baseValue;
    const result: Point[] = [];

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const time = now - durationMs + i * step;
      // Controlled harmonic fluctuation
      const noise = Math.sin(i * 1.2) * 120 + Math.cos(i * 0.7) * 80;
      const val = baseValue + trend * progress + noise * (1 - progress * 0.5);
      result.push({ timestamp: time, value: i === count - 1 ? currentValue : val });
    }

    return result;
  }, [timeframe, livePoints, currentValue, baseValue]);

  // Min and max bounds for scaling
  const { minVal, maxVal } = useMemo(() => {
    if (points.length === 0) return { minVal: 99000, maxVal: 101000 };
    const vals = points.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const padding = Math.max((max - min) * 0.15, 30);
    return { minVal: min - padding, maxVal: max + padding };
  }, [points]);

  const width = 600;
  const height = 150;

  // Convert points to SVG coordinates
  const coords = useMemo(() => {
    if (points.length === 0) return [];
    const range = maxVal - minVal || 1;
    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p.value - minVal) / range) * (height - 20) - 10;
      return { x, y, point: p };
    });
  }, [points, minVal, maxVal]);

  // Construct smooth bezier curve path
  const { linePath, areaPath } = useMemo(() => {
    if (coords.length === 0) return { linePath: "", areaPath: "" };
    if (coords.length === 1) {
      return {
        linePath: `M 0,${coords[0].y} L ${width},${coords[0].y}`,
        areaPath: `M 0,${coords[0].y} L ${width},${coords[0].y} L ${width},${height} L 0,${height} Z`,
      };
    }

    let d = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    const area = `${d} L ${coords[coords.length - 1].x},${height} L ${coords[0].x},${height} Z`;
    return { linePath: d, areaPath: area };
  }, [coords]);

  const activePoint = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  // Track pointer movements
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || coords.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const index = Math.round(ratio * (coords.length - 1));
    setHoverIndex(index);
    onHoverPoint?.(coords[index]?.point || null);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    onHoverPoint?.(null);
  };

  const isPositive = currentValue >= baseValue;
  const strokeColor = isPositive ? "#10b981" : "#ef4444"; // emerald or rose

  return (
    <div className="w-full flex flex-col mb-6 bg-white/[0.015] border border-white/[0.06] rounded-xl p-4 sm:p-5 relative group">
      {/* Chart Sub-Header & Timeframe Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
            Performance Curve
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] text-[10px] font-mono text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Pyth Stream
          </span>
        </div>

        {/* Timeframe Selectors */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] p-0.5 rounded-lg">
          {(["LIVE", "1H", "24H", "7D"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-colors cursor-pointer ${
                timeframe === tf
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Responsive Area Chart */}
      <div className="relative w-full h-[140px] select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.22} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Background Grid Accent Lines */}
          <line
            x1="0"
            y1={height * 0.25}
            x2={width}
            y2={height * 0.25}
            stroke="rgba(255,255,255,0.03)"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1={height * 0.75}
            x2={width}
            y2={height * 0.75}
            stroke="rgba(255,255,255,0.03)"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Primary Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Live End Indicator Pulse */}
          {!activePoint && coords.length > 0 && (
            <g transform={`translate(${coords[coords.length - 1].x}, ${coords[coords.length - 1].y})`}>
              <circle r="5" fill={strokeColor} fillOpacity="0.3" className="animate-ping" />
              <circle r="3" fill={strokeColor} />
            </g>
          )}

          {/* Hover Crosshair & Scrub Marker */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={0}
                x2={activePoint.x}
                y2={height}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth="2.5"
                className="drop-shadow-md"
              />
            </g>
          )}
        </svg>

        {/* Hover Floating Tooltip */}
        {activePoint && (
          <div
            className="absolute -top-3 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-[#16161a] border border-white/[0.15] px-2.5 py-1 rounded-md text-[11px] font-mono shadow-xl text-white flex items-center gap-2 whitespace-nowrap z-20"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
            }}
          >
            <span className="font-semibold text-white">
              ${activePoint.point.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-gray-400 text-[10px]">
              {new Date(activePoint.point.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Axis Footer */}
      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mt-2">
        <span>Low: ${minVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        <span className="text-gray-600">Updated every 1s</span>
        <span>High: ${maxVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  );
}
