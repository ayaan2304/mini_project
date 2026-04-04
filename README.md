<<<<<<< HEAD
# mini_project
=======
# Smart Subscription-Based E-Learning Platform

A polished MERN stack e-learning platform with dark SaaS-style UI, strict 3-day trial control, simulated payments, quizzes, leaderboard, and demo consultation booking.

## 1) Project Overview
This project is designed for students and working professionals. It supports structured course learning, trial-to-paid conversion, quiz-based evaluation, and rank tracking.

Main flow:
`Register/Login -> Book Demo -> Open Course -> Start Trial -> Watch Limited Videos -> Attempt Quiz -> Check Leaderboard -> Buy Plan -> Unlock Full Content`

## 2) Features
- JWT authentication (register/login)
- Dashboard with featured courses and session history
- Course detail with outcomes + module videos
- Locked premium video behavior after trial expiry
- Strict 3-day trial logic per course enrollment
- Mock payment checkout (1 month / 2 months)
- Quiz engine (MCQ) with score saving
- Leaderboard ranking by quiz score + course progress
- Demo consultation booking from login and dashboard
- Professional dark theme UI

## 3) Tech Stack
- Frontend: React, React Router, Vite
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT

## 4) Folder Structure
- `frontend/`
  - `src/pages` UI screens
  - `src/components` reusable UI blocks
  - `src/context` auth state
  - `src/api` API helper
- `backend/`
  - `src/models` Mongoose schemas
  - `src/controllers` request logic
  - `src/routes` API routes
  - `src/middleware` auth/access middleware
  - `src/config` DB connection
  - `src/seed.js` sample data generator

## 5) API Documentation
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Courses
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses`

### Enrollment / Trial
- `POST /api/enroll/start-trial`
- `GET /api/enroll/status/:courseId`

### Payment
- `POST /api/payment/buy`
- `POST /api/payment/checkout`
- `GET /api/payment/history`

### Demo Session
- `POST /api/demo/book`
- `GET /api/demo/my-sessions`

### Quiz
- `GET /api/quiz/:courseId`
- `POST /api/quiz/submit`

### Leaderboard
- `GET /api/leaderboard`

## 6) Database Schema Explanation
### User
- `name`, `email`, `password`, `role`

### Course
- `title`, `description`, `outcomes`, `domain`, `level`, `price`, `videos[]`
- Video fields: `title`, `url`, `module`, `isFreePreview`

### Enrollment (Core Access Control)
- `userId`, `courseId`, `trialStartDate`, `trialEndDate`, `expiryDate`, `paymentStatus`, `progress`

### Payment
- `userId`, `courseId`, `amount`, `status`, `planDurationDays`

### Quiz
- `courseId`, `questions[]`

### QuizResult
- `userId`, `courseId`, `score`

### DemoSession
- `userId`, `date`, `topic`, `status`

## 7) How Trial Works
- Trial starts when user clicks Start Trial on course detail page.
- Backend sets:
  - `trialStartDate = now`
  - `trialEndDate = now + 3 days`
- During trial:
  - first 1-2 videos are always free
  - premium videos are unlocked because trial is active
- After trial end and without payment:
  - premium videos become locked (`🔒` UI)

## 8) How Payment Works
- User selects plan (30 or 60 days) in Payment page.
- Mock checkout marks payment `SUCCESS` and saves record.
- Enrollment updates:
  - `paymentStatus = SUCCESS`
  - `expiryDate = now + planDurationDays`
- While subscription is active, full content stays unlocked.

## 9) Run Locally
1. Copy env files
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.example` -> `frontend/.env`
2. Install
   - `npm install`
   - `npm run install:all`
3. Seed sample data
   - `npm run seed --workspace backend`
4. Start app
   - `npm run dev`

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## 10) Sample Test Flow
1. Register new user or use seeded user (`ayaan@example.com` / `123456`)
2. Login
3. Book free demo session
4. Open course and start trial
5. Watch unlocked videos
6. Take quiz and submit score
7. Visit leaderboard
8. Buy course plan and unlock all videos
>>>>>>> dd9c299 (feat: initial commit - smart e-learning platform (trial, payments, quiz, leaderboard, demo))

