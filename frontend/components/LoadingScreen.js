import { motion } from 'framer-motion';
import { Brain, Sparkles, BookOpen, Cpu } from 'lucide-react';

const steps = [
  { icon: BookOpen, label: 'Reading your syllabus...' },
  { icon: Cpu, label: 'Crafting smart questions...' },
  { icon: Sparkles, label: 'Polishing the test...' },
];

/**
 * Full-page loading overlay shown while AI generates questions.
 */
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
         style={{ background: 'var(--bg-primary)' }}>

      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glow-dot w-96 h-96 bg-brand-500 top-1/4 -left-32" />
        <div className="glow-dot w-96 h-96 bg-accent-500 bottom-1/4 -right-32" />
      </div>

      <motion.div
        className="relative flex flex-col items-center gap-8 text-center px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Pulsing Brain Icon */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-gradient-brand rounded-3xl blur-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative bg-gradient-brand p-6 rounded-3xl shadow-brand-lg">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain size={48} className="text-white" />
            </motion.div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold gradient-text mb-2">AI is Thinking...</h2>
          <p className="text-gray-500 dark:text-gray-400">Generating your personalized MCQ test</p>
        </div>

        {/* Step indicators */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {steps.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.8, duration: 0.4 }}
              className="flex items-center gap-3 glass-card px-4 py-3"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: i * 0.8, duration: 1, repeat: Infinity }}
                className="p-1.5 bg-brand-500/20 rounded-lg"
              >
                <Icon size={16} className="text-brand-500" />
              </motion.div>
              <span className="text-sm font-medium">{label}</span>
              <motion.div
                className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: i * 0.8, duration: 1, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-brand-500/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-brand rounded-full"
            initial={{ width: '5%' }}
            animate={{ width: '90%' }}
            transition={{ duration: 25, ease: 'easeInOut' }}
          />
        </div>
        <p className="text-xs text-gray-400">This may take up to 30 seconds</p>
      </motion.div>
    </div>
  );
}
