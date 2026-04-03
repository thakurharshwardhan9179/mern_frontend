import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import Attendance from "./Attendance";
import "./Dashboard.css";

const Dashboard = () => {
  const [member, setMember] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const RAZORPAY_KEY = "rzp_test_SQOWmVBfsGxlXy";

  const fetchMyData = async () => {
    try {
      const [memberRes, historyRes] = await Promise.all([
        API.get("/member/my"),
        API.get("/member/my-renewal-history"),
      ]);

      setMember(memberRes.data || null);
      setHistory(historyRes.data?.renewalHistory || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const getPlanPrice = (plan) => {
    if (plan === "1 Month") return 500;
    if (plan === "3 Month") return 1200;
    if (plan === "6 Month") return 2000;
    return member?.fees || 500;
  };

  const handlePayment = async () => {
    try {
      if (!member) return;

      const amount = getPlanPrice(member.plan);

      const orderRes = await API.post("/payment/create-order", { amount });
      const { id: order_id, amount: order_amount, currency } = orderRes.data;

      const options = {
        key: RAZORPAY_KEY,
        amount: order_amount,
        currency,
        name: "FitZone Gym",
        description: `Membership Renewal: ${member.plan}`,
        order_id,
        handler: async function (response) {
          await API.post("/payment/verify", {
            userId: member.userId?._id,
            phone: member.phone,
            plan: member.plan,
            fees: amount,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          await API.put(`/member/renew/${member._id}`, {
            plan: member.plan,
            fees: amount,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          });

          await fetchMyData();
          alert("Payment Successful. Membership Renewed");
        },
        prefill: {
          name: member.userId?.name || "",
          email: member.userId?.email || "",
          contact: member.phone || "",
        },
        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Payment Error:", error);
      alert("Payment failed");
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  const fitnessLevel = useMemo(() => {
    if (!member) return "-";
    if (member.fitnessLevel) return member.fitnessLevel;
    if (!member.bmi) return "-";

    const bmi = Number(member.bmi);
    if (Number.isNaN(bmi)) return "-";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }, [member]);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (!member) return <p className="loading">No membership found</p>;

  const expiry = member?.expiryDate ? new Date(member.expiryDate) : null;
  const joining = member?.joiningDate ? new Date(member.joiningDate) : null;
  const today = new Date();

  const totalDays =
    joining && expiry ? Math.ceil((expiry - joining) / 86400000) : 0;

  const daysLeft = expiry ? Math.ceil((expiry - today) / 86400000) : 0;
  const usedDays = totalDays - daysLeft;

  const progress =
    totalDays > 0
      ? Math.min(Math.max((usedDays / totalDays) * 100, 0), 100)
      : 0;

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
      {/* HERO */}
      <div className="hero">
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="hero-topline">MEMBER PANEL</div>

          <h1>
            Welcome back, <span>{member.userId?.name || "Member"}</span>
          </h1>

          <p className="hero-sub">
            Manage your membership, track your fitness details, review renewal
            history, and mark daily attendance from one clean dashboard.
          </p>

          <div className="hero-badge-row">
            <span className="hero-badge">Plan: {member.plan || "-"}</span>
            <span className={`hero-badge status-pill ${status}`}>
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* ALERT */}
      {(daysLeft <= 7 || status === "expired") && (
        <div className={`alert ${status}`}>
          <div className="alert-title">
            {daysLeft <= 0 ? "Membership Expired" : "Membership Expiring Soon"}
          </div>

          <p className="alert-text">
            {daysLeft <= 0
              ? "Your membership has expired. Renew now to continue accessing gym services without interruption."
              : `Your membership will expire in ${daysLeft} day(s). Renew now to keep your plan active.`}
          </p>

          <button className="renew-btn" onClick={handlePayment}>
            Renew Now
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-label">Current Plan</div>
          <div className="stat-value">{member.plan || "-"}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Days Left</div>
          <div className="stat-value">{daysLeft > 0 ? daysLeft : 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className={`status-badge ${status}`}>{statusText}</div>
        </div>
      </div>

      {/* MEMBER DETAILS */}
      <div className="member-card">
        <div className="section-header">
          <h3>Member Details</h3>
          <span className="section-tag">Personal Info</span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Name</span>
            <strong>{member.userId?.name || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>{member.userId?.email || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Phone</span>
            <strong>{member.phone || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Plan</span>
            <strong>{member.plan || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Joining Date</span>
            <strong>{formatDate(member.joiningDate)}</strong>
          </div>

          <div className="detail-item">
            <span>Expiry Date</span>
            <strong>{formatDate(member.expiryDate)}</strong>
          </div>
        </div>

        <div className="membership-progress">
          <div className="progress-head">
            <span>Membership Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="progress-bar">
            <div
              className={`progress-fill ${status}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* FITNESS DETAILS */}
      <div className="health-card">
        <div className="section-header">
          <h3>Fitness Details</h3>
          <span className="section-tag">Health Summary</span>
        </div>

        <div className="health-grid">
          <div className="health-item">
            <span>Age</span>
            <h4>{member.age || "-"}</h4>
          </div>

          <div className="health-item">
            <span>Height</span>
            <h4>{member.height || "-"} cm</h4>
          </div>

          <div className="health-item">
            <span>Weight</span>
            <h4>{member.weight || "-"} kg</h4>
          </div>

          <div className="health-item">
            <span>BMI</span>
            <h4>{member.bmi || "-"}</h4>
          </div>
        </div>

        <div className="health-extra">
          <div className="extra-item">
            <span>Goal</span>
            <strong>{member.goal || "-"}</strong>
          </div>

          <div className="extra-item">
            <span>Fitness Level</span>
            <strong>{fitnessLevel}</strong>
          </div>

          <div className="extra-item">
            <span>Workout Suggestion</span>
            <strong>{member.workoutSuggestion || "-"}</strong>
          </div>

          <div className="extra-item">
            <span>Diet Plan</span>
            <strong>{member.dietSuggestion || "-"}</strong>
          </div>
        </div>
      </div>

      {/* RENEWAL HISTORY */}
      <div className="member-card">
        <div className="history-header">
          <div>
            <h3>Renewal History</h3>
            <p className="section-subtext">
              Review your previous membership renewals and payment records.
            </p>
          </div>

          <button className="renew-btn small-btn" onClick={handlePayment}>
            Renew Membership
          </button>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">No renewal history available.</div>
        ) : (
          <div className="history-list">
            {history
              .slice()
              .reverse()
              .map((item, index) => (
                <div className="history-item" key={index}>
                  <div className="history-row">
                    <span>Plan</span>
                    <strong>{item.plan || "-"}</strong>
                  </div>

                  <div className="history-row">
                    <span>Fees</span>
                    <strong>₹{item.fees || 0}</strong>
                  </div>

                  <div className="history-row">
                    <span>Start Date</span>
                    <strong>{formatDate(item.startDate)}</strong>
                  </div>

                  <div className="history-row">
                    <span>End Date</span>
                    <strong>{formatDate(item.endDate)}</strong>
                  </div>

                  <div className="history-row">
                    <span>Renewed At</span>
                    <strong>{formatDate(item.renewedAt)}</strong>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ATTENDANCE */}
      <div className="grid">
        <Attendance />
      </div>
    </div>
  );
};

export default Dashboard;