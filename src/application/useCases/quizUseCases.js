class QuizUseCases {
  constructor(quizRepository, jobRepository, ollamaService) {
    this.quizRepository = quizRepository;
    this.jobRepository = jobRepository;
    this.ollamaService = ollamaService;
  }

  async generateQuiz(jobId, difficulty) {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const prompt = `Generate a technical quiz for a ${job.title} position. 
    Difficulty level: ${difficulty}
    Job description: ${job.description}
    Requirements: ${job.requirements}
    
    Format the response as a JSON object with the following structure:
    {
      "title": "Quiz title",
      "description": "Brief description of the quiz",
      "questions": [
        {
          "id": "1",
          "question": "Question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "correct option index (0-3)"
        }
      ]
    }
    
    Generate 5 questions that test the key skills required for this position. After generating the json stops there, please do not add any additional text`;

    const response = await this.ollamaService.generateResponse(prompt);
    console.log(response);
    const quizData = JSON.parse(response);

    const quiz = {
      title: quizData.title,
      description: quizData.description,
      questions: quizData.questions,
      jobId,
      difficulty,
    };

    return this.quizRepository.create(quiz);
  }

  async getQuizById(id) {
    return this.quizRepository.findById(id);
  }

  async getQuizzesByJobId(jobId) {
    return this.quizRepository.findByJobId(jobId);
  }
}

module.exports = QuizUseCases;
