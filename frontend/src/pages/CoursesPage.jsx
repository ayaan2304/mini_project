import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";

const CoursesPage = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [level, setLevel] = useState("all");

  useEffect(() => {
    apiRequest("/courses", { token }).then(setCourses).catch(console.error);
  }, [token]);

  const filtered = useMemo(
    () => (level === "all" ? courses : courses.filter((c) => c.level === level)),
    [courses, level]
  );

  return (
    <section>
      <div className="section-head">
        <h2>Courses</h2>
        <select className="filter" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="grid">
        {filtered.map((course) => (
          <article className="card hover" key={course._id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p className="muted">{course.level} • Rs. {course.price}</p>
            <Link to={`/courses/${course._id}`}>Open Course</Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CoursesPage;
