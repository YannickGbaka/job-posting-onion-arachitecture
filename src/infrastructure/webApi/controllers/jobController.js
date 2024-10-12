class JobController {
  constructor(jobUseCases) {
    this.jobUseCases = jobUseCases;
  }

  async createJob(req, res) {
    try {
      const jobData = req.body;
      const newJob = await this.jobUseCases.createJob(jobData);
      res.status(201).json(newJob);
    } catch (error) {
      res.status(500).json({ error: "Error creating job" });
    }
  }

  async getJobById(req, res) {
    try {
      const { id } = req.params;
      const job = await this.jobUseCases.getJobById(id);
      if (job) {
        res.json(job);
      } else {
        res.status(404).json({ error: "Job not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching job" });
    }
  }

  async getAllJobs(req, res) {
    try {
      const jobs = await this.jobUseCases.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching jobs" });
    }
  }

  async updateJob(req, res) {
    try {
      const { id } = req.params;
      const jobData = req.body;
      const updated = await this.jobUseCases.updateJob(id, jobData);
      if (updated) {
        res.json({ message: "Job updated successfully" });
      } else {
        res.status(404).json({ error: "Job not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error updating job" });
    }
  }

  async deleteJob(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.jobUseCases.deleteJob(id);
      if (deleted) {
        res.json({ message: "Job deleted successfully" });
      } else {
        res.status(404).json({ error: "Job not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting job" });
    }
  }
}

module.exports = JobController;
