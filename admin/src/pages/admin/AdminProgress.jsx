import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminProgress.css";

const AdminProgress = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await API.get("/progress/all");
      setData(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-progress-container">
      <h2>📊 Members Progress</h2>

      <input
        type="text"
        placeholder="Search member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-progress-search"
      />

      <div className="admin-progress-grid">
        {filtered.length === 0 ? (
          <p>No progress data found</p>
        ) : (
          filtered.map((item) => (
            <div className="admin-progress-card" key={item.memberId}>
              <h3>{item.name}</h3>
              <p>{item.email}</p>
              <p><strong>Goal:</strong> {item.goalWeight || 0} kg</p>
              <p><strong>Starting:</strong> {item.startingWeight || 0} kg</p>
              <p><strong>Current:</strong> {item.currentWeight || 0} kg</p>
              <p><strong>Change:</strong> {item.change > 0 ? "+" : ""}{item.change || 0} kg</p>
              <p><strong>Total Entries:</strong> {item.totalEntries}</p>

              <div className="admin-progress-history">
                <h4>History</h4>
                {item.progress.length === 0 ? (
                  <p>No entries</p>
                ) : (
                  <ul>
                    {[...item.progress].reverse().map((p) => (
                      <li key={p._id}>
                        {p.date} - {p.weight} kg
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProgress;