class ResumeController {
  constructor(getAllResumesUseCase) {
    this.getAllResumesUseCase = getAllResumesUseCase;
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
}

module.exports = ResumeController;
