import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Attendance.css";

const Attendance = () => {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyMarkedToday, setAlreadyMarkedToday] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const load = async () => {
    try {
      const res = await API.get("/attendance/my");
      const records = res.data || [];
      setList(records);

      const markedToday = records.some((a) => a.date === today);
      setAlreadyMarkedToday(markedToday);
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed to load attendance");
    }
  };

  const markToday = async () => {
    if (alreadyMarkedToday) {
      setMsg("✅ Aaj ki attendance pehle hi mark ho chuki hai");
      return;
    }

    try {
      setLoading(true);
      await API.post("/attendance/mark");
      setMsg("✅ Attendance marked successfully");
      await load();
    } catch (e) {
      const errorMsg = e.response?.data?.message || "Error";

      if (errorMsg.toLowerCase().includes("already")) {
        setMsg("✅ Aaj ki attendance pehle hi mark ho chuki hai");
        setAlreadyMarkedToday(true);
      } else {
        setMsg(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="box">
      <h3>📅 Attendance</h3>

      <button
        className="btn"
        onClick={markToday}
        disabled={loading || alreadyMarkedToday}
      >
        {alreadyMarkedToday ? "Marked for Today" : loading ? "Marking..." : "Mark Today"}
      </button>

      {msg && <p>{msg}</p>}

      <ul className="list">
        {list.map((a) => (
          <li key={a._id}>{a.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;