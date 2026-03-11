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
console.log("Member Data:", res.data);   // DEBUG
setMember(res.data);
} catch (err) {
console.log(err);
alert("Failed to load dashboard");
} finally {
setLoading(false);
}
};
fetchMyData();
}, []);

// ================= PAYMENT FUNCTION =================
const handlePayment = async () => {
try {

  const amount = member?.fees || 500;   // fallback amount

  console.log("Payment Amount:", amount);

  const res = await API.post("/payment/create-order", {
    amount: amount,
  });

  const order = res.data;

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount: order.amount,
    currency: "INR",
    name: "Gym Membership",
    description: "Renew Membership",
    order_id: order.id,

    handler: async function (response) {

      console.log("Payment Response:", response);

      await API.post("/payment/verify", {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        userId: member.userId._id,
        phone: member.phone,
        plan: member.plan,
        fees: amount,
      });

      alert("Membership Renewed Successfully 💪");
      window.location.reload();
    },

    theme: {
      color: "#ff4d4d",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

} catch (error) {
  console.log("Payment Error:", error);
  alert("Payment failed");
}


};

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

return ( <div className="dashboard">

```
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

  {daysLeft <= 7 && (
    <div className={`alert ${status}`}>
      {daysLeft <= 0
        ? "❌ Your membership has expired. Please renew."
        : `⏰ Your membership will expire in ${daysLeft} days`}

      <br /><br />

      <button className="renew-btn" onClick={handlePayment}>
        Renew Membership 💳
      </button>
    </div>
  )}

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

  <div className="grid">
    <Announcements />
    <Attendance />
  </div>

</div>


);
};

export default Dashboard;
