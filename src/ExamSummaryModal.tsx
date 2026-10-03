import React from 'react';
import { PARTS } from './examData';

export interface ExamSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    got?: number;
    max?: number;
    pct?: number;
    code?: string;
    timeUsed?: number;
    auto?: boolean;
    perPart?: Record<number, { got: number; max: number; n: number; right: number }>;
  };
  studentName?: string;
  studentClass?: string;
  cefrEvaluation: {
    level: string;
    band: string;
    color: string;
    bg: string;
    border: string;
    summary: string;
  };
  onExploreDetails?: () => void;
  onCopyTelegram?: () => void;
}

export default function ExamSummaryModal({
  isOpen,
  onClose,
  result,
  studentName = 'Candidate',
  studentClass,
  cefrEvaluation,
  onExploreDetails,
  onCopyTelegram,
}: ExamSummaryModalProps) {
  if (!isOpen) return null;

  const scoreGot = result.got ?? 0;
  const scoreMax = result.max ?? 50;
  const percentage = result.pct ?? (scoreMax > 0 ? Math.round((scoreGot / scoreMax) * 100) : 0);
  const timeUsedSeconds = result.timeUsed ?? 0;
  const mins = Math.floor(timeUsedSeconds / 60);
  const secs = timeUsedSeconds % 60;
  const autoParts = PARTS.filter((p) => p.code !== 'Essay');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md anim-fade no-print overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[var(--card)] border-2 border-[var(--line2)] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL HEADER WITH CELEBRATION GRADIENT ================= */}
        <div className="relative bg-gradient-to-r from-[#0d9488]/30 via-[#7C6FF0]/30 to-[#F5C542]/20 border-b border-[var(--line)] p-6 sm:p-7 text-center space-y-2">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--card2)]/80 hover:bg-[var(--card2)] border border-[var(--line)] text-[var(--ink2)] hover:text-[var(--ink)] flex items-center justify-center text-sm font-bold transition shadow-sm"
            aria-label="Close summary modal"
          >
            ✕
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card)]/80 border border-[var(--teal)]/40 text-[var(--teal)] text-xs font-black uppercase tracking-wider shadow-sm">
            <span>🎉</span> Exam Completed &amp; Graded
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
            Performance Summary
          </h2>

          <div className="text-xs text-[var(--ink2)] font-medium">
            Candidate: <span className="font-extrabold text-[var(--ink)]">{studentName}</span>
            {studentClass && <span> ({studentClass})</span>} · Exam Code:{' '}
            <span className="font-mono font-bold text-[var(--teal)]">{result.code || 'MT15'}</span>
          </div>
        </div>

        {/* ================= SCROLLABLE CONTENT BODY ================= */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* ================= 1. TOTAL SCORE & CEFR BADGE ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Score & Percentage Card */}
            <div className="bg-[var(--card2)] border border-[var(--line)] rounded-2xl p-5 flex flex-col justify-between text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--teal)]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--ink3)]">
                Auto-Graded Total Score
              </div>
              <div className="my-2">
                <div className="text-4xl sm:text-5xl font-black text-[var(--teal)] tracking-tight">
                  {scoreGot}{' '}
                  <span className="text-xl sm:text-2xl text-[var(--ink3)] font-semibold">/ {scoreMax}</span>
                </div>
                <div className="inline-block mt-2 px-3.5 py-1 rounded-full bg-[var(--teal)]/20 text-[var(--teal)] text-sm font-black shadow-inner">
                  {percentage}% Total Accuracy
                </div>
              </div>
              <div className="text-[0.7rem] text-[var(--ink3)]">
                Completed in {mins}m {secs}s · Parts 1 to 7
              </div>
            </div>

            {/* CEFR Level Assessment Card */}
            <div
              className={`rounded-2xl p-5 border flex flex-col justify-between ${cefrEvaluation.bg} ${cefrEvaluation.border}`}
            >
              <div>
                <div className="text-[0.68rem] font-black uppercase tracking-wider opacity-75 text-[var(--ink3)]">
                  CEFR Level Assessment
                </div>
                <div className={`text-xl sm:text-2xl font-black mt-1 ${cefrEvaluation.color}`}>
                  {cefrEvaluation.level}
                </div>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-[var(--card)]/60 text-xs font-extrabold text-[var(--ink)]">
                  {cefrEvaluation.band}
                </div>
              </div>
              <p className="text-xs text-[var(--ink2)] leading-relaxed mt-3 border-t border-[var(--line)] pt-2.5">
                {cefrEvaluation.summary}
              </p>
            </div>
          </div>

          {/* ================= 2. POINTS EARNED PER EXAM PART ================= */}
          <div className="bg-[var(--card2)] border border-[var(--line)] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
              <h3 className="text-xs sm:text-sm font-black text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
                <span>📊</span> Points Earned Per Exam Part
              </h3>
              <span className="text-[0.68rem] font-bold text-[var(--ink3)]">
                7 Auto-Scored Sections
              </span>
            </div>

            <div className="space-y-3">
              {autoParts.map((part) => {
                const pStat = result.perPart ? result.perPart[part.n] : null;
                const got = pStat?.got ?? 0;
                const max = part.pts || 1;
                const partPct = Math.round((got / max) * 100);
                const isStrong = partPct >= 75;
                const isModerate = partPct >= 50 && partPct < 75;

                return (
                  <div
                    key={part.n}
                    className="p-3 sm:p-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-2 hover:border-[var(--teal)]/40 transition"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-[var(--tealsoft)] text-[var(--teal)] font-mono text-[0.68rem] font-black flex items-center justify-center shrink-0">
                          P{part.n}
                        </span>
                        <div className="truncate">
                          <span className="font-extrabold text-[var(--ink)]">
                            Part {part.n}: {part.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-extrabold text-[var(--ink)] text-xs sm:text-sm">
                          <span className={isStrong ? 'text-[var(--teal)]' : isModerate ? 'text-amber-400' : 'text-rose-400'}>
                            {got}
                          </span>{' '}
                          <span className="text-[var(--ink3)] font-normal text-xs">/ {max} pts</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[0.68rem] font-black ${
                            isStrong
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isModerate
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {partPct}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Meter Bar */}
                    <div className="w-full h-2 rounded-full bg-[var(--card2)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isStrong
                            ? 'bg-gradient-to-r from-teal-400 to-emerald-400'
                            : isModerate
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                            : 'bg-gradient-to-r from-rose-500 to-rose-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, partPct))}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Part 8 Essay Note */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--card)]/60 border border-dashed border-[var(--purple)]/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[var(--purplesoft)] text-[var(--purple)] font-mono text-[0.68rem] font-black flex items-center justify-center shrink-0">
                    P8
                  </span>
                  <div>
                    <span className="font-extrabold text-[var(--ink)]">Part 8: Discursive Essay</span>
                    <span className="text-[var(--ink3)] block text-[0.68rem]">
                      Evaluated by Tr. Hein Tay Za with 4-criteria visual rubric
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--purple)]/20 text-[var(--purple)] text-[0.68rem] font-black">
                  10 pts (Teacher Graded)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODAL FOOTER BUTTONS ================= */}
        <div className="bg-[var(--card2)] border-t border-[var(--line)] p-4 sm:p-5 flex items-center justify-between gap-3 flex-wrap">
          {onCopyTelegram && (
            <button
              type="button"
              onClick={onCopyTelegram}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs hover:brightness-105 transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>📋</span> Copy Report for Telegram
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-xs font-bold text-[var(--ink2)] hover:text-[var(--ink)] hover:border-[var(--line2)] transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onExploreDetails) {
                  onExploreDetails();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] text-xs font-black hover:opacity-95 transition shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <span>🔍</span> View Question-by-Question Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
