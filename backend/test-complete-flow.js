/**
 * TEST: Complete My Enrollments & Module Unlock Flow
 * Clean test with no prior enrollments
 */

const BASE_URL = "http://localhost:5000/api";

async function test() {
  try {
    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║  COMPLETE MY ENROLLMENTS TEST SUITE       ║");
    console.log("╚════════════════════════════════════════════╝\n");

    // Step 1: Get a clean state - use Ayaan who has no enrollments in test db
    console.log("📝 Step 1: Get Fresh User (No Enrollments)...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "ayaan@example.com",
        password: "123456",
      }),
    });

    const loginData = await loginRes.json();
    const token = loginData.token;
    const user = loginData.user;
    console.log(`✅ Logged in as: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current enrollments: (checking...)\n`);

    // Step 2: Get My Enrollments before any trial
    console.log("📝 Step 2: Get My Enrollments (Before Trial)...");
    let enrollRes = await fetch(`${BASE_URL}/enroll/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let enrollments = await enrollRes.json();
    console.log(`✅ Current enrollments: ${enrollments.length}`);
    if (enrollments.length > 0) {
      console.log("   Existing enrollments:");
      enrollments.forEach((e) => console.log(`   - ${e.courseTitle} (${e.statusLabel})`));
    } else {
      console.log("   ✅ No prior enrollments");
    }

    // Step 3: Get courses for trial
    console.log("\n📝 Step 3: Get Courses...");
    const coursesRes = await fetch(`${BASE_URL}/courses`);
    const courses = await coursesRes.json();
    const testCourse = courses[0];
    console.log(`✅ Using: ${testCourse.title}`);
    console.log(`   Total videos: ${testCourse.videos.length}`);

    // Step 4: Start trial
    console.log("\n📝 Step 4: Start Trial Enrollment...");
    const trialRes = await fetch(`${BASE_URL}/enroll/start-trial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId: testCourse._id }),
    });

    if (trialRes.ok) {
      const trialData = await trialRes.json();
      console.log(`✅ Trial started successfully`);
      console.log(`   Status: ${trialData.enrollment?.paymentStatus}`);
    }

    // Step 5: Get My Enrollments AFTER trial
    console.log("\n📝 Step 5: Get My Enrollments (After Trial)...");
    enrollRes = await fetch(`${BASE_URL}/enroll/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    enrollments = await enrollRes.json();

    console.log(`✅ Total enrollments: ${enrollments.length}`);

    if (enrollments.length > 0) {
      const enroll = enrollments[0];
      console.log(`\n📋 Enrollment Details:`);
      console.log(`   Course ID: ${enroll.courseId ? "✅ Present" : "❌ MISSING"}`);
      console.log(`   Title: ${enroll.courseTitle}`);
      console.log(`   Level: ${enroll.courseLevel}`);
      console.log(`   Status: ${enroll.statusLabel}`);
      console.log(`   Trial Active: ${enroll.trialActive ? "✅ Yes" : "No"}`);
      console.log(`   Paid Active: ${enroll.paidActive ? "Yes" : "❌ No"}`);

      // Validate
      const hasErrors = !enroll.courseId || !enroll.courseTitle || !enroll.statusLabel;
      if (hasErrors) {
        console.log(`\n❌ MISSING REQUIRED FIELDS`);
      } else {
        console.log(`\n✅ ALL REQUIRED FIELDS PRESENT`);
      }
    }

    // Step 6: Get course detail to check module unlocking
    console.log("\n📝 Step 6: Verify Module Unlocking (Trial Access)...");
    const courseRes = await fetch(`${BASE_URL}/courses/${testCourse._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const course = await courseRes.json();

    console.log(`\n📊 Module Status:`);
    const moduleMap = {};
    course.videos.forEach((video, idx) => {
      const mod = video.module;
      if (!moduleMap[mod]) moduleMap[mod] = { total: 0, unlocked: 0 };
      moduleMap[mod].total++;
      if (video.unlocked) moduleMap[mod].unlocked++;
      
      const status = video.unlocked ? "✅" : "🔒";
      console.log(`   Video ${idx + 1} - ${video.title} (${mod}): ${status}`);
      if (!video.unlocked && video.lockedReason) {
        console.log(`      └─ ${video.lockedReason}`);
      }
    });

    console.log(`\n🔍 Summary:`);
    console.log(`   Trial Access: ${course.access.trialActive ? "✅ Yes" : "❌ No"}`);
    console.log(`   Max Modules: ${course.access.maxModules}`);
    
    Object.entries(moduleMap).forEach(([mod, data]) => {
      const allUnlocked = data.unlocked === data.total;
      const status = allUnlocked ? "✅ Fully Unlocked" : data.unlocked > 0 ? "⚠️ Partially Unlocked" : "🔒 Locked";
      console.log(`   ${mod}: ${data.unlocked}/${data.total} ${status}`);
    });

    // Step 7: Verify expected behavior
    console.log(`\n📋 Verification Checklist:`);
    console.log(`   ✅ My Enrollments returns courseId: ${enrollments[0]?.courseId ? "✅" : "❌"}`);
    console.log(`   ✅ Course detail has access info: ${course.access ? "✅" : "❌"}`);
    console.log(`   ✅ Trial unlocks Module 1: ${moduleMap["Module 1"]?.unlocked > 0 ? "✅" : "❌"}`);
    console.log(`   ✅ Trial unlocks Module 2: ${moduleMap["Module 2"]?.unlocked > 0 ? "✅" : "❌"}`);
    console.log(`   ✅ Trial locks Module 3: ${moduleMap["Module 3"]?.unlocked === 0 ? "✅" : "❌"}`);

    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║         ✅ ALL TESTS COMPLETE            ║");
    console.log("╚════════════════════════════════════════════╝\n");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
    console.error(err);
    process.exit(1);
  }
}

test();
