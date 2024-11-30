const { MongoClient, ObjectId } = require("mongodb");
const Quiz = require("../../domain/entities/Quiz");

class MongoQuizRepository {
  constructor(url, dbName, collectionName) {
    this.url = url;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.client = null;
    this.collection = null;
  }

  async connect() {
    if (!this.client) {
      this.client = await MongoClient.connect(this.url);
      const db = this.client.db(this.dbName);
      this.collection = db.collection(this.collectionName);
    }
  }

  async create(quiz) {
    await this.connect();
    const result = await this.collection.insertOne(quiz);
    return { ...quiz, id: result.insertedId };
  }

  async findById(id) {
    await this.connect();
    const quiz = await this.collection.findOne({ _id: new ObjectId(id) });
    return quiz
      ? new Quiz(
          quiz._id,
          quiz.title,
          quiz.description,
          quiz.questions,
          quiz.jobId,
          quiz.difficulty
        )
      : null;
  }

  async findByJobId(jobId) {
    await this.connect();
    const quizzes = await this.collection.find({ jobId }).toArray();
    return quizzes.map(
      (quiz) =>
        new Quiz(
          quiz._id,
          quiz.title,
          quiz.description,
          quiz.questions,
          quiz.jobId,
          quiz.difficulty
        )
    );
  }
}

module.exports = MongoQuizRepository;
