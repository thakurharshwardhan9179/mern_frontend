import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import "./Progress.css";

const Progress = () => {
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const res = await API.get("/progress/my");
      setList(res.data.progress || []);
      setGoalWeight(res.data.goalWeight || 0);
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to load progress");
    }
  };

  const addProgress = async () => {
    try {
      if (!weight) {
        setMsg("Please enter weight");
        return;
      }

      await API.post("/progress/add", { weight: Number(weight) });
      setWeight("");
      setMsg("Progress added successfully");
      load();
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to add progress");
    }
  };

  const saveGoal = async () => {
    try {
      if (goalWeight === "" || goalWeight === null) {
        setMsg("Please enter goal weight");
        return;
      }

      await API.put("/progress/goal", { goalWeight: Number(goalWeight) });
      setMsg("Goal weight saved successfully");
      load();
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to save goal");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [list]);

  const startingWeight = sortedList.length ? Number(sortedList[0].weight) : 0;
  const currentWeight = sortedList.length
    ? Number(sortedList[sortedList.length - 1].weight)
    : 0;
  const change = sortedList.length ? currentWeight - startingWeight : 0;

  const goalDiff =
    goalWeight !== "" && currentWeight
      ? currentWeight - Number(goalWeight)
      : null;

  return (
    <div className="progress-container">
      <div className="progress-box">
        <h2>🏋️ My Progress</h2>

        <div className="progress-stats">
          <div className="stat-card">
            <span>Starting Weight</span>
            <strong>{startingWeight || 0} kg</strong>
          </div>

          <div className="stat-card">
            <span>Current Weight</span>
            <strong>{currentWeight || 0} kg</strong>
          </div>

          <div className="stat-card">
            <span>Total Change</span>
            <strong>{sortedList.length ? `${change > 0 ? "+" : ""}${change} kg` : "0 kg"}</strong>
          </div>
        </div>

        <div className="progress-form">
          <input
            type="number"
            placeholder="Enter current weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="progress-input"
          />
          <button onClick={addProgress} className="progress-btn">
            Add Progress
          </button>
        </div>

        <div className="goal-box">
          <h3>🎯 Goal Weight</h3>

          <div className="goal-row">
            <input
              type="number"
              placeholder="Set goal weight (kg)"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              className="progress-input"
            />
            <button onClick={saveGoal} className="goal-btn">
              Save Goal
            </button>
          </div>

          {goalDiff !== null && (
            <p className="goal-text">
              {goalDiff > 0
                ? `${goalDiff} kg more to go`
                : goalDiff < 0
                ? `${Math.abs(goalDiff)} kg below goal`
                : "Goal achieved 🎉"}
            </p>
          )}
        </div>

        {msg && <p className="progress-msg">{msg}</p>}

        <div className="history-box">
          <h3>📅 Progress History</h3>

          {sortedList.length === 0 ? (
            <p>No progress added yet</p>
          ) : (
            <ul className="progress-list">
              {[...sortedList].reverse().map((item) => (
                <li key={item._id}>
                  <span>{item.date}</span>
                  <strong>{item.weight} kg</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;