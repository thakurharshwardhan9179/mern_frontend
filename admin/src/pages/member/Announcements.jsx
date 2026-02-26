import { useEffect, useState } from "react";
import API from "../../api/axios";

const Announcements = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await API.get("/announcement");
      setList(res.data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="box">
      <h3>📢 Announcements</h3>

      {loading && <p>Loading...</p>}

      {!loading && list.length === 0 && (
        <p>No announcements</p>
      )}

      {list.map(a => (
        <div
          key={a._id}
          style={{
            background: "#f8fafc",
            padding: 12,
            borderRadius: 8,
            marginTop: 10,
            borderLeft: "4px solid #2563eb"
          }}
        >
          <b>{a.title}</b>
          <p style={{ marginTop: 4 }}>{a.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Announcements;