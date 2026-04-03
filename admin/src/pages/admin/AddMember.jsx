import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AddMember.css";

const AddMember = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    phone: "",
    plan: "1 Month",
    fees: "",
    age: "",
    height: "",
    weight: "",
    goal: "Fitness",
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/all");
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.phone || !form.plan || !form.fees) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        height: form.height ? Number(form.height) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        fees: Number(form.fees),
      };

      await API.post("/member/add", payload);

      alert("✅ Member Added Successfully");

      setForm({
        userId: "",
        phone: "",
        plan: "1 Month",
        fees: "",
        age: "",
        height: "",
        weight: "",
        goal: "Fitness",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-member-page">
      <div className="add-member-card">
        <h2 className="add-member-heading">Add New Member</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Select User</label>
            <select name="userId" value={form.userId} onChange={handleChange} required>
              <option value="">-- Select User --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="field">
            <label>Plan</label>
            <select name="plan" value={form.plan} onChange={handleChange}>
              <option>1 Month</option>
              <option>3 Month</option>
              <option>6 Month</option>
            </select>
          </div>

          <div className="field">
            <label>Fees (₹)</label>
            <input
              type="number"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              placeholder="Enter fees"
              required
            />
          </div>

          <div className="field">
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Height (cm)</label>
            <input type="number" name="height" value={form.height} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Weight (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Fitness Goal</label>
            <select name="goal" value={form.goal} onChange={handleChange}>
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Fitness</option>
            </select>
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "+ Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMember;