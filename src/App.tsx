import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import DetailedResultView from './DetailedResultView';
import TeacherPortal, { saveSingleSubmission, evaluateCEFR } from './TeacherPortal';
import {
  CONFIG,
  PARTS,
  PASSAGES,
  VIDEO,
  AUDIO,
  LISTENINGS,
  prepareQuestions,
  Question,
  PartInfo,
} from './examData';

interface ExamState {
  name: string;
  cls: string;
  idx: number;
  ans: Record<number, any>;
  flags: Record<number, number>;
  endAt: number;
  started: boolean;
  blurs: number;
  blurLog: string[];
  photos: { t: string; ts: number; d: string }[];
  plays: Record<string, number>;
  submitted: boolean;
  camOK: boolean | null;
  sound: boolean;
  rate: number;
  fs: number;
  theme: 'dark' | 'light';
  hc: boolean;
  autoSub: boolean;
  result: any;
}

const INITIAL_STATE: ExamState = {
  name: '',
  cls: '',
  idx: 0,
  ans: {},
  flags: {},
  endAt: 0,
  started: false,
  blurs: 0,
  blurLog: [],
  photos: [],
  plays: {},
  submitted: false,
  camOK: null,
  sound: true,
  rate: 1,
  fs: 1,
  theme: 'dark',
  hc: false,
  autoSub: false,
  result: null,
};

// Sound synthesizer helper using AudioContext
let audioCtx: AudioContext | null = null;
function playTone(freq: number, dur = 0.12, type: OscillatorType = 'sine', vol = 0.05) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {
    // Ignore audio errors
  }
}

const sTap = () => playTone(680, 0.06, 'sine', 0.04);
const sWarn = () => {
  playTone(440, 0.18, 'triangle', 0.08);
  setTimeout(() => playTone(330, 0.24, 'triangle', 0.08), 200);
};
const sDone = () => {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.18, 'sine', 0.06), i * 110));
};

