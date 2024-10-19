const OllamaService = require("../../domain/services/OllamaService");
const Resume = require("../../domain/resume/Resume");

class VectorizeCVUseCase {
  constructor(resumeRepository, ollamaService) {
    this.resumeRepository = resumeRepository;
    this.ollamaService = ollamaService;
  }

  async execute(fileName, jobOfferKeywords) {
    const content = await this.resumeRepository.getResumeContent(fileName);

    if (!content) {
      throw new Error("Resume not found or couldn't be read");
    }

    const resume = new Resume(null, fileName, content);

    const vector = this.vectorize(resume.content, jobOfferKeywords);
    const contactInfo = await this.extractContactInfo(resume.content);
    const analysis = await this.ollamaService.processFile(
      resume.fileName,
      "Analyze this CV and provide a summary of the candidate's skills and experience."
    );

    return {
      ...resume,
      vector,
      contactInfo,
      aiAnalysis: analysis,
    };
  }

  vectorize(content, keywords) {
    const lowerContent = content.toLowerCase();
    return keywords.map((keyword) => {
      const regex = new RegExp(`\\b${this.escapeRegExp(keyword)}\\w*\\b`, "gi");
      return (lowerContent.match(regex) || []).length;
    });
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  async extractContactInfo(content) {
    const prompt = `Extract contact information (phone and email) from this CV. Respond only with a JSON object containing the keys "phone" and "email". If information is not found, set null for that key.

    CV content:
    ${content}`;

    try {
      const response = await this.ollamaService.generateResponse(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error("Error extracting contact info using AI:", error);
      return this.extractContactInfoRegex(content);
    }
  }

  extractContactInfoRegex(content) {
    const phoneRegex =
      /(?:(?:\+|00)(?:33|225)|0)\s*[1-9](?:(?:[\s.-]*\d{2}){4}|\d{2}(?:[\s.-]*\d{3}){2})/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    const phoneMatches = content.match(phoneRegex);
    const emailMatches = content.match(emailRegex);

    let phone = null;
    if (phoneMatches) {
      phone = phoneMatches[0].replace(/\s+/g, "").replace(/^00/, "+");
      if (phone.startsWith("0")) {
        // Check if it's a Côte d'Ivoire number (8 digits after the leading 0)
        if (phone.length === 10) {
          phone = "+225" + phone.slice(1);
        } else {
          phone = "+33" + phone.slice(1);
        }
      }
    }

    return {
      phone: phone,
      email: emailMatches ? emailMatches[0] : null,
    };
  }
}

module.exports = VectorizeCVUseCase;
