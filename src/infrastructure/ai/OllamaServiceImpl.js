const { AxiosService } = require("coddyger");
const fs = require("fs").promises;
const dotenv = require("dotenv");

dotenv.config();

const OllamaService = require("../../domain/services/OllamaService");

class OllamaServiceImpl extends OllamaService {
  constructor() {
    super();
    const ollamaEndpoint =
      process.env.OLLAMA_ENDPOINT || "http://localhost:11434/api";
    this.axiosService = AxiosService.connect(ollamaEndpoint);
  }

  async generateResponse(prompt, model = "llama3.2:latest") {
    try {
      const response = await this.axiosService.post("/generate", {
        model: model,
        prompt: prompt,
        stream: false,
      });

      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        throw new Error("Unexpected response format from Ollama");
      }
    } catch (error) {
      console.error("Error generating response from Ollama:", error);
      throw error;
    }
  }

  async listModels() {
    try {
      const response = await this.axiosService.get("/tags");
      if (response.data && Array.isArray(response.data.models)) {
        return response.data.models.map((model) => model.name);
      } else {
        throw new Error("Unexpected response format from Ollama");
      }
    } catch (error) {
      console.error("Error listing models from Ollama:", error);
      throw error;
    }
  }

  async processFile(filePath, prompt, model = "llama3.2:latest") {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const fullPrompt = `${prompt}\n\nFile content:\n${fileContent}`;

      return await this.generateResponse(fullPrompt, model);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
      throw error;
    }
  }
}

module.exports = OllamaServiceImpl;
