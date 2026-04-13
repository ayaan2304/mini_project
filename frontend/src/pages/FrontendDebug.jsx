/**
 * FILE: FRONTEND_DEBUG.jsx
 * PURPOSE: Debug component to test frontend API calls and authentication
 * 
 * ADD TO App.jsx TEMPORARILY:
 * import FrontendDebug from "./pages/FrontendDebug.jsx";
 * <Route path="/debug" element={<FrontendDebug />} />
 * 
 * Then visit: http://localhost:5173/debug
 */

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../services/api/client.js";

const FrontendDebug = () => {
  const { token, user } = useAuth();
  const [debug, setDebug] = useState({
    authContext: { token, user },
    apiUrl: import.meta.env.VITE_API_URL || "/api",
    courses: null,
    coursesError: null,
    leaderboard: null,
    leaderboardError: null,
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log("🔍 FRONTEND DIAGNOSTICS STARTED");
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "NOT SET");
      console.log("User:", user);

      // Test 1: Fetch courses
      try {
        console.log("📝 Fetching courses...");
        const coursesData = await apiRequest("/courses", { token });
        console.log("✅ Courses fetched:", coursesData.length);
        setDebug((prev) => ({
          ...prev,
          courses: coursesData,
          coursesError: null,
        }));
      } catch (err) {
        console.error("❌ Courses error:", err.message);
        setDebug((prev) => ({
          ...prev,
          coursesError: err.message,
        }));
      }

      // Test 2: Fetch leaderboard
      try {
        console.log("📝 Fetching leaderboard...");
        const leaderboardData = await apiRequest("/leaderboard", { token });
        console.log("✅ Leaderboard fetched:", leaderboardData.leaderboard?.length);
        setDebug((prev) => ({
          ...prev,
          leaderboard: leaderboardData,
          leaderboardError: null,
        }));
      } catch (err) {
        console.error("❌ Leaderboard error:", err.message);
        setDebug((prev) => ({
          ...prev,
          leaderboardError: err.message,
        }));
      }
    };

    runDiagnostics();
  }, [token]);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>🔍 Frontend Diagnostics</h1>

      <section style={{ marginBottom: "20px", padding: "15px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Auth Context</h2>
        <pre>{JSON.stringify(debug.authContext, null, 2)}</pre>
      </section>

      <section style={{ marginBottom: "20px", padding: "15px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>API Configuration</h2>
        <p>VITE_API_URL: {debug.apiUrl}</p>
      </section>

      <section style={{ marginBottom: "20px", padding: "15px", background: debug.coursesError ? "#ffebee" : "#e8f5e9", borderRadius: "8px" }}>
        <h2>Courses Endpoint</h2>
        {debug.coursesError ? (
          <p style={{ color: "red" }}>❌ Error: {debug.coursesError}</p>
        ) : debug.courses ? (
          <>
            <p style={{ color: "green" }}>✅ Success: {debug.courses.length} courses</p>
            <pre>{JSON.stringify(debug.courses.slice(0, 2), null, 2)}</pre>
          </>
        ) : (
          <p>⏳ Loading...</p>
        )}
      </section>

      <section style={{ marginBottom: "20px", padding: "15px", background: debug.leaderboardError ? "#ffebee" : "#e8f5e9", borderRadius: "8px" }}>
        <h2>Leaderboard Endpoint</h2>
        {debug.leaderboardError ? (
          <p style={{ color: "red" }}>❌ Error: {debug.leaderboardError}</p>
        ) : debug.leaderboard ? (
          <>
            <p style={{ color: "green" }}>✅ Success: {debug.leaderboard.leaderboard?.length || 0} entries</p>
            <pre>{JSON.stringify(debug.leaderboard.leaderboard?.slice(0, 2), null, 2)}</pre>
          </>
        ) : (
          <p>⏳ Loading...</p>
        )}
      </section>

      <section style={{ marginBottom: "20px", padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
        <h2>Network Requests (Check DevTools)</h2>
        <ol>
          <li>Open DevTools (F12 or Right-click → Inspect)</li>
          <li>Go to Network tab</li>
          <li>Look for /api/courses and /api/leaderboard</li>
          <li>Check Response tab to see if data is returned</li>
          <li>Check if status is 200 (success)</li>
        </ol>
      </section>
    </div>
  );
};

export default FrontendDebug;
