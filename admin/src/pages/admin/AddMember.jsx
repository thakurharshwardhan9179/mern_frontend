import { useEffect, useState } from "react";
import API from "../../api/axios";

const AddMember = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    userId: "",
    phone: "",
    plan: "",
    fees: ""
  });

  // ================= LOAD USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/all");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SUBMIT =================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!data.userId || !data.phone || !data.plan || !data.fees) {
      return alert("All fields are required");
    }

    try {
      await API.post("/member/add", data);
      alert("Member added successfully ✅");

      setData({
        userId: "",
        phone: "",
        plan: "",
        fees: ""
      });
    } catch (err) {
      alert(err.response?.data?.message || "Add member failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Member</h2>

      {loading && <p>Loading users...</p>}

      <form onSubmit={submitHandler}>
        {/* USER SELECT */}
        <select
          value={data.userId}
          onChange={(e) =>
            setData({ ...data, userId: e.target.value })
          }
          style={inputStyle}
          required
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <input
          placeholder="Phone"
          value={data.phone}
          onChange={(e) =>
            setData({ ...data, phone: e.target.value })
          }
          style={inputStyle}
          required
        />

        <select
          value={data.plan}
          onChange={(e) =>
            setData({ ...data, plan: e.target.value })
          }
          style={inputStyle}
          required
        >
          <option value="">Select Plan</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Month">3 Month</option>
          <option value="6 Month">6 Month</option>
        </select>

        <input
          type="number"
          placeholder="Fees"
          value={data.fees}
          onChange={(e) =>
            setData({ ...data, fees: e.target.value })
          }
          style={inputStyle}
          required
        />

        <button type="submit" style={btnStyle}>
          Add Member
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "10px",
  marginTop: "10px",
  width: "300px",
  display: "block"
};

const btnStyle = {
  marginTop: "15px",
  padding: "10px 20px",
  cursor: "pointer"
};

export default AddMember;
