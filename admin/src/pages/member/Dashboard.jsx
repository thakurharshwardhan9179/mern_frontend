import { useEffect, useState } from "react";
import API from "../../api/axios";
import Announcements from "./Announcements";

const Dashboard = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await API.get("/member/my");
        setMember(res.data);
      } catch (err) {
        alert("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading dashboard...</p>;
  if (!member) return <p style={{ padding: 20 }}>No membership found</p>;

  const expiry = new Date(member.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  let statusColor = "#16a34a";
  let statusText = "Active";

  if (daysLeft <= 0) {
    statusColor = "#dc2626";
    statusText = "Expired";
  } else if (daysLeft <= 7) {
    statusColor = "#ea580c";
    statusText = "Expiring Soon";
  }

  return (
    <div style={{ padding: 25 }}>
      <h2>Welcome, {member.userId?.name} 👋</h2>

      {/* ALERT BOX */}
      {(daysLeft <= 7) && (
        <div
          style={{
            marginTop: 15,
            padding: 15,
            background: statusColor,
            color: "#fff",
            borderRadius: 8,
            maxWidth: 420,
          }}
        >
          {daysLeft <= 0 ? (
            <>
              ❌ <b>Your membership has expired.</b>
              <br />
              Please contact gym admin to renew your plan.
            </>
          ) : (
            <>
              ⏰ <b>Your membership will expire in {daysLeft} days.</b>
              <br />
              Renew soon to avoid interruption.
            </>
          )}
        </div>
      )}

      {/* MEMBER CARD */}
      <div style={card}>
        <p><b>Email:</b> {member.userId?.email}</p>
        <p><b>Phone:</b> {member.phone}</p>
        <p><b>Plan:</b> {member.plan}</p>
        <p>
          <b>Expiry Date:</b>{" "}
          {expiry.toLocaleDateString()}
        </p>
        <p>
          <b>Status:</b>{" "}
          <span style={{ color: statusColor }}>
            {statusText}
          </span>
        </p>
      </div>

      {/* ANNOUNCEMENTS */}
      <Announcements />
    </div>
  );
};

const card = {
  marginTop: 20,
  padding: 20,
  borderRadius: 10,
  width: "360px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
};

export default Dashboard;
