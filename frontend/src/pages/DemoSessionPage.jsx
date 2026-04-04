import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";

const DemoSessionPage = () => {
  const { token } = useAuth();
  const [topic, setTopic] = useState("Career Guidance");
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => apiRequest("/demo/my-sessions", { token }).then(setItems);

  useEffect(() => {
    load().catch(console.error);
  }, [token]);

  const book = async () => {
    const data = await apiRequest("/demo/book", { method: "POST", token, body: { topic, date } });
    setMessage(`Booked: ${data.session.topic}`);
    load();
  };

  return (
    <section>
      <article className="card">
        <h2>Talk to Expert</h2>
        <p className="muted">Book a free consultation and discuss your learning path.</p>
        <div className="form">
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>Career Guidance</option>
            <option>AI and Machine Learning</option>
            <option>Web Development Roadmap</option>
            <option>English Communication Practice</option>
          </select>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="btn" onClick={book}>Book Session</button>
        </div>
        {message && <p className="success">{message}</p>}
      </article>

      <h3>My Sessions</h3>
      <div className="grid">
        {items.map((session) => (
          <article key={session._id} className="card">
            <h4>{session.topic}</h4>
            <p className="muted">{new Date(session.date).toLocaleString()}</p>
            <span className="badge">{session.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DemoSessionPage;
