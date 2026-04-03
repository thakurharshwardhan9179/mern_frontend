import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminAttendance.css";
import AttendanceChart from "../../components/AttendanceChart";

const AdminAttendance = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });

  const loadByDate = async (selectedDate) => {
    try {
      const res = await API.get(`/attendance/by-date?date=${selectedDate}`);
      const records = res.data;

      setData(records);

      // stats calculate
      const present = records.length;
      const totalMembersRes = await API.get("/member"); // assume total members API
      const total = totalMembersRes.data.length;

      setStats({
        total,
        present,
        absent: total - present,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    loadByDate(today);
  }, []);

  return (
    <div className="attendance-container">
      <h2>📊 Attendance Dashboard</h2>

      {/* 📅 Date Picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          loadByDate(e.target.value);
        }}
        className="search-box"
      />

      {/* 📊 Stats */}
      <div className="stats">
        <div className="card">👥 Total: {stats.total}</div>
        <div className="card green">✅ Present: {stats.present}</div>
        <div className="card red">❌ Absent: {stats.absent}</div>
      </div>
      <AttendanceChart data={data} />

      {/* 📋 Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.member?.userId?.name}</td>
                <td>{item.member?.userId?.email}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendance;