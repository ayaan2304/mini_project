import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [demo, setDemo] = useState({ topic: "Career Guidance", date: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/auth/login", { method: "POST", body: form });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const bookDemo = async () => {
    setInfo("");
    try {
      const loginData = await apiRequest("/auth/login", { method: "POST", body: form });
      const result = await apiRequest("/demo/book", {
        method: "POST",
        token: loginData.token,
        body: demo,
      });
      setInfo(`Booked: ${result.session.topic} on ${new Date(result.session.date).toLocaleString()}`);
    } catch (err) {
      setError(err.message || "Please enter valid login and session details first.");
    }
  };

  return (
    <section className="card auth-card">
      <h2>Welcome Back</h2>
      <p className="muted">Login to continue your learning journey.</p>
      <form onSubmit={onSubmit} className="form">
        <input placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Login</button>
      </form>

      <div className="divider" />
      <h3>Book Free Demo Session</h3>
      <p className="muted small">Use your login credentials above, then book instantly.</p>
      <div className="form">
        <select value={demo.topic} onChange={(e) => setDemo({ ...demo, topic: e.target.value })}>
          <option>Career Guidance</option>
          <option>AI and Machine Learning</option>
          <option>Web Development Roadmap</option>
          <option>English Communication Practice</option>
        </select>
        <input type="datetime-local" value={demo.date} onChange={(e) => setDemo({ ...demo, date: e.target.value })} />
        <button className="btn secondary" type="button" onClick={bookDemo}>Book Free Demo Session</button>
      </div>
      {info && <p className="success">{info}</p>}

      <p>New user? <Link to="/register">Create account</Link></p>
    </section>
  );
};

export default LoginPage;
