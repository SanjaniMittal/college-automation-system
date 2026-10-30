const express = require("express");
const Faculty = require("../models/Faculty");

const router = express.Router();

// GET all faculty
router.get("/", async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch faculty",
    });
  }
});

// POST a new faculty member
router.post("/", async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create faculty",
      error: error.message,
    });
  }
});

// PUT update a faculty member
router.put("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty member not found",
      });
    }

    res.json(faculty);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update faculty",
      error: error.message,
    });
  }
});

// DELETE a faculty member
router.delete("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty member not found",
      });
    }

    res.json({
      message: "Faculty member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete faculty",
      error: error.message,
    });
  }
});

module.exports = router;