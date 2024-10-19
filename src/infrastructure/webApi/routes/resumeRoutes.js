const express = require("express");
const ResumeController = require("../controllers/ResumeController.js");
const GetAllResumesUseCase = require("../../../application/useCases/ResumesUseCases.js");
const FileSystemResumeRepository = require("../../persistence/FileSystemResumeRepository.js");

const router = express.Router();

const resumeRepository = new FileSystemResumeRepository();
const getAllResumesUseCase = new GetAllResumesUseCase(resumeRepository);
const resumeController = new ResumeController(getAllResumesUseCase);

router.get("/", (req, res) => resumeController.getAllResumes(req, res));

module.exports = router;
