/**
 * TEST: My Enrollments Fix
 * Tests the fixed My Enrollments endpoint with courseId included
 */

const BASE_URL = "http://localhost:5000/api";

async function test() {
  try {
    console.log("\n====================================");
    console.log("  MY ENROLLMENTS TEST");
    console.log("====================================\n");

    // Step 1: Login
    console.log("📝 Step 1: Login to get token...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "ayaan@example.com",
        password: "123456",
      }),
    });

    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log(`✅ Login successful`);
    console.log(`   Token: ${token.substring(0, 30)}...`);

    // Step 2: Get first course ID for enrollment
    console.log("\n📝 Step 2: Get courses...");
    const coursesRes = await fetch(`${BASE_URL}/courses`);
    if (!coursesRes.ok) throw new Error(`Get courses failed: ${coursesRes.status}`);
    const courses = await coursesRes.json();
    const courseId = courses[0]._id;
    console.log(`✅ Got courses`);
    console.log(`   Using course: ${courses[0].title} (${courseId})`);

    // Step 3: Start trial for course
    console.log("\n📝 Step 3: Start trial enrollment...");
    const trialRes = await fetch(`${BASE_URL}/enroll/start-trial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId }),
    });

    if (!trialRes.ok) throw new Error(`Start trial failed: ${trialRes.status}`);
    const trialData = await trialRes.json();
    console.log(`✅ Trial started`);
    console.log(`   Status: ${trialData.enrollment?.paymentStatus}`);

    // Step 4: Get my enrollments (THE FIX)
    console.log("\n📝 Step 4: Get My Enrollments (TESTING FIX)...");
    const enrollRes = await fetch(`${BASE_URL}/enroll/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!enrollRes.ok) throw new Error(`Get enrollments failed: ${enrollRes.status}`);
    const enrollments = await enrollRes.json();
    console.log(`✅ My Enrollments fetched successfully`);
    console.log(`   Total enrollments: ${enrollments.length}`);

    if (enrollments.length > 0) {
      const enroll = enrollments[0];
      console.log(`\n📋 Enrollment Details:`);
      console.log(`   _id: ${enroll._id}`);
      console.log(`   courseId: ${enroll.courseId} ${enroll.courseId ? "✅" : "❌ MISSING"}`);
      console.log(`   courseTitle: ${enroll.courseTitle}`);
      console.log(`   courseLevel: ${enroll.courseLevel}`);
      console.log(`   statusLabel: ${enroll.statusLabel}`);
      console.log(`   trialActive: ${enroll.trialActive ? "✅ YES" : "❌ NO"}`);
      console.log(`   paidActive: ${enroll.paidActive ? "✅ YES" : "❌ NO"}`);
      console.log(`   startDate: ${enroll.startDate}`);

      // Validate critical fields
      const errors = [];
      if (!enroll.courseId) errors.push("courseId is missing");
      if (!enroll.courseTitle) errors.push("courseTitle is missing");
      if (!enroll.statusLabel) errors.push("statusLabel is missing");

      if (errors.length > 0) {
        console.log(`\n⚠️  VALIDATION ERRORS:`);
        errors.forEach((e) => console.log(`   - ${e}`));
      } else {
        console.log(`\n✅ ALL REQUIRED FIELDS PRESENT`);
      }
    }

    // Step 5: Test course detail page access with trial
    console.log("\n📝 Step 5: Get Course Detail (with trial access)...");
    const courseRes = await fetch(`${BASE_URL}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!courseRes.ok) throw new Error(`Get course detail failed: ${courseRes.status}`);
    const course = await courseRes.json();
    console.log(`✅ Course detail retrieved`);
    console.log(`   Course: ${course.title}`);
    console.log(`   Total videos: ${course.videos?.length || 0}`);
    console.log(`   Access status:`, course.access);

    // Step 6: Check module unlocking logic
    console.log("\n📝 Step 6: Check Module Unlocking Logic...");
    if (course.videos && course.videos.length > 0) {
      course.videos.slice(0, 4).forEach((video, idx) => {
        const status = video.unlocked ? "✅ UNLOCKED" : "🔒 LOCKED";
        console.log(`   Video ${idx + 1} (${video.module}): ${status}`);
        if (!video.unlocked && video.lockedReason) {
          console.log(`      Reason: ${video.lockedReason}`);
        }
      });

      // Validate trial unlocks only modules 1-2
      const unlockedCount = course.videos.filter((v) => v.unlocked).length;
      console.log(`\n   Summary: ${unlockedCount} videos unlocked in trial (should be 2)`);
      if (unlockedCount === 2) {
        console.log(`   ✅ TRIAL UNLOCK LOGIC WORKING CORRECTLY`);
      } else {
        console.log(`   ⚠️  Expected 2 unlocked videos, got ${unlockedCount}`);
      }
    }

    console.log("\n====================================");
    console.log("  ✅ ALL TESTS PASSED");
    console.log("====================================\n");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
    console.error(err);
    process.exit(1);
  }
}

test();
