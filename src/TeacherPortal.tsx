import React, { useState, useMemo, useEffect } from 'react';
import { PARTS, CONFIG, Question, prepareQuestions } from './examData';
import VisualEssayRubric from './VisualEssayRubric';
import CandidateQuestionInspector from './CandidateQuestionInspector';

export interface StudentSubmission {
  id: string;
  name: string;
  cls: string;
  submittedAt: string;
  timestamp: number;
  timeUsed: number;
  code: string;
  autoScore: number;
  autoMax: number;
  autoPct: number;
  teacherScore: number;
  teacherMax: number;
  finalScore: number;
  finalMax: number;
  finalPct: number;
  cefrLevel: string;
  rubric: {
    task: number;
    coherence: number;
    lexical: number;
    grammar: number;
  };
  feedback: string;
  gradedBy: string;
  isGraded: boolean;
  essayText: string;
  essayWordCount: number;
  answers: Record<number, any>;
  perPart: Record<number, { n: number; right: number; got: number; max: number }>;
  perUnit: Record<number, { n: number; right: number }>;
  rows: any[];
  photos?: { t: string; ts: number; d: string }[];
  blurs?: number;
  blurLog?: string[];
}

export const SUBMISSIONS_STORAGE_KEY = 'HEINFINITY_SUBMISSIONS_STORE_V2';

// Helper to escape HTML characters
function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Compute CEFR Level and description
export function evaluateCEFR(pct: number): { level: string; band: string; title: string; color: string } {
  if (pct >= 85) {
    return {
      level: 'C1 Effective Operational Proficiency',
      band: 'Distinction (C1 Level)',
      title: 'Expert Command of English',
      color: '#0d9488',
    };
  }
  if (pct >= 75) {
    return {
      level: 'B2 Vantage (High Pass)',
      band: 'Strong Pass (High B2)',
      title: 'Independent User - High Fluency',
      color: '#0284c7',
    };
  }
  if (pct >= 60) {
    return {
      level: 'B2 Vantage (Standard Pass)',
      band: 'Pass (B2 Standard)',
      title: 'Independent User - Solid Foundation',
      color: '#4f46e5',
    };
  }
  if (pct >= 50) {
    return {
      level: 'B1 Threshold (Developing B2)',
      band: 'Borderline Pass (B1/B2)',
      title: 'Developing Independence',
      color: '#d97706',
    };
  }
  return {
    level: 'A2+ / Emerging B1',
    band: 'Needs Review',
    title: 'Foundational Consolidation Needed',
    color: '#e11d48',
  };
}

// Default mock students for first-time inspection & testing
export const INITIAL_SEED_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-seed-001',
    name: 'Aung Myat Thu',
    cls: 'B2-Weekend-A',
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    timestamp: Date.now() - 3600000 * 4,
    timeUsed: 2750,
    code: 'MT15-AUNG-088-9899889A-2408',
    autoScore: 44,
    autoMax: 50,
    autoPct: 88,
    teacherScore: 8.5,
    teacherMax: 10,
    finalScore: 52.5,
    finalMax: 60,
    finalPct: 88,
    cefrLevel: 'C1 Effective Operational Proficiency',
    rubric: { task: 2.0, coherence: 2.0, lexical: 2.5, grammar: 2.0 },
    feedback:
      'Excellent essay structure and mature argumentation. You clearly distinguished innate potential from deliberate practice with concrete examples. Minor article usage to refine.',
    gradedBy: 'Tr. Hein Tay Za',
    isGraded: true,
    essayText:
      'It is often argued whether innate ability or relentless effort is the primary catalyst for extraordinary achievement. In my perspective, while natural aptitude provides an initial advantage, persistent dedication and structured practice are far more decisive in the long term.\n\nOn the one hand, certain individuals possess biological advantages, such as superior reflexes or musical pitch. In elite competitions, such innate gifts offer a head start. However, talent without cultivation frequently stagnates.\n\nOn the other hand, sustained hard work cultivates discipline, resilience, and muscle memory. The renowned psychologist Anders Ericsson highlighted that master performers engage in thousands of hours of deliberate practice. Through perseverance, individuals can surpass naturally gifted peers who lack commitment.\n\nIn conclusion, while innate talent provides the initial spark, deliberate effort is the engine of lasting success. I firmly believe that dedication is the ultimate determining factor.',
    essayWordCount: 146,
    answers: {},
    perPart: {
      1: { n: 1, right: 9, got: 9, max: 10 },
      2: { n: 2, right: 14, got: 14, max: 15 },
      3: { n: 3, right: 13, got: 13, max: 15 },
      4: { n: 4, right: 5, got: 5, max: 5 },
      5: { n: 5, right: 4, got: 4, max: 5 },
      6: { n: 6, right: 5, got: 5, max: 5 },
      7: { n: 7, right: 8, got: 8, max: 10 },
      8: { n: 8, right: 1, got: 8.5, max: 10 },
    },
    perUnit: {
      1: { n: 12, right: 11 },
      2: { n: 12, right: 10 },
      3: { n: 12, right: 12 },
      4: { n: 12, right: 11 },
      5: { n: 12, right: 10 },
    },
    rows: [],
    blurs: 1,
    blurLog: ['Tab blur recorded at 14:20'],
  },
  {
    id: 'sub-seed-002',
    name: 'Su Su Lwin',
    cls: 'B2-Evening-02',
    submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    timestamp: Date.now() - 3600000 * 8,
    timeUsed: 2980,
    code: 'MT15-SUSU-076-87887788-2408',
    autoScore: 38,
    autoMax: 50,
    autoPct: 76,
    teacherScore: 7.0,
    teacherMax: 10,
    finalScore: 45,
    finalMax: 60,
    finalPct: 75,
    cefrLevel: 'B2 Vantage (High Pass)',
    rubric: { task: 2.0, coherence: 1.5, lexical: 2.0, grammar: 1.5 },
    feedback:
      'Good essay with clear opinions. Focus on linking paragraphs smoothly using transitional phrases (e.g., Furthermore, Conversely) and review mixed conditional structures.',
    gradedBy: 'Tr. Hein Tay Za',
    isGraded: true,
    essayText:
      'Some people believe that talent is more important than hard work for success, while others think hard work is everything. In this essay, I will discuss both points of view and explain my opinion.\n\nFirst, natural talent is very useful in areas like sports and art. If someone is born tall, playing basketball becomes easier for them. Talent helps people learn faster in the beginning.\n\nHowever, hard work is necessary to keep improving. Without training every day, even talented people cannot win championships. For example, Cristiano Ronaldo works extremely hard every single day despite his natural skill.\n\nTo sum up, both talent and effort matter, but hard work is more essential because dedication never fails.',
    essayWordCount: 120,
    answers: {},
    perPart: {
      1: { n: 1, right: 8, got: 8, max: 10 },
      2: { n: 2, right: 11, got: 11, max: 15 },
      3: { n: 3, right: 11, got: 11, max: 15 },
      4: { n: 4, right: 4, got: 4, max: 5 },
      5: { n: 5, right: 4, got: 4, max: 5 },
      6: { n: 6, right: 4, got: 4, max: 5 },
      7: { n: 7, right: 7, got: 7, max: 10 },
      8: { n: 8, right: 1, got: 7.0, max: 10 },
    },
    perUnit: {
      1: { n: 12, right: 9 },
      2: { n: 12, right: 9 },
      3: { n: 12, right: 10 },
      4: { n: 12, right: 9 },
      5: { n: 12, right: 8 },
    },
    rows: [],
    blurs: 0,
    blurLog: [],
  },
  {
    id: 'sub-seed-003',
    name: 'Thant Zin Oo',
    cls: 'B2-Weekend-A',
    submittedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    timestamp: Date.now() - 3600000 * 18,
    timeUsed: 2450,
    code: 'MT15-THAN-064-6766676C-2308',
    autoScore: 32,
    autoMax: 50,
    autoPct: 64,
    teacherScore: 0,
    teacherMax: 10,
    finalScore: 32,
    finalMax: 60,
    finalPct: 53,
    cefrLevel: 'B2 Vantage (Standard Pass)',
    rubric: { task: 0, coherence: 0, lexical: 0, grammar: 0 },
    feedback: '',
    gradedBy: '',
    isGraded: false,
    essayText:
      'In modern life, success is something everyone wants. Some think born talent is key, but I believe working hard is the real reason people succeed.\n\nTalent can give people a head start. But if a talented person does not practice, they will lose their skill.\n\nHard work teaches patience and gives experience. When you work hard, you can learn any skill.\n\nIn my conclusion, effort is always more important than talent.',
    essayWordCount: 76,
    answers: {},
    perPart: {
      1: { n: 1, right: 6, got: 6, max: 10 },
      2: { n: 2, right: 9, got: 9, max: 15 },
      3: { n: 3, right: 9, got: 9, max: 15 },
      4: { n: 4, right: 3, got: 3, max: 5 },
      5: { n: 5, right: 3, got: 3, max: 5 },
      6: { n: 6, right: 3, got: 3, max: 5 },
      7: { n: 7, right: 5, got: 5, max: 10 },
      8: { n: 8, right: 0, got: 0, max: 10 },
    },
    perUnit: {
      1: { n: 12, right: 7 },
      2: { n: 12, right: 8 },
      3: { n: 12, right: 8 },
      4: { n: 12, right: 6 },
      5: { n: 12, right: 7 },
    },
    rows: [],
    blurs: 2,
    blurLog: ['Switched tab at 11:15', 'Switched tab at 11:42'],
  },
];

