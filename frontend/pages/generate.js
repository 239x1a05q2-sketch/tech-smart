import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import { generateTest } from '../lib/api';
import { Brain, BookOpen, Target, Hash, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 40, 50];

export default function Generate({ darkMode, toggleDarkMode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    syllabus: '',
    subject: '',
    difficulty: 'Medium',
    numQuestions: 10,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.syllabus || form.syllabus.trim().length < 20)
      e.syllabus = 'Please enter at least 20 characters of syllabus content.';
    if (!form.subject || form.subject.trim().length < 2)
      e.subject = 'Subject name is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await generateTest({ ...form });
      toast.success(`${res.test.questions.length} questions generated!`);
      router.push(`/test/${res.test.id || res.test._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate test. Please try again.';
      toast.error(msg);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  const difficultyColors = {
    Easy:   'border-green-500 bg-green-500/15 text-green-700 dark:text-green-400',
    Medium: 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400',
    Hard:   'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400',
  };
  const difficultyInactive = 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:bg-brand-500/5';

  return (
    <>
      <Head>
        <title>Generate Test — TestGenius</title>
        <meta name="description" content="Create AI-powered MCQ tests from your syllabus in seconds." />
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="glow-dot w-96 h-96 bg-brand-500 top-0 right-0 opacity-20" />
          <div className="glow-dot w-80 h-80 bg-accent-500 bottom-0 left-0 opacity-15" />
        </div>

        <main className="relative z-10 max-w-3xl mx-auto px-4 pt-28 pb-16">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 glass border border-brand-500/30 px-4 py-2 rounded-full text-sm font-medium text-brand-500 dark:text-brand-400 mb-6">
              <Brain size={14} className="animate-pulse" />
              AI Test Generator
            </div>
            <h1 className="text-4xl font-extrabold mb-3">
              <span className="gradient-text">Generate Test</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Paste your syllabus and let AI craft the perfect MCQ test for you.
            </p>
          </motion.div>

          {/* Form card */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 flex flex-col gap-8"
          >
            {/* Syllabus */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <BookOpen size={16} className="text-brand-500" />
                Syllabus / Topic Content
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.syllabus}
                onChange={e => { setForm(f => ({...f, syllabus: e.target.value})); setErrors(er => ({...er, syllabus: ''})); }}
                placeholder="Paste your syllabus, course outline, or topic list here...&#10;&#10;Example:&#10;Chapter 1: Introduction to Python — Variables, Data Types, Operators&#10;Chapter 2: Control Flow — if/else, loops, functions&#10;Chapter 3: Data Structures — Lists, Tuples, Dictionaries"
                rows={8}
                className={`input-field resize-none font-mono text-sm ${errors.syllabus ? 'border-red-400' : ''}`}
              />
              {errors.syllabus && (
                <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                  <AlertCircle size={13} /> {errors.syllabus}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{form.syllabus.length} characters</p>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Target size={16} className="text-accent-500" />
                Subject
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={e => { setForm(f => ({...f, subject: e.target.value})); setErrors(er => ({...er, subject: ''})); }}
                placeholder="e.g. Computer Science, Mathematics, Biology..."
                className={`input-field ${errors.subject ? 'border-red-400' : ''}`}
              />
              {errors.subject && (
                <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                  <AlertCircle size={13} /> {errors.subject}
                </p>
              )}
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Sparkles size={16} className="text-amber-400" />
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm(f => ({...f, difficulty: d}))}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                      form.difficulty === d ? difficultyColors[d] : difficultyInactive
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Hash size={16} className="text-green-400" />
                Number of Questions
                <span className="ml-auto text-brand-500 font-bold text-base">{form.numQuestions}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {QUESTION_COUNTS.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm(f => ({...f, numQuestions: n}))}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                      form.numQuestions === n
                        ? 'border-brand-500 bg-brand-500/15 text-brand-600 dark:text-brand-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-400 hover:bg-brand-500/5'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="glass px-5 py-4 rounded-xl border border-brand-500/20 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap gap-x-6 gap-y-2">
              <span><strong className="text-gray-800 dark:text-white">Subject:</strong> {form.subject || '—'}</span>
              <span><strong className="text-gray-800 dark:text-white">Difficulty:</strong> {form.difficulty}</span>
              <span><strong className="text-gray-800 dark:text-white">Questions:</strong> {form.numQuestions}</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-3 py-4 rounded-xl text-base font-bold w-full"
            >
              <Brain size={22} />
              Generate Test with AI
              <ChevronRight size={20} />
            </button>
          </motion.form>
        </main>
      </div>
    </>
  );
}
