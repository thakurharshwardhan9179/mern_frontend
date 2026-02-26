import { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/member/stats");
        setStats(res.data);
      } catch (err) {
        alert("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading dashboard...</p>;

  return (
    <div style={{ padding: 25 }}>
      <h2>Admin Dashboard</h2>

      <div style={grid}>
        <Card title="Total Members" value={stats.total} color="#2563eb" />
        <Card title="Active Members" value={stats.active} color="#16a34a" />
        <Card title="Expired Members" value={stats.expired} color="#dc2626" />
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div
    style={{
      padding: 20,
      borderRadius: 12,
      background: "#fff",
      borderLeft: `6px solid ${color}`,
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ marginBottom: 10 }}>{title}</h3>
    <h1 style={{ color }}>{value}</h1>
  </div>
);

const grid = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

export default AdminDashboard;