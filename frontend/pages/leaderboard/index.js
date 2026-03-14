import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { getGlobalLeaderboard } from '../../lib/api';
import { Trophy, Medal, Clock, User, Zap, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

const MEDAL_COLORS = ['text-amber-400', 'text-gray-400', 'text-amber-700'];
const MEDAL_BG     = ['bg-amber-400/15', 'bg-gray-400/15', 'bg-amber-700/15'];

export default function GlobalLeaderboard({ darkMode, toggleDarkMode }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGlobalLeaderboard()
      .then(res => setEntries(res.leaderboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Global Leaderboard — TestGenius</title>
        <meta name="description" content="Top test scores across all subjects on TestGenius." />
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="glow-dot w-96 h-96 bg-amber-400 top-0 right-0 opacity-15" />
          <div className="glow-dot w-80 h-80 bg-accent-500 bottom-0 left-0 opacity-10" />
        </div>

        <main className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass border border-amber-400/30 px-4 py-2 rounded-full text-sm font-medium text-amber-500 mb-6">
              <Trophy size={14} className="text-amber-400 animate-pulse" />
              Global Rankings
            </div>
            <h1 className="text-4xl font-extrabold mb-3">
              <span className="gradient-text">Global Leaderboard</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Top scores across all subjects and tests</p>
          </motion.div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-24 text-gray-500">
              <div className="bg-gradient-brand p-4 rounded-2xl"><Loader2 size={28} className="text-white animate-spin" /></div>
              <p>Loading rankings…</p>
            </div>
          ) : entries.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 glass-card">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-xl font-bold mb-2">No scores yet</h2>
              <p className="text-gray-500 text-sm mb-6">Generate and complete a test to appear here!</p>
              <Link href="/generate" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
                <Zap size={16} /> Generate a Test
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Top 3 podium */}
              {entries.length >= 3 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-3 gap-3 mb-8">
                  {[entries[1], entries[0], entries[2]].map((entry, podiumIdx) => {
                    const rank = podiumIdx === 1 ? 0 : podiumIdx === 0 ? 1 : 2;
                    return entry ? (
                      <div key={entry.id} className={`glass-card p-4 text-center ${podiumIdx === 1 ? 'ring-2 ring-amber-400/40 -mt-4' : ''}`}>
                        <div className={`text-3xl mb-2`}>{rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉'}</div>
                        <div className="font-bold text-sm truncate">{entry.player_name}</div>
                        <div className={`text-2xl font-black mt-1 ${entry.percentage >= 80 ? 'text-green-500' : 'text-brand-500'}`}>{entry.percentage}%</div>
                        <div className="text-xs text-gray-500">{entry.generated_tests?.subject || 'Test'}</div>
                      </div>
                    ) : <div key={podiumIdx} />;
                  })}
                </motion.div>
              )}

              {/* Full list */}
              <div className="flex flex-col gap-3">
                {entries.map((entry, i) => (
                  <motion.div key={entry.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="glass-card px-5 py-4 flex items-center gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black ${i < 3 ? MEDAL_BG[i] : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {i < 3 ? <Medal size={20} className={MEDAL_COLORS[i]} /> : <span className="text-gray-500 text-sm font-bold">#{i + 1}</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 dark:text-white">{entry.player_name}</span>
                        {i === 0 && <span className="text-xs bg-amber-400/15 text-amber-600 px-2 py-0.5 rounded-full font-bold">👑</span>}
                      </div>
                      {entry.generated_tests && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <BookOpen size={11} />
                          <Link href={`/leaderboard/${entry.test_id}`} className="hover:text-brand-500 transition-colors">
                            {entry.generated_tests.title}
                          </Link>
                          <span className={`ml-1 px-1.5 py-0.5 rounded-full ${entry.generated_tests.difficulty === 'Easy' ? 'badge-easy' : entry.generated_tests.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                            {entry.generated_tests.difficulty}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center shrink-0">
                      <div className={`text-2xl font-black ${entry.percentage >= 80 ? 'text-green-500' : entry.percentage >= 60 ? 'text-brand-500' : 'text-amber-500'}`}>
                        {entry.percentage}%
                      </div>
                      <div className="text-xs text-gray-500">{entry.score}/{entry.total}</div>
                    </div>

                    {entry.time_taken && (
                      <div className="text-center shrink-0 hidden sm:block">
                        <div className="flex items-center gap-1 text-sm font-mono font-semibold text-gray-600 dark:text-gray-400">
                          <Clock size={12} className="text-brand-400" />
                          {String(Math.floor(entry.time_taken / 60)).padStart(2,'0')}:{String(entry.time_taken % 60).padStart(2,'0')}
                        </div>
                        <div className="text-xs text-gray-400">Time</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
