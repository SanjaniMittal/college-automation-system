const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
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
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    marks: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Submitted", "Graded"],
      default: "Submitted",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submission per student per assignment
submissionSchema.index(
  {
    assignmentId: 1,
    rollNo: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);