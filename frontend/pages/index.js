import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import {
  Brain, Zap, Shield, Download, History, Target,
  ChevronRight, Star, Sparkles, BookOpen, Code2, FlaskConical, Globe
} from 'lucide-react';

const features = [
  { icon: Brain,      title: 'AI-Powered',        desc: 'Groq LLM generates contextually relevant, high-quality questions from any syllabus.',     color: 'from-brand-500 to-brand-600' },
  { icon: Zap,        title: 'Instant Results',   desc: 'Generate up to 50 MCQs in under 30 seconds. No waiting, no hassle.',                      color: 'from-amber-400 to-orange-500' },
  { icon: Target,     title: 'Smart Difficulty',  desc: 'Easy, Medium, or Hard — the AI tailors complexity to your chosen level.',                  color: 'from-green-400 to-emerald-500' },
  { icon: Download,   title: 'PDF Export',        desc: 'Download tests and answer keys as beautifully formatted PDFs instantly.',                  color: 'from-pink-400 to-rose-500'   },
  { icon: History,    title: 'Test History',      desc: 'All your generated tests are saved and searchable for future reference.',                  color: 'from-accent-400 to-accent-600' },
  { icon: Shield,     title: 'No Duplicates',     desc: 'Smart deduplication ensures every question in your test is unique.',                      color: 'from-cyan-400 to-blue-500'   },
];

const steps = [
  { num: '01', label: 'Paste Syllabus', desc: 'Paste any syllabus, topic list, or course outline.' },
  { num: '02', label: 'Set Parameters', desc: 'Choose subject, difficulty, and number of questions.' },
  { num: '03', label: 'Get Your Test',  desc: 'Receive a complete MCQ test in seconds, ready to use.' },
];

const subjects = [
  { icon: Code2,       name: 'Computer Science' },
  { icon: FlaskConical, name: 'Chemistry'        },
  { icon: Globe,        name: 'Geography'        },
  { icon: BookOpen,     name: 'History'           },
];

export default function Home({ darkMode, toggleDarkMode }) {
  return (
    <>
      <Head>
        <title>TestGenius — AI-Powered MCQ Test Generator</title>
        <meta name="description" content="Generate professional MCQ tests instantly from any syllabus using Groq AI. Perfect for teachers and students." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* ─── Hero Section ─────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-16">
          {/* Ambient glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="glow-dot w-[600px] h-[600px] bg-brand-500 -top-32 -left-32 opacity-30" />
            <div className="glow-dot w-[500px] h-[500px] bg-accent-500 top-1/2 -right-48 opacity-25" />
            <div className="glow-dot w-[400px] h-[400px] bg-brand-400 bottom-0 left-1/2 opacity-15" />
          </div>

          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
               style={{ backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="relative max-w-5xl mx-auto text-center z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass border border-brand-500/30 px-4 py-2 rounded-full text-sm font-medium text-brand-500 dark:text-brand-400 mb-8"
            >
              <Sparkles size={14} className="animate-pulse" />
              Powered by Groq AI · LLaMA 3
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
            >
              <span className="text-gray-900 dark:text-white">Generate</span>{' '}
              <span className="gradient-text">AI-Powered</span>
              <br />
              <span className="text-gray-900 dark:text-white">MCQ Tests</span>{' '}
              <span className="text-gray-400 dark:text-gray-500 font-light">Instantly</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Paste your syllabus and let AI create professional multiple-choice tests in seconds.
              Perfect for <strong>teachers</strong>, <strong>students</strong>, and <strong>educators</strong> worldwide.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/generate"
                className="btn-primary flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold"
              >
                <Sparkles size={20} />
                Generate Your First Test
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/history"
                className="btn-secondary flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold"
              >
                <History size={18} />
                View History
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500"
            >
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              <span className="ml-1">Trusted by 10,000+ educators</span>
            </motion.div>

            {/* Floating subject chips */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {subjects.map(({ icon: Icon, name }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Icon size={15} className="text-brand-400" />
                  {name}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="glass px-4 py-2 rounded-xl text-sm text-gray-500"
              >
                + Any Subject
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Features Section ─────────────────────────────────────────── */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Why TestGenius?</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Everything you need to create perfect tests, powered by cutting-edge AI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-6 flex flex-col gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1.5">{title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── How It Works ─────────────────────────────────────────────── */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-500 dark:text-gray-400">Three simple steps to your perfect test</p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6">
              {steps.map(({ num, label, desc }, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex-1 glass-card p-6 relative overflow-hidden"
                >
                  <span className="absolute top-4 right-4 text-6xl font-black text-brand-500/8 dark:text-brand-400/10 select-none">{num}</span>
                  <div className="relative z-10">
                    <div className="text-4xl font-black gradient-text mb-3">{num}</div>
                    <h3 className="font-bold text-lg mb-2">{label}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ───────────────────────────────────────────────── */}
        <section className="py-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center glass-card p-12 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-500/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to{' '}
                <span className="gradient-text">Create Your Test?</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                Join thousands of educators using AI to save hours every week.
              </p>
              <Link
                href="/generate"
                className="btn-primary inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold"
              >
                <Brain size={22} />
                Start Generating Free
                <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ─── Footer ───────────────────────────────────────────────────── */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2 font-semibold">
              <Brain size={18} className="text-brand-500" />
              <span className="gradient-text font-bold">TestGenius</span>
              <span>— AI-Powered MCQ Generator</span>
            </div>
            <span>Built with Groq · LLaMA 3 · Next.js</span>
          </div>
        </footer>
      </div>
    </>
  );
}
