const { supabase } = require('../services/dbService');
const { generateQuestions } = require('../services/aiService');

/**
 * POST /api/tests/generate
 * Generate a new MCQ test using Groq AI and save it to Supabase.
 */
const generateTest = async (req, res, next) => {
  try {
    const { syllabus, subject, difficulty, numQuestions } = req.body;

    // ─── Validate Input ──────────────────────────────────────
    if (!syllabus || syllabus.trim().length < 20)
      return res.status(400).json({ success: false, message: 'Syllabus must be at least 20 characters.' });
    if (!subject || subject.trim().length < 2)
      return res.status(400).json({ success: false, message: 'Subject is required.' });
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty))
      return res.status(400).json({ success: false, message: 'Difficulty must be Easy, Medium, or Hard.' });
    const count = parseInt(numQuestions);
    if (isNaN(count) || count < 5 || count > 50)
      return res.status(400).json({ success: false, message: 'Number of questions must be between 5 and 50.' });

    // ─── Call AI ─────────────────────────────────────────────
    const questions = await generateQuestions(syllabus.trim(), subject.trim(), difficulty, count);
    if (!questions || questions.length === 0)
      return res.status(500).json({ success: false, message: 'AI failed to generate valid questions. Please try again.' });

    // ─── Save to Supabase ────────────────────────────────────
    const { data, error } = await supabase
      .from('generated_tests')
      .insert({
        title: `${subject.trim()} — ${difficulty} Test`,
        subject: subject.trim(),
        difficulty,
        syllabus: syllabus.trim(),
        num_questions: questions.length,
        questions,  // stored as JSONB
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({
      success: true,
      message: `Successfully generated ${questions.length} questions!`,
      test: data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tests
 * Paginated list of tests (history).
 */
const getTests = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    const { data, error, count } = await supabase
      .from('generated_tests')
      .select('id, title, subject, difficulty, num_questions, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    res.json({
      success: true,
      tests: data,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tests/:id
 * Single test with full questions.
 */
const getTestById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('generated_tests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data)
      return res.status(404).json({ success: false, message: 'Test not found.' });

    res.json({ success: true, test: data });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tests/:id
 */
const deleteTest = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('generated_tests')
      .delete()
      .eq('id', req.params.id);

    if (error) throw new Error(error.message);
    res.json({ success: true, message: 'Test deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateTest, getTests, getTestById, deleteTest };
