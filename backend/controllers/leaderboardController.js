const { supabase } = require('../services/dbService');

/**
 * POST /api/leaderboard
 * Submit a quiz score to the leaderboard.
 */
const submitScore = async (req, res, next) => {
  try {
    const { test_id, player_name, score, total, time_taken } = req.body;

    if (!test_id) return res.status(400).json({ success: false, message: 'test_id is required.' });
    if (!player_name || player_name.trim().length < 1)
      return res.status(400).json({ success: false, message: 'Player name is required.' });
    if (score === undefined || total === undefined || score < 0 || score > total)
      return res.status(400).json({ success: false, message: 'Invalid score or total.' });

    const percentage = parseFloat(((score / total) * 100).toFixed(2));

    const { data, error } = await supabase
      .from('leaderboard')
      .insert({
        test_id,
        player_name: player_name.trim(),
        score,
        total,
        percentage,
        time_taken: time_taken || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({ success: true, message: 'Score submitted!', entry: data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leaderboard/:testId
 * Get top 50 scores for a specific test, ordered by percentage desc.
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { testId } = req.params;

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('test_id', testId)
      .order('percentage', { ascending: false })
      .order('time_taken', { ascending: true, nullsFirst: false })
      .limit(50);

    if (error) throw new Error(error.message);

    res.json({ success: true, leaderboard: data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leaderboard
 * Get global top scores across all tests (top 100).
 */
const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*, generated_tests(title, subject, difficulty)')
      .order('percentage', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    res.json({ success: true, leaderboard: data });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitScore, getLeaderboard, getGlobalLeaderboard };
