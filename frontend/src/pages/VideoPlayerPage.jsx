import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/api/client";
import { useAuth } from "../context/AuthContext";

const VideoPlayerPage = () => {
  const { id, videoIndex } = useParams();
  const { token } = useAuth();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    apiRequest(`/courses/${id}`, { token }).then(setCourse).catch(console.error);
  }, [id, token]);

  if (!course) return <p>Loading...</p>;
  const video = course.videos[Number(videoIndex)];
  if (!video) return <p>Video not found.</p>;
  if (!video.unlocked) return <p className="warning">This video is locked. Start trial or buy course.</p>;

  return (
    <section className="card">
      <h2>{video.title}</h2>
      <p className="muted">{video.module}</p>
      <video controls width="100%" src={video.url} />
    </section>
  );
};

export default VideoPlayerPage;
