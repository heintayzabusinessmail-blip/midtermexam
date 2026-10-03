import React, { useState } from 'react';

export interface RubricValues {
  task: number;
  coherence: number;
  lexical: number;
  grammar: number;
}

export interface VisualEssayRubricProps {
  rubric: RubricValues;
  onChange?: (updated: RubricValues) => void;
  readOnly?: boolean;
  wordCount?: number;
  studentName?: string;
}

interface CriterionLevel {
  score: number;
  bandLabel: string;
  shortTag: string;
  descriptor: string;
}

interface RubricCriterionMeta {
  key: keyof RubricValues;
  title: string;
  subtitle: string;
  icon: string;
  colorHex: string;
  borderClass: string;
  badgeClass: string;
  barColor: string;
  description: string;
  keyLookouts: string[];
  levels: CriterionLevel[];
}

export const RUBRIC_CRITERIA_DEFINITIONS: RubricCriterionMeta[] = [
  {
    key: 'task',
    title: 'Task Response',
    subtitle: 'Prompt Completion & Argumentation',
    icon: '🎯',
    colorHex: '#2DD4A7',
    borderClass: 'border-teal-400/40',
    badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    barColor: 'bg-[#2DD4A7]',
    description: 'Assesses whether both viewpoints (Innate Talent vs Hard Work) are thoroughly examined, a clear personal stance is maintained, and arguments are backed by relevant examples.',
    keyLookouts: [
      'Both talent & hard work perspectives addressed',
      'Clear, nuanced personal stance articulated',
      'Realistic supporting examples and justifications',
      'Adherence to discursive essay prompt'
    ],
    levels: [
      {
        score: 2.5,
        bandLabel: 'Band 5 (Excellent)',
        shortTag: 'Fully developed',
        descriptor: 'Fully addresses all parts of the prompt. Both viewpoints are thoroughly explored with convincing arguments, a clear personal position, and effective real-world examples.'
      },
      {
        score: 2.0,
        bandLabel: 'Band 4 (Good)',
        shortTag: 'Well addressed',
        descriptor: 'Addresses both viewpoints clearly and states an explicit personal position with relevant, supportive reasoning.'
      },
      {
        score: 1.5,
        bandLabel: 'Band 3 (Satisfactory)',
        shortTag: 'Adequate',
        descriptor: 'Addresses the topic adequately, but one perspective is noticeably underdeveloped or arguments rely on generic statements.'
      },
      {
        score: 1.0,
        bandLabel: 'Band 2 (Needs Work)',
        shortTag: 'Incomplete',
        descriptor: 'Only discusses one viewpoint or omits key requirements of the prompt; personal opinion is unclear or unsubstantiated.'
      },
      {
        score: 0.5,
        bandLabel: 'Band 1 (Limited)',
        shortTag: 'Minimal',
        descriptor: 'Minimally engages with the topic, contains tangential arguments, or is largely off-topic.'
      }
    ]
  },
  {
    key: 'coherence',
    title: 'Coherence & Cohesion',
    subtitle: 'Organization & Linking Devices',
    icon: '🔄',
    colorHex: '#7C6FF0',
    borderClass: 'border-purple-400/40',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    barColor: 'bg-[#7C6FF0]',
    description: 'Evaluates 4-paragraph structural clarity (Introduction, Viewpoint A, Viewpoint B, Conclusion), paragraph progression, topic sentences, and natural cohesive linkers.',
    keyLookouts: [
      'Logical 4-paragraph structure (Intro, 2 Bodies, Conclusion)',
      'Clear topic sentences for each paragraph',
      'Smooth transitions (Furthermore, On the contrary, Consequently)',
      'Natural sentence-to-sentence flow without mechanical repetition'
    ],
    levels: [
      {
        score: 2.5,
        bandLabel: 'Band 5 (Excellent)',
        shortTag: 'Seamless flow',
        descriptor: 'Flawless 4-paragraph progression. Transitions connect ideas smoothly and naturally without sounding formulaic; clear topic sentences throughout.'
      },
      {
        score: 2.0,
        bandLabel: 'Band 4 (Good)',
        shortTag: 'Clear structure',
        descriptor: 'Well-organized paragraphs with clear progression and effective linking words; ideas connect logically with minimal awkward transitions.'
      },
      {
        score: 1.5,
        bandLabel: 'Band 3 (Satisfactory)',
        shortTag: 'Basic linking',
        descriptor: 'Basic paragraph division is evident; relies on repetitive or formulaic linkers (Firstly, Secondly, In conclusion); minor gaps in flow.'
      },
      {
        score: 1.0,
        bandLabel: 'Band 2 (Needs Work)',
        shortTag: 'Disjointed',
        descriptor: 'Paragraphing is inconsistent or unclear; abrupt jumps between sentences and ideas make the essay difficult to follow.'
      },
      {
        score: 0.5,
        bandLabel: 'Band 1 (Limited)',
        shortTag: 'Fragmented',
        descriptor: 'Little to no paragraph organization; ideas are jumbled with arbitrary or absent connective devices.'
      }
    ]
  },
  {
    key: 'lexical',
    title: 'Lexical Resource',
    subtitle: 'Vocabulary Range & Precision',
    icon: '📚',
    colorHex: '#F5C542',
    borderClass: 'border-amber-400/40',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    barColor: 'bg-[#F5C542]',
    description: 'Assesses the range and precision of B2/C1 topic vocabulary (deliberate practice, innate gifts, perseverance, expertise), collocations, variety, and spelling accuracy.',
    keyLookouts: [
      'B2/C1 topic vocabulary (perseverance, innate, dedication)',
      'Natural collocations (e.g. acquire a skill, reach peak performance)',
      'Avoidance of repetitive words & pronouns',
      'Accurate spelling and word formation'
    ],
    levels: [
      {
        score: 2.5,
        bandLabel: 'Band 5 (Excellent)',
        shortTag: 'Rich B2/C1 range',
        descriptor: 'Rich, flexible topic vocabulary and natural collocations. Word choices are precise with sophisticated expressions and very rare minor slips.'
      },
      {
        score: 2.0,
        bandLabel: 'Band 4 (Good)',
        shortTag: 'Good range',
        descriptor: 'Good variety of topic-appropriate vocabulary; expresses ideas clearly with occasional minor word choice or spelling errors.'
      },
      {
        score: 1.5,
        bandLabel: 'Band 3 (Satisfactory)',
        shortTag: 'Adequate vocabulary',
        descriptor: 'Adequate vocabulary for the task; noticeable repetition and reliance on simple, familiar everyday words; spelling errors do not impede understanding.'
      },
      {
        score: 1.0,
        bandLabel: 'Band 2 (Needs Work)',
        shortTag: 'Limited range',
        descriptor: 'Limited vocabulary range; frequent inaccurate word choices and spelling errors that occasionally strain comprehension.'
      },
      {
        score: 0.5,
        bandLabel: 'Band 1 (Limited)',
        shortTag: 'Restricted',
        descriptor: 'Severely restricted vocabulary; frequent errors make meaning very difficult to discern.'
      }
    ]
  },
  {
    key: 'grammar',
    title: 'Grammatical Range & Accuracy',
    subtitle: 'Structures, Tenses & Control',
    icon: '⚖️',
    colorHex: '#F0568C',
    borderClass: 'border-pink-400/40',
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    barColor: 'bg-[#F0568C]',
    description: 'Measures flexibility and control over complex sentence structures (conditionals, relative clauses, passive voice, modals), tense consistency, and punctuation.',
    keyLookouts: [
      'Complex structures (e.g., conditional clauses, passive voice)',
      'Accurate tense consistency across paragraphs',
      'Subject-verb agreement and singular/plural control',
      'Punctuation accuracy (commas with introductory clauses)'
    ],
    levels: [
      {
        score: 2.5,
        bandLabel: 'Band 5 (Excellent)',
        shortTag: 'Complex & accurate',
        descriptor: 'Wide range of complex structures (conditionals, passives, relative clauses); consistently high grammatical accuracy with rare minor slips.'
      },
      {
        score: 2.0,
        bandLabel: 'Band 4 (Good)',
        shortTag: 'Solid control',
        descriptor: 'Good mix of simple and complex sentences; generally sound grammatical control and tense consistency with only minor errors.'
      },
      {
        score: 1.5,
        bandLabel: 'Band 3 (Satisfactory)',
        shortTag: 'Basic accuracy',
        descriptor: 'Attempts complex structures with noticeable errors; basic sentences are generally accurate; tenses and agreements slip occasionally.'
      },
      {
        score: 1.0,
        bandLabel: 'Band 2 (Needs Work)',
        shortTag: 'Frequent errors',
        descriptor: 'Frequent grammatical mistakes (tense confusion, faulty agreement, run-on sentences) that cause distraction or obscure meaning.'
      },
      {
        score: 0.5,
        bandLabel: 'Band 1 (Limited)',
        shortTag: 'Persistent errors',
        descriptor: 'Persistent, pervasive grammatical errors throughout; sentences are fragmented or difficult to parse.'
      }
    ]
  }
];

