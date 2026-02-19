import { useEffect, useState } from "react";
import API from "../../api/axios";

const Announcements = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await API.get("/announcement");
        setList(res.data);
      } catch (err) {
        alert("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div style={{ marginTop: 30 }}>
      <h3>📢 Announcements</h3>

      {loading && <p>Loading...</p>}

      {!loading && list.length === 0 && (
        <p>No announcements yet</p>
      )}

      {!loading &&
        list.map((a) => (
          <div
            key={a._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 10,
              marginBottom: 10,
              background: "#f9f9f9"
            }}
          >
            <h4>{a.title}</h4>
            <p>{a.message}</p>
          </div>
        ))}
    </div>
  );
};

export default Announcements;
