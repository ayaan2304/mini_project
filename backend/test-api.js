/**
 * FILE: test-api.js
 * PURPOSE: Comprehensive API testing script to verify all endpoints
 * 
 * USAGE: node test-api.js
 * 
 * TESTS:
 * 1. Health check
 * 2. Authentication (login)
 * 3. Course fetching
 * 4. Leaderboard
 */

const BASE_URL = "http://localhost:5000/api";

async function test(name, url, options = {}) {
  try {
    console.log(`\n📝 Testing: ${name}`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log(`   ❌ FAILED (${response.status})`);
      console.log(`   Error:`, data.message || data);
      return null;
    }

    console.log(`   ✅ SUCCESS (${response.status})`);
    
    if (Array.isArray(data)) {
      console.log(`   Count: ${data.length} items`);
      if (data.length > 0) {
        console.log(`   First item keys: ${Object.keys(data[0]).join(", ")}`);
      }
    } else if (data.leaderboard !== undefined) {
      console.log(`   Leaderboard entries: ${data.leaderboard.length}`);
    } else if (data.courses !== undefined) {
      console.log(`   Courses: ${data.courses.length}`);
    } else if (data.ok !== undefined) {
      console.log(`   Status: ${data.ok}`);
    } else if (data.token !== undefined) {
      console.log(`   Token: ${data.token.substring(0, 20)}...`);
      console.log(`   User: ${data.user.name} (${data.user.email})`);
      return data.token;
    } else {
      console.log(`   Response keys: ${Object.keys(data).join(", ")}`);
    }

    return data;
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log("====================================");
  console.log("  COMPREHENSIVE API TEST SUITE");
  console.log("====================================");

  // Test 1: Health Check
  await test("Health Check", `${BASE_URL}/health`);

  // Test 2: Get Courses (Public)
  const courses = await test("Get All Courses (Public)", `${BASE_URL}/courses`);
  
  if (courses && courses.length > 0) {
    console.log(`   ✅ Found ${courses.length} courses`);
    courses.forEach((course, i) => {
      console.log(`      ${i + 1}. ${course.title} (${course.level}) - Rs. ${course.price}`);
    });
  } else {
    console.log(`   ❌ NO COURSES FOUND - DATABASE ISSUE!`);
  }

  // Test 3: Login
  const loginResponse = await test("Login (Seed User)", `${BASE_URL}/auth/login`, {
    method: "POST",
    body: {
      email: "ayaan@example.com",
      password: "123456",
    },
  });

  let token = null;
  if (loginResponse && loginResponse.token) {
    token = loginResponse.token;
    console.log(`   Streak Count: ${loginResponse.user.streakCount || 0}`);
  }

  // Test 4: Get Courses with Auth
  if (token) {
    await test("Get Courses (With Token)", `${BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Test 5: Leaderboard
  await test("Get Leaderboard", `${BASE_URL}/leaderboard`);

  // Test 6: Expert Booking (Protected)
  if (token) {
    const booking = await test("Create Expert Booking", `${BASE_URL}/expert-booking`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        name: "Ayaan",
        email: "ayaan@example.com",
        topic: "JavaScript Async",
        description: "I don't understand promises and async/await",
        date: new Date(Date.now() + 86400000).toISOString(),
        time: "14:00",
      },
    });

    if (booking) {
      console.log(`   Booking ID: ${booking.booking?.id}`);
      console.log(`   Status: ${booking.booking?.status}`);
    }
  }

  console.log("\n====================================");
  console.log("  TEST SUITE COMPLETE");
  console.log("====================================\n");
}

runTests();
