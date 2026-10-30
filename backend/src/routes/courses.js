const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});

// POST a new course
router.post("/", async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
});

// PUT update a course
router.put("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
});

// DELETE a course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
    });
  }
});

module.exports = router;