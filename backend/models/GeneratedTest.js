const mongoose = require('mongoose');

/**
 * Schema for individual MCQ questions stored within a test.
 */
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length === 4,
      message: 'Each question must have exactly 4 options'
    }
  },
  correct_answer: {
    type: String,
    required: true
  }
});

/**
 * Schema for a generated test (collection of MCQs).
 */
const GeneratedTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  syllabus: {
    type: String,
    required: true
  },
  numQuestions: {
    type: Number,
    required: true,
    min: 5,
    max: 50
  },
  questions: [QuestionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GeneratedTest', GeneratedTestSchema);
