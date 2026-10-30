const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Academic",
        "Examination",
        "Holiday",
        "Meeting",
        "Event",
        "General",
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    audience: {
      type: String,
      enum: [
        "All Students",
        "All Students & Faculty",
        "CSE Students",
        "Faculty",
      ],
      required: true,
    },
    author: {
      type: String,
      default: "Academic Office",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);