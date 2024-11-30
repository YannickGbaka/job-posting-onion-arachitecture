class QuizController {
  constructor(quizUseCases, quizResponseUseCases) {
    this.quizUseCases = quizUseCases;
    this.quizResponseUseCases = quizResponseUseCases;
  }

  async generateQuiz(req, res) {
    try {
      const { jobId, difficulty } = req.body;
      if (!jobId || !difficulty) {
        return res
          .status(400)
          .json({ error: "JobId and difficulty are required" });
      }

      const quiz = await this.quizUseCases.generateQuiz(jobId, difficulty);
      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getQuiz(req, res) {
    try {
      const quiz = await this.quizUseCases.getQuizById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async submitQuizResponse(req, res) {
    try {
      const { quizId } = req.params;
      const { userId, answers } = req.body;

      const response = await this.quizResponseUseCases.submitQuizResponse(
        quizId,
        userId,
        answers
      );

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = QuizController;
