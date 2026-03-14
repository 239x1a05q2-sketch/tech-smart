import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import TestCard from '../components/TestCard';
import { getTests, deleteTest } from '../lib/api';
import { History, Search, Loader2, Brain, Zap, RefreshCw } from 'lucide-react';

export default function HistoryPage({ darkMode, toggleDarkMode }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const fetchTests = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getTests(p, 12);
      setTests(res.tests);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load test history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTests(page); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this test? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteTest(id);
      toast.success('Test deleted.');
      setTests(ts => ts.filter(t => (t.id || t._id) !== id));
    } catch {
      toast.error('Failed to delete test.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = tests.filter(t =>
    !search || t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Test History — TestGenius</title>
        <meta name="description" content="Browse all your previously generated MCQ tests." />
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="glow-dot w-96 h-96 bg-brand-500 top-0 left-0 opacity-15" />
          <div className="glow-dot w-80 h-80 bg-accent-500 bottom-0 right-0 opacity-10" />
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <History size={20} className="text-brand-500" />
                <h1 className="text-3xl font-extrabold gradient-text">Test History</h1>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {pagination.total ?? '—'} tests generated
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchTests(page)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-400 transition-colors text-gray-500 hover:text-brand-500"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              <Link href="/generate" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold">
                <Zap size={16} />
                New Test
              </Link>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-8"
          >
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by subject or title..."
              className="input-field pl-10"
            />
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-gray-500">
              <div className="bg-gradient-brand p-4 rounded-2xl">
                <Loader2 size={28} className="text-white animate-spin" />
              </div>
              <p>Loading your tests...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-6 py-32 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-brand rounded-3xl blur-2xl opacity-40" />
                <div className="relative bg-gradient-brand p-6 rounded-3xl">
                  <Brain size={40} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {search ? 'No tests match your search' : 'No tests yet'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {search ? 'Try a different search term.' : 'Generate your first AI-powered MCQ test to get started!'}
                </p>
                {!search && (
                  <Link href="/generate" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
                    <Zap size={16} />
                    Generate First Test
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((test, i) => (
                  <div key={test.id || test._id} className={deletingId === (test.id || test._id) ? 'opacity-50 pointer-events-none' : ''}>
                    <TestCard test={test} onDelete={handleDelete} index={i} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mt-10"
                >
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-40 hover:border-brand-400 hover:text-brand-500 transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        page === i + 1
                          ? 'bg-gradient-brand text-white shadow-brand'
                          : 'border border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:text-brand-500'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-40 hover:border-brand-400 hover:text-brand-500 transition-colors"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