export default function App() {
  const [Q] = useState<Question[]>(() => prepareQuestions());
  const [state, setState] = useState<ExamState>(() => {
    try {
      const stored = localStorage.getItem(CONFIG.storeKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_STATE, ...parsed };
        }
      }
    } catch (e) {}
    return INITIAL_STATE;
  });

  const [screen, setScreen] = useState<'cover' | 'rules' | 'exam' | 'result' | 'teacher'>('cover');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [camStream, setCamStream] = useState<MediaStream | null>(null);
  const [camStatusText, setCamStatusText] = useState<string>('Camera is off.');
  const [canStartExam, setCanStartExam] = useState<boolean>(false);
  const [startBtnText, setStartBtnText] = useState<string>('🔒 Enable camera to start');

  // Video / Audio Player states
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [passageOpen, setPassageOpen] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(CONFIG.minutes * 60);

  const camVideoRef = useRef<HTMLVideoElement | null>(null);
  const camPrevRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ytPlayerRef = useRef<any>(null);

  // Save to LocalStorage
  const saveState = useCallback((next: Partial<ExamState>) => {
    setState((prev) => {
      const updated = { ...prev, ...next };
      try {
        localStorage.setItem(CONFIG.storeKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMsg(null), 2400);
  }, []);

  // Sync appearance settings
  useEffect(() => {
    document.documentElement.style.setProperty('--fs', String(state.fs));
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.classList.toggle('hc', state.hc);
  }, [state.fs, state.theme, state.hc]);

  // Handle environment detection
  const envProblem = useMemo(() => {
    const isIframe = (() => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    })();
    const isSecure =
      window.isSecureContext === true ||
      location.protocol === 'https:' ||
      ['localhost', '127.0.0.1'].indexOf(location.hostname) >= 0;
    const isGUM = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const isInApp = /FBAN|FBAV|Instagram|Line\/|Telegram|MicroMessenger/i.test(navigator.userAgent || '');

    if (isIframe) {
      return 'This page is open inside a frame. Camera preview is managed inside this tab.';
    }
    if (isInApp) {
      return 'You are in an in-app browser. Tap ⋯ and choose "Open in Safari" or "Open in Chrome" for best camera support.';
    }
    if (!isGUM) {
      return 'This browser does not support webcam capture.';
    }
    if (!isSecure) {
      return 'This page is not on a secure (https) address, so webcam access may be restricted.';
    }
    return '';
  }, []);

  // Initial routing based on saved state
  useEffect(() => {
    if (state.submitted && state.result) {
      setScreen('result');
    } else if (state.started && state.endAt > Date.now()) {
      setScreen('exam');
      startWebcam();
    } else if (state.started && state.endAt <= Date.now()) {
      handleFinalSubmit(true);
    }
  }, []);

  // Snapshot capture helper
  const capturePhoto = useCallback((tag: string) => {
    try {
      const v = camVideoRef.current || camPrevRef.current;
      const c = hiddenCanvasRef.current;
      if (!v || !c || !v.videoWidth) return;
      c.width = 320;
      c.height = Math.round((320 * v.videoHeight) / v.videoWidth);
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(v, 0, 0, c.width, c.height);
        const dataUrl = c.toDataURL('image/jpeg', 0.42);
        setState((prev) => {
          const nextPhotos = [...prev.photos, { t: tag, ts: Date.now(), d: dataUrl }];
          if (nextPhotos.length > 6) nextPhotos.shift();
          try {
            localStorage.setItem(CONFIG.storeKey, JSON.stringify({ ...prev, photos: nextPhotos }));
          } catch (e) {}
          return { ...prev, photos: nextPhotos };
        });
      }
    } catch (e) {}
  }, []);

  // Webcam Start
  const startWebcam = async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCanStartExam(true);
      setStartBtnText('Start without camera →');
      setCamStatusText('No camera available on this device.');
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360, facingMode: 'user' },
        audio: false,
      });
      setCamStream(stream);
      if (camPrevRef.current) camPrevRef.current.srcObject = stream;
      if (camVideoRef.current) camVideoRef.current.srcObject = stream;
      setCamStatusText('Camera is on. Keep your face visible.');
      setCanStartExam(true);
      setStartBtnText('Start examination →');
      saveState({ camOK: true });
      setTimeout(() => capturePhoto('start'), 1200);
      return true;
    } catch (err: any) {
      const name = err?.name || '';
      saveState({ camOK: false });
      if (name === 'NotAllowedError') {
        setCamStatusText('Camera access was denied. Enable permission in settings and try again.');
      } else if (name === 'NotFoundError') {
        setCamStatusText('No camera found on this device.');
        setCanStartExam(true);
        setStartBtnText('Start without camera →');
      } else {
        setCamStatusText(`Camera error (${name || 'unknown'}).`);
        setCanStartExam(true);
        setStartBtnText('Start without camera →');
      }
      return false;
    }
  };

  const stopWebcam = () => {
    if (camStream) {
      camStream.getTracks().forEach((t) => t.stop());
      setCamStream(null);
    }
  };

  // Anti-cheat listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.started && !state.submitted) {
        setState((prev) => {
          const next = {
            ...prev,
            blurs: prev.blurs + 1,
            blurLog: [...prev.blurLog, new Date().toISOString()],
          };
          try {
            localStorage.setItem(CONFIG.storeKey, JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.started && !state.submitted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.started, state.submitted]);

  // Exam Countdown Timer
  useEffect(() => {
    if (screen !== 'exam' || !state.started || state.submitted) return;

    let warned10 = false;
    let warned5 = false;

    const timer = setInterval(() => {
      const remainingMs = state.endAt - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setTimeLeft(remainingSec);

      const mins = remainingMs / 60000;
      if (mins <= 10 && mins > 9.8 && !warned10) {
        warned10 = true;
        sWarn();
        toast('10 minutes remaining');
      }
      if (mins <= 5 && mins > 4.8 && !warned5) {
        warned5 = true;
        sWarn();
        toast('5 minutes remaining — finish now');
      }

      // Mid-exam photo intervals
      const totalMs = CONFIG.minutes * 60000;
      const elapsed = totalMs - remainingMs;
      [0.25, 0.5, 0.75].forEach((frac, idx) => {
        if (elapsed > totalMs * frac && state.photos.length <= idx + 1) {
          capturePhoto(`mid${idx + 1}`);
        }
      });

      if (remainingMs <= 0) {
        clearInterval(timer);
        handleFinalSubmit(true);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [screen, state.started, state.submitted, state.endAt, state.photos.length, capturePhoto]);

  // YouTube API initialization
  const initYouTube = (videoId: string) => {
    if ((window as any).YT && (window as any).YT.Player) {
      mountYTPlayer(videoId);
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      mountYTPlayer(videoId);
    };
  };

  const mountYTPlayer = (videoId: string) => {
    try {
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        ytPlayerRef.current.destroy();
      }
      ytPlayerRef.current = new (window as any).YT.Player('ytPlayerTarget', {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          cc_lang_pref: 'none',
          hl: 'en',
        },
        events: {
          onReady: (ev: any) => {
            try {
              // Explicitly turn off subtitles/closed captions if loaded by YouTube
              if (ev.target.unloadModule) {
                ev.target.unloadModule('captions');
                ev.target.unloadModule('cc');
              }
              if (ev.target.setOption) {
                ev.target.setOption('captions', 'track', {});
                ev.target.setOption('cc', 'track', {});
              }
            } catch (err) {}
            ev.target.playVideo();
            setVideoPlaying(true);
          },
          onStateChange: (ev: any) => {
            if (ev.data === 1) {
              setVideoPlaying(true);
              try {
                // Ensure captions stay off on playback start
                if (ev.target.unloadModule) {
                  ev.target.unloadModule('captions');
                  ev.target.unloadModule('cc');
                }
              } catch (err) {}
            } else if (ev.data === 0) {
              setVideoPlaying(false);
              toast('Video ended — now answer the questions');
            }
          },
          onError: () => {
            setVideoPlaying(false);
            toast('Video playback issue. Please check your internet connection.');
          },
        },
      });
    } catch (e) {
      // Ignore video init errors
    }
  };

  const handlePlayVideo = (lx: string) => {
    const used = state.plays[lx] || 0;
    if (used >= CONFIG.maxPlays) {
      toast('You have already watched the video twice');
      return;
    }
    const nextPlays = { ...state.plays, [lx]: used + 1 };
    saveState({ plays: nextPlays });

    const vidConf = VIDEO[lx];
    if (vidConf && vidConf.id) {
      initYouTube(vidConf.id);
    }
  };

  // Grade calculation
  const computeGrades = () => {
    const autoParts = PARTS.filter((p) => p.code !== 'Essay');
    const autoPts = autoParts.reduce((s, p) => s + p.pts, 0);

    const perPart: Record<number, any> = {};
    autoParts.forEach((p) => {
      perPart[p.n] = { got: 0, max: p.pts, n: 0, right: 0, code: p.code, title: p.title };
    });

    const perUnit: Record<number, { n: number; right: number }> = {
      1: { n: 0, right: 0 },
      2: { n: 0, right: 0 },
      3: { n: 0, right: 0 },
      4: { n: 0, right: 0 },
      5: { n: 0, right: 0 },
    };

    const rows: any[] = [];

    Q.forEach((q) => {
      if (q.t === 'essay') return;
      const userAns = state.ans[q.i];
      let correct = false;

      if (q.t === 'mcq' || q.t === 'match' || q.t === 'sort' || q.t === 'stress') {
        correct = userAns === q.a;
      } else if (q.t === 'order') {
        correct = Array.isArray(userAns) && userAns.map((idx) => q.tl![idx]).join(' ') === q.tl!.join(' ');
      } else if (q.t === 'mistake') {
        correct = userAns && userAns.wi === q.wi && userAns.ci === q.a;
      }

      perPart[q.p].n++;
      if (perUnit[q.u]) perUnit[q.u].n++;

      if (correct) {
        perPart[q.p].got += q.pts || 1;
        perPart[q.p].right++;
        if (perUnit[q.u]) perUnit[q.u].right++;
      }

      // Display representations
      let yourDisplay = '—';
      if (userAns !== undefined && userAns !== null) {
        if (q.t === 'mcq' || q.t === 'match') {
          yourDisplay = typeof userAns === 'number' && q.o ? String(q.o[userAns]).replace(/<[^>]+>/g, '') : '—';
        } else if (q.t === 'sort') {
          yourDisplay = q.bk ? q.bk[userAns] : '—';
        } else if (q.t === 'stress') {
          yourDisplay = q.sy
            ? q.sy.map((s, idx) => (idx === userAns ? s.toUpperCase() : s.toLowerCase())).join(q.mode === 'sentence' ? ' ' : '·')
            : '—';
        } else if (q.t === 'order' && Array.isArray(userAns) && q.tl) {
          yourDisplay = userAns.map((idx) => q.tl![idx]).join(' ') + (q.end || '');
        } else if (q.t === 'mistake' && q.w && q.o) {
          yourDisplay = (userAns.wi !== undefined ? `"${q.w[userAns.wi]}"` : '?') + ' → ' + (userAns.ci !== undefined ? q.o[userAns.ci] : '?');
        }
      }

      let rightDisplay = '—';
      if (q.t === 'mcq' || q.t === 'match') {
        rightDisplay = typeof q.a === 'number' && q.o ? String(q.o[q.a]).replace(/<[^>]+>/g, '') : '—';
      } else if (q.t === 'sort') {
        rightDisplay = q.bk ? q.bk[q.a] : '—';
      } else if (q.t === 'stress') {
        rightDisplay = q.sy
          ? q.sy.map((s, idx) => (idx === q.a ? s.toUpperCase() : s.toLowerCase())).join(q.mode === 'sentence' ? ' ' : '·')
          : '—';
      } else if (q.t === 'order' && q.tl) {
        rightDisplay = q.tl.join(' ') + (q.end || '');
      } else if (q.t === 'mistake' && q.w && q.o && q.wi !== undefined) {
        rightDisplay = `"${q.w[q.wi]}" → ` + q.o[q.a];
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
      });
    });

    const totalGot = Object.values(perPart).reduce((acc: number, item: any) => acc + item.got, 0);
    const roundedGot = Math.round(totalGot * 10) / 10;
    const pct = Math.round((roundedGot / autoPts) * 100);

    return {
      got: roundedGot,
      max: autoPts,
      pct,
      perPart,
      perUnit,
      rows,
    };
  };

  const b36 = (n: number) => (n >= 10 ? String.fromCharCode(55 + n) : String(n));
  const calcCheckChar = (baseStr: string) => {
    let s = 0;
    for (const c of baseStr.replace(/-/g, '')) s += c.charCodeAt(0);
    return b36(s % 36);
  };

  const generateCompletionCode = (res: any) => {
    const nm = (state.name.replace(/[^A-Za-z]/g, '').toUpperCase() + 'XXXX').slice(0, 4);
    const pctStr = String(Math.min(999, res.pct)).padStart(3, '0');
    let sec = '';
    PARTS.filter((p) => p.code !== 'Essay').forEach((p) => {
      const partScore = res.perPart[p.n];
      sec += b36(Math.round((partScore.got / partScore.max) * 10));
    });
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const base = `${CONFIG.examId}-${nm}-${pctStr}-${sec}-${dd}${mm}`;
    const checkCh = calcCheckChar(base);
    return `${CONFIG.examId}-${nm}-${pctStr}-${sec}${checkCh}-${dd}${mm}`;
  };

  const handleFinalSubmit = (isAuto = false) => {
    capturePhoto('end');
    stopWebcam();
    sDone();

    const results = computeGrades();
    const code = generateCompletionCode(results);
    const timeUsed = Math.min(
      CONFIG.minutes * 60,
      Math.round((CONFIG.minutes * 60000 - (state.endAt - Date.now())) / 1000)
    );

    const fullResult = {
      ...results,
      code,
      auto: isAuto,
      timeUsed,
    };

    // Auto-archive submission into persistent Teacher Submissions Store
    try {
      const essayIndex = Q.findIndex((q) => q.t === 'essay');
      const essayText = (state.ans[essayIndex] || '').trim();
      const essayWordCount = essayText ? essayText.split(/\s+/).filter(Boolean).length : 0;
      const cefr = evaluateCEFR(results.pct);

      saveSingleSubmission({
        id: 'sub-' + Date.now(),
        name: state.name || 'Candidate',
        cls: state.cls || '',
        submittedAt: new Date().toISOString(),
        timestamp: Date.now(),
        timeUsed,
        code,
        autoScore: results.got,
        autoMax: results.max,
        autoPct: results.pct,
        teacherScore: 0,
        teacherMax: 10,
        finalScore: results.got,
        finalMax: results.max + 10,
        finalPct: Math.round((results.got / (results.max + 10)) * 100),
        cefrLevel: cefr.level,
        rubric: { task: 0, coherence: 0, lexical: 0, grammar: 0 },
        feedback: '',
        gradedBy: '',
        isGraded: false,
        essayText,
        essayWordCount,
        answers: state.ans,
        perPart: results.perPart,
        perUnit: results.perUnit,
        rows: results.rows,
        photos: state.photos,
        blurs: state.blurs,
        blurLog: state.blurLog,
      });
    } catch (e) {
      console.warn('Teacher store archiving error:', e);
    }

    saveState({
      submitted: true,
      started: false,
      autoSub: isAuto,
      result: fullResult,
    });

    setScreen('result');
  };

  const isQuestionAnswered = (idx: number) => {
    const val = state.ans[idx];
    if (val === undefined || val === null) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return val.wi !== undefined && val.ci !== undefined;
    return true;
  };

  const currentQ = Q[state.idx];
  const currentPart = PARTS.find((p) => p.n === currentQ.p);
  const totalAnsweredCount = useMemo(() => Q.filter((_, idx) => isQuestionAnswered(idx)).length, [state.ans, Q]);

  // Render Screens
  return (
    <div className="min-h-screen flex flex-col text-[var(--ink)] bg-[var(--bg)]">
      {/* ================= APP BAR ================= */}
      <header className="sticky top-0 z-50 bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--line)] no-print">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--card2)] border border-[var(--purple)] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg viewBox="0 0 64 34" className="w-7 h-7">
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2DD4A7" />
                    <stop offset="55%" stopColor="#4FB5E0" />
                    <stop offset="100%" stopColor="#7C6FF0" />
                  </linearGradient>
                </defs>
                <path
                  d="M17 17c0-6 4.4-10 9.4-10 6.6 0 9.4 6.4 12.6 12.4C42 25 44.6 29 49 29c4.4 0 7.6-3.4 7.6-8s-3.2-8-7.6-8c-4.4 0-7 4-10 9.6C35.8 29 33 33 26.4 33 21.4 33 17 29 17 23"
                  fill="none"
                  stroke="url(#logoGrad)"
                  strokeWidth="5.4"
                  strokeLinecap="round"
                  transform="translate(-9,-3) scale(1.02)"
                />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight leading-tight">
                Hein<span className="text-[var(--teal)]">finity</span> English
              </div>
              <div className="text-[0.68rem] tracking-wider text-[var(--ink3)] uppercase font-semibold">
                Empower B2 · Units 1–5 Mid-Term
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextFs = state.fs >= 1.25 ? 1 : Math.round((state.fs + 0.125) * 1000) / 1000;
                saveState({ fs: nextFs });
                toast(`Text size ${Math.round(nextFs * 100)}%`);
              }}
              className={`h-9 px-3 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-xs font-bold transition hover:border-[var(--teal)] ${
                state.fs !== 1 ? 'border-[var(--teal)] text-[var(--teal)]' : ''
              }`}
              title="Change text size"
            >
              A+
            </button>

            <button
              onClick={() => {
                saveState({ hc: !state.hc });
                toast(state.hc ? 'Standard contrast' : 'High contrast active');
              }}
              className={`h-9 px-3 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-xs font-bold transition hover:border-[var(--teal)] ${
                state.hc ? 'border-[var(--teal)] text-[var(--teal)]' : ''
              }`}
              title="High contrast"
            >
              ◐
            </button>

            <button
              onClick={() => {
                const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
                saveState({ theme: nextTheme });
              }}
              className="h-9 px-3 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-xs font-bold transition hover:border-[var(--teal)]"
              title="Toggle dark/light theme"
            >
              {state.theme === 'dark' ? '🌙' : '☀️'}
            </button>

            <button
              onClick={() => {
                setModalContent(
                  <TeacherGateModal
                    onSuccess={() => {
                      setModalContent(null);
                      setScreen('teacher');
                    }}
                    onCancel={() => setModalContent(null)}
                  />
                );
              }}
              className="h-9 px-3 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-xs font-bold transition hover:border-[var(--purple)] text-[var(--ink2)] hover:text-[var(--ink)]"
            >
              🧑‍🏫 <span className="hidden sm:inline ml-1">Teacher</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT SCREENS ================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* SCREEN 1: COVER */}
        {screen === 'cover' && (
          <div className="max-w-2xl mx-auto space-y-6 anim-fade">
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-8 text-center shadow-xl">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--tealsoft)] text-[var(--teal)] mb-3">
                ● Empower B2 · Units 1–5
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--ink)]">
                Units 1–5 <span className="text-[var(--teal)]">Mid-Term Exam</span>
              </h1>
              <div className="text-[var(--gold)] font-bold text-sm mt-1">by {CONFIG.teacher}</div>
              <p className="text-[var(--ink2)] text-sm mt-4 leading-relaxed max-w-lg mx-auto">
                Outstanding People, Survival, Talent, Life Events and Chance — interactive questions with live YouTube video listening, instant scoring, and proctoring. Read carefully and show what you can do!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3.5">
                  <div className="text-2xl font-black text-[var(--teal)]">100</div>
                  <div className="text-[0.68rem] tracking-wider uppercase font-bold text-[var(--ink3)]">Points</div>
                </div>
                <div className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3.5">
                  <div className="text-2xl font-black text-[var(--teal)]">8</div>
                  <div className="text-[0.68rem] tracking-wider uppercase font-bold text-[var(--ink3)]">Parts</div>
                </div>
                <div className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3.5">
                  <div className="text-2xl font-black text-[var(--teal)]">{Q.length}</div>
                  <div className="text-[0.68rem] tracking-wider uppercase font-bold text-[var(--ink3)]">Questions</div>
                </div>
                <div className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-3.5">
                  <div className="text-2xl font-black text-[var(--teal)]">{CONFIG.minutes}</div>
                  <div className="text-[0.68rem] tracking-wider uppercase font-bold text-[var(--ink3)]">Minutes</div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-extrabold text-[var(--ink)]">Candidate Registration</h2>
              <p className="text-xs text-[var(--ink2)]">
                Enter your details to begin. Your progress is saved automatically and will resume if reloaded.
              </p>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-wider font-extrabold text-[var(--ink3)] mb-1.5">
                  Full Name <span className="text-[var(--red)]">*</span>
                </label>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => saveState({ name: e.target.value })}
                  placeholder="e.g. Aung Aung"
                  maxLength={40}
                  className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-4 py-3 text-sm focus:border-[var(--teal)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-wider font-extrabold text-[var(--ink3)] mb-1.5">
                  Student ID / Class (optional)
                </label>
                <input
                  type="text"
                  value={state.cls}
                  onChange={(e) => saveState({ cls: e.target.value })}
                  placeholder="e.g. B2-Evening-03"
                  maxLength={30}
                  className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl px-4 py-3 text-sm focus:border-[var(--teal)] outline-none"
                />
              </div>

              {envProblem && (
                <div className="p-3.5 rounded-xl border border-[var(--gold)] bg-[var(--goldsoft)] text-xs text-[var(--ink)] leading-relaxed">
                  <b>⚠️ Note regarding webcam:</b> {envProblem}
                </div>
              )}

              <button
                onClick={() => {
                  if (state.name.trim().length < 2) {
                    toast('Please enter your full name first');
                    return;
                  }
                  setScreen('rules');
                  startWebcam();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] font-black text-sm transition hover:opacity-95 shadow-lg shadow-teal-500/20"
              >
                Continue to instructions →
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: INSTRUCTIONS */}
        {screen === 'rules' && (
          <div className="max-w-4xl mx-auto space-y-5 anim-fade">
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--ink)]">
                  Examination instructions
                </h1>
                <p className="text-xs sm:text-sm text-[var(--ink2)] mt-1.5 leading-relaxed">
                  This examination has <b className="text-[var(--ink)]">8 parts</b> and a total of{' '}
                  <b className="text-[var(--ink)]">100 points</b>. You have{' '}
                  <b className="text-[var(--teal)]">{CONFIG.minutes} minutes</b>. The essay (Part 8) is marked by your teacher.
                </p>
              </div>

              {/* 8 Parts Grid matching screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {PARTS.map((p) => {
                  const partCount = Q.filter((q) => q.p === p.n).length;
                  return (
                    <div
                      key={p.n}
                      className="bg-[var(--card2)] border border-[var(--line)] rounded-xl p-4 flex flex-col justify-between transition hover:border-[var(--line2)]"
                    >
                      <div>
                        <div className="text-[0.68rem] font-black uppercase tracking-wider text-[#7C6FF0]">
                          PART {p.n}
                        </div>
                        <div className="font-extrabold text-base text-[var(--ink)] mt-1 tracking-tight">
                          {p.title}
                        </div>
                      </div>
                      <div className="text-xs text-[var(--ink2)] mt-3">
                        <span className="text-[var(--teal)] font-bold">{p.pts} points</span>{' '}
                        <span>· {p.code === 'Essay' ? '1 writing task (graded by teacher)' : `${partCount} questions`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Difficulty indicators */}
              <div className="flex items-center gap-4 text-xs font-bold text-[var(--ink)] flex-wrap pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4A7]" /> Easy 20%
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F5C542]" /> Medium 30%
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2607A]" /> Hard 50%
                </span>
              </div>

              {/* How interactive questions work callout */}
              <div className="p-4 sm:p-5 rounded-xl border-l-4 border-l-[#F5C542] bg-[#F5C542]/10 border border-transparent space-y-2">
                <div className="font-extrabold text-xs sm:text-sm text-[#F5C542] flex items-center gap-2">
                  <span>💡</span> How the interactive questions work
                </div>
                <p className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                  Different questions need different actions, all by <b>tapping</b> (works on phone and computer): choose one or more options, tap True/False, tap a word from a <b>word bank</b> into a gap, pick from <b>drop-down menus</b>, <b>match</b> the two columns, <b>put words in order</b>, tap the <b>stressed syllable/word</b>, find and correct mistakes, or type your essay.
                </p>
              </div>

              {/* Part 7 Video Callout */}
              <div className="p-4 rounded-xl border border-[var(--purple)] bg-[var(--purplesoft)] text-xs sm:text-sm text-[var(--ink)] space-y-1.5">
                <div className="font-extrabold text-[var(--purple)] flex items-center gap-2">
                  <span>🎬</span> Part 7 Listening — YouTube Video Test
                </div>
                <div className="text-xs sm:text-sm text-[var(--ink2)] leading-relaxed">
                  Part 7 includes an embedded <b>YouTube Listening Test video (&ldquo;Relationship dilemmas – B2 English Listening Test&rdquo;)</b>. Tap <b>PLAY</b> to watch and listen. You may play the video up to <b>2 times</b>.
                </div>
              </div>

              {/* Camera Verification & Proctoring Box */}
              <div className="p-4 rounded-xl border border-[var(--teal)] bg-[var(--tealsoft)] space-y-3">
                <div className="font-extrabold text-xs uppercase tracking-wider text-[var(--teal)] flex items-center gap-2">
                  <span>📷</span> Proctoring & Candidate Verification
                </div>
                <div className="text-xs text-[var(--ink2)] leading-relaxed">
                  Automated periodic snapshot proctoring is enabled to ensure exam integrity. Please ensure your face remains clearly visible in the preview.
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <video
                    ref={camPrevRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-40 aspect-[4/3] rounded-lg bg-black object-cover border border-[var(--line)] -scale-x-100"
                  />
                  <div className="space-y-2">
                    <button
                      onClick={startWebcam}
                      className="px-4 py-2 rounded-lg bg-[var(--card2)] border border-[var(--line)] text-xs font-bold hover:border-[var(--teal)] text-[var(--ink)]"
                    >
                      {camStream ? 'Camera Connected ✓' : 'Enable Camera'}
                    </button>
                    <div className="text-xs text-[var(--ink2)]">{camStatusText}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setScreen('cover')}
                  className="px-5 py-3 rounded-xl border border-[var(--line2)] text-xs font-bold hover:bg-[var(--card2)] text-[var(--ink)]"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    const now = Date.now();
                    saveState({
                      started: true,
                      submitted: false,
                      idx: 0,
                      endAt: now + CONFIG.minutes * 60000,
                    });
                    setScreen('exam');
                  }}
                  disabled={!canStartExam}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] font-black text-sm transition hover:opacity-95 disabled:opacity-40 shadow-lg shadow-teal-500/20"
                >
                  {startBtnText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: EXAM */}
        {screen === 'exam' && (
          <div className="space-y-4 anim-fade">
            {/* Status bar */}
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2 flex-wrap shadow-lg">
              <div className="flex items-center gap-2 bg-[var(--card2)] border border-[var(--line)] rounded-full px-3 py-1 text-xs font-bold">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] flex items-center justify-center text-[0.65rem] font-black">
                  {(state.name || 'S')[0].toUpperCase()}
                </span>
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{state.name || 'Candidate'}</span>
              </div>

              <div className="bg-[var(--card2)] border border-[var(--line)] rounded-full px-3.5 py-1 text-xs font-bold text-[var(--ink2)]">
                {totalAnsweredCount} / {Q.length} answered
              </div>

              <div
                className={`ml-auto rounded-full px-3.5 py-1 text-xs sm:text-sm font-black tabular-nums border ${
                  timeLeft <= 300
                    ? 'border-[var(--red)] text-[var(--red)] bg-[var(--redsoft)] animate-pulse'
                    : timeLeft <= 600
                    ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--goldsoft)]'
                    : 'border-[var(--line)] bg-[var(--card2)] text-[var(--ink)]'
                }`}
              >
                ⏱ {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </div>

            {/* Exam grid: main question area + sidebar navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
              {/* Question Host */}
              <div className="space-y-4">
                <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
                  {/* Top tags */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-black tracking-wider uppercase text-[var(--purple)]">
                      Part {currentQ.p} · {currentPart?.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[0.65rem] ${
                        currentQ.d === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : currentQ.d === 'medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {currentQ.d}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--tealsoft)] text-[var(--teal)] font-bold text-[0.65rem]">
                      U{currentQ.u} · {currentQ.l}
                    </span>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-[var(--card2)] text-[var(--ink2)] text-[0.65rem] font-bold">
                      1 pt
                    </span>
                  </div>

                  <div className="text-base sm:text-lg font-bold text-[var(--ink)]">
                    Question {state.idx + 1} of {Q.length}
                  </div>

                  {/* Reading passage component */}
                  {currentQ.px && PASSAGES[currentQ.px] && (
                    <div className="border border-[var(--line)] border-l-4 border-l-[var(--gold)] rounded-r-xl bg-[var(--card2)] p-4 space-y-2">
                      <button
                        onClick={() => setPassageOpen(!passageOpen)}
                        className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--gold)] text-left"
                      >
                        <span>{PASSAGES[currentQ.px].title}</span>
                        <span>{passageOpen ? '▴' : '▾'}</span>
                      </button>
                      {passageOpen && (
                        <div className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed space-y-2.5 pt-2 border-t border-[var(--line)]">
                          {PASSAGES[currentQ.px].text.split('\n\n').map((pText, pIdx) => (
                            <p key={pIdx}>{pText}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Listening Video / Audio Player component */}
                  {currentQ.lx && (
                    <div className="border border-[var(--line)] border-l-4 border-l-[var(--purple)] rounded-r-xl bg-[var(--card2)] p-4 space-y-3">
                      <div className="text-xs font-black uppercase tracking-wider text-[var(--purple)]">
                        🎬 Part 7 Listening — Video Test
                      </div>

                      {/* YouTube Video Wrapper */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[var(--line)]">
                        <div id="ytPlayerTarget" className="w-full h-full" />
                        {!videoPlaying && (
                          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 text-center">
                            <div className="text-xs text-[var(--ink2)] max-w-xs">
                              Tap <b>PLAY</b> below to watch the video test. You may play it <b>twice</b>.
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePlayVideo(currentQ.lx!)}
                          disabled={(state.plays[currentQ.lx!] || 0) >= CONFIG.maxPlays && !videoPlaying}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] font-black text-lg flex items-center justify-center shadow-lg transition hover:scale-105 disabled:opacity-30"
                        >
                          {videoPlaying ? '■' : '▶'}
                        </button>
                        <div className="text-xs text-[var(--ink2)]">
                          <div className="font-bold text-[var(--ink)]">{LISTENINGS[currentQ.lx]?.title}</div>
                          <div>
                            {Math.max(0, CONFIG.maxPlays - (state.plays[currentQ.lx!] || 0))} watch(es) remaining
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-[var(--ink3)] -mt-1">{currentPart?.instr}</div>

                  {/* Interactive Question Input based on type */}
                  <div className="pt-2">
                    {/* MCQ */}
                    {currentQ.t === 'mcq' && currentQ.o && (
                      <div className="space-y-3">
                        <div
                          className="text-sm sm:text-base font-bold text-[var(--ink)] leading-snug"
                          dangerouslySetInnerHTML={{ __html: currentQ.q }}
                        />
                        <div className="grid gap-2.5">
                          {currentQ.o.map((opt, oIdx) => {
                            const isSelected = state.ans[state.idx] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  sTap();
                                  saveState({ ans: { ...state.ans, [state.idx]: oIdx } });
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition ${
                                  isSelected
                                    ? 'bg-[var(--tealsoft)] border-[var(--teal)]'
                                    : 'bg-[var(--card2)] border-[var(--line)] hover:border-[var(--line2)]'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                                    isSelected
                                      ? 'bg-[var(--teal)] text-[#08111F]'
                                      : 'bg-[var(--card3)] text-[var(--teal)]'
                                  }`}
                                >
                                  {'ABCD'[oIdx]}
                                </span>
                                <span
                                  className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: opt }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* MATCH */}
                    {currentQ.t === 'match' && currentQ.o && (
                      <div className="space-y-3">
                        <div className="text-sm font-bold text-[var(--ink)]">
                          Column A: <em className="text-[var(--gold)] not-italic font-extrabold">{currentQ.q}</em>
                        </div>
                        <div className="grid gap-2">
                          {currentQ.o.map((opt, oIdx) => {
                            const isSelected = state.ans[state.idx] === oIdx;
                            // Check if this option is chosen elsewhere in the same group
                            const usedElsewhere = Q.some(
                              (otherQ, otherIdx) =>
                                otherQ.t === 'match' &&
                                otherQ.g === currentQ.g &&
                                otherIdx !== state.idx &&
                                state.ans[otherIdx] === oIdx
                            );

                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  sTap();
                                  saveState({ ans: { ...state.ans, [state.idx]: oIdx } });
                                }}
                                className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition ${
                                  isSelected
                                    ? 'bg-[var(--tealsoft)] border-[var(--teal)]'
                                    : usedElsewhere
                                    ? 'opacity-40 bg-[var(--card2)] border-[var(--line)]'
                                    : 'bg-[var(--card2)] border-[var(--line)] hover:border-[var(--line2)]'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                                    isSelected
                                      ? 'bg-[var(--teal)] text-[#08111F]'
                                      : 'bg-[var(--card3)] text-[var(--teal)]'
                                  }`}
                                >
                                  {oIdx + 1}
                                </span>
                                <span className="text-xs sm:text-sm text-[var(--ink)]">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="text-[0.7rem] text-[var(--ink3)]">
                          Dimmed options are currently assigned to another word in this vocabulary set.
                        </div>
                      </div>
                    )}

                    {/* WORD ORDER */}
                    {currentQ.t === 'order' && currentQ.tl && (
                      <div className="space-y-3">
                        <div className="text-sm font-bold text-[var(--ink)]">Put the words in order.</div>
                        <div className="min-h-[56px] border-2 border-dashed border-[var(--line2)] rounded-xl p-2.5 bg-[var(--card2)] flex flex-wrap gap-2 items-center">
                          {Array.isArray(state.ans[state.idx]) && state.ans[state.idx].length > 0 ? (
                            state.ans[state.idx].map((tileIdx: number, pos: number) => (
                              <button
                                key={pos}
                                onClick={() => {
                                  sTap();
                                  const updated = [...state.ans[state.idx]];
                                  updated.splice(pos, 1);
                                  saveState({ ans: { ...state.ans, [state.idx]: updated } });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[var(--tealsoft)] border border-[var(--teal)] text-xs font-bold text-[var(--teal)]"
                              >
                                {currentQ.tl![tileIdx]}
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-[var(--ink3)] px-2">
                              Tap the words below to construct your sentence
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {(currentQ.sh || currentQ.tl.map((_, idx) => idx)).map((tileIdx) => {
                            const isUsed =
                              Array.isArray(state.ans[state.idx]) && state.ans[state.idx].includes(tileIdx);
                            return (
                              <button
                                key={tileIdx}
                                disabled={isUsed}
                                onClick={() => {
                                  sTap();
                                  const currentArr = Array.isArray(state.ans[state.idx])
                                    ? [...state.ans[state.idx]]
                                    : [];
                                  currentArr.push(tileIdx);
                                  saveState({ ans: { ...state.ans, [state.idx]: currentArr } });
                                }}
                                className={`px-3 py-2 rounded-lg border text-xs font-bold transition ${
                                  isUsed
                                    ? 'opacity-30 pointer-events-none bg-[var(--card2)] border-[var(--line)]'
                                    : 'bg-[var(--card2)] border-[var(--line)] hover:border-[var(--teal)]'
                                }`}
                              >
                                {currentQ.tl![tileIdx]}
                              </button>
                            );
                          })}
                        </div>
                        <div className="text-[0.7rem] text-[var(--ink3)]">
                          Sentence ends automatically with <b>{currentQ.end || '.'}</b>
                        </div>
                      </div>
                    )}

                    {/* SORT INTO BUCKETS */}
                    {currentQ.t === 'sort' && currentQ.bk && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[var(--card3)] text-center text-lg font-black text-[var(--teal)]">
                          {currentQ.item}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentQ.bk.map((bucketLabel, bIdx) => {
                            const isSelected = state.ans[state.idx] === bIdx;
                            return (
                              <button
                                key={bIdx}
                                onClick={() => {
                                  sTap();
                                  saveState({ ans: { ...state.ans, [state.idx]: bIdx } });
                                }}
                                className={`p-4 rounded-xl border text-sm font-extrabold transition ${
                                  isSelected
                                    ? 'bg-[var(--tealsoft)] border-[var(--teal)] text-[var(--teal)]'
                                    : 'bg-[var(--card2)] border-[var(--line)] hover:border-[var(--line2)]'
                                }`}
                              >
                                {bucketLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* FIND MISTAKE */}
                    {currentQ.t === 'mistake' && currentQ.w && currentQ.o && (
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-[var(--ink2)] mb-2 font-bold">Step 1 — tap the incorrect word:</div>
                          <div className="flex flex-wrap gap-2">
                            {currentQ.w.map((word, wIdx) => {
                              const isSelected = state.ans[state.idx]?.wi === wIdx;
                              return (
                                <button
                                  key={wIdx}
                                  onClick={() => {
                                    sTap();
                                    saveState({ ans: { ...state.ans, [state.idx]: { wi: wIdx } } });
                                  }}
                                  className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold transition ${
                                    isSelected
                                      ? 'bg-[var(--redsoft)] border-[var(--red)] text-[var(--red)]'
                                      : 'bg-[var(--card2)] border-[var(--line)] hover:border-[var(--line2)]'
                                  }`}
                                >
                                  {word}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {state.ans[state.idx]?.wi !== undefined && (
                          <div className="pt-3 border-t border-dashed border-[var(--line2)] space-y-2">
                            <div className="text-xs text-[var(--ink2)] font-bold">
                              Step 2 — tap the correction for &ldquo;<b>{currentQ.w[state.ans[state.idx].wi]}</b>&rdquo;:
                            </div>
                            <div className="grid gap-2">
                              {currentQ.o.map((corrOpt, cIdx) => {
                                const isCorrSelected = state.ans[state.idx]?.ci === cIdx;
                                return (
                                  <button
                                    key={cIdx}
                                    onClick={() => {
                                      sTap();
                                      saveState({
                                        ans: {
                                          ...state.ans,
                                          [state.idx]: { wi: state.ans[state.idx].wi, ci: cIdx },
                                        },
                                      });
                                    }}
                                    className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition ${
                                      isCorrSelected
                                        ? 'bg-[var(--tealsoft)] border-[var(--teal)] text-[var(--teal)]'
                                        : 'bg-[var(--card2)] border-[var(--line)] hover:border-[var(--line2)]'
                                    }`}
                                  >
                                    <span
                                      className={`w-5 h-5 rounded flex items-center justify-center text-xs font-black ${
                                        isCorrSelected ? 'bg-[var(--teal)] text-[#08111F]' : 'bg-[var(--card3)]'
                                      }`}
                                    >
                                      {'ABC'[cIdx]}
                                    </span>
                                    <span className="text-xs sm:text-sm">{corrOpt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STRESS */}
                    {currentQ.t === 'stress' && currentQ.sy && (
                      <div className="space-y-3">
                        <div
                          className="text-sm font-bold text-[var(--ink)]"
                          dangerouslySetInnerHTML={{ __html: currentQ.q }}
                        />
                        <div className="flex flex-wrap gap-2">
                          {currentQ.sy.map((syllable, sIdx) => {
                            const isSelected = state.ans[state.idx] === sIdx;
                            return (
                              <button
                                key={sIdx}
                                onClick={() => {
                                  sTap();
                                  saveState({ ans: { ...state.ans, [state.idx]: sIdx } });
                                }}
                                className={`px-4 py-2.5 rounded-xl border text-sm font-black uppercase transition ${
                                  isSelected
                                    ? 'bg-[var(--teal)] border-[var(--teal)] text-[#08111F]'
                                    : 'bg-[var(--card2)] border-[var(--line)] hover:border-[var(--teal)] text-[var(--ink)]'
                                }`}
                              >
                                {currentQ.mode === 'sentence' ? syllable : syllable.toLowerCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ESSAY */}
                    {currentQ.t === 'essay' && (
                      <div className="space-y-3">
                        <div
                          className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: currentQ.q }}
                        />
                        <textarea
                          rows={11}
                          value={state.ans[state.idx] || ''}
                          onChange={(e) => {
                            saveState({ ans: { ...state.ans, [state.idx]: e.target.value } });
                          }}
                          placeholder="Write your argument here…"
                          className="w-full bg-[var(--card2)] border border-[var(--line)] rounded-xl p-4 text-xs sm:text-sm focus:border-[var(--teal)] outline-none leading-relaxed"
                        />
                        <div className="flex justify-between items-center text-xs text-[var(--ink3)]">
                          <span>Marked by {CONFIG.teacher} (10 pts)</span>
                          <span
                            className={
                              (() => {
                                const wc = (state.ans[state.idx] || '').trim().split(/\s+/).filter(Boolean).length;
                                return wc >= (currentQ.min || 180) && wc <= (currentQ.max || 220)
                                  ? 'text-[var(--teal)] font-bold'
                                  : '';
                              })()
                            }
                          >
                            {(state.ans[state.idx] || '').trim().split(/\s+/).filter(Boolean).length} words · target {currentQ.min}–{currentQ.max}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <aside className="space-y-4 no-print">
                {/* Live Webcam Proctoring Box */}
                <div className="bg-[var(--card)] border border-[var(--teal)] rounded-2xl p-3.5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--teal)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      📷 Live Proctoring Active
                    </span>
                    <span className="text-[0.65rem] text-[var(--ink3)] font-bold">
                      {state.photos?.length || 0} snapshots
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-[var(--line2)]">
                    <video
                      ref={camVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100"
                    />
                    {!camStream && (
                      <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 text-center">
                        <span className="text-xs text-amber-400 font-bold mb-1.5">Camera feed paused</span>
                        <button
                          onClick={startWebcam}
                          className="px-2.5 py-1 rounded bg-[var(--teal)] text-[#08111F] text-[0.68rem] font-extrabold"
                        >
                          Reconnect Camera
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-[0.68rem] text-[var(--ink2)] flex items-center justify-between">
                    <span>Keep your face centered</span>
                    {state.blurs > 0 && (
                      <span className="text-rose-400 font-bold">⚠️ {state.blurs} tab blur(s)</span>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-4 shadow-xl space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const flaggedKeys = Object.keys(state.flags).map(Number);
                        if (!flaggedKeys.length) {
                          toast('No flagged questions');
                          return;
                        }
                        const nextFlag = flaggedKeys.find((i) => i > state.idx);
                        saveState({ idx: nextFlag !== undefined ? nextFlag : flaggedKeys[0] });
                      }}
                      className="py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20"
                    >
                      🚩 Flagged ({Object.keys(state.flags).length})
                    </button>

                    <button
                      onClick={() => {
                        setModalContent(
                          <SubmitConfirmModal
                            unanswered={Q.length - totalAnsweredCount}
                            onConfirm={() => {
                              setModalContent(null);
                              handleFinalSubmit(false);
                            }}
                            onCancel={() => setModalContent(null)}
                          />
                        );
                      }}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#7C6FF0] to-[#5B4FD6] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-indigo-500/20"
                    >
                      Submit Exam
                    </button>
                  </div>

                  <div>
                    <div className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--ink3)] mb-2">
                      Question Navigator
                    </div>

                    <div className="flex gap-3 text-[0.7rem] text-[var(--ink2)] mb-3 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--teal)]" /> Answered
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" /> Flagged
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--card2)] border border-[var(--line2)]" /> Unanswered
                      </span>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-3">
                      {PARTS.map((p) => {
                        const partQuestions = Q.filter((q) => q.p === p.n);
                        if (!partQuestions.length) return null;
                        return (
                          <div key={p.n}>
                            <div className="text-[0.65rem] font-black uppercase tracking-wider text-[var(--purple)] mb-1.5">
                              Part {p.n} · {p.title}
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                              {partQuestions.map((q) => {
                                const isAns = isQuestionAnswered(q.i);
                                const isFlag = !!state.flags[q.i];
                                const isCur = state.idx === q.i;

                                return (
                                  <button
                                    key={q.i}
                                    onClick={() => {
                                      sTap();
                                      saveState({ idx: q.i });
                                    }}
                                    className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition border ${
                                      isCur ? 'ring-2 ring-[var(--purple)] ring-offset-1 ring-offset-[var(--card)]' : ''
                                    } ${
                                      isAns
                                        ? 'bg-[var(--teal)] border-[var(--teal)] text-[#08111F]'
                                        : isFlag
                                        ? 'bg-[var(--gold)] border-[var(--gold)] text-[#2A1F00]'
                                        : 'bg-[var(--card2)] border-[var(--line)] text-[var(--ink2)] hover:border-[var(--teal)]'
                                    }`}
                                  >
                                    {q.i + 1}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* Bottom Floating Nav */}
            <div className="sticky bottom-3 z-40 bg-[var(--card)]/95 backdrop-blur-md border border-[var(--line)] rounded-2xl p-2.5 flex items-center gap-3 max-w-xl mx-auto shadow-2xl no-print">
              <button
                disabled={state.idx === 0}
                onClick={() => {
                  sTap();
                  saveState({ idx: Math.max(0, state.idx - 1) });
                }}
                className="flex-1 py-2.5 rounded-xl border border-[var(--line2)] text-xs font-bold hover:bg-[var(--card2)] disabled:opacity-30"
              >
                ← Back
              </button>

              <button
                onClick={() => {
                  const updatedFlags = { ...state.flags };
                  if (updatedFlags[state.idx]) {
                    delete updatedFlags[state.idx];
                  } else {
                    updatedFlags[state.idx] = 1;
                  }
                  saveState({ flags: updatedFlags });
                }}
                className={`w-11 h-10 rounded-xl border flex items-center justify-center text-sm transition ${
                  state.flags[state.idx]
                    ? 'bg-[var(--gold)] border-[var(--gold)] text-[#2A1F00]'
                    : 'border-[var(--line2)] text-[var(--ink2)] hover:text-[var(--ink)]'
                }`}
                title="Flag question"
              >
                🚩
              </button>

              <button
                onClick={() => {
                  sTap();
                  if (state.idx < Q.length - 1) {
                    saveState({ idx: state.idx + 1 });
                  } else {
                    setModalContent(
                      <SubmitConfirmModal
                        unanswered={Q.length - totalAnsweredCount}
                        onConfirm={() => {
                          setModalContent(null);
                          handleFinalSubmit(false);
                        }}
                        onCancel={() => setModalContent(null)}
                      />
                    );
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4A7] to-[#7C6FF0] text-[#08111F] text-xs font-black hover:opacity-95 shadow-md shadow-teal-500/20"
              >
                {state.idx === Q.length - 1 ? 'Finish →' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: RESULTS */}
        {screen === 'result' && state.result && (
          <DetailedResultView
            state={state}
            Q={Q}
            toast={toast}
            onRetake={() => {
              if (window.confirm('Reset this test attempt and start over?')) {
                localStorage.removeItem(CONFIG.storeKey);
                setState(INITIAL_STATE);
                setScreen('cover');
              }
            }}
          />
        )}

        {/* SCREEN 5: TEACHER DASHBOARD */}
        {screen === 'teacher' && (
          <TeacherPortal
            onBack={() => setScreen(state.submitted ? 'result' : state.started ? 'exam' : 'cover')}
          />
        )}
      </main>

      {/* Floating Proctoring Webcam during exam */}
      {screen === 'exam' && camStream && (
        <div className="fixed right-4 bottom-20 z-50 w-32 rounded-xl overflow-hidden border-2 border-[var(--teal)] shadow-2xl bg-black no-print">
          <div className="absolute top-1.5 left-1.5 bg-[var(--pink)] text-white text-[0.55rem] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> REC
          </div>
          <video ref={camVideoRef} autoPlay playsInline muted className="w-full aspect-[4/3] object-cover -scale-x-100" />
        </div>
      )}

      {/* Hidden canvas for snapshot capture */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Generic Modal */}
      {modalContent && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalContent(null);
          }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {modalContent}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--card3)] text-[var(--ink)] border border-[var(--line2)] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-2xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// ================= MODALS & SUBCOMPONENTS =================

function SubmitConfirmModal({
  unanswered,
  onConfirm,
  onCancel,
}: {
  unanswered: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-[var(--ink)]">Submit Examination?</h3>
      {unanswered > 0 ? (
        <div className="p-3.5 rounded-xl border border-[var(--red)] bg-[var(--redsoft)] text-xs text-[var(--ink)] leading-relaxed">
          <b>{unanswered} question{unanswered > 1 ? 's are' : ' is'} still unanswered.</b> You will not be able to modify any responses after final submission.
        </div>
      ) : (
        <div className="p-3.5 rounded-xl border border-[var(--teal)] bg-[var(--tealsoft)] text-xs text-[var(--ink)]">
          All questions have been answered. Ready to submit?
        </div>
      )}

      <div className="flex gap-2.5 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-[var(--line2)] text-xs font-bold hover:bg-[var(--card2)]"
        >
          Keep working
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C6FF0] to-[#5B4FD6] text-white text-xs font-bold hover:opacity-95"
        >
          Submit now
        </button>
      </div>
    </div>
  );
}

function TeacherGateModal({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-[var(--ink)]">Teacher Access</h3>
      <p className="text-xs text-[var(--ink2)]">Enter the teacher passcode to review attempts and grade essays.</p>
      <input
        type="password"
        value={pin}
        onChange={(e) => {
          setPin(e.target.value);
          setErr(false);
        }}
        placeholder="Passcode"
        className={`w-full bg-[var(--card2)] border rounded-xl px-4 py-3 text-sm outline-none ${
          err ? 'border-[var(--red)]' : 'border-[var(--line)] focus:border-[var(--purple)]'
        }`}
      />
      {err && <div className="text-xs text-[var(--red)] font-bold">Incorrect passcode</div>}
      <div className="flex gap-2.5 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-[var(--line2)] text-xs font-bold hover:bg-[var(--card2)]"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (pin.trim().toUpperCase() === CONFIG.teacherPin) {
              onSuccess();
            } else {
              setErr(true);
            }
          }}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C6FF0] to-[#5B4FD6] text-white text-xs font-bold hover:opacity-95"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
