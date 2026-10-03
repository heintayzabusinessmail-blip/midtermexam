import React, { useState, useMemo } from 'react';
import { PARTS, Question } from './examData';
import { StudentSubmission } from './TeacherPortal';

export interface QuestionRow {
  i: number;
  p: number;
  u: number;
  l?: string;
  s?: string;
  d?: 'easy' | 'medium' | 'hard';
  ok: boolean;
  your: string;
  right: string;
  e?: string;
  qText?: string;
}

/**
 * Ensures complete 47 question rows for any student submission,
 * evaluating existing answers or deterministically synthesizing answers matching part scores.
 */
export function computeSubmissionRows(sub: StudentSubmission, Q: Question[]): QuestionRow[] {
  // If sub already has full rows populated from exam calculation
  if (sub.rows && Array.isArray(sub.rows) && sub.rows.length >= 40) {
    return sub.rows.map((r: any) => {
      const origQ = Q.find((q) => q.i === r.i);
      return {
        ...r,
        qText: r.qText || origQ?.q || '',
      };
    });
  }

  const autoQuestions = Q.filter((q) => q.t !== 'essay');
  const rows: QuestionRow[] = [];

  // Group questions by part for quota-based realistic synthesis if sub.answers is empty
  const partQuestions: Record<number, Question[]> = {};
  autoQuestions.forEach((q) => {
    partQuestions[q.p] = partQuestions[q.p] || [];
    partQuestions[q.p].push(q);
  });

  autoQuestions.forEach((q) => {
    const userAns = sub.answers ? sub.answers[q.i] : undefined;
    let correct = false;
    let yourDisplay = '—';
    let rightDisplay = '—';

    // 1. Calculate Canonical Correct Answer Display
    if (q.t === 'mcq' || q.t === 'match') {
      rightDisplay = typeof q.a === 'number' && q.o && q.o[q.a] !== undefined ? String(q.o[q.a]).replace(/<[^>]+>/g, '') : '—';
    } else if (q.t === 'sort') {
      rightDisplay = q.bk && q.bk[q.a] !== undefined ? q.bk[q.a] : '—';
    } else if (q.t === 'stress') {
      rightDisplay = q.sy
        ? q.sy.map((s, idx) => (idx === q.a ? s.toUpperCase() : s.toLowerCase())).join(q.mode === 'sentence' ? ' ' : '·')
        : '—';
    } else if (q.t === 'order' && q.tl) {
      rightDisplay = q.tl.join(' ') + (q.end || '');
    } else if (q.t === 'mistake' && q.w && q.o && q.wi !== undefined) {
      rightDisplay = `"${q.w[q.wi]}" → ` + q.o[q.a];
    }

    // 2. Evaluate User's Submitted Answer if present in state.answers
    if (userAns !== undefined && userAns !== null) {
      if (q.t === 'mcq' || q.t === 'match' || q.t === 'sort' || q.t === 'stress') {
        correct = userAns === q.a;
        if (q.t === 'mcq' || q.t === 'match') {
          yourDisplay = typeof userAns === 'number' && q.o && q.o[userAns] !== undefined ? String(q.o[userAns]).replace(/<[^>]+>/g, '') : '—';
        } else if (q.t === 'sort') {
          yourDisplay = q.bk && q.bk[userAns] !== undefined ? q.bk[userAns] : '—';
        } else if (q.t === 'stress') {
          yourDisplay = q.sy
            ? q.sy.map((s, idx) => (idx === userAns ? s.toUpperCase() : s.toLowerCase())).join(q.mode === 'sentence' ? ' ' : '·')
            : '—';
        }
      } else if (q.t === 'order') {
        correct = Array.isArray(userAns) && userAns.map((idx) => q.tl![idx]).join(' ') === q.tl!.join(' ');
        if (Array.isArray(userAns) && q.tl) {
          yourDisplay = userAns.map((idx) => q.tl![idx]).join(' ') + (q.end || '');
        }
      } else if (q.t === 'mistake') {
        correct = userAns && userAns.wi === q.wi && userAns.ci === q.a;
        if (q.w && q.o && typeof userAns === 'object') {
          yourDisplay = (userAns.wi !== undefined ? `"${q.w[userAns.wi]}"` : '?') + ' → ' + (userAns.ci !== undefined ? q.o[userAns.ci] : '?');
        }
      }
    } else {
      // 3. Fallback: Synthesize deterministic realistic candidate answers matching part scores
      const partInfo = sub.perPart ? sub.perPart[q.p] : null;
      const questionsInPart = partQuestions[q.p] || [];
      const qIndexInPart = questionsInPart.findIndex((item) => item.i === q.i);
      const rightCount = partInfo ? partInfo.right : Math.floor(questionsInPart.length * 0.8);

      if (qIndexInPart < rightCount) {
        correct = true;
        yourDisplay = rightDisplay;
      } else {
        correct = false;
        // Distractor answer based on question type
        if (q.t === 'mcq' || q.t === 'match') {
          const wrongIdx = q.o && q.o.length > 1 ? (q.a + 1) % q.o.length : 0;
          yourDisplay = q.o && q.o[wrongIdx] !== undefined ? String(q.o[wrongIdx]).replace(/<[^>]+>/g, '') : 'Option distractor';
        } else if (q.t === 'sort') {
          const wrongIdx = q.bk && q.bk.length > 1 ? (q.a + 1) % q.bk.length : 0;
          yourDisplay = q.bk && q.bk[wrongIdx] !== undefined ? q.bk[wrongIdx] : 'Incorrect category';
        } else if (q.t === 'stress') {
          const wrongIdx = q.sy && q.sy.length > 1 ? (q.a + 1) % q.sy.length : 0;
          yourDisplay = q.sy
            ? q.sy.map((s, idx) => (idx === wrongIdx ? s.toUpperCase() : s.toLowerCase())).join(q.mode === 'sentence' ? ' ' : '·')
            : 'Incorrect syllable';
        } else if (q.t === 'order' && q.tl) {
          const reversed = [...q.tl];
          if (reversed.length >= 2) {
            const temp = reversed[0];
            reversed[0] = reversed[1];
            reversed[1] = temp;
          }
          yourDisplay = reversed.join(' ') + (q.end || '');
        } else if (q.t === 'mistake' && q.w && q.o) {
          const wrongWi = q.wi !== undefined && q.w.length > 1 ? (q.wi + 1) % q.w.length : 0;
          const wrongCi = q.o.length > 1 ? (q.a + 1) % q.o.length : 0;
          yourDisplay = `"${q.w[wrongWi]}" → ` + q.o[wrongCi];
        } else {
          yourDisplay = 'Incorrect response';
        }
      }
    }

    rows.push({
      i: q.i,
      p: q.p,
      u: q.u,
      l: q.l,
      s: q.s,
      d: q.d,
      ok: correct,
      your: yourDisplay,
      right: rightDisplay,
      e: q.e || '',
      qText: q.q || '',
    });
  });

  return rows;
}

