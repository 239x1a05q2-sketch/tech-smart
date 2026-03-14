const express = require('express');
const router = express.Router();
const {
  generateTest,
  getTests,
  getTestById,
  deleteTest
} = require('../controllers/testController');

// POST /api/tests/generate — Generate a new MCQ test via AI
router.post('/generate', generateTest);

// GET /api/tests — Get paginated test history
router.get('/', getTests);

// GET /api/tests/:id — Get a single test with full questions
router.get('/:id', getTestById);

// DELETE /api/tests/:id — Delete a test
router.delete('/:id', deleteTest);

module.exports = router;
