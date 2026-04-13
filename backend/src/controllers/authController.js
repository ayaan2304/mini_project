import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

/**
 * Updates user's daily login streak.
 * If logged in today: no change
 * If logged in after 24 hours: increment streak
 * If missed a day: reset streak to 1
 */
const updateStreak = (user) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!user.lastLoginDate) {
    user.streakCount = 1;
  } else {
    const lastLogin = new Date(user.lastLoginDate.getFullYear(), user.lastLoginDate.getMonth(), user.lastLoginDate.getDate());
    const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Already logged in today, no change
    } else if (daysDiff === 1) {
      // Logged in yesterday, increment streak
      user.streakCount = (user.streakCount || 0) + 1;
    } else {
      // Missed a day, reset streak
      user.streakCount = 1;
    }
  }

  user.lastLoginDate = now;
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    console.log("[AUTH][REGISTER] attempt", { email: cleanEmail });
    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (cleanName.toLowerCase() === cleanEmail) {
      return res.status(400).json({ message: "Name and email cannot be the same" });
    }

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Password is hashed in User schema pre-save hook.
    const user = await User.create({ name: cleanName, email: cleanEmail, password: cleanPassword, role: "student" });
    console.log("[AUTH][REGISTER] success", { userId: user._id.toString(), email: user.email });

    return res
      .status(201)
      .json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("[AUTH][REGISTER] error", error.message);
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    console.log("[AUTH][LOGIN] attempt", { email: cleanEmail });
    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      console.log("[AUTH][LOGIN] failed: user not found", { email: cleanEmail });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(cleanPassword);
    if (!ok) {
      console.log("[AUTH][LOGIN] failed: password mismatch", { userId: user._id.toString() });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update daily login streak
    updateStreak(user);
    await user.save();

    console.log("[AUTH][LOGIN] success", { userId: user._id.toString(), email: user.email, streak: user.streakCount });
    return res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, streakCount: user.streakCount },
    });
  } catch (error) {
    console.error("[AUTH][LOGIN] error", error.message);
    return res.status(500).json({ message: "Login failed" });
  }
};
