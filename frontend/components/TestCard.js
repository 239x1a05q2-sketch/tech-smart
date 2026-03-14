import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, BookOpen, HelpCircle, Trash2, Eye, ChevronRight } from 'lucide-react';

const difficultyClass = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard',
};

/**
 * Card component for a single test in the history list.
 */
export default function TestCard({ test, onDelete, index }) {
  const date = new Date(test.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const time = new Date(test.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card p-5 flex flex-col gap-4 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base leading-snug text-gray-900 dark:text-white line-clamp-1">
            {test.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <BookOpen size={13} className="text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{test.subject}</span>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyClass[test.difficulty]}`}>
          {test.difficulty}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <HelpCircle size={14} className="text-brand-400" />
          <span>{test.numQuestions} Questions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-accent-400" />
          <span>{date} · {time}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
        <Link
          href={`/test/${test.id || test._id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-semibold bg-brand-500/10 text-brand-500 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
        >
          <Eye size={15} />
          View Test
          <ChevronRight size={14} />
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(test.id || test._id)}
            className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete test"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
