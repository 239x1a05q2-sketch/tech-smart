import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sun, Moon, Menu, X, Sparkles, History, Home, Zap, Trophy } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/generate', label: 'Generate', icon: Zap },
  { href: '/history', label: 'History', icon: History },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

/**
 * Top navigation bar with dark mode toggle and mobile menu.
 */
export default function Navbar({ darkMode, toggleDarkMode }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [router.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-brand-500/10 shadow-lg shadow-brand-500/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-brand rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-brand p-2 rounded-xl">
                  <Brain size={20} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg gradient-text">TestGenius</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">AI-Powered</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = router.pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-brand-500/15 text-brand-500 dark:text-brand-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-500/8'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className="relative p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500/40 transition-all duration-200 hover:bg-brand-500/8"
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun size={18} className="text-amber-400" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon size={18} className="text-brand-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* CTA Button */}
              <Link
                href="/generate"
                className="hidden sm:flex items-center gap-2 btn-primary px-4 py-2 rounded-xl text-sm font-semibold"
              >
                <Sparkles size={16} />
                Generate Test
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="md:hidden p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass border-b border-brand-500/10 p-4 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    router.pathname === href
                      ? 'bg-brand-500/15 text-brand-500'
                      : 'hover:bg-brand-500/8 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <Link href="/generate" className="btn-primary flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold mt-2">
                <Sparkles size={16} />
                Generate Test
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
