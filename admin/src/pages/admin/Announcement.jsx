import { useEffect, useState } from "react";
import API from "../../api/axios";

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    const res = await API.get("/announcement");
    setList(res.data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await API.post("/announcement/create", { title, message });
      setTitle("");
      setMessage("");
      fetchAnnouncements();
    } catch (err) {
      alert("Error creating announcement");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete announcement?")) return;
    await API.delete(`/announcement/${id}`);
    fetchAnnouncements();
  };

  return (
    <div style={page}>
      {/* CREATE ANNOUNCEMENT */}
      <div style={card}>
        <h2 style={heading}>📢 Admin Announcements</h2>

        <form onSubmit={submitHandler}>
          <div style={field}>
            <label style={label}>Title</label>
            <input
              style={input}
              placeholder="Announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={field}>
            <label style={label}>Message</label>
            <textarea
              style={textarea}
              placeholder="Write announcement message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button style={button} disabled={loading}>
            {loading ? "Creating..." : "+ Create Announcement"}
          </button>
        </form>
      </div>

      {/* ANNOUNCEMENT LIST */}
      <div style={listWrap}>
        {list.map((a) => (
          <div key={a._id} style={announcementCard}>
            <h4 style={aTitle}>{a.title}</h4>
            <p style={aMessage}>{a.message}</p>

            <button
              onClick={() => deleteHandler(a._id)}
              style={deleteBtn}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "#f6f8fb",
  padding: "30px",
};

const card = {
  maxWidth: "600px",
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  marginBottom: "30px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "18px",
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
};

const textarea = {
  ...input,
  minHeight: "90px",
  resize: "vertical",
};

const button = {
  width: "100%",
  padding: "13px",
  background: "#0f766e",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const listWrap = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "18px",
};

const announcementCard = {
  background: "#ffffff",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
};

const aTitle = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "6px",
  color: "#0f172a",
};

const aMessage = {
  fontSize: "14px",
  color: "#475569",
  marginBottom: "12px",
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "13px",
};

export default Announcement;