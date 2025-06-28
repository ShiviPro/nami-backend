const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      enum: [
        "Full-time (On-site)",
        "Part-time (On-site)",
        "Full-time (Remote)",
        "Part-time (Remote)",
      ],
      required: true,
    },
    description: String,
    reqQualifications: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
