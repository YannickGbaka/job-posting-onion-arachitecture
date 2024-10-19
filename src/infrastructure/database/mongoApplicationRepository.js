const Application = require("../../domain/entities/Application");
const { MongoClient, ObjectId } = require("mongodb");

class MongoApplicationRepository {
  constructor(url, dbName, collectionName) {
    this.url = url;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.client = null;
    this.collection = null;
  }

  async connect() {
    this.client = await MongoClient.connect(this.url);
    const db = this.client.db(this.dbName);
    this.collection = db.collection(this.collectionName);
  }

  async create(application) {
    const result = await this.collection.insertOne(application);
    return { ...application, id: result.insertedId };
  }

  async findById(id) {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    return result ? new Application(result) : null;
  }

  async findByUserId(userId) {
    const results = await this.collection.find({ userId }).toArray();
    return results.map((result) => new Application(result));
  }

  async findAll() {
    const results = await this.collection.find().toArray();
    return results.map((result) => new Application(result));
  }

  async update(id, application) {
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: application }
    );
    return application;
  }

  async delete(id) {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = MongoApplicationRepository;
