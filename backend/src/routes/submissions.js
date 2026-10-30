const express = require("express");
const Submission = require("../models/Submission");

const router = express.Router();

// ------------------------------------
// GET ALL SUBMISSIONS
// ------------------------------------

router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("assignmentId")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submissions",
      error: error.message,
    });
  }
});

// ------------------------------------
// GET SUBMISSIONS FOR ASSIGNMENT
// ------------------------------------

router.get(
  "/assignment/:assignmentId",
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          assignmentId:
            req.params.assignmentId,
        }).sort({
          submittedAt: -1,
        });

      res.json(submissions);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch assignment submissions",
        error: error.message,
      });
    }
  }
);

// ------------------------------------
// GET SUBMISSIONS FOR STUDENT
// ------------------------------------

router.get(
  "/student/:rollNo",
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          rollNo: req.params.rollNo,
        })
          .populate("assignmentId")
          .sort({
            submittedAt: -1,
          });

      res.json(submissions);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch student submissions",
        error: error.message,
      });
    }
  }
);

// ------------------------------------
// CREATE SUBMISSION
// ------------------------------------

router.post("/", async (req, res) => {
  try {
    const {
      assignmentId,
      studentName,
      rollNo,
      answer,
    } = req.body;

    // Basic validation
    if (!assignmentId) {
      return res.status(400).json({
        message: "Assignment ID is required.",
      });
    }

    if (!studentName) {
      return res.status(400).json({
        message: "Student name is required.",
      });
    }

    if (!rollNo) {
      return res.status(400).json({
        message: "Roll number is required.",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        message: "Answer cannot be empty.",
      });
    }

    const submission =
      await Submission.create({
        assignmentId,
        studentName,
        rollNo,
        answer: answer.trim(),
        submittedAt: new Date(),
        status: "Submitted",
      });

    const populatedSubmission =
      await submission.populate(
        "assignmentId"
      );

    res.status(201).json(
      populatedSubmission
    );
  } catch (error) {
    // Duplicate submission
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already submitted this assignment.",
      });
    }

    console.error(
      "Submission creation error:",
      error
    );

    res.status(400).json({
      message: "Failed to submit assignment.",
      error: error.message,
    });
  }
});

// ------------------------------------
// DELETE SUBMISSION
// ------------------------------------

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const submission =
        await Submission.findByIdAndDelete(
          req.params.id
        );

      if (!submission) {
        return res.status(404).json({
          message: "Submission not found.",
        });
      }

      res.json({
        message:
          "Submission deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to delete submission.",
        error: error.message,
      });
    }
  }
);

// ------------------------------------
// GRADE SUBMISSION
// ------------------------------------
router.put("/:id/grade", async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        marks: Number(marks),
        feedback: feedback || "",
        status: "Graded",
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to grade submission.", error: error.message });
  }
});

module.exports = router;