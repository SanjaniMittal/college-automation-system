const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const facultyRoutes = require("./routes/faculty");
const courseRoutes = require("./routes/courses");
const attendanceRoutes = require("./routes/attendance");
const noticeRoutes = require("./routes/notices");
const submissionRoutes = require("./routes/submissions");
const assignmentRoutes = require("./routes/assignments");
const timetableRoutes = require("./routes/timetable");
const statsRoutes = require("./routes/stats");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/stats", statsRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Health check / Root Route
app.get("/", (req, res) => {
  res.json({
    name: "Acadexa College Automation API",
    status: "Healthy",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      students: "/api/students",
      faculty: "/api/faculty",
      courses: "/api/courses",
      attendance: "/api/attendance",
      notices: "/api/notices",
      assignments: "/api/assignments",
      submissions: "/api/submissions",
      timetable: "/api/timetable",
      stats: "/api/stats",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Acadexa API server running on http://localhost:${PORT}`);
});