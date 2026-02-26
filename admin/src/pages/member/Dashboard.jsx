import { useEffect, useState } from "react";
import API from "../../api/axios";
import Announcements from "./Announcements";
import Attendance from "./Attendance";
import "./Dashboard.css";

const Dashboard = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await API.get("/member/my");
        setMember(res.data);
      } catch {
        alert("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (!member) return <p className="loading">No membership found</p>;

  const expiry = new Date(member.expiryDate);
  const joining = new Date(member.joiningDate);
  const today = new Date();

  const totalDays = Math.ceil((expiry - joining) / 86400000);
  const daysLeft = Math.ceil((expiry - today) / 86400000);
  const usedDays = totalDays - daysLeft;
  const progress = Math.min(Math.max((usedDays / totalDays) * 100, 0), 100);

  let status = "active";
  let statusText = "Active";

  if (daysLeft <= 0) {
    status = "expired";
    statusText = "Expired";
  } else if (daysLeft <= 7) {
    status = "warning";
    statusText = "Expiring Soon";
  }

  return (
    <div className="dashboard">

     {/* HERO SECTION */}
<div className="hero">

<div className="hero-glow"></div>

<div className="hero-content">
  <h1>
    Welcome Back, <span>{member.userId?.name}</span> 👋
  </h1>

  <p className="hero-sub">
    Every workout makes you stronger than yesterday.
  </p>

  <div className="hero-badge">
    💪 Train Hard. Stay Strong. No Excuses.
  </div>
</div>

</div>


      {/* ALERT */}
      {daysLeft <= 7 && (
        <div className={`alert ${status}`}>
          {daysLeft <= 0
            ? "❌ Your membership has expired. Please renew."
            : `⏰ Your membership will expire in ${daysLeft} days`}
        </div>
      )}

      {/* QUICK STATS */}
      <div className="stats">
        <div className="stat-card">
          <h4>Plan</h4>
          <p>{member.plan}</p>
        </div>

        <div className="stat-card">
          <h4>Days Left</h4>
          <p>{daysLeft > 0 ? daysLeft : 0}</p>
        </div>

        <div className="stat-card">
          <h4>Status</h4>
          <p className={`status-text ${status}`}>{statusText}</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="card">
        <p><b>Email:</b> {member.userId?.email}</p>
        <p><b>Phone:</b> {member.phone}</p>
        <p><b>Expiry:</b> {expiry.toLocaleDateString()}</p>

        <div className="progress-bar">
          <div
            className={`progress-fill ${status}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        <Announcements />
        <Attendance />
      </div>

    </div>
  );
};

export default Dashboard;