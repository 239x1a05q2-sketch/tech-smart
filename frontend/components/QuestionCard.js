import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

/**
 * Individual MCQ question card with option selection and answer reveal.
 */
export default function QuestionCard({ question, index, showAllAnswers }) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const revealed = showAllAnswers || showAnswer;
  const optionLabels = ['A', 'B', 'C', 'D'];

  const getOptionStyle = (opt) => {
    if (!revealed && selected !== opt) return 'border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:bg-brand-500/5';
    if (!revealed && selected === opt) return 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400';
    if (opt === question.correct_answer) return 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400';
    if (selected === opt && opt !== question.correct_answer) return 'border-red-400 bg-red-400/10 text-red-600 dark:text-red-400';
    return 'border-gray-200 dark:border-gray-700 opacity-60';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="glass-card p-6 flex flex-col gap-4"
    >
      {/* Question header */}
      <div className="flex items-start gap-3">
        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-brand text-white text-sm font-bold shadow-brand">
          {index + 1}
        </span>
        <p className="text-gray-900 dark:text-white font-medium leading-relaxed pt-1">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2 ml-11">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { if (!revealed) setSelected(opt); }}
            disabled={revealed}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${getOptionStyle(opt)}`}
          >
            <span className="shrink-0 w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
              {optionLabels[i]}
            </span>
            <span className="flex-1">{opt}</span>
            {revealed && opt === question.correct_answer && (
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            )}
            {revealed && selected === opt && opt !== question.correct_answer && (
              <XCircle size={16} className="text-red-400 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Correct answer reveal */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-11 flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400"
          >
            <CheckCircle2 size={15} />
            <span><strong>Correct Answer:</strong> {question.correct_answer}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show answer toggle button */}
      {!showAllAnswers && (
        <div className="ml-11">
          <button
            onClick={() => setShowAnswer(v => !v)}
            className="flex items-center gap-2 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            {showAnswer ? <EyeOff size={13} /> : <Eye size={13} />}
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
