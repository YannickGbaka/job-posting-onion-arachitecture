const express = require("express");
const JobController = require("../controllers/jobController");

function jobRoutes(jobController) {
  const router = express.Router();

  router.post("/", jobController.createJob.bind(jobController));
  router.get("/", jobController.getAllJobs.bind(jobController));
  router.get("/:id", jobController.getJobById.bind(jobController));
  router.put("/:id", jobController.updateJob.bind(jobController));
  router.delete("/:id", jobController.deleteJob.bind(jobController));

  return router;
}

module.exports = jobRoutes;
