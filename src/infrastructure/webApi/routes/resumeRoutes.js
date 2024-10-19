const express = require("express");
const ResumeController = require("../controllers/ResumeController.js");
const GetAllResumesUseCase = require("../../../application/useCase/GetAllResumesUseCase.js");
const FindMatchingResumesUseCase = require("../../../application/useCase/FindMatchingResumesUseCase.js");
const VectorizeCVUseCase = require("../../../application/useCase/VectorizeCVUseCase.js");
const FileSystemResumeRepository = require("../../persistence/FileSystemResumeRepository.js");
const OllamaServiceImpl = require("../../ai/OllamaServiceImpl.js");
const JobUseCases = require("../../../application/useCases/jobUseCases");

const router = express.Router();

module.exports = (resumeController, jobRepository) => {
  const resumeRepository = new FileSystemResumeRepository();
  const ollamaService = new OllamaServiceImpl();
  const getAllResumesUseCase = new GetAllResumesUseCase(resumeRepository);

  const jobUseCases = new JobUseCases(jobRepository);

  const findMatchingResumesUseCase = new FindMatchingResumesUseCase(
    resumeRepository
  );
  const vectorizeCVUseCase = new VectorizeCVUseCase(
    resumeRepository,
    ollamaService
  );

  router.get("/", (req, res) => resumeController.getAllResumes(req, res));
  router.post("/match", (req, res) =>
    resumeController.findMatchingResumes(req, res)
  );
  router.post("/vectorize", (req, res) =>
    resumeController.vectorizeCV(req, res)
  );

  return router;
};
