const express = require("express");
const Assignment = require("../models/Assignment");

const router = express.Router();

// GET all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({
      dueDate: 1,
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments",
      error: error.message,
    });
  }
});

// CREATE assignment
router.post("/", async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);

    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create assignment",
      error: error.message,
    });
  }
});

// UPDATE assignment
router.put("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.json(assignment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update assignment",
      error: error.message,
    });
  }
});

// DELETE assignment
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(
      req.params.id
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete assignment",
      error: error.message,
    });
  }
});

module.exports = router;