import React, { useState, useMemo } from 'react';
import { CONFIG, PARTS, PASSAGES, LISTENINGS, Question } from './examData';
import ExamSummaryModal from './ExamSummaryModal';

interface DetailedResultViewProps {
  state: any;
  Q: Question[];
  toast: (msg: string) => void;
  onRetake: () => void;
}

function escapeHtml(str: string) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function DetailedResultView({ state, Q, toast, onRetake }: DetailedResultViewProps) {
  const res = state.result || {};
  const [activeTab, setActiveTab] = useState<'feedback' | 'questions' | 'essay' | 'overview' | 'proctor'>('feedback');
  const [selectedPartFilter, setSelectedPartFilter] = useState<number | 'all'>('all');
  const [onlyMistakes, setOnlyMistakes] = useState<boolean>(false);
  const [questionSearch, setQuestionSearch] = useState<string>('');
  const [expandedPart, setExpandedPart] = useState<number | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(true);

  // Teacher feedback & grading state for Part 8 Essay
  const [teacherScore, setTeacherScore] = useState<string>('8.5');
  const [teacherFeedbackText, setTeacherFeedbackText] = useState<string>(
    'Well-balanced discursive essay with clear paragraphing and good topic vocabulary. Keep working on varied linking devices and complex conditional clauses for C1 level.'
  );
  const [rubricScores, setRubricScores] = useState<{
    task: string;
    coherence: string;
    lexical: string;
    grammar: string;
  }>({
    task: '2.0',
    coherence: '2.0',
    lexical: '2.5',
    grammar: '2.0',
  });

  // CEFR Grade Evaluation - Simple, student-friendly tone
  const cefrEvaluation = useMemo(() => {
    const pct = res.pct || 0;
    if (pct >= 85) {
      return {
        level: 'C1 (Advanced Level)',
        band: 'Excellent Score!',
        color: 'text-[#2DD4A7]',
        bg: 'bg-[#2DD4A7]/10',
        border: 'border-[#2DD4A7]',
        summary:
          'Great job! You did fantastic across all parts of the test, including the tricky grammar and the video listening. Keep up this amazing standard!',
      };
    }
    if (pct >= 75) {
      return {
        level: 'B2+ (Strong Vantage)',
        band: 'Very Good!',
        color: 'text-[#2DD4A7]',
        bg: 'bg-[#2DD4A7]/10',
        border: 'border-[#2DD4A7]',
        summary:
          'Well done! You have a strong grasp of Units 1–5. You understood the reading texts well, followed the video clearly, and used grammar accurately.',
      };
    }
    if (pct >= 60) {
      return {
        level: 'B2 (Pass Standard)',
        band: 'Good Pass!',
        color: 'text-[#F5C542]',
        bg: 'bg-[#F5C542]/10',
        border: 'border-[#F5C542]',
        summary:
          'Nice work! You passed the test and understand the main topics of Units 1–5. Check the questions you missed below to help you improve.',
      };
    }
    if (pct >= 45) {
      return {
        level: 'B1+ (Almost B2)',
        band: 'Almost There!',
        color: 'text-[#F5C542]',
        bg: 'bg-[#F5C542]/10',
        border: 'border-[#F5C542]',
        summary:
          'You understood the main ideas, but had some trouble with harder grammar (like conditionals and past tenses) or fast speech in the listening.',
      };
    }
    return {
      level: 'B1 (Needs Practice)',
      band: 'Keep Practicing!',
      color: 'text-[#F2607A]',
      bg: 'bg-[#F2607A]/10',
      border: 'border-[#F2607A]',
      summary:
        'Don’t worry! Take time to review the grammar rules and word lists for Units 1 to 5, especially past tenses and conditional sentences.',
    };
  }, [res.pct]);

  // Total mistakes count
  const totalMistakesCount = useMemo(() => {
    return (res.rows || []).filter((r: any) => !r.ok).length;
  }, [res.rows]);

  // Questions filtered for review
  const filteredQuestions = useMemo(() => {
    return (res.rows || []).filter((r: any) => {
      if (selectedPartFilter !== 'all' && r.p !== selectedPartFilter) return false;
      if (onlyMistakes && r.ok) return false;
      if (questionSearch.trim()) {
        const query = questionSearch.toLowerCase().trim();
        const numMatch = `q${r.i + 1}`.includes(query) || `${r.i + 1}` === query;
        const origQ = Q.find((item) => item.i === r.i);
        const textMatch = (origQ?.q || '').toLowerCase().includes(query);
        const focusMatch = (r.s || '').toLowerCase().includes(query);
        const yourMatch = (r.your || '').toLowerCase().includes(query);
        const rightMatch = (r.right || '').toLowerCase().includes(query);
        const expMatch = (r.e || '').toLowerCase().includes(query);
        if (!numMatch && !textMatch && !focusMatch && !yourMatch && !rightMatch && !expMatch) return false;
      }
      return true;
    });
  }, [res.rows, selectedPartFilter, onlyMistakes, questionSearch, Q]);

  // Part-specific feedback texts and diagnostics - simple, encouraging, clear
  const getPartFeedback = (partNum: number) => {
    const partStat = res.perPart ? res.perPart[partNum] : null;
    const got = partStat?.got || 0;
    const max = partStat?.max || 1;
    const pct = Math.round((got / max) * 100);

    switch (partNum) {
      case 1:
        return {
          title: 'Part 1: Reading',
          subtitle: 'Story A (Mira at sea) & Story B (Daniel’s lucky train)',
          pct,
          got,
          max,
          strengths:
            pct >= 70
              ? 'You did a great job understanding both stories! You found specific details quickly and understood how the characters felt and thought.'
              : 'You understood the main storyline of both texts.',
          weaknesses:
            pct < 70
              ? 'Be careful with trap choices: read the question carefully to see what it really asks, not just words that look familiar from the text.'
              : 'Only missed a couple of tricky detail questions.',
          tips: [
            'Tip 1: Look at the whole sentence in the text, not just single words.',
            'Tip 2: Cross out options you know are 100% wrong first.',
          ],
        };
      case 2:
        return {
          title: 'Part 2: Grammar',
          subtitle: 'Units 1–5 Grammar Rules (Tenses, Conditionals & Questions)',
          pct,
          got,
          max,
          strengths:
            pct >= 75
              ? 'Awesome grammar score! You used question word order, past tenses, future forms, and if-sentences very accurately.'
              : 'Good understanding of basic sentences and tenses.',
          weaknesses:
            pct < 75
              ? 'Common areas to practice: mixed conditionals (if + past), indirect question word order, and using Simple vs Continuous tenses.'
              : 'Just a few small mistakes on word order or tricky tenses.',
          tips: [
            'Indirect questions: Keep normal order — say "Can you tell me where he is?" (NOT "where is he").',
            'Present Perfect Continuous: Use "-ing" for actions taking time ("I have been studying for 2 hours").',
            'Third Conditional: "If + had + V3, would have + V3" for things in the past that didn’t happen.',
          ],
        };
      case 3:
        return {
          title: 'Part 3: Vocabulary',
          subtitle: 'Personality words, Strong Adjectives, Phrases & Idioms',
          pct,
          got,
          max,
          strengths:
            pct >= 75
              ? 'Super vocabulary score! You know personality adjectives, strong pairs (freezing, exhausted), and common idioms well.'
              : 'Good general knowledge of Unit 1–5 words.',
          weaknesses:
            pct < 75
              ? 'Review strong adjectives (use "absolutely freezing", not "very freezing") and phrases like "hit it off" and "take for granted".'
              : 'Minor slips on prepositions or word endings.',
          tips: [
            'Strong adjectives: Say "completely exhausted" or "absolutely freezing" (do NOT use "very" with extreme words).',
            'Idioms: "Hit it off" = become good friends right away; "Drift apart" = slowly lose contact.',
          ],
        };
      case 4:
        return {
          title: 'Part 4: Writing Skills',
          subtitle: 'Essay Structure, Linking Words & Paragraphs',
          pct,
          got,
          max,
          strengths:
            pct >= 70
              ? 'You know how to organize an essay, write topic sentences, and use linking words (However, In addition, In spite of) correctly.'
              : 'Good sense of how paragraphs and basic linking words work.',
          weaknesses:
            pct < 70
              ? 'Remember the difference between linking words like "Although" (+ subject & verb) and "Despite" (+ noun or -ing).'
              : 'Just a few points lost on formal vs informal words.',
          tips: [
            'Use "Although + subject + verb" (e.g., Although it was raining...).',
            'Use "Despite + noun / -ing" (e.g., Despite the rain...).',
            'Always start each body paragraph with one clear main point.',
          ],
        };
      case 5:
        return {
          title: 'Part 5: Pronunciation',
          subtitle: 'Word Stress & Sentence Rhythm',
          pct,
          got,
          max,
          strengths:
            pct >= 80
              ? 'Great listening ear! You easily identified which syllables and words carry the main stress in English.'
              : 'Good job hearing where English words are stressed.',
          weaknesses:
            pct < 80
              ? 'Notice how word stress changes when you add endings like -ic (pho-TOG-ra-pher vs pho-to-GRAPH-ic).'
              : 'A couple of slips on sentence stress.',
          tips: [
            'Words ending in -ic or -tion almost always stress the syllable right before them (e.g., in-for-MA-tion).',
            'In full sentences, we usually stress nouns, verbs, and adjectives more than small words like "to", "at", or "the".',
          ],
        };
      case 6:
        return {
          title: 'Part 6: Everyday English & Speaking Situations',
          subtitle: 'Polite Disagreeing, Giving Opinions & Reacting',
          pct,
          got,
          max,
          strengths:
            pct >= 70
              ? 'Great communication choices! You picked natural, polite phrases to share opinions and disagree nicely without being rude.'
              : 'Good understanding of conversational English phrases.',
          weaknesses:
            pct < 70
              ? 'Practice polite ways to disagree in English (like "I see what you mean, but..." instead of "You are wrong").'
              : 'Minor slips on situational expressions.',
          tips: [
            'Polite disagreement: Say "I’m not so sure about that" or "That may be true, but..."',
            'Surprised reactions: Say "You’re joking!" or "I never would have guessed!"',
          ],
        };
      case 7:
        return {
          title: 'Part 7: Video Listening',
          subtitle: 'Video Test: Relationship Dilemmas (Emma, Sofia, Daniel)',
          pct,
          got,
          max,
          strengths:
            pct >= 70
              ? 'Super listening comprehension! You understood the natural British English accents and followed all three relationship problems.'
              : 'You understood the main idea of what each person talked about.',
          weaknesses:
            pct < 70
              ? 'Listen closely for specific phrases like "confident without being arrogant" or "take each other for granted".'
              : 'Missed a few small details in fast speech.',
          tips: [
            'Speaker 1 (Emma): Liked Josh because he was confident, but didn’t want to rush into things too fast.',
            'Speaker 2 (Sofia): Felt her friend Ashley was being cold and critical after a breakup, but wants to talk and make up.',
            'Speaker 3 (Daniel): Long relationship (4 years) with no fights, but feels they are taking each other for granted.',
          ],
        };
      case 8:
        return {
          title: 'Part 8: Essay Writing',
          subtitle: 'Marked by Teacher (10 Points) · Hard work vs Talent',
          pct: 100,
          got: 'Pending',
          max: 10,
          strengths: 'Your essay is saved and submitted to Tr. Hein Tay Za for grading.',
          weaknesses: 'Make sure your essay has 180–220 words and explains both sides of the topic with clear examples.',
          tips: [
            '1. Answer both sides: Explain why hard work matters, and also why talent or luck matters.',
            '2. Give your clear opinion in the introduction and conclusion.',
            '3. Use 4 clear paragraphs: Intro → Point 1 → Point 2 → Conclusion.',
            '4. Check your spelling and verb tenses before submitting.',
          ],
        };
      default:
        return null;
    }
  };

  const essayAnswer = (state.ans[Q.findIndex((q) => q.t === 'essay')] || '').trim();
  const essayWordCount = essayAnswer ? essayAnswer.split(/\s+/).filter(Boolean).length : 0;

  // Build clean self-contained HTML document for printing & downloading
  const buildReportHTML = (autoPrint = false) => {
    const now = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const totalFinalScore = (Number(res.got) || 0) + (parseFloat(teacherScore) || 0);
    const totalMaxScore = (Number(res.max) || 0) + 10;
    const finalGradePct = Math.round((totalFinalScore / totalMaxScore) * 100);

    const partRows = PARTS.map((p) => {
      const pStat = res.perPart ? res.perPart[p.n] : null;
      const got = p.n === 8 ? `${teacherScore} / 10` : (pStat?.got || 0);
      const max = p.pts;
      const pct = p.n === 8 
        ? `${Math.round(((parseFloat(teacherScore) || 0) / 10) * 100)}%` 
        : `${Math.round(((pStat?.got || 0) / max) * 100)}%`;
      return `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;"><b>Part ${p.n}:</b> ${escapeHtml(p.title)}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${max} pts</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #0d9488;">${got}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${pct}</td>
        </tr>
      `;
    }).join('');

    const unitTitles = [
      '',
      'Unit 1: Outstanding People',
      'Unit 2: Survival',
      'Unit 3: Talent',
      'Unit 4: Life Events',
      'Unit 5: Chance',
    ];

    const unitRows = [1, 2, 3, 4, 5].map((u) => {
      const uStat = res.perUnit ? res.perUnit[u] || { n: 0, right: 0 } : { n: 0, right: 0 };
      const uPct = uStat.n ? Math.round((uStat.right / uStat.n) * 100) : 0;
      return `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px;">
            <span>${unitTitles[u]}</span>
            <span>${uStat.right} / ${uStat.n} (${uPct}%)</span>
          </div>
          <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="width: ${uPct}%; height: 100%; background: #0d9488; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }).join('');

    const questionRows = (res.rows || []).map((row: any) => {
      const isOk = row.ok;
      return `
        <div style="border: 1px solid ${isOk ? '#e5e7eb' : '#fecdd3'}; background: ${isOk ? '#ffffff' : '#fff1f2'}; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 6px;">
            <span style="color: #4b5563;">Q${row.n} · Part ${row.p} · Unit ${row.u}</span>
            <span style="color: ${isOk ? '#059669' : '#e11d48'};">${isOk ? '✓ Correct (' + row.g + ' pt)' : '✗ Incorrect (0 pt)'}</span>
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 8px;">${escapeHtml(row.q)}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 6px;">
            <div style="background: #f3f4f6; padding: 8px 10px; border-radius: 6px;">
              <b style="color: #4b5563;">Your Answer:</b> <span style="color: ${isOk ? '#059669' : '#e11d48'}; font-weight: 600;">${escapeHtml(row.uA || '(none)')}</span>
            </div>
            <div style="background: #ecfdf5; padding: 8px 10px; border-radius: 6px;">
              <b style="color: #065f46;">Correct Answer:</b> <span style="color: #047857; font-weight: 600;">${escapeHtml(row.cA)}</span>
            </div>
          </div>
          ${row.e ? `<div style="font-size: 12px; color: #374151; background: #ffffff; padding: 6px 10px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 4px;"><b>Explanation:</b> ${escapeHtml(row.e)}</div>` : ''}
        </div>
      `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Heinfinity English - B2 Exam Report - ${escapeHtml(state.name || 'Student')}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #f3f4f6;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .top-actions {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-bottom: 20px;
      padding: 12px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .btn {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary {
      background: #0d9488;
      color: #ffffff;
    }
    .btn-primary:hover { background: #0f766e; }
    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover { background: #e5e7eb; }
    .header {
      border-bottom: 2px solid #0d9488;
      padding-bottom: 18px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .exam-subtitle {
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
    }
    .score-banner {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .score-circle {
      text-align: center;
    }
    .score-number {
      font-size: 36px;
      font-weight: 900;
      color: #0f766e;
      line-height: 1;
    }
    .score-max {
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
    }
    .section-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 24px 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      background: #f8fafc;
      padding: 10px 12px;
      text-align: left;
      font-weight: 700;
      color: #475569;
      border-bottom: 2px solid #e2e8f0;
    }
    .essay-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      margin-bottom: 16px;
    }
    .code-box {
      font-family: monospace;
      font-size: 13px;
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px dashed #94a3b8;
      font-weight: 700;
      color: #0f172a;
      display: inline-block;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        color: #000000 !important;
      }
      .container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .top-actions {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-actions">
      <button class="btn btn-secondary" onclick="window.close()">✕ Close Preview</button>
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>

    <div class="header">
      <div>
        <div class="brand-title">HEINFINITY ENGLISH</div>
        <div class="exam-subtitle">Cambridge Empower B2 Mid-Term Examination (Units 1–5)</div>
      </div>
      <div style="text-align: right; font-size: 12px; color: #475569;">
        <div><b>Date:</b> ${now}</div>
        <div style="margin-top: 4px;"><b>Completion Code:</b> <span class="code-box">${res.code || 'N/A'}</span></div>
      </div>
    </div>

    <div style="margin-bottom: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 13px;">
      <div><b>Student:</b> ${escapeHtml(state.name || 'Candidate')} ${state.cls ? `(${escapeHtml(state.cls)})` : ''}</div>
      <div><b>Duration:</b> ${Math.floor((res.timeUsed || 0) / 60)}m ${(res.timeUsed || 0) % 60}s</div>
      <div><b>Camera Proctoring:</b> ${state.camOK ? 'Verified Active ✓' : 'Disabled'}</div>
      <div><b>Tab switches:</b> ${state.blurs || 0} time(s)</div>
    </div>

    <div class="score-banner">
      <div class="score-circle">
        <div class="score-number">${res.pct}%</div>
        <div class="score-max">${res.got} / ${res.max} points</div>
      </div>
      <div style="flex: 1;">
        <div style="font-size: 16px; font-weight: 800; color: #0f766e; margin-bottom: 4px;">
          ${cefrEvaluation.band} · ${cefrEvaluation.level}
        </div>
        <div style="font-size: 13px; color: #334155; line-height: 1.5;">
          ${escapeHtml(cefrEvaluation.summary)}
        </div>
      </div>
    </div>

    <div class="section-title">📊 Part-by-Part Score Ledger</div>
    <table>
      <thead>
        <tr>
          <th>Part / Component</th>
          <th style="text-align: center;">Max Points</th>
          <th style="text-align: center;">Score</th>
          <th style="text-align: center;">Percentage</th>
        </tr>
      </thead>
      <tbody>
        ${partRows}
      </tbody>
    </table>

    <div class="section-title">📈 Unit Mastery (Units 1 to 5)</div>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      ${unitRows}
    </div>

    <div class="page-break"></div>

    <div class="section-title">✍️ Part 8: Student Essay Submission (${essayWordCount} words)</div>
    <div class="essay-box">${escapeHtml(essayAnswer || '(No essay text provided)')}</div>

    <!-- Teacher Hein Tay Za's Essay Assessment Box -->
    <div style="background: #fdfefe; border: 2px solid #0d9488; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(13,148,136,0.08);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccfbf1; padding-bottom: 10px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-size: 11px; font-weight: 800; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px;">Teacher Assessment & Marking</div>
          <div style="font-size: 16px; font-weight: 900; color: #0f172a;">Evaluated by Tr. Hein Tay Za</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 20px; font-weight: 900; color: #0d9488;">${teacherScore} / 10 pts</span>
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">Overall Exam Total: ${totalFinalScore} / ${totalMaxScore} (${finalGradePct}%)</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 10px; border-radius: 8px; font-size: 12px;">
          <div style="font-weight: 700; color: #0f766e; display: flex; justify-content: space-between;">
            <span>1. Task Achievement</span>
            <span>${rubricScores.task}/2.5</span>
          </div>
        </div>
        <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 10px; border-radius: 8px; font-size: 12px;">
          <div style="font-weight: 700; color: #0f766e; display: flex; justify-content: space-between;">
            <span>2. Organization</span>
            <span>${rubricScores.coherence}/2.5</span>
          </div>
        </div>
        <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 10px; border-radius: 8px; font-size: 12px;">
          <div style="font-weight: 700; color: #0f766e; display: flex; justify-content: space-between;">
            <span>3. Vocabulary</span>
            <span>${rubricScores.lexical}/2.5</span>
          </div>
        </div>
        <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 10px; border-radius: 8px; font-size: 12px;">
          <div style="font-weight: 700; color: #0f766e; display: flex; justify-content: space-between;">
            <span>4. Grammar</span>
            <span>${rubricScores.grammar}/2.5</span>
          </div>
        </div>
      </div>

      <div style="font-size: 12px; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
        <div style="font-weight: 800; color: #0f766e; margin-bottom: 4px;">💬 Personalized Teacher Feedback & Guidance:</div>
        <div style="line-height: 1.6; white-space: pre-wrap;">${escapeHtml(teacherFeedbackText || '(No personalized feedback entered)')}</div>
      </div>
      <div style="margin-top: 10px; text-align: right; font-size: 11px; font-weight: 700; color: #64748b;">
        — Tr. Hein Tay Za · Heinfinity English
      </div>
    </div>

    <div class="section-title">📝 Complete Question Breakdown & Answers</div>
    <div style="margin-top: 12px;">
      ${questionRows}
    </div>

    <div style="margin-top: 36px; padding-top: 18px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
      Heinfinity English Examination Assessment System · Tr. Hein Tay Za · Empower B2 Mid-Term Examination
    </div>
  </div>
  ${autoPrint ? '<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>' : ''}
</body>
</html>`;
  };

  const handleDownloadReport = () => {
    try {
      const html = buildReportHTML(false);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (state.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `Heinfinity_B2_Exam_Report_${safeName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('📄 PDF-ready exam report downloaded! Open file & print to save as PDF.');
      setShowPrintModal(false);
    } catch (err) {
      toast('Download failed. Please use Telegram report copy.');
    }
  };

  const handleOpenInNewTab = () => {
    try {
      const html = buildReportHTML(true);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const newWin = window.open(url, '_blank');
      if (!newWin) {
        handleDownloadReport();
      } else {
        toast('Opening printable report in a new tab...');
        setShowPrintModal(false);
      }
    } catch (e) {
      handleDownloadReport();
    }
  };

  const handleDirectPrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Direct print prevented:', err);
      setShowPrintModal(true);
      toast('Direct print was blocked by the browser. Use the Download option!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 anim-fade">
      {/* ================= PRINT / PDF EXPORT MODAL ================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm anim-fade no-print">
          <div className="bg-[var(--card)] border border-[var(--line2)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🖨️</span>
                <h3 className="text-base font-extrabold text-[var(--ink)]">Print or Save Exam Report</h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="w-8 h-8 rounded-lg bg-[var(--card2)] hover:bg-[var(--card3)] text-[var(--ink2)] hover:text-[var(--ink)] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--ink2)] leading-relaxed">
              Choose how you would like to save your complete Cambridge Empower B2 exam results and question-by-question review:
            </p>

            <div className="space-y-3">
              {/* Option 1: 1-Click File Download (Guaranteed to work in all browsers/iframes) */}
              <button
                onClick={handleDownloadReport}
                className="w-full text-left p-4 rounded-xl border border-[var(--teal)] bg-[var(--tealsoft)] hover:opacity-95 transition space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--teal)] flex items-center gap-1.5">
                    <span>💾</span> Download PDF-Ready Report (.html)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--teal)] text-[#08111F] text-[0.65rem] font-bold">
                    Recommended
                  </span>
                </div>
                <div className="text-[0.72rem] text-[var(--ink)]">
                  Instantly downloads a clean file with all 8 parts, essay, and answers. Open it in Chrome/Safari/Edge and press <b>Print → Save as PDF</b>.
                </div>
              </button>

              {/* Option 2: Open in New Tab with Auto-Print */}
              <button
                onClick={handleOpenInNewTab}
                className="w-full text-left p-3.5 rounded-xl border border-[var(--line)] bg-[var(--card2)] hover:border-[var(--purple)] transition space-y-1"
              >
                <div className="text-xs font-black text-[var(--purple)] flex items-center gap-1.5">
                  <span>↗️</span> Open Printable Page in New Tab
                </div>
                <div className="text-[0.72rem] text-[var(--ink2)]">
                  Opens a full-page clean white version in a new browser tab with print options.
                </div>
              </button>

              {/* Option 3: Direct Browser Print Dialog */}
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  setTimeout(() => handleDirectPrint(), 200);
                }}
                className="w-full text-left p-3.5 rounded-xl border border-[var(--line)] bg-[var(--card2)] hover:border-[var(--line2)] transition space-y-1"
              >
                <div className="text-xs font-black text-[var(--ink)] flex items-center gap-1.5">
                  <span>🖨️</span> Print Current Screen Directly
                </div>
                <div className="text-[0.72rem] text-[var(--ink2)]">
                  Triggers your device&apos;s standard print dialog on this window.
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ink2)] hover:text-[var(--ink)] hover:bg-[var(--card2)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TELEGRAM SUBMISSION PROMINENT NOTICE BANNER ================= */}
      <div className="bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-indigo-500/20 border-2 border-amber-400/80 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-3 anim-fade">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl font-black">
              📢
            </span>
            <div>
              <div className="text-[0.68rem] font-black uppercase tracking-wider text-amber-300">
                ACTION REQUIRED FOR ALL CANDIDATES
              </div>
              <h2 className="text-base sm:text-lg font-black text-[var(--ink)]">
                Send Your Exam Code &amp; Essay to Tr. Hein Tay Za on Telegram
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              const autoParts = PARTS.filter((p) => p.code !== 'Essay');
              let msg = `🎓 HEINFINITY B2 MID-TERM EXAM REPORT\n`;
              msg += `Student: ${state.name} ${state.cls ? `(${state.cls})` : ''}\n`;
              msg += `Verification Code: ${res.code}\n`;
              msg += `Score: ${res.got}/${res.max} (${res.pct}%) — ${cefrEvaluation.band}\n`;
              msg += `Level: ${cefrEvaluation.level}\n\n`;
              msg += `📊 Part Scores:\n`;
              autoParts.forEach((p) => {
                const pStat = res.perPart[p.n];
                msg += `• Part ${p.n} (${p.title}): ${pStat?.got || 0}/${p.pts} pts (${Math.round(((pStat?.got || 0) / p.pts) * 100)}%)\n`;
              });
              msg += `• Part 8 (Essay): 10 pts (Pending Teacher Grading)\n\n`;
              msg += `📈 Units Mastery:\n`;
              [1, 2, 3, 4, 5].forEach((u) => {
                const uStat = res.perUnit[u] || { n: 0, right: 0 };
                const uPct = uStat.n ? Math.round((uStat.right / uStat.n) * 100) : 0;
                msg += `• Unit ${u}: ${uStat.right}/${uStat.n} (${uPct}%)\n`;
              });
              msg += `\n📷 Proctoring: ${state.camOK ? 'Camera Verified ✓' : 'No Camera'} | Tab switches: ${state.blurs}\n`;
              msg += `\n--- PART 8 ESSAY (${essayWordCount} words) ---\n${essayAnswer || '(no essay text)'}\n`;

              navigator.clipboard.writeText(msg);
              toast('✓ Full Exam Report & Code copied! Now paste into Telegram to Tr. Hein Tay Za');
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <span>📋</span> Copy Full Telegram Report &amp; Code
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="bg-[var(--card)]/90 border border-amber-400/40 rounded-xl p-3.5 space-y-1">
            <span className="text-[0.68rem] font-bold text-amber-300 uppercase">Your Unique Exam Code:</span>
            <div className="font-mono text-sm sm:text-base font-black text-[var(--teal)] select-all tracking-wider">
              {res.code}
            </div>
            <p className="text-[0.72rem] text-[var(--ink2)] mt-1">
              Tr. Hein Tay Za needs this code to record your official grade and verify your submission.
            </p>
          </div>
          <div className="bg-[var(--card)]/90 border border-amber-400/40 rounded-xl p-3.5 flex flex-col justify-center">
            <div className="text-[0.72rem] font-bold text-[var(--ink)]">
              👉 <b>Instructions:</b> Click the yellow button above to copy your complete exam code and Part 8 essay, then open <b>Telegram</b> and send it directly to <b>Tr. Hein Tay Za</b>.
            </div>
          </div>
        </div>
      </div>

      {/* ================= HERO VERDICT CARD ================= */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[var(--line)]">
          {/* Circular Score Indicator */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 170 170">
                <circle cx="85" cy="85" r="70" fill="none" stroke="var(--card3)" strokeWidth="14" />
                <circle
                  cx="85"
                  cy="85"
                  r="70"
                  fill="none"
                  stroke={res.pct >= CONFIG.passPct ? 'var(--teal)' : 'var(--red)'}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - Math.min(100, res.pct) / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`text-3xl font-black ${
                    res.pct >= CONFIG.passPct ? 'text-[var(--teal)]' : 'text-[var(--red)]'
                  }`}
                >
                  {res.pct}%
                </div>
                <div className="text-[0.6rem] uppercase tracking-wider font-extrabold text-[var(--ink3)]">
                  {res.got} / {res.max} pts
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${cefrEvaluation.bg} ${cefrEvaluation.color} border ${cefrEvaluation.border}`}
                >
                  {cefrEvaluation.band}
                </span>
                <span className="text-xs font-bold text-[var(--purple)] bg-[var(--purplesoft)] px-2.5 py-1 rounded-full">
                  {cefrEvaluation.level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--ink)]">
                {state.name} {state.cls && <span className="text-sm font-normal text-[var(--ink2)]">({state.cls})</span>}
              </h1>
              <div className="text-xs text-[var(--ink2)]">
                Completed in {Math.floor((res.timeUsed || 0) / 60)}m {(res.timeUsed || 0) % 60}s · {res.auto ? 'Auto-submitted at time limit' : 'Submitted by student'}
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                const autoParts = PARTS.filter((p) => p.code !== 'Essay');
                let msg = `🎓 HEINFINITY B2 MID-TERM EXAM REPORT\n`;
                msg += `Student: ${state.name} ${state.cls ? `(${state.cls})` : ''}\n`;
                msg += `Verification Code: ${res.code}\n`;
                msg += `Score: ${res.got}/${res.max} (${res.pct}%) — ${cefrEvaluation.band}\n`;
                msg += `Level: ${cefrEvaluation.level}\n\n`;
                msg += `📊 Part Scores:\n`;
                autoParts.forEach((p) => {
                  const pStat = res.perPart[p.n];
                  msg += `• Part ${p.n} (${p.title}): ${pStat?.got || 0}/${p.pts} pts (${Math.round(((pStat?.got || 0) / p.pts) * 100)}%)\n`;
                });
                msg += `• Part 8 (Essay): 10 pts (Marked by Teacher)\n\n`;
                msg += `📈 Units Mastery:\n`;
                [1, 2, 3, 4, 5].forEach((u) => {
                  const uStat = res.perUnit[u] || { n: 0, right: 0 };
                  const uPct = uStat.n ? Math.round((uStat.right / uStat.n) * 100) : 0;
                  msg += `• Unit ${u}: ${uStat.right}/${uStat.n} (${uPct}%)\n`;
                });
                msg += `\n📷 Proctoring: ${state.camOK ? 'Camera Verified ✓' : 'No Camera'} | Tab switches: ${state.blurs}\n`;
                msg += `\n--- PART 8 ESSAY (${essayWordCount} words) ---\n${essayAnswer || '(no essay text)'}\n`;

                navigator.clipboard.writeText(msg);
                toast('Exam report copied! Send to Tr. Hein Tay Za on Telegram');
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] text-xs font-black hover:opacity-95 shadow-md shadow-teal-500/20"
            >
              📤 Copy for Telegram
            </button>

            <button
              onClick={() => setShowSummaryModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[var(--card2)] border border-[var(--teal)]/40 text-xs font-black text-[var(--teal)] hover:bg-[var(--teal)] hover:text-[#08111F] transition no-print flex items-center justify-center gap-1.5 shadow-sm"
              title="View concise exam performance summary and CEFR level modal"
            >
              <span>📊</span> Score Summary
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] hover:border-[var(--teal)] no-print"
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>

        {/* Teacher / Feedback Summary Banner */}
        <div className="p-4 rounded-xl border border-[var(--line2)] bg-[var(--card2)] text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
          <b className="text-[var(--teal)]">Teacher Feedback:</b> {cefrEvaluation.summary}
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex border-b border-[var(--line)] gap-2 overflow-x-auto pb-1 no-print">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition border-b-2 ${
            activeTab === 'feedback'
              ? 'border-[var(--teal)] text-[var(--teal)] bg-[var(--card)]'
              : 'border-transparent text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          🎯 Part Feedback ({PARTS.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'border-[var(--teal)] text-[var(--teal)] bg-[var(--card)]'
              : 'border-transparent text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          <span>📝</span> Check Answers ({Q.filter((q) => q.t !== 'essay').length})
          {totalMistakesCount > 0 ? (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[0.68rem] font-black">
              {totalMistakesCount} ✗
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[0.68rem] font-black">
              All ✓
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('essay')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition border-b-2 ${
            activeTab === 'essay'
              ? 'border-[var(--teal)] text-[var(--teal)] bg-[var(--card)]'
              : 'border-transparent text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          ✍️ Your Essay & Guide
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-[var(--teal)] text-[var(--teal)] bg-[var(--card)]'
              : 'border-transparent text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          📊 Scores by Unit
        </button>

        <button
          onClick={() => setActiveTab('proctor')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition border-b-2 ${
            activeTab === 'proctor'
              ? 'border-[var(--teal)] text-[var(--teal)] bg-[var(--card)]'
              : 'border-transparent text-[var(--ink2)] hover:text-[var(--ink)]'
          }`}
        >
          📷 Exam Photos ({state.photos?.length || 0})
        </button>
      </div>

      {/* ================= TAB 1: PART-BY-PART DETAILED FEEDBACK ================= */}
      {activeTab === 'feedback' && (
        <div className="space-y-4 anim-fade">
          <div className="text-xs text-[var(--ink2)]">
            Tap on any part below to see what you did well, what you can improve, and easy tips for that topic.
          </div>

          <div className="space-y-3.5">
            {PARTS.map((p) => {
              const fb = getPartFeedback(p.n);
              if (!fb) return null;
              const isExpanded = expandedPart === p.n || expandedPart === null;

              return (
                <div
                  key={p.n}
                  className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-3 transition"
                >
                  {/* Part Header */}
                  <div
                    onClick={() => setExpandedPart(expandedPart === p.n ? null : p.n)}
                    className="flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          p.n === 8
                            ? 'bg-[var(--purple)] text-white'
                            : fb.pct >= 75
                            ? 'bg-[#2DD4A7]/20 text-[#2DD4A7] border border-[#2DD4A7]/40'
                            : fb.pct >= 50
                            ? 'bg-[#F5C542]/20 text-[#F5C542] border border-[#F5C542]/40'
                            : 'bg-[#F2607A]/20 text-[#F2607A] border border-[#F2607A]/40'
                        }`}
                      >
                        P{p.n}
                      </span>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-[var(--ink)]">
                          {fb.title}
                        </div>
                        <div className="text-xs text-[var(--ink3)]">{fb.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-black text-[var(--teal)]">
                          {p.n === 8 ? 'Teacher Graded' : `${fb.got} / ${fb.max} pts`}
                        </div>
                        {p.n !== 8 && (
                          <div className="text-[0.65rem] font-extrabold text-[var(--ink3)]">
                            {fb.pct}% correct
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-[var(--ink3)]">{isExpanded ? '▴' : '▾'}</span>
                    </div>
                  </div>

                  {/* Expanded Detailed Diagnostic Content */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[var(--line)] space-y-3 text-xs sm:text-sm">
                      {/* Score Bar */}
                      {p.n !== 8 && (
                        <div className="w-full h-2 rounded-full bg-[var(--card3)] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              fb.pct >= 75
                                ? 'bg-[#2DD4A7]'
                                : fb.pct >= 50
                                ? 'bg-[#F5C542]'
                                : 'bg-[#F2607A]'
                            }`}
                            style={{ width: `${Math.max(5, fb.pct)}%` }}
                          />
                        </div>
                      )}

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                          <div className="font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
                            <span>✓</span> What you did well
                          </div>
                          <div className="text-xs text-[var(--ink)] leading-relaxed">{fb.strengths}</div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                          <div className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                            <span>💡</span> Things to practice
                          </div>
                          <div className="text-xs text-[var(--ink)] leading-relaxed">{fb.weaknesses}</div>
                        </div>
                      </div>

                      {/* Targeted Study Tips */}
                      <div className="p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-2">
                        <div className="font-extrabold text-xs text-[var(--purple)] uppercase tracking-wider">
                          📚 Easy Tips & Key Rules for this Part
                        </div>
                        <ul className="space-y-1.5 text-xs text-[var(--ink)] list-disc list-inside">
                          {fb.tips.map((tip, tIdx) => (
                            <li key={tIdx} className="leading-relaxed">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button to view questions for this part */}
                      {p.n !== 8 && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              setSelectedPartFilter(p.n);
                              setActiveTab('questions');
                            }}
                            className="text-xs font-bold text-[var(--teal)] hover:underline flex items-center gap-1"
                          >
                            Review Part {p.n} questions ({res.perPart[p.n]?.n || 0}) →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: QUESTION-BY-QUESTION REVIEW ================= */}
      {activeTab === 'questions' && (
        <div className="space-y-4 anim-fade">
          {/* Filter Bar */}
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="🔍 Search questions by prompt, grammar focus, answer, or Q# (e.g. Q14)..."
                  className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-4 py-2 text-xs text-[var(--ink)] placeholder-[var(--ink3)] focus:outline-none focus:border-[var(--teal)] transition"
                />
                {questionSearch && (
                  <button
                    type="button"
                    onClick={() => setQuestionSearch('')}
                    className="absolute right-3 top-2 text-xs font-bold text-[var(--ink3)] hover:text-[var(--ink)]"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyMistakes(!onlyMistakes)}
                  className={`px-3 py-2 rounded-xl text-xs font-black border transition flex items-center gap-1.5 ${
                    onlyMistakes
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                      : 'bg-[var(--card2)] border-[var(--line)] text-[var(--ink2)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span>{onlyMistakes ? '❌' : '🔍'}</span>
                  <span>
                    {onlyMistakes
                      ? `Showing Mistakes Only (${totalMistakesCount})`
                      : `Show Mistakes Only (${totalMistakesCount})`}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[var(--line)]">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--ink3)]">Filter Part:</span>
              <button
                type="button"
                onClick={() => setSelectedPartFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedPartFilter === 'all'
                    ? 'bg-[var(--teal)] text-[#08111F]'
                    : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
                }`}
              >
                All Parts
              </button>
              {PARTS.filter((p) => p.code !== 'Essay').map((p) => (
                <button
                  key={p.n}
                  type="button"
                  onClick={() => setSelectedPartFilter(p.n)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedPartFilter === p.n
                      ? 'bg-[var(--teal)] text-[#08111F]'
                      : 'bg-[var(--card2)] text-[var(--ink2)] hover:text-[var(--ink)]'
                  }`}
                >
                  P{p.n} ({p.code})
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3.5">
            {filteredQuestions.length === 0 ? (
              <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-8 text-center text-xs sm:text-sm text-[var(--ink2)]">
                No questions found with this filter.
              </div>
            ) : (
              filteredQuestions.map((row: any) => {
                const origQ = Q.find((q) => q.i === row.i);
                return (
                  <div
                    key={row.i}
                    className={`bg-[var(--card)] border rounded-2xl p-5 shadow-xl space-y-3 transition ${
                      row.ok ? 'border-[var(--line)]' : 'border-rose-500/30'
                    }`}
                  >
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                            row.ok
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {row.ok ? '✓' : '✗'}
                        </span>
                        <span className="font-extrabold text-[var(--ink)]">
                          Question {row.i + 1}
                        </span>
                        <span className="text-[var(--purple)] font-bold">
                          Part {row.p} · {PARTS.find((p) => p.n === row.p)?.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[var(--tealsoft)] text-[var(--teal)] font-bold text-[0.65rem]">
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
                          {row.d}
                        </span>
                        <span className="font-extrabold text-xs">
                          {row.ok ? (
                            <span className="text-emerald-400">+1 pt</span>
                          ) : (
                            <span className="text-rose-400">0 pt</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    {origQ && origQ.q && (
                      <div
                        className="text-xs sm:text-sm font-semibold text-[var(--ink)] leading-relaxed pt-1"
                        dangerouslySetInnerHTML={{ __html: origQ.q }}
                      />
                    )}

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm">
                      <div
                        className={`p-3 rounded-xl border ${
                          row.ok
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-rose-500/30 bg-rose-500/5'
                        }`}
                      >
                        <div className="text-[0.68rem] uppercase tracking-wider font-extrabold text-[var(--ink3)] mb-0.5">
                          Your Answer:
                        </div>
                        <div className={`font-bold ${row.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {row.your}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                        <div className="text-[0.68rem] uppercase tracking-wider font-extrabold text-[var(--ink3)] mb-0.5">
                          Correct Answer:
                        </div>
                        <div className="font-bold text-emerald-400">{row.right}</div>
                      </div>
                    </div>

                    {/* Pedagogical Explanation */}
                    {row.e && (
                      <div className="p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--line)] text-xs text-[var(--ink)] space-y-1">
                        <div className="font-extrabold text-[var(--teal)] flex items-center gap-1.5">
                          <span>💡</span> Why is this correct?
                        </div>
                        <div className="leading-relaxed text-[var(--ink2)]">{row.e}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: ESSAY REVIEW & RUBRIC ================= */}
      {activeTab === 'essay' && (
        <div className="space-y-5 anim-fade">
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[var(--line)] pb-4">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--purple)]">
                  PART 8 · ESSAY WRITING
                </span>
                <h2 className="text-lg font-extrabold text-[var(--ink)] mt-0.5">
                  Your Essay
                </h2>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    essayWordCount >= 180 && essayWordCount <= 220
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {essayWordCount} words · (Goal: 180–220 words)
                </span>
              </div>
            </div>

            {/* Student Essay Output */}
            <div className="p-5 rounded-xl bg-[var(--card3)] border border-[var(--line2)] text-xs sm:text-sm text-[var(--ink)] leading-relaxed whitespace-pre-wrap font-sans">
              {essayAnswer || (
                <span className="text-[var(--ink3)] italic">No essay was written for this test.</span>
              )}
            </div>
          </div>

          {/* Simple Essay Marking Guide */}
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-[var(--ink)] flex items-center gap-2">
              <span>📋</span> How Teacher Marks Your Essay (Total 10 Points)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black text-[var(--teal)]">
                  <span>1. Answering the Question</span>
                  <span>/ 2.5 pts</span>
                </div>
                <p className="text-xs text-[var(--ink2)] leading-relaxed">
                  Did you talk about both sides (hard work AND talent/luck)? Did you give your own clear opinion?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black text-[var(--teal)]">
                  <span>2. Organization & Paragraphs</span>
                  <span>/ 2.5 pts</span>
                </div>
                <p className="text-xs text-[var(--ink2)] leading-relaxed">
                  Are your paragraphs clear (Introduction, Side 1, Side 2, Conclusion)? Did you use linking words like However, In addition, and Therefore?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black text-[var(--teal)]">
                  <span>3. Vocabulary & Words</span>
                  <span>/ 2.5 pts</span>
                </div>
                <p className="text-xs text-[var(--ink2)] leading-relaxed">
                  Did you use good B2 vocabulary words (like perseverance, practice, opportunity, achieve) without repeating the same words?
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black text-[var(--teal)]">
                  <span>4. Grammar & Accuracy</span>
                  <span>/ 2.5 pts</span>
                </div>
                <p className="text-xs text-[var(--ink2)] leading-relaxed">
                  Are your sentences well-written and easy to read? Did you use a mix of simple and complex sentences with correct punctuation?
                </p>
              </div>
            </div>
          </div>

          {/* ================= STUDENT ESSAY SUBMISSION & TEACHER EVALUATION STATUS ================= */}
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--tealsoft)] text-[var(--teal)] flex items-center justify-center text-xl font-bold">
                  🧑‍🏫
                </div>
                <div>
                  <div className="text-[0.68rem] font-bold text-[var(--teal)] uppercase tracking-wider">
                    Teacher Evaluation · Tr. Hein Tay Za
                  </div>
                  <h3 className="text-base font-extrabold text-[var(--ink)]">
                    Part 8 Essay Evaluation Status
                  </h3>
                </div>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-[var(--card2)] border border-[var(--line)] text-xs font-bold text-[var(--ink2)]">
                  Maximum: 10.0 Points
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--card2)] border border-[var(--line)] space-y-2 text-xs leading-relaxed text-[var(--ink)]">
              <p>
                <b>Candidate: {state.name || 'Student'}</b> &mdash; Your essay has been recorded and submitted for manual evaluation.
              </p>
              <p className="text-[var(--ink2)]">
                Tr. Hein Tay Za will evaluate your writing based on the Cambridge B2 criteria (Task Achievement, Coherence & Organization, Lexical Resource, and Grammatical Range & Accuracy) and provide your final score and personalized feedback.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--tealsoft)] text-[var(--teal)] text-xs font-medium flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Your essay is saved. Make sure to copy your exam code or send your report to Tr. Hein Tay Za.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SCORE BREAKDOWN & UNITS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5 anim-fade">
          {/* Table Breakdown */}
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-[var(--ink)]">Scores by Part</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-[var(--card2)] text-[var(--ink3)]">
                    {PARTS.filter((p) => p.code !== 'Essay').map((p) => (
                      <th key={p.n} className="p-3">
                        P{p.n} ({p.code})<br />
                        <span className="font-normal text-[0.65rem] text-[var(--ink2)]">/{p.pts} pts</span>
                      </th>
                    ))}
                    <th className="p-3 text-[var(--teal)]">
                      Auto Score<br />
                      <span className="font-normal text-[0.65rem]">/{res.max}</span>
                    </th>
                    <th className="p-3 text-[var(--purple)]">
                      Part 8 (Essay)<br />
                      <span className="font-normal text-[0.65rem]">/10 pts</span>
                    </th>
                    <th className="p-3">
                      Total Grade<br />
                      <span className="font-normal text-[0.65rem]">/100 pts</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--line)] text-sm font-black text-[var(--ink)]">
                    {PARTS.filter((p) => p.code !== 'Essay').map((p) => (
                      <td key={p.n} className="p-3">
                        {res.perPart[p.n]?.got || 0}
                      </td>
                    ))}
                    <td className="p-3 text-[var(--teal)]">{res.got}</td>
                    <td className="p-3 text-[var(--purple)]">{teacherScore} pts</td>
                    <td className="p-3 text-[var(--ink)]">
                      {(Number(res.got) || 0) + (parseFloat(teacherScore) || 0)} / {(Number(res.max) || 0) + 10}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Unit Mastery Bars */}
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-[var(--ink)]">How You Did by Book Unit (Units 1–5)</h3>
            <div className="space-y-3.5">
              {[
                { u: 1, title: 'Unit 1: Outstanding People (Questions & Character Words)' },
                { u: 2, title: 'Unit 2: Survival (Past Tenses & Strong Adjectives)' },
                { u: 3, title: 'Unit 3: Talent (Future Tenses & Abilities)' },
                { u: 4, title: 'Unit 4: Life Events (If-Conditionals & Idioms)' },
                { u: 5, title: 'Unit 5: Chance (Inversions & Word Building)' },
              ].map((unitInfo) => {
                const uStat = res.perUnit ? res.perUnit[unitInfo.u] || { n: 0, right: 0 } : { n: 0, right: 0 };
                const uPct = uStat.n ? Math.round((uStat.right / uStat.n) * 100) : 0;
                return (
                  <div key={unitInfo.u} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-[var(--ink)]">
                      <span>{unitInfo.title}</span>
                      <span className="text-[var(--ink2)]">
                        {uStat.right} / {uStat.n} correct ({uPct}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-[var(--card3)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          uPct >= 75
                            ? 'bg-[#2DD4A7]'
                            : uPct >= 50
                            ? 'bg-[#F5C542]'
                            : 'bg-[#F2607A]'
                        }`}
                        style={{ width: `${uPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion Code */}
          <div className="bg-[var(--card2)] border border-[var(--teal)] rounded-2xl p-6 text-center shadow-xl space-y-3">
            <div className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--teal)]">
              YOUR TEST COMPLETION CODE
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[var(--teal)] tracking-wider break-all select-all">
              {res.code}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(res.code);
                toast('Completion code copied!');
              }}
              className="px-5 py-2.5 rounded-xl border border-[var(--teal)] text-xs font-bold text-[var(--teal)] hover:bg-[var(--tealsoft)] transition"
            >
              Tap to copy code
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 5: INTEGRITY & PROCTORING ================= */}
      {activeTab === 'proctor' && (
        <div className="space-y-4 anim-fade">
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-base font-extrabold text-[var(--ink)]">Exam Proctor Photos</h3>
                <div className="text-xs text-[var(--ink2)] mt-0.5">
                  Camera: <b>{state.camOK ? 'Working ✓' : 'Off'}</b> · Left exam tab: <b>{state.blurs} time(s)</b>
                </div>
              </div>
            </div>

            {state.photos && state.photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2">
                {state.photos.map((p: any, pIdx: number) => (
                  <div key={pIdx} className="space-y-1 text-center">
                    <img
                      src={p.d}
                      alt={`Photo ${pIdx + 1}`}
                      className="w-full rounded-xl border border-[var(--line)] object-cover aspect-[4/3]"
                    />
                    <div className="text-[0.62rem] text-[var(--ink3)] font-mono">
                      {p.t} · {new Date(p.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[var(--card2)] text-xs text-[var(--ink3)] text-center">
                No exam photos taken during this session.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset & Retake Option */}
      <div className="text-center pt-4 no-print">
        <button
          onClick={onRetake}
          className="text-xs text-[var(--ink3)] hover:text-[var(--red)] transition font-bold underline"
        >
          Reset and retake examination
        </button>
      </div>

      {/* ================= EXAM PERFORMANCE SUMMARY MODAL ================= */}
      <ExamSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        result={res}
        studentName={state.name || 'Candidate'}
        studentClass={state.cls}
        cefrEvaluation={cefrEvaluation}
        onExploreDetails={() => {
          setActiveTab('questions');
          setShowSummaryModal(false);
        }}
        onCopyTelegram={() => {
          const autoParts = PARTS.filter((p) => p.code !== 'Essay');
          let msg = `🎓 HEINFINITY B2 MID-TERM EXAM REPORT\n`;
          msg += `Student: ${state.name} ${state.cls ? `(${state.cls})` : ''}\n`;
          msg += `Verification Code: ${res.code}\n`;
          msg += `Score: ${res.got}/${res.max} (${res.pct}%) — ${cefrEvaluation.band}\n`;
          msg += `Level: ${cefrEvaluation.level}\n\n`;
          msg += `📊 Part Scores:\n`;
          autoParts.forEach((p) => {
            const pStat = res.perPart ? res.perPart[p.n] : null;
            msg += `• Part ${p.n} (${p.title}): ${pStat?.got || 0}/${p.pts} pts (${Math.round(((pStat?.got || 0) / p.pts) * 100)}%)\n`;
          });
          msg += `• Part 8 (Essay): 10 pts (Marked by Teacher)\n\n`;
          msg += `📈 Units Mastery:\n`;
          [1, 2, 3, 4, 5].forEach((u) => {
            const uStat = res.perUnit ? res.perUnit[u] : { n: 0, right: 0 };
            const uPct = uStat?.n ? Math.round((uStat.right / uStat.n) * 100) : 0;
            msg += `• Unit ${u}: ${uStat.right}/${uStat.n} (${uPct}%)\n`;
          });
          msg += `\n📷 Proctoring: ${state.camOK ? 'Camera Verified ✓' : 'No Camera'} | Tab switches: ${state.blurs}\n`;
          msg += `\n--- PART 8 ESSAY (${essayWordCount} words) ---\n${essayAnswer || '(no essay text)'}\n`;

          navigator.clipboard.writeText(msg);
          toast('✓ Full Exam Report copied! Send to Tr. Hein Tay Za on Telegram');
        }}
      />
    </div>
  );
}