export default function VisualEssayRubric({
  rubric,
  onChange,
  readOnly = false,
  wordCount,
  studentName,
}: VisualEssayRubricProps) {
  const [showMatrix, setShowMatrix] = useState<boolean>(false);
  const [activeCriterionHelp, setActiveCriterionHelp] = useState<keyof RubricValues | null>(null);

  const totalScore = Number((rubric.task + rubric.coherence + rubric.lexical + rubric.grammar).toFixed(1));
  const percentage = Math.round((totalScore / 10) * 100);

  // Determine CEFR Band Badge
  const getCefrBadge = (score: number) => {
    if (score >= 9.0) {
      return {
        level: 'C1 Distinction',
        desc: 'Advanced / Expert Proficiency',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
        ringColor: '#10B981',
      };
    }
    if (score >= 7.5) {
      return {
        level: 'B2 High Pass',
        desc: 'Strong Cambridge B2 Vantage',
        badgeClass: 'bg-teal-500/15 text-teal-400 border-teal-500/40',
        ringColor: '#14B894',
      };
    }
    if (score >= 6.0) {
      return {
        level: 'B2 Standard Pass',
        desc: 'Competent Cambridge B2',
        badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
        ringColor: '#F59E0B',
      };
    }
    return {
      level: 'B1 Borderline',
      desc: 'Threshold / Needs Revision',
      badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
      ringColor: '#F43F5E',
    };
  };

  const cefrInfo = getCefrBadge(totalScore);

  const handleScoreSelect = (key: keyof RubricValues, value: number) => {
    if (readOnly || !onChange) return;
    onChange({
      ...rubric,
      [key]: value,
    });
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--line2)] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* ================= COMPONENT HEADER & SCORE BANNER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[0.68rem] font-black uppercase tracking-wider bg-[var(--tealsoft)] text-[var(--teal)] border border-[var(--teal)]/30">
              Cambridge B2 Rubric
            </span>
            {wordCount !== undefined && (
              <span className="text-xs text-[var(--ink3)] font-medium">
                Candidate Essay: <b className="text-[var(--ink)]">{wordCount} words</b>
              </span>
            )}
            {studentName && (
              <span className="text-xs text-[var(--ink3)]">
                Candidate: <b className="text-[var(--teal)]">{studentName}</b>
              </span>
            )}
          </div>
          <h3 className="text-lg font-black text-[var(--ink)] mt-1 flex items-center gap-2">
            <span>📊</span> Visual Essay Grading Rubric
          </h3>
          <p className="text-xs text-[var(--ink2)] max-w-xl mt-0.5 leading-relaxed">
            Breakdown across 4 core criteria. Click any score level chip to instantly assign marks and inspect examiner descriptors.
          </p>
        </div>

        {/* Aggregate Score Card */}
        <div className="flex items-center gap-4 bg-[var(--card2)] border border-[var(--line)] p-3.5 rounded-xl self-start md:self-auto">
          <div className="text-right">
            <div className="text-[0.68rem] uppercase font-bold text-[var(--ink3)]">Awarded Essay Score</div>
            <div className="text-2xl sm:text-3xl font-black text-[var(--teal)] leading-none mt-0.5">
              {totalScore.toFixed(1)} <span className="text-sm font-bold text-[var(--ink3)]">/ 10</span>
            </div>
            <div className="text-[0.7rem] font-bold text-[var(--ink2)] mt-1">
              Score: <span className="text-[var(--ink)]">{percentage}%</span>
            </div>
          </div>

          <div className="border-l border-[var(--line)] pl-3.5 flex flex-col items-start gap-1">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${cefrInfo.badgeClass}`}>
              {cefrInfo.level}
            </span>
            <span className="text-[0.65rem] text-[var(--ink3)] font-medium">{cefrInfo.desc}</span>
          </div>
        </div>
      </div>

      {/* ================= MULTI-SEGMENT WEIGHTED VISUAL BAR ================= */}
      <div className="space-y-2 bg-[var(--card2)] border border-[var(--line)] p-4 rounded-xl">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--ink)]">
          <span className="flex items-center gap-1.5">
            <span>⚖️</span> Criteria Weight Distribution (2.5 pts each = 10.0 pts max)
          </span>
          <button
            type="button"
            onClick={() => setShowMatrix(!showMatrix)}
            className="text-[0.72rem] font-bold text-[var(--purple)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showMatrix ? '▲ Hide' : '▼ Show'}</span> Complete Cambridge Matrix
          </button>
        </div>

        {/* Stacked segmented bar */}
        <div className="w-full h-3.5 rounded-full bg-black/40 overflow-hidden flex border border-[var(--line)]">
          <div
            className="bg-[#2DD4A7] h-full transition-all duration-300"
            style={{ width: `${(rubric.task / 10) * 100}%` }}
            title={`Task Response: ${rubric.task}/2.5`}
          />
          <div
            className="bg-[#7C6FF0] h-full transition-all duration-300"
            style={{ width: `${(rubric.coherence / 10) * 100}%` }}
            title={`Coherence: ${rubric.coherence}/2.5`}
          />
          <div
            className="bg-[#F5C542] h-full transition-all duration-300"
            style={{ width: `${(rubric.lexical / 10) * 100}%` }}
            title={`Lexical Resource: ${rubric.lexical}/2.5`}
          />
          <div
            className="bg-[#F0568C] h-full transition-all duration-300"
            style={{ width: `${(rubric.grammar / 10) * 100}%` }}
            title={`Grammar: ${rubric.grammar}/2.5`}
          />
        </div>

        {/* Segment legends */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[0.7rem] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4A7]" />
            <span className="text-[var(--ink2)] truncate">Task:</span>
            <span className="text-[var(--teal)] font-black">{rubric.task} / 2.5</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C6FF0]" />
            <span className="text-[var(--ink2)] truncate">Coherence:</span>
            <span className="text-[#7C6FF0] font-black">{rubric.coherence} / 2.5</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5C542]" />
            <span className="text-[var(--ink2)] truncate">Lexical:</span>
            <span className="text-[#F5C542] font-black">{rubric.lexical} / 2.5</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F0568C]" />
            <span className="text-[var(--ink2)] truncate">Grammar:</span>
            <span className="text-[#F0568C] font-black">{rubric.grammar} / 2.5</span>
          </div>
        </div>
      </div>

      {/* ================= 4 CRITERIA VISUAL INTERACTIVE CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RUBRIC_CRITERIA_DEFINITIONS.map((crit) => {
          const currentScore = rubric[crit.key] ?? 2.0;
          const currentPct = Math.round((currentScore / 2.5) * 100);
          const activeLevel =
            crit.levels.find((lvl) => Math.abs(lvl.score - currentScore) < 0.05) ||
            crit.levels[1];

          return (
            <div
              key={crit.key}
              className={`p-4 sm:p-5 rounded-2xl bg-[var(--card2)] border transition-all duration-200 ${
                activeCriterionHelp === crit.key
                  ? 'border-[var(--teal)] ring-2 ring-[var(--teal)]/20'
                  : 'border-[var(--line2)] hover:border-[var(--line)]'
              }`}
            >
              {/* Criterion Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl p-2 rounded-xl bg-[var(--card)] border border-[var(--line)]">
                    {crit.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-[var(--ink)] flex items-center gap-1.5">
                      {crit.title}
                    </h4>
                    <span className="text-[0.68rem] text-[var(--ink3)] font-bold">
                      {crit.subtitle}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="text-base font-black"
                    style={{ color: crit.colorHex }}
                  >
                    {currentScore.toFixed(1)}{' '}
                    <span className="text-xs text-[var(--ink3)] font-medium">/ 2.5</span>
                  </div>
                  <span className="text-[0.65rem] font-bold text-[var(--ink2)]">
                    {currentPct}%
                  </span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden mt-3 mb-2.5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${currentPct}%`,
                    backgroundColor: crit.colorHex,
                  }}
                />
              </div>

              {/* Criterion description & guidance */}
              <p className="text-[0.72rem] text-[var(--ink2)] leading-relaxed mb-3">
                {crit.description}
              </p>

              {/* Interactive Score Chips (Click to assign) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[0.65rem] uppercase font-black text-[var(--ink3)]">
                  <span>Score Level:</span>
                  <span>{activeLevel?.bandLabel || `${currentScore} pts`}</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {crit.levels.map((lvl) => {
                    const isSelected = Math.abs(currentScore - lvl.score) < 0.05;
                    return (
                      <button
                        key={lvl.score}
                        type="button"
                        disabled={readOnly}
                        onClick={() => handleScoreSelect(crit.key, lvl.score)}
                        className={`py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'font-black text-[#08111F] shadow-md scale-[1.02]'
                            : 'bg-[var(--card)] hover:bg-[var(--card3)] text-[var(--ink)] border border-[var(--line)] font-bold opacity-80 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isSelected ? crit.colorHex : undefined,
                          borderColor: isSelected ? crit.colorHex : undefined,
                        }}
                        title={`${lvl.bandLabel}: ${lvl.descriptor}`}
                      >
                        <div className="text-[0.75rem] leading-tight">{lvl.score}</div>
                        <div
                          className={`text-[0.55rem] truncate uppercase tracking-tighter ${
                            isSelected ? 'text-[#08111F] font-black' : 'text-[var(--ink3)]'
                          }`}
                        >
                          {lvl.score === 2.5
                            ? 'Band 5'
                            : lvl.score === 2.0
                            ? 'Band 4'
                            : lvl.score === 1.5
                            ? 'Band 3'
                            : lvl.score === 1.0
                            ? 'Band 2'
                            : 'Band 1'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Descriptor Feedback Box */}
              <div className="mt-3 p-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] space-y-1">
                <div className="flex items-center justify-between text-[0.68rem] font-bold">
                  <span className="flex items-center gap-1" style={{ color: crit.colorHex }}>
                    <span>✓</span> Descriptor ({activeLevel?.bandLabel})
                  </span>
                  <span className="text-[0.62rem] text-[var(--ink3)] italic">
                    {activeLevel?.shortTag}
                  </span>
                </div>
                <div className="text-[0.7rem] text-[var(--ink)] leading-snug">
                  {activeLevel?.descriptor}
                </div>
              </div>

              {/* Fine-Tuning Dropdown for Custom Scores */}
              {!readOnly && (
                <div className="mt-2.5 flex items-center justify-between text-[0.68rem] text-[var(--ink3)]">
                  <span>Fine-tune decimal:</span>
                  <select
                    value={currentScore}
                    onChange={(e) => handleScoreSelect(crit.key, parseFloat(e.target.value))}
                    className="bg-[var(--card)] border border-[var(--line2)] text-[var(--ink)] text-[0.7rem] rounded-lg px-2 py-0.5 font-bold outline-none cursor-pointer"
                  >
                    <option value="2.5">2.5 (Excellent)</option>
                    <option value="2.3">2.3 (High Band 4+)</option>
                    <option value="2.0">2.0 (Good)</option>
                    <option value="1.8">1.8 (Solid Band 3+)</option>
                    <option value="1.5">1.5 (Satisfactory)</option>
                    <option value="1.2">1.2 (Band 2+)</option>
                    <option value="1.0">1.0 (Needs Work)</option>
                    <option value="0.7">0.7 (Developing)</option>
                    <option value="0.5">0.5 (Limited)</option>
                    <option value="0.0">0.0 (Unattempted)</option>
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= COLLAPSIBLE FULL CAMBRIDGE B2 RUBRIC MATRIX ================= */}
      {showMatrix && (
        <div className="border border-[var(--line2)] bg-[var(--card2)] rounded-2xl p-4 sm:p-5 space-y-3 anim-fade">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-[var(--ink)] flex items-center gap-2">
                <span>📖</span> Cambridge Empower B2 Official Grading Matrix
              </h4>
              <p className="text-[0.7rem] text-[var(--ink3)]">
                Comparative descriptors across Band 5 (2.5 pts) to Band 1 (0.5 pts). Click any cell to assign.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMatrix(false)}
              className="text-xs text-[var(--ink2)] hover:text-[var(--ink)] px-2 py-1 rounded-lg bg-[var(--card)] border border-[var(--line)]"
            >
              ✕ Close Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--card)]">
                  <th className="p-2.5 font-black text-[var(--ink)] w-36">Criterion</th>
                  <th className="p-2.5 font-black text-teal-400">Band 5 (2.5 pts)</th>
                  <th className="p-2.5 font-black text-purple-400">Band 4 (2.0 pts)</th>
                  <th className="p-2.5 font-black text-amber-400">Band 3 (1.5 pts)</th>
                  <th className="p-2.5 font-black text-orange-400">Band 2 (1.0 pt)</th>
                  <th className="p-2.5 font-black text-rose-400">Band 1 (0.5 pt)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {RUBRIC_CRITERIA_DEFINITIONS.map((crit) => (
                  <tr key={crit.key} className="hover:bg-[var(--card)]/50 transition">
                    <td className="p-2.5 font-black text-[var(--ink)] align-top bg-[var(--card)]">
                      <div className="flex items-center gap-1.5">
                        <span>{crit.icon}</span>
                        <span>{crit.title}</span>
                      </div>
                      <div className="text-[0.65rem] text-[var(--ink3)] font-normal mt-0.5">
                        Current: <b style={{ color: crit.colorHex }}>{rubric[crit.key]} / 2.5</b>
                      </div>
                    </td>
                    {crit.levels.map((lvl) => {
                      const isCurrent = Math.abs(rubric[crit.key] - lvl.score) < 0.05;
                      return (
                        <td
                          key={lvl.score}
                          onClick={() => !readOnly && handleScoreSelect(crit.key, lvl.score)}
                          className={`p-2.5 align-top text-[0.68rem] leading-relaxed cursor-pointer transition ${
                            isCurrent
                              ? 'bg-[var(--tealsoft)] text-[var(--ink)] font-bold border-2 border-[var(--teal)] rounded-lg'
                              : 'text-[var(--ink2)] hover:text-[var(--ink)] hover:bg-[var(--card)]'
                          }`}
                        >
                          <div className="font-black text-[0.62rem] uppercase mb-1" style={{ color: crit.colorHex }}>
                            {lvl.bandLabel} {isCurrent && '★ Selected'}
                          </div>
                          {lvl.descriptor}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
