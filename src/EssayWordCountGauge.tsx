import React, { useMemo } from 'react';

export interface EssayWordCountGaugeProps {
  text: string;
  minWords?: number;
  maxWords?: number;
  className?: string;
}

export const EssayWordCountGauge: React.FC<EssayWordCountGaugeProps> = ({
  text,
  minWords = 180,
  maxWords = 220,
  className = '',
}) => {
  // Analyze text stats
  const { words, characters, charactersNoSpaces, paragraphs } = useMemo(() => {
    const trimmed = text.trim();
    const wordList = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const paraList = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0) : [];
    return {
      words: wordList.length,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s+/g, '').length,
      paragraphs: paraList.length,
    };
  }, [text]);

  // Determine status
  const status: 'empty' | 'under' | 'target' | 'over' = useMemo(() => {
    if (words === 0) return 'empty';
    if (words < minWords) return 'under';
    if (words <= maxWords) return 'target';
    return 'over';
  }, [words, minWords, maxWords]);

  // Max scale for the gauge (at least maxWords + 30 or words + 10)
  const scaleMax = Math.max(maxWords + 30, words + 10, 250);

  // Percentage for the gauge bar (0 to 100%)
  const fillPercentage = Math.min(100, Math.max(0, (words / scaleMax) * 100));

  // Range marker positions in percentage
  const minPosPct = (minWords / scaleMax) * 100;
  const maxPosPct = (maxWords / scaleMax) * 100;

  // Words remaining or over
  const wordsNeeded = Math.max(0, minWords - words);
  const wordsOver = Math.max(0, words - maxWords);

  // Gauge styling depending on status
  const statusStyles = {
    empty: {
      color: 'text-[var(--ink3)]',
      bgBar: 'bg-rose-500/80',
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      dotColor: 'bg-rose-500',
      shadow: '',
      label: `0 / ${minWords} words · Target: ${minWords}–${maxWords}`,
      subLabel: `Write at least ${minWords} words to meet the requirement.`,
    },
    under: {
      color: 'text-rose-500',
      bgBar: 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500',
      badgeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-500 dark:text-rose-400',
      dotColor: 'bg-rose-500 animate-pulse',
      shadow: 'shadow-[0_0_12px_rgba(244,63,94,0.35)]',
      label: `${wordsNeeded} more word${wordsNeeded === 1 ? '' : 's'} needed`,
      subLabel: `${words} words written (${Math.round((words / minWords) * 100)}% of minimum)`,
    },
    target: {
      color: 'text-emerald-500',
      bgBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
      dotColor: 'bg-emerald-500 animate-ping',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.45)]',
      label: `Target met (${words} words)`,
      subLabel: `Excellent! Your essay is within the ideal ${minWords}–${maxWords} word range.`,
    },
    over: {
      color: 'text-amber-500',
      bgBar: 'bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500',
      badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400',
      dotColor: 'bg-amber-500',
      shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.35)]',
      label: `${wordsOver} word${wordsOver === 1 ? '' : 's'} over target`,
      subLabel: `Keep it concise. Cambridge B2 penalizes rambling arguments.`,
    },
  }[status];

  return (
    <div
      className={`rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 shadow-lg space-y-4 transition-all duration-300 ${className}`}
      data-testid="essay-word-count-gauge"
    >
      {/* Top Header: Visual Metrics and Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Big Word Count Display */}
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-300 ${
                status === 'target'
                  ? 'text-emerald-500'
                  : status === 'over'
                  ? 'text-amber-500'
                  : status === 'under' && words > 0
                  ? 'text-rose-500'
                  : 'text-[var(--ink)]'
              }`}
            >
              {words}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink3)]">
              words
            </span>
          </div>

          <div className="h-6 w-px bg-[var(--line)] hidden sm:block" />

          {/* Target range pill */}
          <div className="text-xs text-[var(--ink2)] flex items-center gap-1.5 font-medium">
            <span>Target:</span>
            <span className="font-extrabold text-[var(--ink)] bg-[var(--card2)] px-2 py-0.5 rounded-md border border-[var(--line)]">
              {minWords} – {maxWords}
            </span>
          </div>
        </div>

        {/* Live Feedback Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-extrabold transition-all duration-300 ${statusStyles.badgeBg}`}
        >
          <span className="relative flex h-2 w-2">
            {status === 'target' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                status === 'target'
                  ? 'bg-emerald-500'
                  : status === 'over'
                  ? 'bg-amber-500'
                  : status === 'under' && words > 0
                  ? 'bg-rose-500'
                  : 'bg-[var(--ink3)]'
              }`}
            />
          </span>
          <span>{statusStyles.label}</span>
          {status === 'target' && <span className="text-emerald-500 text-sm font-black">✓</span>}
        </div>
      </div>

      {/* Visual Dynamic Gauge Bar with Target Sweet-Spot Zone */}
      <div className="space-y-1.5">
        <div className="relative w-full h-4 sm:h-5 bg-[var(--card2)] rounded-full overflow-hidden border border-[var(--line)] shadow-inner">
          {/* Sweet Spot Target Zone Highlight (180 to 220 words) */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-500/15 border-x border-emerald-500/40 z-0 pointer-events-none"
            style={{
              left: `${minPosPct}%`,
              width: `${maxPosPct - minPosPct}%`,
            }}
            title={`Target Zone: ${minWords} - ${maxWords} words`}
          />

          {/* Dynamic Fill Bar */}
          <div
            className={`h-full rounded-full transition-all duration-300 relative z-10 ${statusStyles.bgBar} ${statusStyles.shadow}`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>

        {/* Gauge Scale Labels & Threshold Marks */}
        <div className="relative w-full h-5 text-[10px] text-[var(--ink3)] font-mono select-none">
          <span className="absolute left-0 top-0">0</span>

          {/* Min Mark (180) */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${minPosPct}%` }}
          >
            <div className="w-0.5 h-1.5 bg-emerald-500/60 mb-0.5" />
            <span
              className={`font-bold ${
                words >= minWords ? 'text-emerald-500 font-extrabold' : 'text-[var(--ink2)]'
              }`}
            >
              {minWords} min
            </span>
          </div>

          {/* Max Mark (220) */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${maxPosPct}%` }}
          >
            <div className="w-0.5 h-1.5 bg-emerald-500/60 mb-0.5" />
            <span
              className={`font-bold ${
                words > maxWords
                  ? 'text-amber-500 font-extrabold'
                  : words >= minWords
                  ? 'text-emerald-500 font-extrabold'
                  : 'text-[var(--ink2)]'
              }`}
            >
              {maxWords} max
            </span>
          </div>

          <span className="absolute right-0 top-0">{scaleMax}+</span>
        </div>
      </div>

      {/* Status Explanatory Subtitle & Detailed Statistics Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-[var(--line)]/60 text-xs">
        <p className="text-[var(--ink2)] flex items-center gap-1.5 leading-tight">
          <span className="text-sm">
            {status === 'target'
              ? '🎯'
              : status === 'over'
              ? '⚠️'
              : words === 0
              ? '✍️'
              : '📝'}
          </span>
          <span>{statusStyles.subLabel}</span>
        </p>

        {/* Quick Auxiliary Stats */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--ink3)] font-medium">
          <span>
            <b className="text-[var(--ink2)]">{characters}</b> chars
          </span>
          <span>•</span>
          <span>
            <b className="text-[var(--ink2)]">{paragraphs}</b> {paragraphs === 1 ? 'para' : 'paras'}
          </span>
          <span>•</span>
          <span>
            ~<b className="text-[var(--ink2)]">{Math.max(1, Math.round(words / 130))}</b> min read
          </span>
        </div>
      </div>
    </div>
  );
};

export default EssayWordCountGauge;
