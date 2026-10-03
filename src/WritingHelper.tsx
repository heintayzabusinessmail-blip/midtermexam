import React, { useState } from 'react';

interface WritingHelperProps {
  currentText: string;
  onUpdateText: (newText: string) => void;
  minWords?: number;
  maxWords?: number;
}

export const WritingHelper: React.FC<WritingHelperProps> = ({
  currentText,
  onUpdateText,
}) => {
  const [activeTab, setActiveTab] = useState<'tips' | 'templates' | 'vocab' | 'guided'>('templates');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Guided 4-paragraph state
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [p4, setP4] = useState('');

  const showNotification = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const insertText = (snippet: string) => {
    if (!currentText.trim()) {
      onUpdateText(snippet);
    } else {
      onUpdateText(currentText + (currentText.endsWith(' ') || currentText.endsWith('\n') ? '' : ' ') + snippet);
    }
    showNotification('Inserted into your essay draft!');
  };

  const applyTemplate = (templateType: 'inspiring' | 'talent') => {
    if (currentText.trim() && !window.confirm('Replace your current draft with this starter template? You can edit each sentence!')) {
      return;
    }

    if (templateType === 'inspiring') {
      const template = `I would like to write about [Name], who is one of the most inspiring people I know. They are well known for [mention their field or work].

First of all, they are truly ambitious and determined. One of their greatest achievements is [describe what they achieved or created].

However, their journey was not easy. They had to face several arduous challenges, such as [describe an obstacle or difficulty]. Despite these setbacks, they remained resilient and never gave up.

In conclusion, they are an exceptionally influential figure who inspires me to work hard, overcome obstacles, and pursue my goals with confidence.`;
      onUpdateText(template);
      showNotification('Loaded "Inspiring Person" starter template!');
    } else {
      const template = `It is often debated whether inborn talent or relentless practice is the primary key to achieving extraordinary success.

On the one hand, innate ability provides people with a valuable head start. For example, some individuals seem to pick up complex skills with natural ease.

On the other hand, deliberate practice is far more decisive. As research has shown, thousands of hours of rigorous training make performers truly exceptional. Without discipline and effort, raw talent often goes to waste.

In conclusion, while natural gifts can offer an initial advantage, I firmly believe that dedication, resilience, and hard work are what truly lead to excellence.`;
      onUpdateText(template);
      showNotification('Loaded "Talent vs Practice" starter template!');
    }
  };

  // Sync guided boxes into single text
  const applyGuidedToEssay = () => {
    const combined = [
      p1.trim(),
      p2.trim(),
      p3.trim(),
      p4.trim(),
    ].filter(Boolean).join('\n\n');

    if (combined) {
      onUpdateText(combined);
      showNotification('Combined guided paragraphs into your essay draft!');
    }
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5">
      {/* Header with Navigation Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[var(--ink)]">
              Writing Assistant & Scaffold Helper
            </h4>
            <p className="text-[11px] text-[var(--ink3)]">
              Click any starter, template, or vocabulary chip to insert it into your draft!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[var(--card2)] p-1 rounded-xl border border-[var(--line)] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'templates'
                ? 'bg-[var(--teal)] text-white shadow-sm'
                : 'text-[var(--ink2)] hover:text-[var(--ink)]'
            }`}
          >
            📋 Templates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vocab')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'vocab'
                ? 'bg-[var(--teal)] text-white shadow-sm'
                : 'text-[var(--ink2)] hover:text-[var(--ink)]'
            }`}
          >
            🔤 Word Bank
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guided')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'guided'
                ? 'bg-[var(--teal)] text-white shadow-sm'
                : 'text-[var(--ink2)] hover:text-[var(--ink)]'
            }`}
          >
            🧩 Step-by-Step
          </button>
        </div>
      </div>

      {copyFeedback && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span>{copyFeedback}</span>
          <span className="text-emerald-500">✓</span>
        </div>
      )}

      {/* TAB 1: ONE-CLICK TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--ink2)]">
            Stuck on where to start? Load a complete outline with sentence frames you can customize:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => applyTemplate('inspiring')}
              className="text-left p-3.5 rounded-xl border border-[var(--teal)]/40 bg-[var(--card2)] hover:border-[var(--teal)] hover:bg-[var(--teal)]/5 transition space-y-1.5 group"
            >
              <div className="text-xs font-extrabold text-[var(--teal)] flex items-center justify-between">
                <span>⭐ Option A: Inspiring Person Template</span>
                <span className="text-[10px] bg-[var(--teal)]/10 px-2 py-0.5 rounded-full font-bold">1-Click Insert</span>
              </div>
              <p className="text-[11px] text-[var(--ink2)] leading-relaxed">
                4-paragraph structure: Introduction of person → Notable achievements → Difficult challenges overcome → Concluding inspiration.
              </p>
            </button>

            <button
              type="button"
              onClick={() => applyTemplate('talent')}
              className="text-left p-3.5 rounded-xl border border-[var(--purple)]/40 bg-[var(--card2)] hover:border-[var(--purple)] hover:bg-[var(--purple)]/5 transition space-y-1.5 group"
            >
              <div className="text-xs font-extrabold text-[var(--purple)] flex items-center justify-between">
                <span>⚖️ Option B: Talent vs Practice Template</span>
                <span className="text-[10px] bg-[var(--purple)]/10 px-2 py-0.5 rounded-full font-bold">1-Click Insert</span>
              </div>
              <p className="text-[11px] text-[var(--ink2)] leading-relaxed">
                Balanced argument: Introduction of debate → Points for natural talent → Points for deliberate 10,000 hours practice → Your stance.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CLICKABLE VOCABULARY & CONNECTORS BANK */}
      {activeTab === 'vocab' && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--ink2)]">
            Tap any course phrase to append it to your essay draft:
          </p>

          {/* Linking Phrases */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-[var(--ink3)] uppercase tracking-wider">
              Linking Phrases & Transitions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'On the one hand,',
                'On the other hand,',
                'Furthermore,',
                'In addition,',
                'Conversely,',
                'For example,',
                'For instance,',
                'In conclusion,',
                'As research shows,',
                'In my perspective,',
              ].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => insertText(phrase)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-[var(--card2)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition font-medium"
                >
                  + {phrase}
                </button>
              ))}
            </div>
          </div>

          {/* Character & Ability Adjectives */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-[var(--ink3)] uppercase tracking-wider">
              Character & Ability Adjectives (Unit 1A & 3A):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'determined',
                'ambitious',
                'resilient',
                'influential',
                'skilled',
                'outstanding',
                'exceptional',
                'brilliant',
                'motivated',
                'brave',
                'creative',
              ].map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => insertText(word)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-[var(--card2)] border border-[var(--purple)]/30 text-[var(--purple)] hover:border-[var(--purple)] hover:bg-[var(--purple)]/10 transition font-bold"
                >
                  + {word}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-word Verbs & Phrasal Verbs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-[var(--ink3)] uppercase tracking-wider">
              Multi-Word Verbs (Unit 3A & 1B):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'stick with',
                'come up with',
                'have a go at',
                'try out',
                'work out',
                'give up',
                'make an effort',
              ].map((verb) => (
                <button
                  key={verb}
                  type="button"
                  onClick={() => insertText(verb)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-[var(--card2)] border border-[var(--teal)]/30 text-[var(--teal)] hover:border-[var(--teal)] hover:bg-[var(--teal)]/10 transition font-bold"
                >
                  + {verb}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GUIDED 4-STEP PARAGRAPH BUILDER */}
      {activeTab === 'guided' && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--ink2)] leading-relaxed">
            Fill in these 4 bite-sized prompts, then tap <b>Combine into Essay</b> to assemble your full response:
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-bold text-[var(--teal)] block mb-1">
                1. Introduction (Introduce the person or topic — ~25 words):
              </label>
              <input
                type="text"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                placeholder="e.g. I would like to write about Jony Ive, who designed Apple's iconic products..."
                className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] outline-none focus:border-[var(--teal)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[var(--teal)] block mb-1">
                2. Key Achievements or Viewpoint A (~40 words):
              </label>
              <input
                type="text"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                placeholder="e.g. He is exceptionally ambitious and skilled. His greatest achievement was designing the iMac and iPhone..."
                className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] outline-none focus:border-[var(--teal)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[var(--teal)] block mb-1">
                3. Challenges Overcome or Viewpoint B (~40 words):
              </label>
              <input
                type="text"
                value={p3}
                onChange={(e) => setP3(e.target.value)}
                placeholder="e.g. However, early on he faced difficult setbacks. Yet he remained resilient and stuck with his vision..."
                className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] outline-none focus:border-[var(--teal)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[var(--teal)] block mb-1">
                4. Conclusion & Opinion (~25 words):
              </label>
              <input
                type="text"
                value={p4}
                onChange={(e) => setP4(e.target.value)}
                placeholder="e.g. In conclusion, he is an influential innovator who inspires me to never give up on creative ideas."
                className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] outline-none focus:border-[var(--teal)]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={applyGuidedToEssay}
                disabled={!p1 && !p2 && !p3 && !p4}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--teal)] to-emerald-500 text-white text-xs font-black hover:opacity-90 transition disabled:opacity-40 shadow-md flex items-center gap-1.5"
              >
                <span>🚀</span>
                <span>Combine into Essay Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingHelper;
