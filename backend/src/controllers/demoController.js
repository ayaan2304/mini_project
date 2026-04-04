import DemoSession from "../models/DemoSession.js";

export const bookDemoSession = async (req, res) => {
  const { topic, date } = req.body;
  if (!topic || !date) return res.status(400).json({ message: "topic and date are required" });

  const session = await DemoSession.create({
    userId: req.user.id,
    topic,
    date,
  });

  return res.status(201).json({ message: "Demo session booked", session });
};

export const getMyDemoSessions = async (req, res) => {
  const sessions = await DemoSession.find({ userId: req.user.id }).sort({ date: 1 });
  res.json(sessions);
};
