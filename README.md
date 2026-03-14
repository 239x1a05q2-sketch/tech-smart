# 🧠 TestGenius — AI-Powered MCQ Test Generator

A full-stack ed-tech platform that generates professional multiple-choice tests from any syllabus using **Groq AI (LLaMA 3.1)** and **Supabase**.

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14, TailwindCSS, Framer Motion |
| Backend    | Node.js, Express.js                 |
| AI         | Groq API (llama-3.1-8b-instant)     |
| Database   | Supabase (PostgreSQL)               |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
mini_project/
├── frontend/          # Next.js app
│   ├── components/    # Navbar, QuestionCard, TestCard, LoadingScreen
│   ├── pages/         # index, generate, history, test/[id], leaderboard
│   ├── lib/api.js     # Axios API client
│   └── styles/        # globals.css
├── backend/           # Express API
│   ├── controllers/   # testController.js, leaderboardController.js
│   ├── routes/        # testRoutes.js, leaderboardRoutes.js
│   ├── services/      # aiService.js, dbService.js
│   └── middleware/    # errorHandler.js
├── .gitignore         # Configured to hide .env keys
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+
- Supabase account (Run the provided SQL schema in your project)
- Groq API Key

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env from .env.example
node server.js
# Server starts at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
# Create .env.local from .env.example
npm run dev
# App starts at http://localhost:3000
```

---

## ☁️ Deployment Guide

### A. Backend → Render
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Create **New > Web Service**.
3. Connect the GitHub repo: `https://github.com/239x1a05q2-sketch/tech-smart`.
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `node server.js`
7. **Env Vars**:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `PORT`: `10000`

### B. Frontend → Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the GitHub repo.
3. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
4. **Env Vars**:
   - `NEXT_PUBLIC_API_URL`: (Your Render URL, e.g., `https://test-generator-backend.onrender.com`)
5. Click **Deploy**.

---

## 🔌 API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/tests/generate    | Generate AI MCQ test     |
| GET    | /api/tests             | Get test history         |
| POST   | /api/leaderboard       | Submit a quiz score      |
| GET    | /api/leaderboard/:id   | Get test leaderboard     |
| GET    | /api/health            | Health check             |

---

## 🎯 Main Features

- ✅ AI MCQ generation via Groq `llama-3.1-8b-instant`
- ✅ **Quiz Mode**: Live timer, scoring, and progress tracking
- ✅ **Leaderboards**: Global rankings and per-test competitive lists
- ✅ **Review System**: See correct/wrong answers with visual feedback
- ✅ **PDF Export**: Generate professional tests and answer keys
- ✅ Dark mode & premium animations
- ✅ Supabase for reliable cloud storage
