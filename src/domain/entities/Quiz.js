class Quiz {
  constructor(id, title, description, questions, jobId, difficulty) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.questions = questions; // Array of Question objects
    this.jobId = jobId;
    this.difficulty = difficulty; // 'easy', 'medium', 'hard'
    this.createdAt = new Date();
  }
}

module.exports = Quiz;