// Load submissions from storage
export function loadAllSubmissions(): StudentSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  // Default to initial seed if empty
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_SUBMISSIONS));
  } catch (e) {}
  return INITIAL_SEED_SUBMISSIONS;
}

// Save submissions
export function saveAllSubmissions(subs: StudentSubmission[]) {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(subs));
  } catch (e) {}
}

// Add or update a submission
export function saveSingleSubmission(sub: StudentSubmission) {
  const all = loadAllSubmissions();
  const existingIdx = all.findIndex((s) => s.id === sub.id || (s.name === sub.name && s.code === sub.code));
  if (existingIdx >= 0) {
    all[existingIdx] = { ...all[existingIdx], ...sub };
  } else {
    all.unshift(sub);
  }
  saveAllSubmissions(all);
}

// ================= EXPORT HELPERS =================
export function downloadCSV(submissions: StudentSubmission[]) {
  const headers = [
    'Student Name',
    'Class / ID',
    'Date Submitted',
    'Exam Code',
    'Auto Score (50)',
    'Auto %',
    'Teacher Essay Score (10)',
    'Final Combined Score (60)',
    'Final Scaled Score (100%)',
    'CEFR Level',
    'Grading Status',
    'Task Score (2.5)',
    'Coherence (2.5)',
    'Lexical (2.5)',
    'Grammar (2.5)',
    'Teacher Feedback',
    'Essay Word Count',
    'Integrity Flag (Blurs)',
  ];

  const rows = submissions.map((s) => [
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${(s.cls || '').replace(/"/g, '""')}"`,
    `"${new Date(s.timestamp || s.submittedAt).toLocaleDateString('en-GB')}"`,
    `"${s.code || ''}"`,
    s.autoScore,
    `${s.autoPct}%`,
    s.teacherScore,
    s.finalScore,
    `${s.finalPct}%`,
    `"${s.cefrLevel || ''}"`,
    s.isGraded ? 'Graded' : 'Pending',
    s.rubric?.task || 0,
    s.rubric?.coherence || 0,
    s.rubric?.lexical || 0,
    s.rubric?.grammar || 0,
    `"${(s.feedback || '').replace(/"/g, '""')}"`,
    s.essayWordCount || 0,
    s.blurs || 0,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Heinfinity_Empower_B2_Grades_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadJSONBackup(submissions: StudentSubmission[]) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(submissions, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `Heinfinity_Submissions_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate Single Student Report HTML for Printing / Saving to PDF
export function buildStudentHTMLReport(sub: StudentSubmission, autoPrint = false): string {
  const dateFormatted = new Date(sub.timestamp || sub.submittedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const cefr = evaluateCEFR(sub.finalPct);

  const partRows = PARTS.map((p) => {
    const pStat = sub.perPart ? sub.perPart[p.n] : null;
    const got = p.n === 8 ? `${sub.teacherScore} / 10` : pStat?.got || 0;
    const max = p.pts;
    const pct =
      p.n === 8
        ? `${Math.round(((sub.teacherScore || 0) / 10) * 100)}%`
        : `${Math.round(((pStat?.got || 0) / max) * 100)}%`;
    return `
      <tr>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px;"><b>Part ${p.n}:</b> ${escapeHtml(p.title)}</td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 12px;">${max} pts</td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: #0d9488; font-size: 12px;">${got}</td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 12px; font-weight: 600;">${pct}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Report · ${escapeHtml(sub.name)} · Heinfinity English</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 12px; background: #ffffff; line-height: 1.45; }
    .header-box { border-bottom: 2px solid #0d9488; padding-bottom: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 22px; font-weight: 900; color: #0f172a; }
    .brand-title span { color: #0d9488; }
    .score-badge { background: #f0fdfa; border: 2px solid #0d9488; border-radius: 12px; padding: 12px 18px; text-align: center; }
    .table-custom { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 16px; }
    .table-custom th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: left; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 14px; }
    .teacher-box { background: #fdfefe; border: 2px solid #0d9488; border-radius: 12px; padding: 16px; margin-top: 14px; margin-bottom: 16px; }
    .page-break { page-break-after: always; }
    @media print { .no-print { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <div class="brand-title">Hein<span>finity</span> English</div>
      <div style="font-size: 13px; font-weight: 800; color: #475569; margin-top: 2px;">
        Empower B2 Mid-Term Examination (Units 1–5) · Official Statement of Results
      </div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
        Lead Instructor: <b>Tr. Hein Tay Za</b> · Verification Code: <span style="font-family: monospace; font-weight: bold; color: #0d9488;">${escapeHtml(sub.code)}</span>
      </div>
    </div>
    <div class="score-badge">
      <div style="font-size: 10px; font-weight: 800; color: #0d9488; text-transform: uppercase;">Final Overall Result</div>
      <div style="font-size: 26px; font-weight: 900; color: #0f172a; line-height: 1.1;">${sub.finalScore} <span style="font-size: 14px; color: #64748b;">/ 60</span></div>
      <div style="font-size: 13px; font-weight: 800; color: #0d9488;">${sub.finalPct}% · ${cefr.band}</div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; margin-bottom: 14px;">
    <div class="box" style="margin-bottom: 0;">
      <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Candidate Information</div>
      <div style="font-size: 16px; font-weight: 900; color: #0f172a;">${escapeHtml(sub.name)}</div>
      <div style="font-size: 12px; color: #475569; margin-top: 2px;">
        Class / Roll: <b>${escapeHtml(sub.cls || 'General Batch')}</b> · Date: <b>${dateFormatted}</b>
      </div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
        Time Used: <b>${Math.floor(sub.timeUsed / 60)}m ${sub.timeUsed % 60}s</b> · Tab Switch Blurs: <b>${sub.blurs || 0}</b>
      </div>
    </div>
    <div class="box" style="margin-bottom: 0; background: #f0fdfa; border-color: #99f6e4;">
      <div style="font-size: 10px; font-weight: 800; color: #0f766e; text-transform: uppercase; margin-bottom: 4px;">CEFR Performance Level</div>
      <div style="font-size: 15px; font-weight: 900; color: #0f766e;">${cefr.level}</div>
      <div style="font-size: 11px; color: #334155; margin-top: 2px;">${cefr.title}</div>
    </div>
  </div>

  <!-- Parts Breakdown Table -->
  <table class="table-custom">
    <thead>
      <tr>
        <th>Exam Section / Skill</th>
        <th style="text-align: center;">Max Points</th>
        <th style="text-align: center;">Awarded</th>
        <th style="text-align: center;">Mastery %</th>
      </tr>
    </thead>
    <tbody>
      ${partRows}
    </tbody>
  </table>

  <!-- Student Essay -->
  <div class="box">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <div style="font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
        📝 Part 8 Candidate Essay: Hard Work vs Talent
      </div>
      <div style="font-size: 11px; font-weight: 700; color: #64748b;">
        Word Count: <b>${sub.essayWordCount} words</b>
      </div>
    </div>
    <div style="font-size: 12px; color: #1e293b; line-height: 1.6; white-space: pre-wrap; font-style: italic; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
      ${escapeHtml(sub.essayText || '(No essay text submitted)')}
    </div>
  </div>

  <!-- Teacher Feedback & Evaluation Box -->
  <div class="teacher-box">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccfbf1; padding-bottom: 8px; margin-bottom: 12px; flex-wrap: wrap;">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: #0d9488; text-transform: uppercase;">Teacher Assessment & Feedback</div>
        <div style="font-size: 15px; font-weight: 900; color: #0f172a;">Evaluated & Graded by Tr. Hein Tay Za</div>
      </div>
      <div style="font-size: 18px; font-weight: 900; color: #0d9488;">
        Essay Score: ${sub.teacherScore} / 10 pts
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 8px; border-radius: 6px; font-size: 11px;">
        <div style="color: #64748b; font-size: 10px;">1. Task Achievement</div>
        <div style="font-weight: 900; color: #0f766e; font-size: 13px;">${sub.rubric?.task || 0} / 2.5</div>
      </div>
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 8px; border-radius: 6px; font-size: 11px;">
        <div style="color: #64748b; font-size: 10px;">2. Coherence & Org</div>
        <div style="font-weight: 900; color: #0f766e; font-size: 13px;">${sub.rubric?.coherence || 0} / 2.5</div>
      </div>
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 8px; border-radius: 6px; font-size: 11px;">
        <div style="color: #64748b; font-size: 10px;">3. Lexical / Vocab</div>
        <div style="font-weight: 900; color: #0f766e; font-size: 13px;">${sub.rubric?.lexical || 0} / 2.5</div>
      </div>
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 8px; border-radius: 6px; font-size: 11px;">
        <div style="color: #64748b; font-size: 10px;">4. Grammar & Accuracy</div>
        <div style="font-weight: 900; color: #0f766e; font-size: 13px;">${sub.rubric?.grammar || 0} / 2.5</div>
      </div>
    </div>

    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px;">
      <div style="font-weight: 800; color: #0f766e; margin-bottom: 4px;">💬 Personalized Teacher Feedback & Next Steps:</div>
      <div style="line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(sub.feedback || 'Good attempt on the exam. Review units where scores were below 70% and keep expanding your B2 vocabulary.')}</div>
    </div>

    <div style="margin-top: 10px; text-align: right; font-size: 11px; font-weight: 800; color: #0f766e;">
      — Tr. Hein Tay Za · Heinfinity English Academic Team
    </div>
  </div>

  <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8;">
    Heinfinity English Academic Assessment System · Tr. Hein Tay Za · Cambridge Empower B2
  </div>

  ${autoPrint ? '<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>' : ''}
</body>
</html>
  `;
}

// Generate Multi-Student Batch Report for All Students in One PDF / Print
export function buildBatchHTMLReport(submissions: StudentSubmission[]): string {
  const individualReports = submissions.map((s, idx) => {
    const isLast = idx === submissions.length - 1;
    const report = buildStudentHTMLReport(s, false);
    // Extract body content
    const bodyMatch = report.match(/<body>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : report;
    return `
      <div class="student-page ${isLast ? '' : 'page-break'}">
        ${bodyContent}
      </div>
    `;
  }).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>All Candidate Reports (${submissions.length}) · Heinfinity English</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; background: #ffffff; }
    .page-break { page-break-after: always; break-after: page; }
    .student-page { padding: 12px; margin-bottom: 24px; }
    .header-box { border-bottom: 2px solid #0d9488; padding-bottom: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 22px; font-weight: 900; color: #0f172a; }
    .brand-title span { color: #0d9488; }
    .score-badge { background: #f0fdfa; border: 2px solid #0d9488; border-radius: 12px; padding: 12px 18px; text-align: center; }
    .table-custom { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 16px; }
    .table-custom th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: left; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 14px; }
    .teacher-box { background: #fdfefe; border: 2px solid #0d9488; border-radius: 12px; padding: 16px; margin-top: 14px; margin-bottom: 16px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  ${individualReports}
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>
</body>
</html>
  `;
}

// Generate student-friendly Telegram/WhatsApp feedback template
export function formatTelegramFeedback(sub: StudentSubmission): string {
  const cefr = evaluateCEFR(sub.finalPct);
  return `📢 *HEINFINITY ENGLISH · EMPOWER B2 MID-TERM RESULT*
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Candidate:* ${sub.name}
🏫 *Class:* ${sub.cls || 'General'}
📅 *Date:* ${new Date(sub.timestamp || sub.submittedAt).toLocaleDateString('en-GB')}
🔑 *Code:* \`${sub.code}\`

🏆 *FINAL SCORE:* ${sub.finalScore} / 60 (${sub.finalPct}%)
🎖️ *CEFR Level:* ${cefr.level}
📊 *Objective Test (Parts 1–7):* ${sub.autoScore} / 50 pts
✍️ *Essay Writing (Part 8):* ${sub.teacherScore} / 10 pts

📋 *ESSAY RUBRIC BREAKDOWN:*
• Task Achievement: ${sub.rubric?.task || 0}/2.5
• Coherence & Org: ${sub.rubric?.coherence || 0}/2.5
• Lexical / Vocab: ${sub.rubric?.lexical || 0}/2.5
• Grammar & Accuracy: ${sub.rubric?.grammar || 0}/2.5

💬 *TEACHER FEEDBACK (Tr. Hein Tay Za):*
"${sub.feedback || 'Well done on completing the mid-term exam! Keep practicing!'}"

Keep striving for excellence! 🚀
— *Tr. Hein Tay Za · Heinfinity English*`;
}

// ================= TEACHER DASHBOARD COMPONENT =================
export default function TeacherPortal({
  onBack,
  onViewStudentFullResult,
}: {
  onBack: () => void;
  onViewStudentFullResult?: (sub: StudentSubmission) => void;
}) {
  const Q = useMemo(() => prepareQuestions(), []);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => loadAllSubmissions());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'gradebook' | 'grading' | 'questions' | 'import' | 'analytics'>('gradebook');
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states for grading currently selected student
  const currentSelectedSub = useMemo(() => {
    return submissions.find((s) => s.id === selectedSubId) || submissions[0] || null;
  }, [submissions, selectedSubId]);

  const [editRubric, setEditRubric] = useState({
    task: currentSelectedSub?.rubric?.task || 2.0,
    coherence: currentSelectedSub?.rubric?.coherence || 2.0,
    lexical: currentSelectedSub?.rubric?.lexical || 2.0,
    grammar: currentSelectedSub?.rubric?.grammar || 2.0,
  });

  const [editFeedback, setEditFeedback] = useState(currentSelectedSub?.feedback || '');
  const [pasteCodeText, setPasteCodeText] = useState('');
  const [importJsonText, setImportJsonText] = useState('');

  // Update edit form when selected student changes
  useEffect(() => {
    if (currentSelectedSub) {
      setEditRubric({
        task: currentSelectedSub.rubric?.task || 2.0,
        coherence: currentSelectedSub.rubric?.coherence || 2.0,
        lexical: currentSelectedSub.rubric?.lexical || 2.0,
        grammar: currentSelectedSub.rubric?.grammar || 2.0,
      });
      setEditFeedback(
        currentSelectedSub.feedback ||
          'Good work on completing the examination. Review your vocabulary precision and practice complex sentences.'
      );
    }
  }, [selectedSubId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.cls && s.cls.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q))
    );
  }, [submissions, search]);

  // Overall Stats
  const stats = useMemo(() => {
    if (!submissions.length) return { total: 0, avgPct: 0, passRate: 0, gradedCount: 0 };
    const total = submissions.length;
    const gradedCount = submissions.filter((s) => s.isGraded).length;
    const avgPct = Math.round(submissions.reduce((acc, s) => acc + s.finalPct, 0) / total);
    const passCount = submissions.filter((s) => s.finalPct >= 60).length;
    const passRate = Math.round((passCount / total) * 100);
    return { total, avgPct, passRate, gradedCount };
  }, [submissions]);

  // Save graded student
  const handleSaveGrade = () => {
    if (!currentSelectedSub) return;
    const essayTotal = Number((editRubric.task + editRubric.coherence + editRubric.lexical + editRubric.grammar).toFixed(1));
    const finalScore = Number((currentSelectedSub.autoScore + essayTotal).toFixed(1));
    const finalPct = Math.round((finalScore / 60) * 100);
    const cefr = evaluateCEFR(finalPct);

    const updated: StudentSubmission = {
      ...currentSelectedSub,
      teacherScore: essayTotal,
      finalScore,
      finalPct,
      cefrLevel: cefr.level,
      rubric: { ...editRubric },
      feedback: editFeedback,
      isGraded: true,
      gradedBy: 'Tr. Hein Tay Za',
      gradedAt: new Date().toISOString(),
    };

    const nextList = submissions.map((s) => (s.id === updated.id ? updated : s));
    setSubmissions(nextList);
    saveAllSubmissions(nextList);
    showToast(`✓ Grades and feedback saved for ${updated.name}!`);
  };

  // Print / Save PDF for Single Student
  const handlePrintSingle = (sub: StudentSubmission) => {
    const html = buildStudentHTMLReport(sub, true);
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
      showToast('Popup blocked. Please allow popups to open the printable report.');
    }
  };

  // Print / Save PDF for ALL Students in one batch
  const handlePrintBatch = () => {
    if (!submissions.length) {
      showToast('No student submissions to print.');
      return;
    }
    const html = buildBatchHTMLReport(submissions);
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
      showToast('Popup blocked. Please allow popups to open batch reports.');
    }
  };

  // Import Telegram Code or JSON
  const handleImportCode = () => {
    const trimmed = pasteCodeText.trim();
    if (!trimmed) {
      showToast('Please paste a student submission string or Telegram message.');
      return;
    }

    const match = trimmed.match(/\b(MT15)-([A-Z]{4})-(\d{3})-([0-9A-Z]{8})-(\d{4})\b/i);
    if (!match) {
      showToast('No valid Heinfinity Exam code found in text.');
      return;
    }

    const [, , nm, pctStr] = match;
    const autoScore = Math.round((parseInt(pctStr, 10) / 100) * 50 * 10) / 10;
    const newSub: StudentSubmission = {
      id: 'sub-' + Date.now(),
      name: `Candidate ${nm.toUpperCase()}`,
      cls: 'Imported',
      submittedAt: new Date().toISOString(),
      timestamp: Date.now(),
      timeUsed: 2700,
      code: match[0].toUpperCase(),
      autoScore,
      autoMax: 50,
      autoPct: parseInt(pctStr, 10),
      teacherScore: 7.5,
      teacherMax: 10,
      finalScore: autoScore + 7.5,
      finalMax: 60,
      finalPct: Math.round(((autoScore + 7.5) / 60) * 100),
      cefrLevel: evaluateCEFR(parseInt(pctStr, 10)).level,
      rubric: { task: 2.0, coherence: 2.0, lexical: 2.0, grammar: 1.5 },
      feedback: 'Good work on the exam. Continue refining your paragraph transitions.',
      gradedBy: 'Tr. Hein Tay Za',
      isGraded: false,
      essayText: trimmed,
      essayWordCount: trimmed.split(/\s+/).length,
      answers: {},
      perPart: {
        1: { n: 1, right: 8, got: 8, max: 10 },
        2: { n: 2, right: 12, got: 12, max: 15 },
        3: { n: 3, right: 12, got: 12, max: 15 },
        4: { n: 4, right: 4, got: 4, max: 5 },
        5: { n: 5, right: 4, got: 4, max: 5 },
        6: { n: 6, right: 4, got: 4, max: 5 },
        7: { n: 7, right: 8, got: 8, max: 10 },
        8: { n: 8, right: 0, got: 0, max: 10 },
      },
      perUnit: {},
      rows: [],
    };

    const next = [newSub, ...submissions];
    setSubmissions(next);
    saveAllSubmissions(next);
    setSelectedSubId(newSub.id);
    setActiveTab('grading');
    setPasteCodeText('');
    showToast(`✓ Imported candidate ${nm}! You can now grade their essay.`);
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) throw new Error('Empty list');
      const next = [...items, ...submissions.filter((s) => !items.some((i) => i.id === s.id))];
      setSubmissions(next);
      saveAllSubmissions(next);
      setImportJsonText('');
      showToast(`✓ Successfully imported ${items.length} student submission(s)!`);
      setActiveTab('gradebook');
    } catch (err) {
      showToast('Invalid JSON structure. Please check the format.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 anim-fade pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#08111F] text-[var(--teal)] border border-[var(--teal)] px-5 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2">
          <span>✨</span> {toastMsg}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0d9488] to-[#7C6FF0] flex items-center justify-center text-white text-2xl shadow-lg shadow-teal-500/20">
            🧑‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
                Teacher Management Portal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--tealsoft)] text-[var(--teal)] text-[0.68rem] font-extrabold uppercase">
                Tr. Hein Tay Za
              </span>
            </div>
            <p className="text-xs text-[var(--ink2)] mt-0.5">
              Empower B2 Mid-Term · Grade essays, provide personalized feedback, and download batch student reports.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrintBatch}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] text-xs font-black hover:opacity-95 shadow-md shadow-teal-500/20 flex items-center gap-1.5"
            title="Print or Save All Student Reports to PDF in one document"
          >
            <span>🖨️</span> Download All Reports (PDF)
          </button>
          <button
            type="button"
            onClick={() => downloadCSV(submissions)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] hover:border-[var(--teal)] flex items-center gap-1.5"
            title="Download grades to Excel/CSV"
          >
            <span>📊</span> Export CSV
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--card2)] border border-[var(--line2)] text-xs font-bold text-[var(--ink2)] hover:text-[var(--ink)]"
          >
            ← Back to Exam
          </button>
        </div>
      </div>

      {/* Top Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-4 shadow-sm">
          <div className="text-[0.68rem] font-black uppercase text-[var(--ink3)]">Total Candidates</div>
          <div className="text-2xl font-black text-[var(--teal)] mt-1">{stats.total}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-4 shadow-sm">
          <div className="text-[0.68rem] font-black uppercase text-[var(--ink3)]">Grading Completed</div>
          <div className="text-2xl font-black text-[var(--purple)] mt-1">
            {stats.gradedCount} <span className="text-xs text-[var(--ink3)] font-normal">/ {stats.total}</span>
          </div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-4 shadow-sm">
          <div className="text-[0.68rem] font-black uppercase text-[var(--ink3)]">Class Average</div>
          <div className="text-2xl font-black text-[var(--gold)] mt-1">{stats.avgPct}%</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-4 shadow-sm">
          <div className="text-[0.68rem] font-black uppercase text-[var(--ink3)]">B2 Pass Rate (≥60%)</div>
          <div className="text-2xl font-black text-[#10b981] mt-1">{stats.passRate}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('gradebook')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'gradebook'
              ? 'bg-[var(--teal)] text-[#08111F]'
              : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          📋 All Candidates & Gradebook ({submissions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'grading'
              ? 'bg-[var(--teal)] text-[#08111F]'
              : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          ✍️ Essay Grading & Feedback
        </button>
        <button
          type="button"
          onClick={() => {
            if (!selectedSubId && submissions.length > 0) {
              setSelectedSubId(submissions[0].id);
            }
            setActiveTab('questions');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'bg-[var(--teal)] text-[#08111F]'
              : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          <span>🔍</span> Question Answers (Correct vs Wrong)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'import'
              ? 'bg-[var(--teal)] text-[#08111F]'
              : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          📥 Import / Paste Submissions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-[var(--teal)] text-[#08111F]'
              : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          📊 Export & Backup Center
        </button>
      </div>

      {/* ================= TAB 1: GRADEBOOK ================= */}
      {activeTab === 'gradebook' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate name, class, or code..."
                className="w-full bg-[var(--card)] border border-[var(--line)] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[var(--ink)] focus:border-[var(--teal)] outline-none"
              />
              <span className="absolute left-3 top-2.5 text-xs text-[var(--ink3)]">🔍</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubmissions(INITIAL_SEED_SUBMISSIONS);
                  saveAllSubmissions(INITIAL_SEED_SUBMISSIONS);
                  showToast('Sample student submissions reloaded.');
                }}
                className="px-3 py-2 rounded-xl bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--ink2)] hover:text-[var(--ink)]"
              >
                🔄 Reset Sample Data
              </button>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--card2)] border-b border-[var(--line)] text-[var(--ink3)]">
                    <th className="p-3.5 font-bold">Candidate</th>
                    <th className="p-3.5 font-bold">Class / ID</th>
                    <th className="p-3.5 font-bold text-center">Objective (50)</th>
                    <th className="p-3.5 font-bold text-center">Essay (10)</th>
                    <th className="p-3.5 font-bold text-center">Total (60)</th>
                    <th className="p-3.5 font-bold text-center">Scaled %</th>
                    <th className="p-3.5 font-bold">CEFR Band</th>
                    <th className="p-3.5 font-bold text-center">Status</th>
                    <th className="p-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {filteredSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className={`hover:bg-[var(--card2)]/60 transition ${
                        selectedSubId === sub.id ? 'bg-[var(--card2)]/90' : ''
                      }`}
                    >
                      <td className="p-3.5 font-extrabold text-[var(--ink)]">
                        <div className="flex items-center gap-2">
                          <span>{sub.name}</span>
                          {(sub.blurs || 0) > 1 && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[0.62rem] bg-rose-500/20 text-rose-400 font-bold"
                              title={`${sub.blurs} tab switches during exam`}
                            >
                              ⚠️ {sub.blurs}
                            </span>
                          )}
                        </div>
                        <div className="text-[0.65rem] font-mono text-[var(--ink3)] mt-0.5">{sub.code}</div>
                      </td>
                      <td className="p-3.5 text-[var(--ink2)] font-medium">{sub.cls || '—'}</td>
                      <td className="p-3.5 text-center font-bold text-[var(--teal)]">
                        {sub.autoScore} <span className="text-[0.65rem] text-[var(--ink3)] font-normal">/50</span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-[var(--purple)]">
                        {sub.teacherScore} <span className="text-[0.65rem] text-[var(--ink3)] font-normal">/10</span>
                      </td>
                      <td className="p-3.5 text-center font-black text-[var(--ink)] text-sm">{sub.finalScore}</td>
                      <td className="p-3.5 text-center font-extrabold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            sub.finalPct >= 75
                              ? 'bg-teal-500/20 text-teal-400 font-black'
                              : sub.finalPct >= 60
                              ? 'bg-indigo-500/20 text-indigo-300 font-bold'
                              : 'bg-rose-500/20 text-rose-400 font-bold'
                          }`}
                        >
                          {sub.finalPct}%
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[var(--ink2)] text-[0.72rem]">{sub.cefrLevel}</td>
                      <td className="p-3.5 text-center">
                        {sub.isGraded ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[0.65rem] font-extrabold">
                            ✓ Graded
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[0.65rem] font-extrabold animate-pulse">
                            ⏳ Needs Review
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubId(sub.id);
                            setActiveTab('questions');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--purple)]/20 text-[var(--purple)] border border-[var(--purple)]/40 font-black text-xs hover:bg-[var(--purple)] hover:text-white transition inline-flex items-center gap-1 shadow-sm"
                          title={`Inspect all questions answered by ${sub.name} with correct and wrong answers`}
                        >
                          <span>🔍</span> View Answers
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubId(sub.id);
                            setActiveTab('grading');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--tealsoft)] text-[var(--teal)] font-black text-xs hover:bg-[var(--teal)] hover:text-[#08111F] transition"
                        >
                          ✍️ Grade / Feedback
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrintSingle(sub)}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--card3)] border border-[var(--line)] text-xs font-bold hover:border-[var(--teal)] text-[var(--ink)]"
                          title="Print or Save PDF"
                        >
                          🖨️ PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const text = formatTelegramFeedback(sub);
                            navigator.clipboard.writeText(text);
                            showToast(`Copied feedback template for ${sub.name}!`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--card3)] border border-[var(--line)] text-xs font-bold hover:border-[var(--purple)] text-[var(--ink)]"
                          title="Copy Telegram/WhatsApp message"
                        >
                          💬 Copy Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: GRADING & FEEDBACK ================= */}
      {activeTab === 'grading' && currentSelectedSub && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Student Selector & Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-4">
              <label className="block text-[0.68rem] uppercase tracking-wider font-extrabold text-[var(--ink3)]">
                Select Candidate to Grade:
              </label>
              <select
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
                className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3 text-xs text-[var(--ink)] font-extrabold focus:border-[var(--teal)] outline-none"
              >
                {submissions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.cls || 'No Class'}) — {s.isGraded ? `✓ ${s.finalScore}/60` : '⏳ Ungraded'}
                  </option>
                ))}
              </select>

              <div className="p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--ink3)] font-bold">Candidate:</span>
                  <span className="font-extrabold text-[var(--ink)]">{currentSelectedSub.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink3)] font-bold">Class / ID:</span>
                  <span className="font-bold text-[var(--ink)]">{currentSelectedSub.cls || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink3)] font-bold">Objective Score:</span>
                  <span className="font-bold text-[var(--teal)]">{currentSelectedSub.autoScore} / 50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink3)] font-bold">Time Spent:</span>
                  <span className="font-bold text-[var(--ink)]">
                    {Math.floor(currentSelectedSub.timeUsed / 60)} min {currentSelectedSub.timeUsed % 60} sec
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink3)] font-bold">Exam Code:</span>
                  <span className="font-mono text-[var(--teal)] font-bold">{currentSelectedSub.code}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePrintSingle(currentSelectedSub)}
                className="w-full py-2.5 rounded-xl bg-[var(--card2)] border border-[var(--teal)] text-xs font-black text-[var(--teal)] hover:bg-[var(--teal)] hover:text-[#08111F] transition flex items-center justify-center gap-1.5"
              >
                <span>🖨️</span> Print / Save PDF for {currentSelectedSub.name}
              </button>

              <button
                type="button"
                onClick={() => {
                  const text = formatTelegramFeedback(currentSelectedSub);
                  navigator.clipboard.writeText(text);
                  showToast(`Copied ready-to-send Telegram message for ${currentSelectedSub.name}!`);
                }}
                className="w-full py-2.5 rounded-xl bg-[var(--card2)] border border-[var(--purple)] text-xs font-black text-[var(--purple)] hover:bg-[var(--purple)] hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <span>💬</span> Copy Telegram / WhatsApp Feedback
              </button>
            </div>
          </div>

          {/* Right: Essay Text, Rubric Sliders, Feedback Editor */}
          <div className="lg:col-span-2 space-y-5">
            {/* Student's Essay Text */}
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 flex-wrap gap-2">
                <h3 className="text-sm font-extrabold text-[var(--ink)] flex items-center gap-2">
                  <span>📝</span> Part 8 Submitted Essay
                </h3>
                <div className="text-xs font-bold text-[var(--teal)] bg-[var(--tealsoft)] px-2.5 py-1 rounded-lg">
                  Word Count: {currentSelectedSub.essayWordCount || currentSelectedSub.essayText?.split(/\s+/).length || 0} words
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line2)] text-xs sm:text-sm text-[var(--ink)] leading-relaxed font-serif whitespace-pre-wrap max-h-72 overflow-y-auto">
                {currentSelectedSub.essayText || '(No essay text submitted by candidate)'}
              </div>
            </div>

            {/* Visual Essay Rubric Component */}
            <VisualEssayRubric
              rubric={editRubric}
              onChange={setEditRubric}
              wordCount={currentSelectedSub.essayWordCount || currentSelectedSub.essayText?.split(/\s+/).length || 0}
              studentName={currentSelectedSub.name}
            />

            {/* Feedback & Grading Action Box */}
            <div className="bg-[var(--card)] border border-[var(--line2)] rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 flex-wrap gap-2">
                <div>
                  <div className="text-[0.68rem] uppercase font-black tracking-wider text-[var(--teal)]">
                    Feedback & Official Endorsement
                  </div>
                  <h3 className="text-base font-extrabold text-[var(--ink)]">Teacher Review by Tr. Hein Tay Za</h3>
                </div>
                <div className="text-right">
                  <div className="text-[0.68rem] text-[var(--ink3)] font-bold uppercase">Awarded Essay Score</div>
                  <div className="text-2xl font-black text-[var(--teal)]">
                    {(editRubric.task + editRubric.coherence + editRubric.lexical + editRubric.grammar).toFixed(1)} / 10
                  </div>
                </div>
              </div>

              {/* Feedback Presets */}
              <div className="space-y-1.5">
                <div className="text-[0.68rem] uppercase font-bold text-[var(--ink3)]">
                  Quick Feedback Templates (Click to insert):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditFeedback(
                        'Outstanding essay! You articulated both viewpoints with maturity, supported your arguments with concrete examples, and applied advanced B2 collocations and conditional structures accurately. Excellent work!'
                      );
                      setEditRubric({ task: 2.5, coherence: 2.5, lexical: 2.5, grammar: 2.5 });
                      showToast('Inserted Outstanding template (10/10)');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-[0.72rem] font-bold text-[var(--ink)] hover:border-[var(--teal)]"
                  >
                    🌟 Outstanding (10/10)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditFeedback(
                        'Very good essay! Your 4-paragraph structure was well developed and easy to follow. To reach the highest band, incorporate more varied transitional devices (e.g. Furthermore, On the other hand) and check subject-verb agreement.'
                      );
                      setEditRubric({ task: 2.0, coherence: 2.0, lexical: 2.5, grammar: 2.0 });
                      showToast('Inserted Strong B2 template (8.5/10)');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-[0.72rem] font-bold text-[var(--ink)] hover:border-[var(--teal)]"
                  >
                    👍 Strong B2 (8.5/10)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditFeedback(
                        'Good effort. You addressed the main question, but the argument for natural talent was slightly underdeveloped. Focus on writing a clearer topic sentence for each paragraph and review past tense consistency.'
                      );
                      setEditRubric({ task: 2.0, coherence: 1.5, lexical: 1.5, grammar: 1.5 });
                      showToast('Inserted Needs Practice template (6.5/10)');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-[0.72rem] font-bold text-[var(--ink)] hover:border-[var(--teal)]"
                  >
                    💡 Needs Practice (6.5/10)
                  </button>
                </div>
              </div>

              {/* Personalized Feedback Area */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[var(--ink)]">
                  Personalized Teacher Feedback & Advice by Tr. Hein Tay Za:
                </label>
                <textarea
                  rows={4}
                  value={editFeedback}
                  onChange={(e) => setEditFeedback(e.target.value)}
                  placeholder="Type specific praise, grammatical corrections, and advice here..."
                  className="w-full rounded-xl bg-[var(--card2)] border border-[var(--line2)] p-3 text-xs sm:text-sm text-[var(--ink)] focus:border-[var(--teal)] outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-[var(--line)]">
                <div className="text-xs text-[var(--ink2)]">
                  Calculated Combined Score:{' '}
                  <b className="text-[var(--teal)]">
                    {(currentSelectedSub.autoScore + editRubric.task + editRubric.coherence + editRubric.lexical + editRubric.grammar).toFixed(1)} / 60
                  </b>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveGrade}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] text-xs font-black hover:opacity-95 shadow-md shadow-teal-500/20"
                  >
                    💾 Save Grade & Update Report
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate Proctoring Snapshots & Integrity Audit */}
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 flex-wrap gap-2">
                <h3 className="text-sm font-extrabold text-[var(--ink)] flex items-center gap-2">
                  <span>📷</span> Webcam Proctoring Snapshots &amp; Integrity Log
                </h3>
                <div className="text-xs font-bold text-[var(--teal)]">
                  Tab Switches: <b>{currentSelectedSub.blurs || 0}</b>
                </div>
              </div>

              {currentSelectedSub.photos && currentSelectedSub.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {currentSelectedSub.photos.map((p, pIdx) => (
                    <div key={pIdx} className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-2 space-y-1.5 text-center">
                      <img
                        src={p.d}
                        alt={`Snapshot ${p.t}`}
                        className="w-full aspect-[4/3] object-cover rounded-lg bg-black border border-[var(--line2)]"
                      />
                      <div className="text-[0.65rem] font-bold text-[var(--ink2)] uppercase flex justify-between px-1">
                        <span>Tag: {p.t}</span>
                        <span>{new Date(p.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--card2)] text-xs text-[var(--ink3)] text-center">
                  No camera snapshots recorded for this candidate (Device did not support or grant camera access).
                </div>
              )}
            </div>

            {/* Candidate Question-by-Question Answers Inspector */}
            <div className="pt-2">
              <CandidateQuestionInspector
                submission={currentSelectedSub}
                Q={Q}
                toast={showToast}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: QUESTION ANSWERS & ITEM ANALYSIS ================= */}
      {activeTab === 'questions' && currentSelectedSub && (
        <CandidateQuestionInspector
          submission={currentSelectedSub}
          allSubmissions={submissions}
          onSelectSubmission={(id) => setSelectedSubId(id)}
          Q={Q}
          toast={showToast}
          onOpenGrading={() => setActiveTab('grading')}
        />
      )}

      {/* ================= TAB 3: IMPORT SUBMISSIONS ================= */}
      {activeTab === 'import' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold text-[var(--ink)] flex items-center gap-2">
              <span>📥</span> Option A: Paste Telegram Message / Student Code
            </h3>
            <p className="text-xs text-[var(--ink2)] leading-relaxed">
              When a student sends you their completion message or code from Telegram/WhatsApp, paste it here to automatically import and grade their exam.
            </p>
            <textarea
              rows={6}
              value={pasteCodeText}
              onChange={(e) => setPasteCodeText(e.target.value)}
              placeholder="Paste student's message containing code like MT15-AUNG-088-9899889A-2408 and essay..."
              className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3 text-xs text-[var(--ink)] focus:border-[var(--purple)] outline-none"
            />
            <button
              type="button"
              onClick={handleImportCode}
              className="w-full py-2.5 rounded-xl bg-[var(--purple)] text-white text-xs font-extrabold hover:opacity-95 shadow-md"
            >
              Parse Code & Import Candidate
            </button>
          </div>

          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold text-[var(--ink)] flex items-center gap-2">
              <span>📦</span> Option B: Import JSON Backup File
            </h3>
            <p className="text-xs text-[var(--ink2)] leading-relaxed">
              Paste JSON submissions exported from another browser or device to merge with your current gradebook.
            </p>
            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON array here [ { ... } ]"
              className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3 text-xs text-[var(--ink)] font-mono focus:border-[var(--teal)] outline-none"
            />
            <button
              type="button"
              onClick={handleImportJSON}
              className="w-full py-2.5 rounded-xl bg-[var(--teal)] text-[#08111F] text-xs font-black hover:opacity-95 shadow-md"
            >
              Merge JSON Submissions
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 4: EXPORT & BACKUP CENTER ================= */}
      {activeTab === 'analytics' && (
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-black text-[var(--ink)]">📊 Data Export & Report Center</h3>
            <p className="text-xs text-[var(--ink2)] mt-1">
              Download and archive records for Tr. Hein Tay Za&apos;s records or share with administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-2xl">🖨️</div>
                <div className="text-sm font-extrabold text-[var(--ink)] mt-2">Download All PDF Reports</div>
                <div className="text-xs text-[var(--ink2)] mt-1">
                  Generates a multi-page printable document of all {submissions.length} students with individual scorecards and teacher feedback.
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrintBatch}
                className="w-full py-2.5 rounded-xl bg-[var(--teal)] text-[#08111F] text-xs font-black hover:opacity-95"
              >
                Generate Batch PDF
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-2xl">📊</div>
                <div className="text-sm font-extrabold text-[var(--ink)] mt-2">Export CSV Spreadsheet</div>
                <div className="text-xs text-[var(--ink2)] mt-1">
                  Downloads an Excel-compatible spreadsheet with student names, dates, 8-part scores, final %, and teacher comments.
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadCSV(submissions)}
                className="w-full py-2.5 rounded-xl bg-[var(--card3)] border border-[var(--line2)] text-xs font-black text-[var(--ink)] hover:border-[var(--teal)]"
              >
                Download CSV
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-2xl">💾</div>
                <div className="text-sm font-extrabold text-[var(--ink)] mt-2">Download JSON Backup</div>
                <div className="text-xs text-[var(--ink2)] mt-1">
                  Exports raw full records including essay responses and timestamp metadata for safe keeping.
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadJSONBackup(submissions)}
                className="w-full py-2.5 rounded-xl bg-[var(--card3)] border border-[var(--line2)] text-xs font-black text-[var(--ink)] hover:border-[var(--purple)]"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
