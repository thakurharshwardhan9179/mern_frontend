import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Attendance.css";

const Attendance = () => {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await API.get("/attendance/my");
    setList(res.data);
  };

  const markToday = async () => {
    try {
      await API.post("/attendance/mark");
      setMsg("✅ Attendance marked");
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || "Error");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="box">
      <h3>📅 Attendance</h3>

      <button className="btn" onClick={markToday}>Mark Today</button>
      {msg && <p>{msg}</p>}

      <ul className="list">
        {list.map(a => <li key={a._id}>{a.date}</li>)}
      </ul>
    </div>
  );
};

export default Attendance;