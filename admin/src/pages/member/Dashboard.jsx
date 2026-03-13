import { useEffect, useState } from "react";
import API from "../../api/axios";
import Attendance from "./Attendance";
import "./Dashboard.css";

const Dashboard = () => {

const [member, setMember] = useState(null);
const [loading, setLoading] = useState(true);

const RAZORPAY_KEY = "rzp_test_SQOWmVBfsGxlXy";


useEffect(() => {

const fetchMyData = async () => {

try {

const res = await API.get("/member/my");
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

// ================= PAYMENT =================

const handlePayment = async () => {

try {

if (!member) return;

const amount = member?.fees || 500;

const orderRes = await API.post("/payment/create-order", {
amount
});

const { id: order_id, amount: order_amount, currency } = orderRes.data;

const options = {

key: RAZORPAY_KEY,
amount: order_amount,
currency,
name: "Indvibe Gym",
description: `Membership Plan: ${member.plan}`,
order_id,

handler: async function (response) {

await API.post("/payment/verify", {

userId: member.userId._id,
phone: member.phone,
plan: member.plan,
fees: amount,

razorpay_order_id: response.razorpay_order_id,
razorpay_payment_id: response.razorpay_payment_id,
razorpay_signature: response.razorpay_signature

});

const res = await API.get("/member/my");
setMember(res.data);

alert("Payment Successful 💪 Membership Activated");

},

prefill: {

name: member.userId?.name,
email: member.userId?.email,
contact: member.phone

},

theme: {
color: "#0f172a"
}

};

const rzp = new window.Razorpay(options);
rzp.open();

} catch (error) {

console.log("Payment Error:", error);
alert("Payment failed");

}

};

// ================= LOADING =================

if (loading) return <p className="loading">Loading dashboard...</p>;

if (!member) return <p className="loading">No membership found</p>;

// ================= DATE CALCULATION =================

const expiry = member?.expiryDate ? new Date(member.expiryDate) : null;
const joining = member?.joiningDate ? new Date(member.joiningDate) : null;
const today = new Date();

const totalDays =
joining && expiry ? Math.ceil((expiry - joining) / 86400000) : 0;

const daysLeft =
expiry ? Math.ceil((expiry - today) / 86400000) : 0;

const usedDays = totalDays - daysLeft;

const progress =
totalDays > 0
? Math.min(Math.max((usedDays / totalDays) * 100, 0), 100)
: 0;

// ================= STATUS =================

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

<br /><br />

<button className="renew-btn" onClick={handlePayment}>
Renew Membership 💳
</button>

</div>

)}

{/* MEMBERSHIP STATS */}

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

{/* MEMBER DETAILS */}

<div className="member-card">

<h3>👤 Member Details</h3>

<p><b>Name:</b> {member.userId?.name}</p>
<p><b>Email:</b> {member.userId?.email}</p>
<p><b>Phone:</b> {member.phone}</p>

<p><b>Plan:</b> {member.plan}</p>

<p><b>Joining Date:</b> {joining?.toLocaleDateString()}</p>
<p><b>Expiry Date:</b> {expiry?.toLocaleDateString()}</p>

{/* PROGRESS BAR */}

<div className="progress-bar">

<div
className={`progress-fill ${status}`}
style={{ width: `${progress}%` }}
/>

</div>

</div>

{/* HEALTH DETAILS */}

<div className="health-card">

<h3>🏋️ Fitness Details</h3>

<div className="health-grid">

<div className="health-item">
<span>Age</span>
<h4>{member.age}</h4>
</div>

<div className="health-item">
<span>Height</span>
<h4>{member.height} cm</h4>
</div>

<div className="health-item">
<span>Weight</span>
<h4>{member.weight} kg</h4>
</div>

<div className="health-item">
<span>BMI</span>
<h4>{member.bmi}</h4>
</div>

</div>

<div className="health-extra">

<p><b>Goal:</b> {member.goal}</p>
<p><b>Fitness Level:</b> {member.fitnessLevel}</p>
<p><b>Workout Suggestion:</b> {member.workoutSuggestion}</p>
<p><b>Diet Plan:</b> {member.dietSuggestion}</p>

</div>

</div>

{/* ATTENDANCE */}

<div className="grid">

<Attendance />

</div>

</div>

);

};

export default Dashboard;
