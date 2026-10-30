const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for the same
// student + course + day
attendanceSchema.index(
  {
    rollNo: 1,
    course: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);