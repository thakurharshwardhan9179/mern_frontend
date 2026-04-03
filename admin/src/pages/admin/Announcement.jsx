import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Announcement.css";

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
    <div className="announcement-page">
      <div className="announcement-form-card">
        <h2 className="announcement-heading">📢 Admin Announcements</h2>

        <form onSubmit={submitHandler}>
          <div className="announcement-field">
            <label className="announcement-label">Title</label>
            <input
              className="announcement-input"
              placeholder="Announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="announcement-field">
            <label className="announcement-label">Message</label>
            <textarea
              className="announcement-textarea"
              placeholder="Write announcement message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button className="announcement-submit-btn" disabled={loading}>
            {loading ? "Creating..." : "+ Create Announcement"}
          </button>
        </form>
      </div>

      <div className="announcement-list-wrap">
        {list.map((a) => (
          <div key={a._id} className="announcement-card">
            <h4 className="announcement-card-title">{a.title}</h4>
            <p className="announcement-card-message">{a.message}</p>

            <button
              onClick={() => deleteHandler(a._id)}
              className="announcement-delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;