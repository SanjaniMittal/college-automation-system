const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});

// GET students by class
router.get("/class/:className", async (req, res) => {
  try {
    const students = await Student.find({
      className: req.params.className,
      status: "Active",
    }).sort({
      rollNo: 1,
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch class students",
      error: error.message,
    });
  }
});

// GET student by roll number
router.get("/roll/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({
      rollNo: req.params.rollNo,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student",
      error: error.message,
    });
  }
});

// CREATE student
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create student",
      error: error.message,
    });
  }
});

// UPDATE student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
});

// DELETE student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
});

module.exports = router;