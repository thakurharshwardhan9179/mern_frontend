import { useEffect, useState } from "react";
import API from "../../api/axios";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 search & filter state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | expired

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/member");
      setMembers(res.data);
    } catch (err) {
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ================= DELETE =================
  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await API.delete(`/member/${id}`);
      alert("Member deleted");
      fetchMembers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= RENEW =================
  const renewMember = async (id) => {
    const plan = prompt("Enter Plan (1 Month / 3 Month / 6 Month)");
    const fees = prompt("Enter Fees");

    if (!plan || !fees) return alert("Plan & fees required");

    try {
      await API.put(`/member/renew/${id}`, { plan, fees });
      alert("Plan renewed");
      fetchMembers();
    } catch (err) {
      alert("Renew failed");
    }
  };

  // ================= FILTER LOGIC =================
  const filteredMembers = members.filter((m) => {
    const expired = new Date(m.expiryDate) < new Date();

    // status filter
    if (filter === "active" && expired) return false;
    if (filter === "expired" && !expired) return false;

    // search filter
    const text = search.toLowerCase();
    const name = m.userId?.name?.toLowerCase() || "";
    const email = m.userId?.email?.toLowerCase() || "";

    return name.includes(text) || email.includes(text);
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>All Members</h2>

      {/* 🔍 SEARCH + FILTER */}
      <div style={{ marginBottom: 15 }}>
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: 250, marginRight: 10 }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && filteredMembers.length === 0 && (
        <p>No members found</p>
      )}

      {!loading && filteredMembers.length > 0 && (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((m) => {
              const expired = new Date(m.expiryDate) < new Date();

              return (
                <tr
                  key={m._id}
                  style={{ color: expired ? "red" : "green" }}
                >
                  <td>{m.userId?.name || "N/A"}</td>
                  <td>{m.userId?.email || "N/A"}</td>
                  <td>{m.phone}</td>
                  <td>{m.plan}</td>
                  <td>
                    {new Date(m.expiryDate).toLocaleDateString()}
                  </td>
                  <td>{expired ? "Expired" : "Active"}</td>
                  <td>
                    <button onClick={() => renewMember(m._id)}>
                      Renew
                    </button>
                    &nbsp;
                    <button
                      onClick={() => deleteMember(m._id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Members;
