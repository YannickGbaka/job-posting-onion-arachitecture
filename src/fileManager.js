import * as fs from "fs/promises";
import mammoth from "mammoth";
import * as path from "path";
import pdf from "pdf-parse";

async function extractFiles(filePath) {
  const directoryPath = path.dirname(filePath);
  const files = await fs.readdir(directoryPath);
  return files;
}

async function readPdf(filepath) {
  const dataBuffer = await fs.readFile(filepath);
  const data = await pdf(dataBuffer);
  return data.text;
}

async function readWord(filePath) {
  const result = await mammoth.extractRawText({ path: filepath });
  return result.value;
}

async function readTextFile(filePath) {
  return await fs.readFile(filePath, "utf-8");
}
