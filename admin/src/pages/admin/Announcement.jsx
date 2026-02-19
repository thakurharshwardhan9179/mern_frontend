import { useEffect, useState } from "react";
import API from "../../api/axios";

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);

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
      await API.post("/announcement/create", { title, message });
      setTitle("");
      setMessage("");
      fetchAnnouncements();
    } catch (err) {
      alert("Error");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete announcement?")) return;

    await API.delete(`/announcement/${id}`);
    fetchAnnouncements();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Announcements</h2>

      <form onSubmit={submitHandler}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <br /><br />

        <button>Create</button>
      </form>

      <hr />

      {list.map((a) => (
        <div key={a._id} style={{ marginBottom: 10 }}>
          <b>{a.title}</b>
          <p>{a.message}</p>
          <button
            onClick={() => deleteHandler(a._id)}
            style={{ color: "red" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Announcement;
