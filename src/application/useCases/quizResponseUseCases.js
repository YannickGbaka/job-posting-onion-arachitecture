class QuizResponseUseCases {
  constructor(quizResponseRepository, quizRepository) {
    this.quizResponseRepository = quizResponseRepository;
    this.quizRepository = quizRepository;
  }

  async submitQuizResponse(quizId, userId, answers) {
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Calculate score
    let score = 0;
    const totalQuestions = quiz.questions.length;

    answers.forEach((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    });

    const scorePercentage = (score / totalQuestions) * 100;

    const quizResponse = {
      quizId,
      userId,
      answers,
      score: scorePercentage,
      completedAt: new Date(),
    };

    return this.quizResponseRepository.create(quizResponse);
  }

  async getUserQuizResponse(quizId, userId) {
    return this.quizResponseRepository.findByQuizAndUser(quizId, userId);
  }
}

module.exports = QuizResponseUseCases;
