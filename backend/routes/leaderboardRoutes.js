const express = require('express');
const router = express.Router();
const { submitScore, getLeaderboard, getGlobalLeaderboard } = require('../controllers/leaderboardController');

// POST /api/leaderboard — Submit a score
router.post('/', submitScore);

// GET /api/leaderboard — Global top scores
router.get('/', getGlobalLeaderboard);

// GET /api/leaderboard/:testId — Top scores for a specific test
router.get('/:testId', getLeaderboard);

module.exports = router;
