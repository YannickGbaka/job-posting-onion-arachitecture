const fs = require("fs/promises");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../../domain/resume/Resume.js");
const ResumeRepository = require("../../domain/resume/ResumeRepository.js");

const CV_DIRECTORY = path.join("src", "public", "cv");

class FileSystemResumeRepository extends ResumeRepository {
  async getAllResumes() {
    try {
      const files = await fs.readdir(CV_DIRECTORY);
      const resumePromises = files
        .filter(
          (file) =>
            file.toLowerCase().endsWith(".pdf") ||
            file.toLowerCase().endsWith(".docx")
        )
        .map(async (fileName, index) => {
          const content = await this.getResumeContent(fileName);
          return new Resume(index + 1, fileName, content);
        });

      return Promise.all(resumePromises);
    } catch (error) {
      console.error("Error reading CV directory:", error);
      return [];
    }
  }

  async getResumeById(id) {
    const resumes = await this.getAllResumes();
    return resumes.find((resume) => resume.id === id) || null;
  }

  async getResumeContent(fileName) {
    const filePath = path.join(CV_DIRECTORY, fileName);
    const fileExtension = path.extname(fileName).toLowerCase();

    try {
      if (fileExtension === ".pdf") {
        return await this._readPdf(filePath);
      } else if (fileExtension === ".docx") {
        return await this._readWord(filePath);
      } else {
        throw new Error("Unsupported file format");
      }
    } catch (error) {
      console.error(`Error reading resume ${fileName}:`, error);
      return null;
    }
  }

  async _readPdf(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async _readWord(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
}

module.exports = FileSystemResumeRepository;
