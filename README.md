# 🧠 TestGenius — AI-Powered MCQ Test Generator

A full-stack ed-tech platform that generates professional multiple-choice tests from any syllabus using **Groq AI (LLaMA 3)**.

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14, TailwindCSS, Framer Motion |
| Backend    | Node.js, Express.js                 |
| AI         | Groq API (LLaMA 3 8B)               |
| Database   | MongoDB (+ JSON file fallback)      |
| Deployment | Docker, Vercel, Render              |

## 📁 Project Structure

```
mini_project/
├── frontend/          # Next.js app
│   ├── components/    # Navbar, QuestionCard, TestCard, LoadingScreen
│   ├── pages/         # index, generate, history, test/[id]
│   ├── lib/api.js     # Axios API client
│   └── styles/        # globals.css
├── backend/           # Express API
│   ├── controllers/   # testController.js
│   ├── routes/        # testRoutes.js
│   ├── services/      # aiService.js, dbService.js
│   ├── models/        # GeneratedTest.js
│   └── middleware/    # errorHandler.js
├── database/
│   └── tests.json     # JSON fallback DB
└── docker-compose.yml
```

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (optional — falls back to JSON)

### 1. Backend
```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:3000
```

### 3. Environment Variables

**backend/.env** (already configured):
```
GROQ_API_KEY=your_groq_key
MONGODB_URI=mongodb://localhost:27017/ai_test_generator
PORT=5000
```

**frontend/.env.local** (already configured):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🐳 Docker (Full Stack)

```bash
# From project root
GROQ_API_KEY=your_key docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## ☁️ Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set env: NEXT_PUBLIC_API_URL=https://your-backend.render.com
```

### Backend → Render
1. Connect GitHub repo to Render
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add env vars: `GROQ_API_KEY`, `MONGODB_URI`, `PORT=5000`

## 🔌 API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/tests/generate    | Generate AI MCQ test     |
| GET    | /api/tests             | Get test history (paged) |
| GET    | /api/tests/:id         | Get single test          |
| DELETE | /api/tests/:id         | Delete a test            |
| GET    | /api/health            | Health check             |

## 📝 Generate Test Request

```json
POST /api/tests/generate
{
  "syllabus": "Chapter 1: Python basics...",
  "subject": "Computer Science",
  "difficulty": "Medium",
  "numQuestions": 10
}
```

## 🎯 Features

- ✅ AI MCQ generation via Groq LLaMA 3
- ✅ Easy / Medium / Hard difficulty
- ✅ 5–50 questions per test  
- ✅ Duplicate question prevention
- ✅ PDF export + Answer key export
- ✅ Test history with search & pagination
- ✅ Dark mode
- ✅ MongoDB + JSON file fallback
- ✅ Responsive UI with animations
- ✅ Docker ready
