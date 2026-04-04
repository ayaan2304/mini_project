import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

const CourseDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  const refresh = async () => {
    const [courseData, statusData] = await Promise.all([
      apiRequest(`/courses/${id}`, { token }),
      apiRequest(`/enroll/status/${id}`, { token }),
    ]);
    setCourse(courseData);
    setStatus(statusData);
  };

  useEffect(() => {
    refresh().catch(console.error);
  }, [id]);

  const startTrial = async () => {
    await apiRequest("/enroll/start-trial", { method: "POST", token, body: { courseId: id } });
    await refresh();
  };

  const startQuiz = async () => {
    const data = await apiRequest(`/quiz/${id}`, { token });
    setQuiz(data);
    setAnswers(new Array(data.questions.length).fill(""));
  };

  const submitQuiz = async () => {
    const data = await apiRequest("/quiz/submit", { method: "POST", token, body: { courseId: id, answers } });
    setScore(data.score);
  };

  if (!course) return <p>Loading...</p>;

  return (
    <section>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p className="muted">Level: {course.level}</p>

      <h3>What You Will Learn</h3>
      <ul className="list">
        {(course.outcomes || []).map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      {status && (
        <div className="card status">
          {status.trialActive ? <p className="success">Trial Active ({status.trialDaysLeft} days left)</p> : <p className="warning">Trial Expired - Buy Course</p>}
          {status.paidActive && <p className="success">Subscription Active</p>}
          {!status.hasEnrollment && <button className="btn" onClick={startTrial}>Start 3-Day Trial</button>}
          {!status.paidActive && <Link className="btn-link" to={`/payment/${course._id}`}>Buy Course</Link>}
        </div>
      )}

      <h3>Videos</h3>
      <div className="grid">
        {course.videos.map((video, idx) => (
          <article className="card" key={idx}>
            <h4>{video.title}</h4>
            <p className="muted">{video.module}</p>
            {video.unlocked ? (
              <Link to={`/courses/${course._id}/video/${idx}`}>Play Video</Link>
            ) : (
              <p className="lock">🔒 {video.lockedReason}</p>
            )}
          </article>
        ))}
      </div>

      <div className="card">
        <h3>Course Quiz</h3>
        {!quiz && <button className="btn" onClick={startQuiz}>Start Quiz</button>}
        {quiz && quiz.questions.map((q, i) => (
          <div key={i} className="quiz-block">
            <p>{i + 1}. {q.question}</p>
            {q.options.map((opt) => (
              <label key={opt} className="option">
                <input
                  type="radio"
                  name={`q-${i}`}
                  checked={answers[i] === opt}
                  onChange={() => {
                    const copy = [...answers];
                    copy[i] = opt;
                    setAnswers(copy);
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        {quiz && <button className="btn secondary" onClick={submitQuiz}>Submit Quiz</button>}
        {score !== null && <p className="success">Your score: {score}</p>}
      </div>
    </section>
  );
};

export default CourseDetailPage;
