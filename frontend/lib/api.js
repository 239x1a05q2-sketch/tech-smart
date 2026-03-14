import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000,
});

// ─── Test API ──────────────────────────────────────────────────────────────
export const generateTest = async ({ syllabus, subject, difficulty, numQuestions }) => {
  const res = await api.post('/tests/generate', { syllabus, subject, difficulty, numQuestions });
  return res.data;
};
export const getTests = async (page = 1, limit = 10) => {
  const res = await api.get('/tests', { params: { page, limit } });
  return res.data;
};
export const getTestById = async (id) => {
  const res = await api.get(`/tests/${id}`);
  return res.data;
};
export const deleteTest = async (id) => {
  const res = await api.delete(`/tests/${id}`);
  return res.data;
};

// ─── Leaderboard API ───────────────────────────────────────────────────────
export const submitScore = async ({ test_id, player_name, score, total, time_taken }) => {
  const res = await api.post('/leaderboard', { test_id, player_name, score, total, time_taken });
  return res.data;
};
export const getLeaderboard = async (testId) => {
  const res = await api.get(`/leaderboard/${testId}`);
  return res.data;
};
export const getGlobalLeaderboard = async () => {
  const res = await api.get('/leaderboard');
  return res.data;
};

export default api;
