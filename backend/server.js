const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./services/dbService');
const testRoutes = require('./routes/testRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Database Connection ───────────────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/tests', testRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Test Generator API is running', timestamp: new Date().toISOString() });
});

// ─── Error Handling ────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 AI Test Generator Backend running on http://localhost:${PORT}`);
  console.log(`🗄️  Database: Supabase`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
