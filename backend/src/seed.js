import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Quiz from "./models/Quiz.js";
import Enrollment from "./models/Enrollment.js";
import QuizResult from "./models/QuizResult.js";

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

const quizForCourse = (courseId) => ({
  courseId,
  questions: [
    {
      question: "What is the key goal of this course?",
      options: ["Entertainment", "Structured learning", "Gaming", "Random tasks"],
      correctAnswer: "Structured learning",
    },
    {
      question: "Which option is best for regular progress?",
      options: ["Skip modules", "Follow modules step by step", "Never revise", "Ignore quizzes"],
      correctAnswer: "Follow modules step by step",
    },
  ],
});

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Quiz.deleteMany({}),
    Enrollment.deleteMany({}),
    QuizResult.deleteMany({}),
  ]);

  const hashed = await bcrypt.hash("123456", 10);
  const users = await User.insertMany([
    { name: "Ayaan", email: "ayaan@example.com", password: hashed, role: "student" },
    { name: "Riya", email: "riya@example.com", password: hashed, role: "student" },
    { name: "Rahul", email: "rahul@example.com", password: hashed, role: "student" },
  ]);

  const courses = await Course.insertMany(sampleCourses);
  await Quiz.insertMany(courses.map((course) => quizForCourse(course._id)));

  await Enrollment.insertMany([
    { userId: users[1]._id, courseId: courses[0]._id, progress: 80, paymentStatus: "SUCCESS", expiryDate: new Date(Date.now() + 86400000 * 30) },
    { userId: users[2]._id, courseId: courses[1]._id, progress: 70, paymentStatus: "SUCCESS", expiryDate: new Date(Date.now() + 86400000 * 30) },
  ]);

  await QuizResult.insertMany([
    { userId: users[1]._id, courseId: courses[0]._id, score: 40 },
    { userId: users[2]._id, courseId: courses[1]._id, score: 30 },
  ]);

  console.log("Seed complete. Users login password: 123456");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
