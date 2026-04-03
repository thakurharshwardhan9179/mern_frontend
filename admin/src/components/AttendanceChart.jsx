const AttendanceChart = ({ data = [] }) => {
    const grouped = {};
  
    data.forEach((item) => {
      if (!grouped[item.date]) grouped[item.date] = 0;
      grouped[item.date]++;
    });
  
    return (
      <div style={{ marginBottom: "20px" }}>
        <h3>📈 Attendance Trend</h3>
  
        {Object.entries(grouped).map(([date, count]) => (
          <div key={date} style={{ marginBottom: "10px" }}>
            <span>{date}</span>
            <div
              style={{
                height: "10px",
                width: `${count * 20}px`,
                background: "#4caf50",
                marginTop: "5px",
                borderRadius: "5px"
              }}
            ></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default AttendanceChart;