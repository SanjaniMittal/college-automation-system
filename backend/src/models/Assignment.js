const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);