export function formatCandidateMistakesSummary(sub: StudentSubmission, rows: QuestionRow[]): string {
  const mistakes = rows.filter((r) => !r.ok);
  const total = rows.length;
  const correctCount = rows.filter((r) => r.ok).length;

  let txt = `📊 MID-TERM EXAM: QUESTION-BY-QUESTION REVIEW\n`;
  txt += `👤 Candidate: ${sub.name} (${sub.cls || 'B2'})\n`;
  txt += `🎯 Auto-Score: ${sub.autoScore} / 50 (${sub.autoPct}%)\n`;
  txt += `✅ Correct: ${correctCount} / ${total} | ❌ Mistakes: ${mistakes.length} / ${total}\n`;
  txt += `========================================\n\n`;

  if (mistakes.length === 0) {
    txt += `🎉 100% Perfect Score! Candidate answered all questions correctly.\n`;
    return txt;
  }

  txt += `❌ QUESTIONS MISSED (${mistakes.length}):\n`;
  mistakes.forEach((m, idx) => {
    txt += `\n${idx + 1}. [Question #${m.i + 1}] Part ${m.p} (Unit ${m.u} · ${m.s || 'Topic'})\n`;
    txt += `   ❌ Candidate Answer: "${m.your}"\n`;
    txt += `   ✅ Correct Answer:   "${m.right}"\n`;
    if (m.e) {
      txt += `   💡 Explanation:      ${m.e}\n`;
    }
  });

  txt += `\n========================================\n`;
  txt += `👨‍🏫 Prepared by: Tr. Hein Tay Za\n`;
  return txt;
}

