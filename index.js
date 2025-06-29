const { initialiseDatabase } = require("./db/db.connect");
const Job = require("./models/job.models");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

initialiseDatabase();

// The following code was used for seeding i.e. adding data in bulk in the initial phase. I've left it here, so that it can be looked at & reviewed, if deemed necessary by the team.
/*
const fs = require("fs");
const jobsData = JSON.parse(fs.readFileSync("./jobs.json", "utf-8"));

const seedJobs = async () => {
  try {
    for (const jobData of jobsData) {
      const newJob = new Job(jobData);
      await newJob.save();
    }
    console.log("Jobs seeded successfully.");
  } catch (error) {
    console.log("Error seeding jobs:", error);
  }
};

seedJobs();
*/

const readAllJobs = async () => {
  try {
    const allJobs = await Job.find();
    return allJobs;
  } catch (error) {
    throw error;
  }
};

app.get("/jobs", async (req, res) => {
  try {
    const allJobs = await readAllJobs();
    if (allJobs && allJobs.length > 0) {
      res.send(JSON.stringify(allJobs));
    } else {
      res.status(404).send(JSON.stringify({ message: "No Jobs Found!" }));
    }
  } catch (error) {
    res
      .status(500)
      .send(
        JSON.stringify({ message: "An error occurred while fetching jobs" })
      );
  }
});

const readJobById = async (jobId) => {
  try {
    const requiredJob = await Job.findOne({ _id: jobId });
    return requiredJob;
  } catch (error) {
    throw error;
  }
};

app.get("/jobs/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const requestedJob = await readJobById(jobId);
    if (requestedJob) {
      res.status(200).send(JSON.stringify(requestedJob));
    } else {
      res
        .status(404)
        .send(
          JSON.stringify({ message: `Job with Id ${jobId} was Not Found!` })
        );
    }
  } catch (error) {
    res
      .status(500)
      .send(
        JSON.stringify({ message: "An error occurred while fetching the job" })
      );
  }
});

const readJobByTitle = async (jobTitle) => {
  try {
    const requiredJob = await Job.findOne({ title: jobTitle });
    return requiredJob;
  } catch (error) {
    throw error;
  }
};

app.get("/jobs/title/:jobTitle", async (req, res) => {
  try {
    const jobTitle = req.params.jobTitle;
    const requestedJob = await readJobByTitle(jobTitle);
    if (requestedJob) {
      res.status(200).send(JSON.stringify(requestedJob));
    } else {
      res
        .status(404)
        .send(
          JSON.stringify({
            message: `Job with title ${jobTitle} was Not Found!`,
          })
        );
    }
  } catch (error) {
    res
      .status(500)
      .send(
        JSON.stringify({ message: "An error occurred while fetching the job" })
      );
  }
});

const createNewJob = async (jobData) => {
  try {
    const newJob = new Job(jobData);
    const savedJob = await newJob.save();
    console.log("Added the following Job into DB:", savedJob);
    return savedJob;
  } catch (error) {
    throw error;
  }
};

app.post("/jobs", async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = await createNewJob(jobData);
    res.status(200).send(JSON.stringify(newJob));
  } catch (error) {
    res.status(400).send(
      JSON.stringify({
        message:
          "Please provide the data in correct format: Job Title, Company Name, Location, Salary, Job Type, & Required Qualifications are all mandatory!",
      })
    );
  }
});

const deleteJobById = async (jobId) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);
    console.log("Deleted the following Job from DB:", deletedJob);
    return deletedJob;
  } catch (error) {
    throw error;
  }
};

app.delete("/jobs/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const deletedJob = await deleteJobById(jobId);
    if (deletedJob) {
      res.status(200).send(JSON.stringify(deletedJob));
    } else {
      res
        .status(404)
        .send(
          JSON.stringify({ message: `No Job with id ${jobId} was found!` })
        );
    }
  } catch (error) {
    res
      .status(500)
      .send(
        JSON.stringify({ message: "An error occurred while deleting Job!" })
      );
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Successfully started server on port ${PORT}`);
});
