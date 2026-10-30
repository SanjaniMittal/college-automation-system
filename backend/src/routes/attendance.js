const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// Get all attendance records
router.get("/", async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create attendance record
router.post("/", async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update attendance record
router.put("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete attendance record
router.delete("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;