class ApplicationController {
  constructor(applicationUseCases) {
    this.applicationUseCases = applicationUseCases;
  }

  async applyForJob(req, res) {
    try {
      const { userId, jobId, resumeFile, coverLetter } = req.body;
      const application = await this.applicationUseCases.createApplication({
        userId,
        jobId,
        resumeFile,
        coverLetter,
      });
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserApplications(req, res) {
    try {
      const { userId } = req.params;
      const applications = await this.applicationUseCases.getUserApplications(
        userId
      );
      res.status(200).json(applications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedApplication =
        await this.applicationUseCases.updateApplicationStatus(id, status);
      res.status(200).json(updatedApplication);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ApplicationController;
