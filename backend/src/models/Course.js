const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    faculty: {
      type: String,
      required: true,
      trim: true,
    },

    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);