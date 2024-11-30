const { MongoClient, ObjectId } = require("mongodb");
const QuizResponse = require("../../domain/entities/QuizResponse");

class MongoQuizResponseRepository {
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

  async create(quizResponse) {
    await this.connect();
    const result = await this.collection.insertOne(quizResponse);
    return { ...quizResponse, id: result.insertedId };
  }

  async findByQuizAndUser(quizId, userId) {
    await this.connect();
    const response = await this.collection.findOne({ quizId, userId });
    return response
      ? new QuizResponse(
          response._id,
          response.quizId,
          response.userId,
          response.answers,
          response.score,
          response.completedAt
        )
      : null;
  }
}

module.exports = MongoQuizResponseRepository;
