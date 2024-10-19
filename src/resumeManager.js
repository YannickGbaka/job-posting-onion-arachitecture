import * as fs from "fs/promises";
import * as path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const CV_DIRECTORY = path.join("src", "public", "cv");

async function getAllResumes() {
  try {
    const files = await fs.readdir(CV_DIRECTORY);
    return files.filter(
      (file) =>
        file.toLowerCase().endsWith(".pdf") ||
        file.toLowerCase().endsWith(".docx")
    );
  } catch (error) {
    console.error("Error reading CV directory:", error);
    return [];
  }
}

async function readResume(fileName) {
  const filePath = path.join(CV_DIRECTORY, fileName);
  const fileExtension = path.extname(fileName).toLowerCase();

  try {
    if (fileExtension === ".pdf") {
      return await readPdf(filePath);
    } else if (fileExtension === ".docx") {
      return await readWord(filePath);
    } else {
      throw new Error("Unsupported file format");
    }
  } catch (error) {
    console.error(`Error reading resume ${fileName}:`, error);
    return null;
  }
}

async function readPdf(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

async function readWord(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

export { getAllResumes, readResume };