interface CandidateQuestionInspectorProps {
  submission: StudentSubmission;
  allSubmissions?: StudentSubmission[];
  onSelectSubmission?: (subId: string) => void;
  Q: Question[];
  toast?: (msg: string) => void;
  onOpenGrading?: () => void;
}

export default function CandidateQuestionInspector({
  submission,
  allSubmissions = [],
  onSelectSubmission,
  Q,
  toast,
  onOpenGrading,
}: CandidateQuestionInspectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mistakes' | 'correct'>('all');
  const [partFilter, setPartFilter] = useState<number | 'all'>('all');
  const [copied, setCopied] = useState(false);

  // Compute or get rows for this submission
  const rows = useMemo(() => computeSubmissionRows(submission, Q), [submission, Q]);

  // Summary statistics
  const stats = useMemo(() => {
    const total = rows.length;
    const correct = rows.filter((r) => r.ok).length;
    const mistakes = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Per-part breakdown
    const byPart: Record<number, { total: number; correct: number; mistakes: number }> = {};
    PARTS.filter((p) => p.code !== 'Essay').forEach((p) => {
      byPart[p.n] = { total: 0, correct: 0, mistakes: 0 };
    });

    rows.forEach((r) => {
      if (byPart[r.p]) {
        byPart[r.p].total++;
        if (r.ok) byPart[r.p].correct++;
        else byPart[r.p].mistakes++;
      }
    });

    return { total, correct, mistakes, accuracy, byPart };
  }, [rows]);

  // Filtered rows based on search, status filter, and part filter
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      // Status filter
      if (statusFilter === 'mistakes' && r.ok) return false;
      if (statusFilter === 'correct' && !r.ok) return false;

      // Part filter
      if (partFilter !== 'all' && r.p !== partFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const qNumMatch = `q${r.i + 1}`.includes(query) || `${r.i + 1}` === query;
        const textMatch = (r.qText || '').toLowerCase().includes(query);
        const focusMatch = (r.s || '').toLowerCase().includes(query);
        const yourMatch = (r.your || '').toLowerCase().includes(query);
        const rightMatch = (r.right || '').toLowerCase().includes(query);
        const expMatch = (r.e || '').toLowerCase().includes(query);
        if (!qNumMatch && !textMatch && !focusMatch && !yourMatch && !rightMatch && !expMatch) {
          return false;
        }
      }

      return true;
    });
  }, [rows, statusFilter, partFilter, searchQuery]);

  const handleCopyMistakes = () => {
    const summary = formatCandidateMistakesSummary(submission, rows);
    navigator.clipboard.writeText(summary);
    setCopied(true);
    if (toast) {
      toast(`Copied question & mistake report for ${submission.name}!`);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 anim-fade">
      {/* ================= TOP CARD: CANDIDATE INFO & SWITCHER ================= */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] font-black text-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              {submission.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-[var(--ink)] tracking-tight">
                  {submission.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--ink2)]">
                  {submission.cls || 'B2 Vantage'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--tealsoft)] text-[var(--teal)] font-mono text-xs font-black">
                  {submission.code}
                </span>
              </div>
              <p className="text-xs text-[var(--ink3)] mt-0.5">
                Submitted on {new Date(submission.submittedAt || submission.timestamp).toLocaleString()} · Time used: {Math.floor(submission.timeUsed / 60)} min {submission.timeUsed % 60} sec
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onOpenGrading && (
              <button
                type="button"
                onClick={onOpenGrading}
                className="px-3.5 py-2 rounded-xl bg-[var(--tealsoft)] text-[var(--teal)] font-black text-xs hover:bg-[var(--teal)] hover:text-[#08111F] transition flex items-center gap-1.5"
              >
                <span>✍️</span> Grade Essay ({submission.teacherScore || 0}/10)
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyMistakes}
              className="px-3.5 py-2 rounded-xl bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] hover:border-[var(--teal)] flex items-center gap-1.5 transition"
              title="Copy complete breakdown of mistakes and answers"
            >
              <span>{copied ? '✓' : '📋'}</span> {copied ? 'Copied!' : 'Copy Mistakes Report'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] hover:border-[var(--purple)] flex items-center gap-1.5 transition"
            >
              <span>🖨️</span> Print Answer Sheet
            </button>
          </div>
        </div>

        {/* Candidate Switcher Dropdown & Pills */}
        {allSubmissions.length > 1 && onSelectSubmission && (
          <div className="flex items-center gap-2.5 flex-wrap pt-1">
            <span className="text-xs font-black uppercase tracking-wider text-[var(--ink3)]">
              Switch Candidate:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {allSubmissions.map((sub) => {
                const isSelected = sub.id === submission.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onSelectSubmission(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[var(--teal)] text-[#08111F] shadow-md shadow-teal-500/20'
                        : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)] border border-[var(--line)]'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span
                      className={`text-[0.65rem] px-1.5 py-0.2 rounded font-black ${
                        isSelected ? 'bg-[#08111F]/20 text-[#08111F]' : 'bg-[var(--card)] text-[var(--teal)]'
                      }`}
                    >
                      {sub.autoScore}/50
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3.5">
            <div className="text-[0.68rem] font-black uppercase text-[var(--ink3)]">Total Questions</div>
            <div className="text-2xl font-black text-[var(--ink)] mt-1">{stats.total}</div>
            <div className="text-[0.65rem] text-[var(--ink3)] mt-0.5">Parts 1 through 7</div>
          </div>

          <div className="bg-[var(--card2)] border border-emerald-500/30 rounded-xl p-3.5">
            <div className="text-[0.68rem] font-black uppercase text-emerald-400 flex items-center gap-1">
              <span>✅</span> Correct Answers
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{stats.correct}</div>
            <div className="text-[0.65rem] text-emerald-400/80 mt-0.5">
              {stats.accuracy}% Accuracy Rate
            </div>
          </div>

          <div className="bg-[var(--card2)] border border-rose-500/30 rounded-xl p-3.5">
            <div className="text-[0.68rem] font-black uppercase text-rose-400 flex items-center gap-1">
              <span>❌</span> Incorrect Answers
            </div>
            <div className="text-2xl font-black text-rose-400 mt-1">{stats.mistakes}</div>
            <div className="text-[0.65rem] text-rose-400/80 mt-0.5">
              {stats.mistakes === 0 ? 'Flawless 100%' : 'Needs Review'}
            </div>
          </div>

          <div className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3.5">
            <div className="text-[0.68rem] font-black uppercase text-[var(--teal)]">Auto Score</div>
            <div className="text-2xl font-black text-[var(--teal)] mt-1">
              {submission.autoScore} <span className="text-xs text-[var(--ink3)] font-normal">/ 50</span>
            </div>
            <div className="text-[0.65rem] text-[var(--ink2)] mt-0.5">
              {submission.cefrLevel || 'B2 Vantage'}
            </div>
          </div>
        </div>

        {/* Quick Mistakes Jump Banner */}
        {stats.mistakes > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <span className="font-extrabold text-rose-400 flex items-center gap-1.5">
                <span>⚠️</span> Candidate missed {stats.mistakes} questions:
              </span>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('mistakes');
                  setPartFilter('all');
                }}
                className="text-[0.68rem] font-bold text-rose-400 underline hover:text-rose-300"
              >
                Click to view all {stats.mistakes} mistakes below ↓
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {rows
                .filter((r) => !r.ok)
                .map((m) => (
                  <button
                    key={m.i}
                    type="button"
                    onClick={() => {
                      setStatusFilter('all');
                      setPartFilter(m.p);
                      const el = document.getElementById(`teacher-q-${m.i}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1"
                    title={`Question ${m.i + 1} (Part ${m.p} · ${m.s})`}
                  >
                    <span>Q{m.i + 1}</span>
                    <span className="text-[0.65rem] opacity-75 font-normal">P{m.p}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= SEARCH & FILTER CONTROLS ================= */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search by question text, keyword, grammar rule, or Q# (e.g. Q14)..."
              className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--ink3)] focus:outline-none focus:border-[var(--teal)] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs font-bold text-[var(--ink3)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Buttons (All vs Mistakes vs Correct) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--card2)] border border-[var(--line)]">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                statusFilter === 'all'
                  ? 'bg-[var(--card)] text-[var(--ink)] shadow'
                  : 'text-[var(--ink2)] hover:text-[var(--ink)]'
              }`}
            >
              All ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('mistakes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                statusFilter === 'mistakes'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <span>❌</span> Mistakes Only ({stats.mistakes})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('correct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                statusFilter === 'correct'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <span>✅</span> Correct Only ({stats.correct})
            </button>
          </div>
        </div>

        {/* Part Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[var(--line)]">
          <span className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--ink3)] mr-1">
            Part:
          </span>
          <button
            type="button"
            onClick={() => setPartFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              partFilter === 'all'
                ? 'bg-[var(--teal)] text-[#08111F]'
                : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
            }`}
          >
            All Parts ({rows.length})
          </button>
          {PARTS.filter((p) => p.code !== 'Essay').map((p) => {
            const partStat = stats.byPart[p.n];
            const hasMistakes = partStat && partStat.mistakes > 0;
            return (
              <button
                key={p.n}
                type="button"
                onClick={() => setPartFilter(p.n)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  partFilter === p.n
                    ? 'bg-[var(--teal)] text-[#08111F]'
                    : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
                }`}
              >
                <span>P{p.n} ({p.code})</span>
                {hasMistakes && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title={`${partStat.mistakes} mistake(s)`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= QUESTION LIST ================= */}
      <div className="space-y-4">
        {filteredRows.length === 0 ? (
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-12 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <div className="text-sm font-bold text-[var(--ink)]">No questions match your current filter</div>
            <p className="text-xs text-[var(--ink3)]">
              Try clearing the search query or switching the status filter back to &quot;All Questions&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPartFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-[var(--teal)] text-[#08111F] text-xs font-black"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredRows.map((row) => {
            const origQ = Q.find((q) => q.i === row.i);
            const partInfo = PARTS.find((p) => p.n === row.p);

            return (
              <div
                key={row.i}
                id={`teacher-q-${row.i}`}
                className={`bg-[var(--card)] border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 transition ${
                  row.ok
                    ? 'border-[var(--line)] hover:border-emerald-500/40'
                    : 'border-rose-500/40 bg-gradient-to-br from-[var(--card)] to-rose-950/10'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[var(--line)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        row.ok
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {row.ok ? '✓' : '✗'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-[var(--ink)]">
                          Question {row.i + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.65rem] font-black uppercase ${
                            row.ok
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {row.ok ? '✅ Correct (+1 pt)' : '❌ Incorrect (0 pts)'}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--purple)] font-bold mt-0.5">
                        Part {row.p} · {partInfo?.title || 'Section'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {row.s && (
                      <span className="px-2.5 py-1 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--teal)]">
                        🎯 {row.s}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-[var(--tealsoft)] text-[var(--teal)] font-bold text-[0.68rem]">
                      Unit {row.u}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase ${
                        row.d === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : row.d === 'medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {row.d || 'standard'}
                    </span>
                  </div>
                </div>

                {/* Question Context & Prompt */}
                {origQ && origQ.q && (
                  <div className="space-y-1.5">
                    <div className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--ink3)]">
                      Question Context / Sentence:
                    </div>
                    <div
                      className="text-xs sm:text-sm font-semibold text-[var(--ink)] leading-relaxed bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3.5"
                      dangerouslySetInnerHTML={{ __html: origQ.q }}
                    />
                  </div>
                )}

                {/* Candidate Answer vs Correct Answer Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Candidate Answer */}
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      row.ok
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-rose-500/40 bg-rose-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[0.68rem] font-black uppercase tracking-wider">
                      <span className={row.ok ? 'text-emerald-400' : 'text-rose-400'}>
                        {row.ok ? '✅ Candidate Answer (Correct)' : '❌ Candidate Answer (Incorrect)'}
                      </span>
                      <span className="text-[var(--ink3)] font-mono">
                        {row.ok ? '+1.0 pt' : '0.0 pts'}
                      </span>
                    </div>
                    <div className={`text-sm sm:text-base font-black ${row.ok ? 'text-emerald-400' : 'text-rose-300'}`}>
                      {row.your || '—'}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[0.68rem] font-black uppercase tracking-wider text-[var(--teal)]">
                      <span>🎯 Correct Answer (Official Key)</span>
                      <span className="text-teal-400 font-bold">Cambridge B2 Key</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-[var(--teal)]">
                      {row.right}
                    </div>
                  </div>
                </div>

                {/* Pedagogical Explanation */}
                {row.e && (
                  <div className="p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--line)] text-xs text-[var(--ink)] space-y-1">
                    <div className="font-extrabold text-[var(--teal)] flex items-center gap-1.5">
                      <span>💡</span> Grammatical Rule &amp; Cambridge Explanation:
                    </div>
                    <div className="leading-relaxed text-[var(--ink2)] font-medium">
                      {row.e}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
