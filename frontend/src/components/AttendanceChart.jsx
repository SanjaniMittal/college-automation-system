function AttendanceChart({ data = [] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 100);

  return (
    <div className="attendance-chart">
      <div className="chart-header">
        <div>
          <h3>Attendance Overview</h3>
          <p>Attendance percentage by subject</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="chart-empty">
          No attendance data available
        </div>
      ) : (
        <div className="chart-bars">
          {data.map((item) => {
            const height = (item.value / maxValue) * 100;

            return (
              <div className="chart-column" key={item.label}>
                <span className="chart-value">
                  {item.value}%
                </span>

                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>

                <span className="chart-label">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AttendanceChart;