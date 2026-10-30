import { useEffect, useState } from "react";
import { Clock, MapPin, Filter } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Timetable() {
  const [selectedDay, setSelectedDay] = useState("All");
  const [timetableDays, setTimetableDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultSchedule = [
    {
      day: "Monday",
      classes: [
        { time: "09:00 AM - 10:00 AM", subject: "Data Structures", faculty: "Dr. Rahul Sharma", room: "Room 201" },
        { time: "11:00 AM - 12:00 PM", subject: "Database Management", faculty: "Dr. Neha Kapoor", room: "Lab 102" },
        { time: "02:00 PM - 03:00 PM", subject: "Computer Networks", faculty: "Prof. Amit Kumar", room: "Room 305" },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        { time: "09:00 AM - 10:00 AM", subject: "Operating Systems", faculty: "Prof. Priya Singh", room: "Room 202" },
        { time: "11:00 AM - 12:00 PM", subject: "Software Engineering", faculty: "Dr. Rahul Sharma", room: "Room 301" },
      ],
    },
    {
      day: "Wednesday",
      classes: [
        { time: "10:00 AM - 12:00 PM", subject: "Data Structures Lab", faculty: "Dr. Rahul Sharma", room: "Lab 101" },
        { time: "01:00 PM - 03:00 PM", subject: "Database Management Lab", faculty: "Dr. Neha Kapoor", room: "Lab 102" },
      ],
    },
    {
      day: "Thursday",
      classes: [
        { time: "09:00 AM - 10:00 AM", subject: "Computer Networks", faculty: "Prof. Amit Kumar", room: "Room 305" },
        { time: "11:00 AM - 12:00 PM", subject: "Operating Systems", faculty: "Prof. Priya Singh", room: "Room 202" },
      ],
    },
    {
      day: "Friday",
      classes: [
        { time: "10:00 AM - 11:00 AM", subject: "Software Engineering", faculty: "Dr. Rahul Sharma", room: "Room 301" },
        { time: "12:00 PM - 02:00 PM", subject: "Computer Networks Lab", faculty: "Prof. Amit Kumar", room: "Lab 104" },
      ],
    },
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/timetable?className=CSE-A`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // Group by day
            const daysMap = {};
            data.forEach((item) => {
              if (!daysMap[item.day]) daysMap[item.day] = [];
              daysMap[item.day].push(item);
            });
            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const formatted = daysOrder
              .filter((day) => daysMap[day])
              .map((day) => ({
                day,
                classes: daysMap[day],
              }));
            setTimetableDays(formatted);
          } else {
            setTimetableDays(defaultSchedule);
          }
        } else {
          setTimetableDays(defaultSchedule);
        }
      } catch (err) {
        console.warn("Using default timetable:", err);
        setTimetableDays(defaultSchedule);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const filteredDays =
    selectedDay === "All"
      ? timetableDays
      : timetableDays.filter((d) => d.day === selectedDay);

  const daysList = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <DashboardLayout>
      <PageHeader
        title="Class Timetable"
        description="Weekly academic timetable and scheduled lecture halls for CSE-A."
      />

      <div className="content-card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <Filter size={18} color="#6366f1" />
          <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Filter by Day:</span>
          {daysList.map((day) => (
            <button
              key={day}
              type="button"
              className={selectedDay === day ? "admin-primary-button" : "admin-secondary-button"}
              onClick={() => setSelectedDay(day)}
              style={{ padding: "6px 14px", fontSize: "0.85rem" }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="timetable-grid">
        {filteredDays.map((day) => (
          <div className="timetable-day" key={day.day}>
            <div className="timetable-day-header">
              <h2>{day.day}</h2>
              <span>{day.classes.length} classes</span>
            </div>

            <div className="timetable-classes">
              {day.classes.map((item, index) => (
                <div className="timetable-class" key={`${day.day}-${index}`}>
                  <h3>{item.subject}</h3>

                  <div className="timetable-detail">
                    <Clock size={14} />
                    <span>{item.time}</span>
                  </div>

                  <div className="timetable-detail">
                    <MapPin size={14} />
                    <span>{item.room}</span>
                  </div>

                  <p>{item.faculty}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Timetable;