# Smart E-Learning Platform (Clean MERN Version)

This is a cleaned and simplified MERN stack project focused on core learning features:

- User authentication (register/login/logout)
- Course list and course detail pages with videos
- Enrollment tracking (student, course, start date)
- Subscription purchase flow with full course unlock

The project uses MongoDB Atlas and is structured to be easy to read, maintain, and extend.

## Clean Folder Structure

```text
mini_project/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      seed.js
      server.js
  frontend/
    src/
      components/
      context/
      pages/
      services/
        api/
          client.js
      styles/
      App.jsx
      main.jsx
```

## Core Features

### 1) Authentication
- Register and login with JWT tokens.
- Passwords are hashed using bcrypt before storage.
- Email is normalized (trim + lowercase) to avoid login mismatch issues.

### 2) Courses
- Public course list on homepage.
- Protected course detail page for signed-in users.
- Video modules are unlocked based on trial/subscription access rules.

### 3) Enrollment
- Trial can be started per course.
- Enrollment details are available at `GET /api/enroll/my`.
- Dashboard shows:
  - student name
  - enrolled course
  - enrollment start date
  - current status

### 4) Payments / Subscription
- Mock checkout supports 30/60 day plans.
- On successful subscription:
  - trial dates are removed
  - paid access is activated
  - all modules in that purchased course are unlocked

## Removed During Cleanup

The following unused or out-of-scope modules were removed:

- Quiz
- QuizResult
- DemoSession
- Leaderboard
- Old frontend `src/api/client.js` helper (moved to `src/services/api/client.js`)

## API Reference

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Courses
- `GET /api/courses` (public)
- `GET /api/courses/:id` (protected)
- `POST /api/courses` (protected)

### Enrollment
- `POST /api/enroll/start-trial` (protected)
- `GET /api/enroll/status/:courseId` (protected)
- `GET /api/enroll/my` (protected)

### Payment
- `POST /api/payment/checkout` (protected)
- `POST /api/payment/buy` (protected, alias)
- `GET /api/payment/history` (protected)

## Environment Setup

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Optional `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, frontend uses `/api` and Vite proxy.

## Install and Run

From `mini_project` root:

```bash
npm install
```

Install backend and frontend packages if needed:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Run backend:

```bash
cd backend
npm run dev
```

Run frontend (separate terminal):

```bash
cd frontend
npm run dev
```

URLs:
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## Seed Data (Optional)

To reset and seed sample users/courses/enrollments:

```bash
cd backend
npm run seed
```

Default seeded password: `123456`

## Quick Verification Flow

1. Register a new user.
2. Login with same credentials.
3. Open Courses and enter one course detail page.
4. Start trial and verify partial access behavior.
5. Buy subscription plan and return to course detail.
6. Verify all modules are unlocked and trial is removed.

## Notes for Future Development

- Keep API calls inside `frontend/src/services/api`.
- Add any new feature with:
  - model
  - controller
  - route
  - page/component usage
- Update README whenever API contracts or core flows change.

