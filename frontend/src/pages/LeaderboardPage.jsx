import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";

const LeaderboardPage = () => {
  const { token } = useAuth();
  const [data, setData] = useState({ topUsers: [], myRank: null });

  useEffect(() => {
    apiRequest("/leaderboard", { token }).then(setData).catch(console.error);
  }, [token]);

  return (
    <section className="card">
      <h2>Leaderboard</h2>
      {data.myRank && <p className="muted">Your Rank: #{data.myRank.rank} (Total: {data.myRank.totalScore})</p>}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Quiz Score</th>
            <th>Progress</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.topUsers.map((item, index) => (
            <tr key={`${item.userId}-${index}`} className={index < 3 ? "top-row" : ""}>
              <td>#{item.rank}</td>
              <td>{item.name}</td>
              <td>{item.quizScore}</td>
              <td>{item.courseProgress}%</td>
              <td>{item.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default LeaderboardPage;
