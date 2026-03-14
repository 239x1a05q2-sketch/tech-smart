import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { getLeaderboard, getTestById } from '../../lib/api';
import { Trophy, Medal, Clock, User, ArrowLeft, Zap, BarChart2, Loader2 } from 'lucide-react';
import Link from 'next/link';

const MEDAL_COLORS = ['text-amber-400', 'text-gray-400', 'text-amber-700'];
const MEDAL_BG    = ['bg-amber-400/15', 'bg-gray-400/15', 'bg-amber-700/15'];

export default function TestLeaderboard({ darkMode, toggleDarkMode }) {
  const router = useRouter();
  const { id } = router.query;

  const [entries, setEntries]   = useState([]);
  const [test, setTest]         = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [lbRes, testRes] = await Promise.all([getLeaderboard(id), getTestById(id)]);
        setEntries(lbRes.leaderboard);
        setTest(testRes.test);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <>
      <Head>
        <title>{test ? `Leaderboard — ${test.title}` : 'Leaderboard'} — TestGenius</title>
        <meta name="description" content="Top scores for this MCQ test" />
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="glow-dot w-96 h-96 bg-amber-400 top-0 right-0 opacity-15" />
          <div className="glow-dot w-80 h-80 bg-brand-500 bottom-0 left-0 opacity-15" />
        </div>

        <main className="relative z-10 max-w-3xl mx-auto px-4 pt-24 pb-16">
          {/* Back */}
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 transition-colors mb-8">
            <ArrowLeft size={16} /> Back
          </motion.button>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass border border-amber-400/30 px-4 py-2 rounded-full text-sm font-medium text-amber-500 mb-6">
              <Trophy size={14} className="text-amber-400" />
              Leaderboard
            </div>
            {test && (
              <>
                <h1 className="text-3xl font-extrabold mb-2">
                  <span className="gradient-text">{test.title}</span>
                </h1>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                  <span>{test.subject}</span>
                  <span>·</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    test.difficulty === 'Easy' ? 'badge-easy' : test.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                  }`}>{test.difficulty}</span>
                  <span>·</span>
                  <span>{test.num_questions} Questions</span>
                </div>
              </>
            )}
          </motion.div>

          {/* Take test CTA */}
          {test && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex justify-center mb-8">
              <Link href={`/test/${id}`} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold">
                <Zap size={16} /> Take This Test
              </Link>
            </motion.div>
          )}

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-24 text-gray-500">
              <div className="bg-gradient-brand p-4 rounded-2xl"><Loader2 size={28} className="text-white animate-spin" /></div>
              <p>Loading leaderboard…</p>
            </div>
          ) : entries.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 glass-card">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-xl font-bold mb-2">No scores yet</h2>
              <p className="text-gray-500 text-sm mb-6">Be the first to complete this test!</p>
              {test && <Link href={`/test/${id}`} className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
                <Zap size={16} /> Take the Test
              </Link>}
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <motion.div key={entry.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`glass-card px-5 py-4 flex items-center gap-4 ${i < 3 ? 'border-amber-400/20' : ''}`}>

                  {/* Rank */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${i < 3 ? MEDAL_BG[i] : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {i < 3 ? (
                      <Medal size={20} className={MEDAL_COLORS[i]} />
                    ) : (
                      <span className="text-gray-500 text-sm font-bold">#{i + 1}</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400 shrink-0" />
                      <span className="font-semibold text-gray-900 dark:text-white truncate">{entry.player_name}</span>
                      {i === 0 && <span className="text-xs bg-amber-400/15 text-amber-600 px-2 py-0.5 rounded-full font-bold">👑 Top</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Date(entry.submitted_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center shrink-0">
                    <div className={`text-2xl font-black ${entry.percentage >= 80 ? 'text-green-500' : entry.percentage >= 60 ? 'text-brand-500' : 'text-amber-500'}`}>
                      {entry.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">{entry.score}/{entry.total}</div>
                  </div>

                  {/* Time */}
                  {entry.time_taken && (
                    <div className="text-center shrink-0 hidden sm:block">
                      <div className="flex items-center gap-1 text-sm font-mono font-semibold text-gray-600 dark:text-gray-400">
                        <Clock size={13} className="text-brand-400" />
                        {String(Math.floor(entry.time_taken / 60)).padStart(2,'0')}:{String(entry.time_taken % 60).padStart(2,'0')}
                      </div>
                      <div className="text-xs text-gray-400">Time</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Global leaderboard link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center mt-10">
            <Link href="/leaderboard" className="text-sm text-brand-500 hover:underline flex items-center justify-center gap-2">
              <BarChart2 size={14} /> View Global Leaderboard
            </Link>
          </motion.div>
        </main>
      </div>
    </>
  );
}
