import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/member");
      setMembers(res.data);
    } catch {
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      await API.delete(`/member/${id}`);
      fetchMembers();
    } catch {
      alert("Delete failed");
    }
  };

  const renewMember = async (id) => {
    const plan = prompt("Enter plan (1 Month / 3 Month / 6 Month)");
    const fees = prompt("Enter fees");

    if (!plan || !fees) return;

    try {
      await API.put(`/member/renew/${id}`, { plan, fees });
      fetchMembers();
    } catch {
      alert("Renew failed");
    }
  };

  const filteredMembers = members.filter((m) => {
    const expired = new Date(m.expiryDate) < new Date();

    if (filter === "active" && expired) return false;
    if (filter === "expired" && !expired) return false;

    const text = search.toLowerCase();
    return (
      m.userId?.name?.toLowerCase().includes(text) ||
      m.userId?.email?.toLowerCase().includes(text)
    );
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Members</h2>

      <div style={toolbar}>
        <input
          placeholder="Search member"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={select}
        >
          <option value="all">All Members</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && filteredMembers.length === 0 && (
        <div style={emptyBox}>
          <h3>No Members Found</h3>
        </div>
      )}

      <div style={grid}>
        {filteredMembers.map((m) => {
          const expired = new Date(m.expiryDate) < new Date();

          return (
            <div key={m._id} style={card}>
              
              {/* CLICKABLE NAME */}
              <h3>
                <Link to={`/admin/member/${m._id}`}>
                  {m.userId?.name || "N/A"}
                </Link>
              </h3>

              <p>Email: {m.userId?.email}</p>
              <p>Phone: {m.phone}</p>
              <p>Plan: {m.plan}</p>

              <p>
                Expiry: {new Date(m.expiryDate).toLocaleDateString()}
              </p>

              <p
                style={{
                  color: expired ? "#dc2626" : "#16a34a",
                  fontWeight: "bold",
                }}
              >
                {expired ? "Expired" : "Active"}
              </p>

              <div style={btnRow}>
                <button
                  style={renewBtn}
                  onClick={() => renewMember(m._id)}
                >
                  Renew
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteMember(m._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        style={floatingBtn}
        onClick={() => window.location.href="/admin/add-member"}
      >
        + Add Member
      </button>
    </div>
  );
};

/* styles */

const toolbar = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
};

const searchInput = {
  padding: 10,
  width: 250,
};

const select = {
  padding: 10,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 20,
};

const card = {
  padding: 15,
  borderRadius: 12,
  background: "#f8fafc",
  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
};

const btnRow = {
  marginTop: 10,
  display: "flex",
  gap: 10,
};

const renewBtn = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const emptyBox = {
  marginTop: 50,
  textAlign: "center",
};

const floatingBtn = {
  position: "fixed",
  bottom: 30,
  right: 30,
  padding: "14px 20px",
  borderRadius: "50px",
  background: "#0f766e",
  color: "#fff",
  border: "none",
  fontSize: 16,
  cursor: "pointer",
};

export default Members;