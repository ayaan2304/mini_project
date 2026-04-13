/**
 * FILE: seed.js
 * PURPOSE: Populates the database with baseline users, courses, and enrollments.
 *
 * FLOW:
 * 1) Connect to the database.
 * 2) Clear core collections.
 * 3) Insert sample users and courses with videos.
 * 4) Insert example enrollments for quick testing.
 *
 * WHY THIS EXISTS:
 * It gives a predictable starter dataset for local development and demos.
 *
 * DEPENDENCIES:
 * - User/Course/Enrollment models
 * - connectDB for database connection
 * - bcryptjs for test user password hashing
 */
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";

dotenv.config();

const sampleCourses = [
  {
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React and backend basics.",
    outcomes: ["Build responsive websites", "Understand React basics", "Create REST APIs"],
    domain: "technical",
    level: "beginner",
    price: 1999,
    videos: [
      { title: "Intro to Web", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "HTML and CSS Basics", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "JavaScript Essentials", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { title: "React Fundamentals", module: "Module 3", url: "https://www.w3schools.com/html/movie.mp4" },
    ],
  },
  {
    title: "AI and Machine Learning",
    description: "Understand AI concepts, ML algorithms, and real-world use cases.",
    outcomes: ["Know ML workflow", "Train simple models", "Evaluate performance"],
    domain: "technical",
    level: "intermediate",
    price: 2499,
    videos: [
      { title: "What is AI?", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "Data and Features", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "Supervised Learning", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { title: "Model Evaluation", module: "Module 3", url: "https://www.w3schools.com/html/movie.mp4" },
    ],
  },
  {
    title: "English Communication Course",
    description: "Improve spoken English, vocabulary, and professional communication.",
    outcomes: ["Speak confidently", "Improve vocabulary", "Use professional phrases"],
    domain: "language",
    level: "beginner",
    price: 1499,
    videos: [
      { title: "Communication Basics", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "Daily Conversation", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "Business English", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { title: "Interview Communication", module: "Module 3", url: "https://www.w3schools.com/html/movie.mp4" },
    ],
  },
];

// Add 5 more courses
sampleCourses.push(
  {
    title: "Data Structures & Algorithms",
    description: "Master DSA for interviews with clear explanations and problems.",
    outcomes: ["Arrays, Strings, Trees", "Time/Space complexity", "Problem solving"],
    domain: "technical",
    level: "intermediate",
    price: 2299,
    videos: [
      { title: "Big-O Basics", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "Arrays & Hashing", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "Two Pointers", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
  {
    title: "React + Redux Essentials",
    description: "Build modern SPAs with React hooks and Redux Toolkit.",
    outcomes: ["Hooks and context", "Redux Toolkit", "API integration"],
    domain: "technical",
    level: "intermediate",
    price: 1999,
    videos: [
      { title: "React Hooks Intro", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "State & Effects", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "Redux Toolkit", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
  {
    title: "Node.js & Express API",
    description: "Learn REST API patterns, auth, and production practices.",
    outcomes: ["Express routing", "JWT auth", "Mongo integration"],
    domain: "technical",
    level: "beginner",
    price: 1799,
    videos: [
      { title: "Express Basics", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "CRUD & Middlewares", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "JWT Auth", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
  {
    title: "Python for Beginners",
    description: "Start coding with Python and build small CLI projects.",
    outcomes: ["Syntax & Types", "Control flow", "Modules & packages"],
    domain: "technical",
    level: "beginner",
    price: 1499,
    videos: [
      { title: "Getting Started", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "Data Types", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "Functions & Modules", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
  {
    title: "Spoken English Practice",
    description: "Improve fluency with daily practice and practical scenarios.",
    outcomes: ["Pronunciation", "Vocabulary", "Interview skills"],
    domain: "language",
    level: "beginner",
    price: 1299,
    videos: [
      { title: "Intro & Sounds", module: "Module 1", url: "https://www.w3schools.com/html/mov_bbb.mp4", isFreePreview: true },
      { title: "Common Phrases", module: "Module 1", url: "https://www.w3schools.com/html/movie.mp4", isFreePreview: true },
      { title: "Interview Basics", module: "Module 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  }
);

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
  ]);

  const hashed = await bcrypt.hash("123456", 10);
  const users = await User.insertMany([
    { name: "Ayaan", email: "ayaan@example.com", password: hashed, role: "student" },
    { name: "Riya", email: "riya@example.com", password: hashed, role: "student" },
    { name: "Rahul", email: "rahul@example.com", password: hashed, role: "student" },
  ]);

  const courses = await Course.insertMany(sampleCourses);

  await Enrollment.insertMany([
    { userId: users[1]._id, courseId: courses[0]._id, progress: 80, paymentStatus: "SUCCESS", expiryDate: new Date(Date.now() + 86400000 * 30) },
    { userId: users[2]._id, courseId: courses[1]._id, progress: 70, paymentStatus: "SUCCESS", expiryDate: new Date(Date.now() + 86400000 * 30) },
  ]);

  console.log("Seed complete. Users login password: 123456");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
