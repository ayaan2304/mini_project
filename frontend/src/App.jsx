/**
 * FILE: App.jsx
 * PURPOSE: Declares the top-level route map for the frontend application.
 *
 * FLOW:
 * 1) Render a shared navbar for every page.
 * 2) Register public routes for home, login, and register.
 * 3) Protect learning routes so only authenticated users can access them.
 * 4) Include new routes: leaderboard, expert-booking, my-enrollments
 *
 * WHY THIS EXISTS:
 * It centralizes navigation logic so the app has a single source of truth for routing.
 * Ensures all feature pages are accessible through this router.
 *
 * DEPENDENCIES:
 * - react-router-dom: Route/Routes for client-side navigation
 * - ProtectedRoute: gatekeeper for authenticated pages
 * - Page components for each route target
 */
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import VideoPlayerPage from "./pages/VideoPlayerPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ExpertBookingPage from "./pages/ExpertBookingPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage.jsx";
import FrontendDebug from "./pages/FrontendDebug.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/debug" element={<FrontendDebug />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/courses/:id/video/:videoIndex" element={<ProtectedRoute><VideoPlayerPage /></ProtectedRoute>} />
          <Route path="/payment/:courseId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/expert-booking" element={<ProtectedRoute><ExpertBookingPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/my-enrollments" element={<ProtectedRoute><MyEnrollmentsPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
