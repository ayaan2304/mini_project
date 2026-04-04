import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import VideoPlayerPage from "./pages/VideoPlayerPage.jsx";
import DemoSessionPage from "./pages/DemoSessionPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/courses/:id/video/:videoIndex" element={<ProtectedRoute><VideoPlayerPage /></ProtectedRoute>} />
          <Route path="/demo" element={<ProtectedRoute><DemoSessionPage /></ProtectedRoute>} />
          <Route path="/payment/:courseId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
