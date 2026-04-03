import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./Members.css";

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
    <div className="members-page">
      <div className="members-header">
        <h2 className="members-title">Members</h2>
      </div>

      <div className="members-toolbar">
        <input
          className="members-search"
          placeholder="Search member"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="members-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Members</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading && <p className="members-loading">Loading...</p>}

      {!loading && filteredMembers.length === 0 && (
        <div className="members-empty">
          <h3>No Members Found</h3>
        </div>
      )}

      <div className="members-grid">
        {filteredMembers.map((m) => {
          const expired = new Date(m.expiryDate) < new Date();

          return (
            <div key={m._id} className="member-card">
              <h3 className="member-name">
                <Link to={`/admin/member/${m._id}`}>
                  {m.userId?.name || "N/A"}
                </Link>
              </h3>

              <div className="member-details">
                <p>
                  <span>Email:</span> {m.userId?.email || "N/A"}
                </p>
                <p>
                  <span>Phone:</span> {m.phone || "N/A"}
                </p>
                <p>
                  <span>Plan:</span> {m.plan || "N/A"}
                </p>
                <p>
                  <span>Expiry:</span>{" "}
                  {new Date(m.expiryDate).toLocaleDateString()}
                </p>
              </div>

              <p
                className={`member-status ${
                  expired ? "status-expired" : "status-active"
                }`}
              >
                {expired ? "Expired" : "Active"}
              </p>

              <div className="member-btn-row">
                <button
                  className="renew-btn"
                  onClick={() => renewMember(m._id)}
                >
                  Renew
                </button>

                <button
                  className="delete-btn"
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
        className="add-member-btn"
        onClick={() => (window.location.href = "/admin/add-member")}
      >
        + Add Member
      </button>
    </div>
  );
};

export default Members;