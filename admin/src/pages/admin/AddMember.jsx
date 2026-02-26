import { useEffect, useState } from "react";
import API from "../../api/axios";

const AddMember = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    phone: "",
    plan: "1 Month",
    fees: "",
  });

  // ================= GET USERS =================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/all"); // ✅ correct
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.phone || !form.plan || !form.fees) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);

      await API.post("/member/add", {
        userId: form.userId,
        phone: form.phone,
        plan: form.plan,
        fees: form.fees,
      });

      alert("✅ Member Added Successfully");

      setForm({
        userId: "",
        phone: "",
        plan: "1 Month",
        fees: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={heading}>Add New Member</h2>

        <form onSubmit={handleSubmit}>
          {/* USER */}
          <div style={field}>
            <label style={label}>Select User</label>
            <select
              name="userId"
              value={form.userId}
              onChange={handleChange}
              required
              style={input}
            >
              <option value="">-- Select User --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* PHONE */}
          <div style={field}>
            <label style={label}>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              style={input}
            />
          </div>

          {/* PLAN */}
          <div style={field}>
            <label style={label}>Plan</label>
            <select
              name="plan"
              value={form.plan}
              onChange={handleChange}
              style={input}
            >
              <option>1 Month</option>
              <option>3 Month</option>
              <option>6 Month</option>
            </select>
          </div>

          {/* FEES */}
          <div style={field}>
            <label style={label}>Fees (₹)</label>
            <input
              type="number"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              placeholder="Enter fees"
              required
              style={input}
            />
          </div>
          console.log(form);
          <button style={button} disabled={loading}>
            {loading ? "Adding..." : "+ Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ================= INLINE STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "#f6f8fb",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "40px 20px",
};

const card = {
  width: "100%",
  maxWidth: "520px",
  background: "#ffffff",
  padding: "28px",
  borderRadius: "16px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "20px",
  color: "#0f172a",
};

const field = {
  marginBottom: "16px",
};

const label = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#334155",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
};

const button = {
  width: "100%",
  marginTop: "12px",
  padding: "13px",
  background: "#0f766e", // same vibe as members page
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
};

export default AddMember;