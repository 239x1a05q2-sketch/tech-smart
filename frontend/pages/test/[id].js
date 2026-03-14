import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { getTestById, submitScore } from '../../lib/api';
import {
  Brain, CheckCircle2, XCircle, ArrowLeft, Trophy, Download,
  FileText, Loader2, Clock, ChevronRight, ChevronLeft,
  Eye, EyeOff, BarChart2, User, Send, Star
} from 'lucide-react';
import jsPDF from 'jspdf';
import Link from 'next/link';

const difficultyBadge = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ─── Modes ───────────────────────────────────────────────────────────────────
// 'quiz'    → user taking the test (selecting answers, timer running)
// 'result'  → score screen after submission
// 'review'  → review all answers after seeing score
// 'browse'  → just browsing / viewing questions (no quiz)

export default function TestViewer({ darkMode, toggleDarkMode }) {
  const router = useRouter();
  const { id } = router.query;

  const [test, setTest]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [mode, setMode]           = useState('quiz');       // quiz | result | review | browse
  const [answers, setAnswers]     = useState({});           // { questionIndex: selectedOption }
  const [score, setScore]         = useState(null);
  const [elapsed, setElapsed]     = useState(0);            // seconds timer
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const timerRef = useRef(null);

  // ─── Load test ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await getTestById(id);
        setTest(res.test);
      } catch {
        toast.error('Failed to load test.');
        router.push('/history');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode === 'quiz') {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [mode]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ─── Submit quiz ───────────────────────────────────────────────────────────
  const handleSubmitQuiz = () => {
    if (!test) return;
    let correct = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
    });
    setScore({ correct, total: test.questions.length, time: elapsed });
    setMode('result');
  };

  // ─── Submit to leaderboard ────────────────────────────────────────────────
  const handleLeaderboardSubmit = async () => {
    if (!playerName.trim()) { toast.error('Please enter your name.'); return; }
    setSubmitting(true);
    try {
      await submitScore({
        test_id: test.id,
        player_name: playerName.trim(),
        score: score.correct,
        total: score.total,
        time_taken: score.time,
      });
      toast.success('Score saved to leaderboard! 🏆');
      setSubmitted(true);
    } catch {
      toast.error('Failed to save score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── PDF Export ────────────────────────────────────────────────────────────
  const exportPDF = async (answerKeyOnly = false) => {
    if (!test) return;
    setExportingPDF(true);
    try {
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const W = pdf.internal.pageSize.getWidth();
      const margin = 15, usable = W - margin * 2;
      let y = margin;
      const checkNewPage = (n = 10) => { if (y + n > 285) { pdf.addPage(); y = margin; } };

      pdf.setFillColor(68, 97, 242);
      pdf.rect(0, 0, W, 28, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(17);
      pdf.text(answerKeyOnly ? 'ANSWER KEY' : test.title, margin, 18);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Subject: ${test.subject} | Difficulty: ${test.difficulty} | Questions: ${test.questions.length}`, margin, 25);
      y = 38;
      pdf.setTextColor(10, 15, 30);

      if (answerKeyOnly) {
        test.questions.forEach((q, i) => {
          checkNewPage(10);
          pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10);
          const lines = pdf.splitTextToSize(`${i + 1}. ${q.correct_answer}`, usable - 8);
          pdf.text(lines, margin + 4, y); y += lines.length * 6 + 2;
        });
      } else {
        test.questions.forEach((q, i) => {
          checkNewPage(40);
          pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
          const qLines = pdf.splitTextToSize(`Q${i + 1}. ${q.question}`, usable);
          pdf.text(qLines, margin, y); y += qLines.length * 6 + 3;
          pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10);
          q.options.forEach((opt, j) => {
            checkNewPage(8);
            const oLines = pdf.splitTextToSize(`   ${OPTION_LABELS[j]}) ${opt}`, usable - 8);
            pdf.text(oLines, margin + 4, y); y += oLines.length * 5.5;
          });
          y += 6;
        });
      }
      pdf.save(answerKeyOnly ? `${test.subject}_AnswerKey.pdf` : `${test.subject}_${test.difficulty}_Test.pdf`);
      toast.success(`${answerKeyOnly ? 'Answer key' : 'Test'} downloaded!`);
    } catch { toast.error('Export failed.'); }
    finally { setExportingPDF(false); }
  };

  // ─── Option button style ─────────────────────────────────────────────────
  const getOptionStyle = (q, i, opt) => {
    if (mode === 'quiz') {
      return answers[i] === opt
        ? 'border-brand-500 bg-brand-500/15 text-brand-600 dark:text-brand-400'
        : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:bg-brand-500/5';
    }
    // review / result
    if (opt === q.correct_answer) return 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400';
    if (answers[i] === opt && opt !== q.correct_answer) return 'border-red-400 bg-red-400/10 text-red-600 dark:text-red-400';
    return 'border-gray-200 dark:border-gray-700 opacity-50';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-col items-center gap-4">
        <div className="bg-gradient-brand p-4 rounded-2xl"><Loader2 size={32} className="text-white animate-spin" /></div>
        <p className="text-gray-500">Loading test…</p>
      </div>
    </div>
  );

  if (!test) return null;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === test.questions.length;
  const pct = score ? Math.round((score.correct / score.total) * 100) : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // RESULT SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (mode === 'result') return (
    <>
      <Head><title>Results — {test.title}</title></Head>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="glow-dot w-96 h-96 bg-brand-500 top-0 right-0 opacity-20" />
          <div className="glow-dot w-80 h-80 bg-accent-500 bottom-0 left-0 opacity-15" />
        </div>

        <main className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-16">
          {/* Score Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center mb-6">
            {/* Emoji result */}
            <div className="text-6xl mb-4">
              {pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : pct >= 40 ? '📚' : '💪'}
            </div>
            <h1 className="text-3xl font-extrabold gradient-text mb-1">
              {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : pct >= 40 ? 'Keep Practicing!' : 'Better Luck Next Time!'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{test.title}</p>

            {/* Score ring */}
            <div className="flex items-center justify-center gap-10 mb-8">
              <div className="text-center">
                <div className="text-5xl font-black gradient-text">{pct}%</div>
                <div className="text-sm text-gray-500 mt-1">Score</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-green-500">{score.correct}</div>
                <div className="text-sm text-gray-500 mt-1">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-red-400">{score.total - score.correct}</div>
                <div className="text-sm text-gray-500 mt-1">Wrong</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-amber-400">{formatTime(score.time)}</div>
                <div className="text-sm text-gray-500 mt-1">Time</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
              <motion.div
                className={`h-full rounded-full ${pct >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : pct >= 60 ? 'bg-gradient-brand' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setMode('review')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500/10 text-brand-500 font-semibold hover:bg-brand-500/20 transition-colors text-sm">
                <Eye size={15} /> Review Answers
              </button>
              <button onClick={() => exportPDF(false)} disabled={exportingPDF} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm hover:border-brand-400 transition-colors">
                {exportingPDF ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export PDF
              </button>
              <button onClick={() => exportPDF(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm hover:border-brand-400 transition-colors">
                <FileText size={14} /> Answer Key
              </button>
            </div>
          </motion.div>

          {/* Leaderboard submission */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-amber-400" />
              <h2 className="text-lg font-bold">Save to Leaderboard</h2>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="bg-amber-400/15 p-3 rounded-2xl"><Trophy size={28} className="text-amber-400" /></div>
                <p className="font-semibold text-green-600 dark:text-green-400">Your score has been saved! 🎉</p>
                <Link href={`/leaderboard/${test.id}`} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold">
                  <BarChart2 size={15} /> View Leaderboard
                </Link>
              </motion.div>
            ) : (
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLeaderboardSubmit()}
                    placeholder="Enter your name..." maxLength={30}
                    className="input-field pl-9"
                  />
                </div>
                <button onClick={handleLeaderboardSubmit} disabled={submitting || !playerName.trim()}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60 shrink-0">
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Submit
                </button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 justify-center flex-wrap">
              <Link href={`/leaderboard/${test.id}`} className="text-sm text-brand-500 hover:underline flex items-center gap-1">
                <BarChart2 size={13} /> View Leaderboard for this test
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link href="/leaderboard" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
                <Trophy size={13} /> Global Leaderboard
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // QUIZ / REVIEW SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  const isReview = mode === 'review';

  return (
    <>
      <Head><title>{isReview ? 'Review — ' : ''}{test.title} — TestGenius</title></Head>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="glow-dot w-96 h-96 bg-brand-500 -top-20 -right-20 opacity-20" />
          <div className="glow-dot w-80 h-80 bg-accent-500 bottom-0 left-0 opacity-15" />
        </div>

        <main className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-20">
          {/* Back */}
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => isReview ? setMode('result') : router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 transition-colors mb-6">
            <ArrowLeft size={16} /> {isReview ? 'Back to Results' : 'Back'}
          </motion.button>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${difficultyBadge[test.difficulty]}`}>{test.difficulty}</span>
                  <span className="text-xs text-gray-500">{test.subject}</span>
                  <span className="text-xs text-gray-500">{test.questions.length} Questions</span>
                  {isReview && score && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-500">
                      Score: {score.correct}/{score.total} ({pct}%)
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold">{isReview ? '📋 Review — ' : ''}{test.title}</h1>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* Timer (quiz mode only) */}
                {!isReview && (
                  <div className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-sm font-mono font-semibold">
                    <Clock size={14} className="text-brand-400" />
                    {formatTime(elapsed)}
                  </div>
                )}
                {/* Answer toggle (review only) */}
                {isReview && (
                  <button onClick={() => setShowAllAnswers(v => !v)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-500/30 text-brand-500 text-sm font-semibold hover:bg-brand-500/10 transition-colors">
                    {showAllAnswers ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showAllAnswers ? 'Hide' : 'Show All'}
                  </button>
                )}
                <button onClick={() => exportPDF(false)} disabled={exportingPDF} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500/10 text-brand-500 text-sm font-semibold hover:bg-brand-500/20 transition-colors">
                  {exportingPDF ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} PDF
                </button>
              </div>
            </div>

            {/* Progress bar (quiz mode) */}
            {!isReview && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{answeredCount}/{test.questions.length} answered</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-brand rounded-full" animate={{ width: `${(answeredCount / test.questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Questions */}
          <div className="flex flex-col gap-4">
            {test.questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = isReview && userAnswer === q.correct_answer;
              const isWrong   = isReview && userAnswer && userAnswer !== q.correct_answer;
              const isSkipped = isReview && !userAnswer;

              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`glass-card p-6 flex flex-col gap-4 ${isReview ? (isCorrect ? 'border-green-500/30' : isWrong ? 'border-red-400/30' : 'border-amber-400/30') : ''}`}>

                  {/* Question */}
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-xl text-white text-sm font-bold shadow-brand ${isReview ? (isCorrect ? 'bg-green-500' : isWrong ? 'bg-red-400' : 'bg-amber-400') : 'bg-gradient-brand'}`}>
                      {isReview ? (isCorrect ? '✓' : isWrong ? '✗' : '–') : i + 1}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium leading-relaxed pt-1">{q.question}</p>
                    {isReview && (
                      <span className={`ml-auto shrink-0 text-xs font-bold px-2 py-1 rounded-full ${isCorrect ? 'bg-green-500/15 text-green-600 dark:text-green-400' : isWrong ? 'bg-red-400/15 text-red-500' : 'bg-amber-400/15 text-amber-600'}`}>
                        {isCorrect ? 'Correct' : isWrong ? 'Wrong' : 'Skipped'}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-2 ml-11">
                    {q.options.map((opt, j) => (
                      <button key={j} onClick={() => { if (!isReview) setAnswers(a => ({ ...a, [i]: opt })); }}
                        disabled={isReview}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${getOptionStyle(q, i, opt)}`}>
                        <span className="shrink-0 w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                          {OPTION_LABELS[j]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isReview && opt === q.correct_answer && <CheckCircle2 size={15} className="text-green-500 shrink-0" />}
                        {isReview && answers[i] === opt && opt !== q.correct_answer && <XCircle size={15} className="text-red-400 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Show correct answer in review */}
                  {(isReview && (showAllAnswers || isWrong || isSkipped)) && (
                    <AnimatePresence>
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="ml-11 flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
                        <CheckCircle2 size={14} />
                        <span><strong>Correct:</strong> {q.correct_answer}</span>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Submit button (quiz mode) */}
          {!isReview && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="fixed bottom-6 left-0 right-0 flex justify-center z-30 px-4">
              <div className="glass-card px-6 py-4 flex items-center gap-4 max-w-lg w-full">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">{answeredCount}/{test.questions.length} answered</div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-brand rounded-full transition-all duration-300" style={{ width: `${(answeredCount / test.questions.length) * 100}%` }} />
                  </div>
                </div>
                <button onClick={handleSubmitQuiz}
                  className={`btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shrink-0 ${!allAnswered ? 'opacity-80' : ''}`}>
                  <Trophy size={16} />
                  {allAnswered ? 'Submit Test' : `Submit (${answeredCount}/${test.questions.length})`}
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}
