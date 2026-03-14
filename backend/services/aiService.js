const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // Updated from llama3-8b-8192

/**
 * Build the AI prompt for MCQ generation.
 */
const buildPrompt = (syllabus, subject, difficulty, numQuestions) => `
You are an expert educator creating a ${difficulty} difficulty test on the subject: "${subject}".

Based on the following syllabus, generate exactly ${numQuestions} unique multiple choice questions.
Cover different topics from the syllabus to ensure balanced coverage.

SYLLABUS:
${syllabus}

RULES:
1. Each question must be unique with no duplicates.
2. Provide exactly 4 options per question labeled A, B, C, D.
3. The correct_answer must exactly match one of the 4 options.
4. For ${difficulty} difficulty: ${getDifficultyGuidance(difficulty)}
5. Return ONLY a valid JSON array — no markdown, no explanation, no extra text.

REQUIRED JSON FORMAT:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A"
  }
]
`.trim();

/**
 * Return difficulty-specific guidance for the prompt.
 */
const getDifficultyGuidance = (difficulty) => {
  const guides = {
    'Easy': 'use straightforward recall questions, basic definitions, and simple concepts.',
    'Medium': 'use application-based questions, require understanding of relationships between concepts.',
    'Hard': 'use analysis, synthesis, and evaluation questions requiring deep understanding.'
  };
  return guides[difficulty] || guides['Medium'];
};

/**
 * Parse and validate the AI JSON response.
 * Extracts JSON from the response even if surrounded by extra text.
 */
const parseAIResponse = (content, numQuestions) => {
  // Try to extract JSON array from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('AI response did not contain a valid JSON array');
  }

  let questions;
  try {
    questions = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error('Failed to parse AI response as JSON: ' + e.message);
  }

  if (!Array.isArray(questions)) {
    throw new Error('AI response is not a JSON array');
  }

  // Validate and clean each question
  const validated = questions
    .filter(q => q.question && Array.isArray(q.options) && q.options.length === 4 && q.correct_answer)
    .map(q => ({
      question: q.question.trim(),
      options: q.options.map(o => o.trim()),
      correct_answer: q.correct_answer.trim()
    }));

  // Remove duplicates by question text
  const unique = validated.filter((q, idx, arr) =>
    arr.findIndex(x => x.question.toLowerCase() === q.question.toLowerCase()) === idx
  );

  if (unique.length < numQuestions) {
    console.warn(`⚠️  AI returned ${unique.length} valid, unique questions (requested ${numQuestions})`);
  }

  return unique;
};

/**
 * Call Groq API to generate MCQ questions.
 * Retries once on failure.
 */
const generateQuestions = async (syllabus, subject, difficulty, numQuestions) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

  const prompt = buildPrompt(syllabus, subject, difficulty, numQuestions);

  const payload = {
    model: GROQ_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an expert educator and test designer. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 4096,
    stream: false
  };

  let lastError;

  // Retry up to 2 times
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🤖 Calling Groq API (attempt ${attempt})...`);
      const response = await axios.post(GROQ_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      });

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from Groq API');

      const questions = parseAIResponse(content, numQuestions);
      console.log(`✅ Generated ${questions.length} questions successfully`);
      return questions;

    } catch (err) {
      lastError = err;
      const errMsg = err.response?.data?.error?.message || err.message;
      console.error(`❌ Groq API attempt ${attempt} failed: ${errMsg}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000)); // wait 1s before retry
    }
  }

  throw new Error(`Groq API failed after 2 attempts: ${lastError?.response?.data?.error?.message || lastError?.message}`);
};

module.exports = { generateQuestions };
