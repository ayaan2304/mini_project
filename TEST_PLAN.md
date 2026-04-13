/**
 * FILE: TEST_PLAN.md
 * PURPOSE: Comprehensive testing and debugging guide for MERN project
 * 
 * ISSUES TO CHECK:
 * 1. Database connection and seed
 * 2. Course retrieval endpoints
 * 3. Authentication flow
 * 4. Frontend API calls
 * 5. Error handling
 * 6. CORS issues
 */

# COMPREHENSIVE TEST PLAN & DEBUGGING

## BACKEND CHECKLIST

### 1. Database Connection Test
```
URL: mongodb+srv://b23ai079:Ayaan23@att.utoatdu.mongodb.net/smart_elearning?retryWrites=true&w=majority
- Check connection in MongoDB Atlas
- Verify collections exist
- Check if courses are in "courses" collection
- Verify users collection has 3 seed users
```

### 2. Seed Script Test
```
Command: npm run seed
Expected output:
- Users deleted: 3
- Courses deleted: 8
- Users created: 3
- Courses created: 8
- Enrollments created: 2
- "Seed complete. Users login password: 123456"
```

### 3. API Endpoints Test
```
a) GET /api/health
   - Should return: { ok: true }
   - Endpoint must work without auth

b) POST /api/auth/register
   - Create new user with valid email
   - Should return token + user data

c) POST /api/auth/login
   - Login with seed user: ayaan@example.com / 123456
   - Should return token + user data with streakCount field

d) GET /api/courses
   - Should return array of 8 courses
   - No authentication required
   - Each course should have: _id, title, description, level, price, videos

e) GET /api/leaderboard
   - Should return { leaderboard: [] }
   - No authentication required
```

### 4. Common Issues & Fixes
```
Issue: Courses not appearing
Solutions:
  - MongoDB connection is down
  - Seed hasn't been run
  - Course collection is empty
  - API is returning error
  - Frontend not calling correct endpoint

Issue: Authentication failing
Solutions:
  - JWT_SECRET not set in .env
  - Token not being sent in headers
  - Token format incorrect (missing "Bearer ")
  - Token expired

Issue: CORS errors
Solutions:
  - CLIENT_URL not set in .env
  - Frontend port not in allowed origins
  - Credentials mode not set correctly
```

## FRONTEND CHECKLIST

### 1. API Client Test
```
- Check if /api proxy is working
- Verify VITE_API_URL environment variable
- Check if Bearer token is in Authorization header
- Console log all API calls and responses
```

### 2. Authentication Test
```
- Login with test user
- Check if token is stored in localStorage
- Check if user object is stored correctly
- Verify token is sent in subsequent API calls
```

### 3. Course Fetching Test
```
- Navigate to /courses
- Check browser DevTools:
  - Network tab: See GET /api/courses request
  - Response: Should have 8 courses
  - Check status code (200 = success)
  - Check response time
```

### 4. State Management Test
```
- useAuth hook returns token
- useAuth hook returns user object
- useAuth hook returns logout function
- Routes are protected correctly
```

## DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All seeds run successfully
- [ ] All API endpoints respond
- [ ] Authentication works
- [ ] Courses load
- [ ] Leaderboard works
- [ ] Expert booking works
- [ ] Streak system works
- [ ] No console errors
- [ ] No CORS errors
- [ ] All pages responsive
- [ ] Tests pass

### Production Ready
- [ ] Set MONGO_URI for production database
- [ ] Set JWT_SECRET (strong random string)
- [ ] Set CLIENT_URL to production domain
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Use process.env variables
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Backups configured
