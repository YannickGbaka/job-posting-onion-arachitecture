class QuizResponse {
  constructor(id, quizId, userId, answers, score, completedAt = new Date()) {
    this.id = id;
    this.quizId = quizId;
    this.userId = userId;
    this.answers = answers; // Array of {questionId, selectedAnswer}
    this.score = score;
    this.completedAt = completedAt;
  }
}

module.exports = QuizResponse;
