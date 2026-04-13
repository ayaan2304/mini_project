/**
 * FILE: DEPLOYMENT_GUIDE.md
 * PURPOSE: Complete step-by-step guides for deployment and troubleshooting
 */

# 🚀 DEPLOYMENT & TROUBLESHOOTING GUIDE

## TABLE OF CONTENTS
1. [Quick Start (Development)](#quick-start)
2. [Complete Testing](#testing)
3. [Troubleshooting](#troubleshooting)
4. [Production Deployment](#production)
5. [Common Issues & Fixes](#common-issues)

---

## QUICK START (Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- MongoDB Atlas account (already configured)
- Port 5000 (backend) and 5173 (frontend) available

### Step 1: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Verify .env file exists with:
# MONGO_URI=mongodb+srv://b23ai079:...
# JWT_SECRET=supersecretkey123
# PORT=5000
# CLIENT_URL=http://localhost:5173

# Seed database with initial courses
npm run seed

# Expected output:
# MongoDB connected
# Seed complete. Users login password: 123456
```

### Step 2: Start Backend Server
```bash
npm start

# Expected output:
# MongoDB connected
# Server running on port 5000
```

### Step 3: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Expected output:
# ➜  Local: http://localhost:5173/
```

### Step 4: Test Application
1. Open browser: http://localhost:5173
2. Click "Get Started" → "Explore Courses"
3. You should see 8 courses
4. Or go to /login and use: ayaan@example.com / 123456

---

## COMPLETE TESTING

### Test 1: Database & Seed
```bash
# In backend folder
npm run seed

# Check output:
# ✅ MongoDB connected
# ✅ Collections cleared
# ✅ 3 users created
# ✅ 8 courses created
# ✅ 2 enrollments created
# ✅ Seed complete...
```

### Test 2: Backend API Endpoints
```bash
# Use test-api.js script
cd backend
node test-api.js

# Check output for:
# ✅ Health Check: OK
# ✅ Get All Courses: 8 items
# ✅ Login: Token received
# ✅ Leaderboard: Entries found
# ✅ Expert Booking: Created
```

### Test 3: Frontend Features
```
1. HomePage
   - Navigate to: http://localhost:5173
   - Check: 6 featured courses display
   - Check: Login button works

2. Login
   - Go to: http://localhost:5173/login
   - Email: ayaan@example.com
   - Password: 123456
   - Check: Login succeeds, token saved

3. Dashboard
   - Should see: Welcome message
   - Should see: Courses, enrollments, streak card
   - Should see: Action buttons

4. Courses Page
   - Navigate to: /courses
   - Check: All 8 courses load
   - Check: Filter by level works
   - Check: Course cards display correctly

5. Leaderboard
   - Navigate to: /leaderboard
   - Check: Ranked list displays (2 entries)
   - Check: Scores and names show

6. Expert Booking
   - Navigate to: /expert-booking
   - Check: Form loads with auto-filled email/name
   - Check: Can submit booking
   - Check: Success message appears

7. My Enrollments
   - Navigate to: /my-enrollments
   - Check: Enrolled courses display
   - Check: Status badges show
```

### Test 4: Debug Page
```bash
# Go to: http://localhost:5173/debug (while logged in)

# Check:
# ✅ Auth Context shows user & token
# ✅ Courses fetched: 8 items
# ✅ Leaderboard fetched: 2 entries
# ✅ No errors on either

# If errors appear:
# 1. Check browser console (F12)
# 2. Check Network tab for failed requests
# 3. See troubleshooting section
```

---

## TROUBLESHOOTING

### Issue 1: "Courses Not Loading"

**Symptoms:**
- Courses page shows empty grid
- Homepage shows no featured courses
- No error in console

**Diagnosis:**
1. Check backend is running: `lsof -i :5000`
2. Check if courses exist: `node test-api.js`
3. Check frontend console (F12): Any network errors?
4. Check Network tab: Is /api/courses request made?

**Solutions:**
```
a) If backend not running:
   cd backend
   npm start

b) If courses not in database:
   npm run seed

c) If frontend can't reach backend:
   - Check Vite proxy in vite.config.js
   - Verify proxy: { "/api": "http://localhost:5000" }
   - Restart frontend dev server: npm run dev

d) If CORS error in console:
   - Update backend/src/server.js CORS config
   - Add error logging to see exact error
   - Restart backend
```

### Issue 2: "Login Not Working"

**Symptoms:**
- Login button not responding
- Stays on login page after clicking
- No token saved

**Diagnosis:**
1. Check if backend login endpoint works: `curl http://localhost:5000/api/auth/login`
2. Check Network tab: Is POST request made?
3. Check browser console: Any errors?

**Solutions:**
```
a) Verify seed data exists:
   npm run seed

b) Test login endpoint manually:
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"ayaan@example.com","password":"123456"}'

c) Check if token is being saved:
   - Open DevTools → Console tab
   - Type: localStorage.getItem('token')
   - Should see JWT token starting with 'eyJ'

d) If 400/401 error:
   - Verify user exists: npm run seed
   - Check password is correct: 123456
```

### Issue 3: "Leaderboard Shows No Entries"

**Symptoms:**
- Leaderboard page loads but no entries
- No error message

**Diagnosis:**
1. Check if quiz results exist in database
2. Check leaderboard API: `curl http://localhost:5000/api/leaderboard`

**Solutions:**
```
a) This is expected if no quizzes taken yet
   - Take a quiz first on /courses/:id/video/:videoIndex
   - Then check leaderboard again

b) If API returns empty:
   - Verify QuizResult collection has documents
   - Check aggregation pipeline in leaderboardController
```

### Issue 4: "Expert Booking Not Saving"

**Symptoms:**
- Form submits but no success message
- Booking appears blank
- Returns error

**Solutions:**
```
a) Check if user is authenticated:
   - Must be logged in
   - Token must be valid

b) Check all form fields are filled:
   - All fields are required
   - Date must be in future

c) Test endpoint manually:
   curl -X POST http://localhost:5000/api/expert-booking \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "name":"Ayaan",
       "email":"ayaan@example.com",
       "topic":"JavaScript",
       "description":"Need help with promises",
       "date":"2026-04-15T14:00:00Z",
       "time":"14:00"
     }'
```

### Issue 5: "CORS Error in Console"

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/courses' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**
1. Check backend CORS config in server.js:
```javascript
app.use(cors({ 
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174"
  ] 
}));
```

2. Restart backend after changes:
```bash
# Kill: Ctrl+C
# Restart: npm start
```

---

## PRODUCTION DEPLOYMENT

### Step 1: Build Frontend
```bash
cd frontend
npm run build

# Creates dist/ folder with production-ready files
# Ready to deploy to Vercel, Netlify, or any static host
```

### Step 2: Update Environment Files

**backend/.env (Production)**
```
MONGO_URI=

INSERT_YOUR_PRODUCTION_DATABASE_URI

JWT_SECRET=YOUR_STRONG_RANDOM_SECRET_KEY_HERE
PORT=5000
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
```

**frontend/.env.production**
```
VITE_API_URL=https://your-api-domain.com/api
```

### Step 3: Deploy Backend
```bash
# Option 1: Railway.app
- Connect GitHub repo
- Set environment variables
- Deploy

# Option 2: Heroku
- heroku create app-name
- heroku config:set MONGO_URI=...
- git push heroku main

# Option 3: AWS EC2/DigitalOcean
- SSH into server
- npm install
- npm start (or use PM2)
```

### Step 4: Deploy Frontend
```bash
# Option 1: Vercel
- Connect GitHub repo
- Vercel auto-builds dist/
- Set VITE_API_URL in environment

# Option 2: Netlify
- Drag & drop dist/ folder
- Set environment variables
- Configure redirects for SPA

# Option 3: GitHub Pages
- npm run build
- Deploy dist/ folder
```

### Step 5: Production Verification
```bash
1. Test health endpoint:
   curl https://your-api-domain.com/api/health

2. Test courses endpoint:
   curl https://your-api-domain.com/api/courses

3. Test frontend:
   Open https://yourdomain.com
   Check if courses load
   Test login flow

4. Monitor:
   - Check error logs
   - Monitor database connections
   - Check API response times
```

---

## COMMON ISSUES & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| "Cannot find module" | Dependencies not installed | `npm install` |
| "ENOENT: no such file" | Wrong directory | `cd backend` or `cd frontend` |
| "Port 5000 already in use" | Another app using port | `kill -9 $(lsof -t -i:5000)` |
| "MongoDB connection error" | Wrong connection string | Verify MONGO_URI in .env |
| "Token expired" | JWT expires after 7 days | Login again to get new token |
| "Blank page on frontend" | Build failed | Check npm run build output |
| "API returning 404" | Endpoint doesn't exist | Verify route is mounted in server.js |
| "User already exists" | Duplicate email | Use different email for register |
| "Invalid credentials" | Wrong password or email | Check login credentials |

---

## FINAL CHECKLIST BEFORE PRODUCTION

- [ ] Backend server runs without errors
- [ ] Frontend dev server runs without errors
- [ ] Seed script completes successfully
- [ ] All 8 courses visible on home page
- [ ] Login with test user works
- [ ] Dashboard displays correctly
- [ ] Courses page shows all 8 courses
- [ ] Filters work (beginner/intermediate/advanced)
- [ ] Course detail page loads
- [ ] Leaderboard displays
- [ ] Expert booking form works
- [ ] My enrollments page works
- [ ] Streak displays in navbar
- [ ] No console errors
- [ ] No Network tab errors
- [ ] Responsive on mobile
- [ ] Test on different browsers
- [ ] Database backups configured
- [ ] Environment variables set correctly
- [ ] HTTPS enabled (production)
- [ ] Rate limiting configured

---

**Ready for Deployment! 🚀**
