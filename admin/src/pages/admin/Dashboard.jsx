import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminDashboard.css";

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

  if (loading) return <p className="admin-dashboard-loading">Loading dashboard...</p>;

  return (
    <div className="admin-dashboard-page">
      <h2 className="admin-dashboard-heading">Admin Dashboard</h2>

      <div className="admin-dashboard-grid">
        <Card title="Total Members" value={stats.total} variant="blue" />
        <Card title="Active Members" value={stats.active} variant="green" />
        <Card title="Expired Members" value={stats.expired} variant="red" />
      </div>
    </div>
  );
};

const Card = ({ title, value, variant }) => (
  <div className={`admin-stat-card ${variant}`}>
    <h3>{title}</h3>
    <h1>{value}</h1>
  </div>
);

export default AdminDashboard;