import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

const MemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await API.get(`/member/${id}`);
        setMember(res.data);
      } catch (err) {
        alert("Failed to load member");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!member) return <p style={{ padding: 20 }}>Member not found</p>;

  const expiry = new Date(member.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  const totalDays = member.plan.includes("12")
    ? 365
    : member.plan.includes("6")
    ? 180
    : member.plan.includes("3")
    ? 90
    : 30;

  const progress = Math.max(
    0,
    Math.min(100, (daysLeft / totalDays) * 100)
  );

  const status =
    daysLeft <= 0 ? "Expired" : daysLeft <= 7 ? "Expiring Soon" : "Active";

  const statusColor =
    status === "Expired"
      ? "#dc2626"
      : status === "Expiring Soon"
      ? "#ea580c"
      : "#16a34a";

  return (
    <div style={page}>
      <div style={card}>
        <h2>👤 Member Profile</h2>

        <div style={badge(statusColor)}>{status}</div>

        <div style={info}>
          <p><b>Name:</b> {member.userId?.name}</p>
          <p><b>Email:</b> {member.userId?.email}</p>
          <p><b>Phone:</b> {member.phone}</p>
          <p><b>Plan:</b> {member.plan}</p>
          <p>
            <b>Expiry:</b> {expiry.toLocaleDateString()}
          </p>
          <p>
            <b>Days Left:</b>{" "}
            <span style={{ color: statusColor }}>
              {daysLeft <= 0 ? 0 : daysLeft}
            </span>
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div>
          <p style={{ marginBottom: 6 }}>Membership Progress</p>
          <div style={progressWrap}>
            <div
              style={{
                ...progressBar,
                width: `${progress}%`,
                background: statusColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============ STYLES ============ */
const page = {
  minHeight: "100vh",
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: "420px",
  background: "#fff",
  padding: 25,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const badge = (bg) => ({
  marginTop: 10,
  marginBottom: 15,
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 20,
  background: bg,
  color: "#fff",
  fontWeight: 600,
});

const info = {
  marginBottom: 20,
  lineHeight: 1.8,
};

const progressWrap = {
  height: 10,
  width: "100%",
  background: "#e5e7eb",
  borderRadius: 20,
  overflow: "hidden",
};

const progressBar = {
  height: "100%",
  transition: "0.4s",
};

export default MemberProfile;