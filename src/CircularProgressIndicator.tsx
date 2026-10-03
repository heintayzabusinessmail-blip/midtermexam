import React, { useState } from 'react';

export interface CircularProgressIndicatorProps {
  percentage: number;
  answered: number;
  total: number;
  partsBreakdown?: {
    partNumber: number;
    partTitle: string;
    answered: number;
    total: number;
    isComplete: boolean;
  }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
}

export default function CircularProgressIndicator({
  percentage,
  answered,
  total,
  partsBreakdown = [],
  size = 42,
  strokeWidth = 3.5,
  className = '',
  onClick,
}: CircularProgressIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  // Color scheme dynamically transitioning based on completion
  const getColor = (pct: number) => {
    if (pct >= 100) return '#10b981'; // Emerald 500
    if (pct >= 75) return '#2DD4A7'; // Vibrant Teal
    if (pct >= 40) return '#7C6FF0'; // Purple
    return '#38bdf8'; // Sky Blue
  };

  const ringColor = getColor(clampedPct);

  return (
    <div
      className={`relative inline-flex items-center gap-2.5 ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        onClick={onClick}
        className={`relative flex items-center justify-center cursor-pointer group select-none transition-transform active:scale-95`}
        title={`Exam Completion: ${clampedPct}% (${answered} of ${total} questions answered across all parts)`}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-sm"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Subtle Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[var(--card2)] opacity-80"
          />

          {/* Glowing Animated Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: clampedPct > 0 ? `drop-shadow(0 0 2px ${ringColor}80)` : 'none',
            }}
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {clampedPct >= 100 ? (
            <span className="text-[0.68rem] font-black text-emerald-400 leading-none">✓</span>
          ) : (
            <span className="text-[0.62rem] sm:text-[0.68rem] font-black text-[var(--ink)] tracking-tighter leading-none">
              {clampedPct}%
            </span>
          )}
        </div>
      </div>

      {/* Accompanying Completion Text Info */}
      <div
        onClick={onClick}
        className="hidden sm:flex flex-col cursor-pointer"
        title="Click to view question completion by part"
      >
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-xs font-black text-[var(--ink)]">
            {answered} <span className="text-[var(--ink3)] font-normal">/ {total}</span>
          </span>
          <span
            className={`text-[0.62rem] font-black px-1.5 py-0.5 rounded-full ${
              clampedPct >= 100
                ? 'bg-emerald-500/20 text-emerald-400'
                : clampedPct >= 60
                ? 'bg-[var(--tealsoft)] text-[var(--teal)]'
                : 'bg-[var(--card2)] text-[var(--ink3)]'
            }`}
          >
            {clampedPct >= 100 ? 'All Complete' : `${clampedPct}%`}
          </span>
        </div>
        <span className="text-[0.62rem] font-semibold text-[var(--ink3)] tracking-wider uppercase mt-0.5">
          Exam Progress
        </span>
      </div>

      {/* ================= HOVER POPOVER BREAKDOWN ================= */}
      {showTooltip && partsBreakdown.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[var(--card)] border border-[var(--line2)] rounded-2xl shadow-2xl p-3 z-50 text-xs anim-fade pointer-events-none no-print">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-1.5 mb-2">
            <span className="font-extrabold text-[var(--ink)] text-[0.72rem] uppercase tracking-wider">
              Completion by Part
            </span>
            <span className="font-mono text-[var(--teal)] font-bold text-[0.68rem]">
              {answered}/{total} ({clampedPct}%)
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
            {partsBreakdown.map((pb) => (
              <div
                key={pb.partNumber}
                className="flex items-center justify-between gap-2 text-[0.7rem] p-1 rounded-lg hover:bg-[var(--card2)]"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-3.5 h-3.5 rounded-full text-[0.55rem] font-black flex items-center justify-center ${
                      pb.isComplete
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : pb.answered > 0
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-[var(--card2)] text-[var(--ink3)]'
                    }`}
                  >
                    {pb.isComplete ? '✓' : pb.partNumber}
                  </span>
                  <span className="truncate text-[var(--ink2)] font-medium">
                    P{pb.partNumber}: {pb.partTitle}
                  </span>
                </div>
                <span className={`font-mono font-bold shrink-0 ${pb.isComplete ? 'text-emerald-400' : 'text-[var(--ink3)]'}`}>
                  {pb.answered}/{pb.total}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-1.5 border-t border-[var(--line)] text-[0.62rem] text-[var(--ink3)] text-center">
            {total - answered > 0
              ? `${total - answered} question${total - answered > 1 ? 's' : ''} remaining`
              : '🎉 All questions completed!'}
          </div>
        </div>
      )}
    </div>
  );
}
