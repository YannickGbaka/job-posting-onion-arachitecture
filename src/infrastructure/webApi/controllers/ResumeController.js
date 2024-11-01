class ResumeController {
  constructor(
    getAllResumesUseCase,
    findMatchingResumesUseCase,
    vectorizeCVUseCase,
    JobUseCases
  ) {
    this.getAllResumesUseCase = getAllResumesUseCase;
    this.findMatchingResumesUseCase = findMatchingResumesUseCase;
    this.vectorizeCVUseCase = vectorizeCVUseCase;
    this.jobUseCases = JobUseCases;
  }

  async getAllResumes(req, res) {
    try {
      const resumes = await this.getAllResumesUseCase.execute();
      res.json(resumes);
    } catch (error) {
      console.error("Error in getAllResumes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async findMatchingResumes(req, res) {
    try {
      const { jobOfferId } = req.body;
      if (!jobOfferId) {
        return res.status(400).json({ error: "Job offer ID is required" });
      }

      const job = await this.jobUseCases.getJobById(jobOfferId);
      if (!job) {
        return res.status(404).json({ error: "Job offer not found" });
      }
      const jobOfferText = `${job.description} - ${job.requirements}`;
      console.log(jobOfferText);
      const matchingResumes = await this.findMatchingResumesUseCase.execute(
        jobOfferText
      );
      res.json(matchingResumes);
    } catch (error) {
      console.error("Error in findMatchingResumes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async vectorizeCV(req, res) {
    try {
      const { resumePath, keywords } = req.body;
      if (!(resumePath, keywords)) {
        return res
          .status(400)
          .json({ error: "Resume ID and job offer keywords are required" });
      }
      const vectorizedCV = await this.vectorizeCVUseCase.execute(
        resumePath,
        keywords
      );
      res.json(vectorizedCV);
    } catch (error) {
      console.error("Error in vectorizeCV:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = ResumeController;
