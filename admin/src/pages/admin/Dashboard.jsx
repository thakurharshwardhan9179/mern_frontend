import { useEffect, useState } from "react";
import API from "../../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/member/stats");
        setStats(res.data);
      } catch (error) {
        alert("Failed to load dashboard stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard 👑</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Members</h3>
          <p>{stats.total}</p>
        </div>

        <div style={{ ...cardStyle, background: "#d4edda" }}>
          <h3>Active Members</h3>
          <p>{stats.active}</p>
        </div>

        <div style={{ ...cardStyle, background: "#f8d7da" }}>
          <h3>Expired Members</h3>
          <p>{stats.expired}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "200px",
  textAlign: "center",
  fontSize: "18px"
};

export default Dashboard;
