const { MongoClient, ObjectId } = require("mongodb");
const Application = require("../../domain/entities/Application");

class MongoApplicationRepository {
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

  async create(application) {
    try {
      await this.connect();
      const result = await this.collection.insertOne({
        id: application.id,
        userId: application.userId,
        jobId: application.jobId,
        resumeFile: application.resumeFile,
        coverLetter: application.coverLetter,
        status: application.status,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      });
      return { ...application, id: result.insertedId };
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  }

  async findByUserId(userId) {
    await this.connect();
    const applications = await this.collection.find({ userId }).toArray();
    return applications.map((app) => new Application(app));
  }

  async findById(id) {
    await this.connect();
    const application = await this.collection.findOne({
      _id: new ObjectId(id),
    });
    return application ? new Application(application) : null;
  }

  async update(id, application) {
    await this.connect();
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: application.status,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async findAll() {
    await this.connect();
    const applications = await this.collection.find().toArray();
    return applications.map((app) => new Application(app));
  }

  async delete(id) {
    try {
      await this.collection.deleteOne({ _id: new ObjectId(id) });
      return true;
    } catch (error) {
      throw new Error(`Error deleting application: ${error.message}`);
    }
  }
}

module.exports = MongoApplicationRepository;
