const express = require("express");
const Timetable = require("../models/Timetable");

const router = express.Router();

// GET all timetable entries or filter by className or day
router.get("/", async (req, res) => {
  try {
    const { className, day } = req.query;
    const filter = {};
    if (className) filter.className = className;
    if (day) filter.day = day;

    const timetable = await Timetable.find(filter).sort({ day: 1, time: 1 });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch timetable", error: error.message });
  }
});

// POST a new timetable entry
router.post("/", async (req, res) => {
  try {
    const entry = await Timetable.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: "Failed to create timetable entry", error: error.message });
  }
});

// DELETE a timetable entry
router.delete("/:id", async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Timetable entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete entry", error: error.message });
  }
});

module.exports = router;
