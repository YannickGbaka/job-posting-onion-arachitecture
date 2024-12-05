const { MongoClient, ObjectId } = require("mongodb");
const Application = require("../../domain/entities/Application");
const { User } = require("../../domain/entities/User");

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
        userId: application.userId,
        jobId: application.jobId,
        resumeFile: application.resumeFile,
        coverLetter: application.coverLetter,
        status: application.status,
        score: application.score,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      });

      const db = this.client.db(this.dbName);
      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({
        _id: new ObjectId(application.userId),
      });

      return {
        ...application,
        id: result.insertedId,
        user: user
          ? {
              id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
            }
          : null,
      };
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

    if (!application) {
      return null;
    }

    const db = this.client.db(this.dbName);
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(application.userId),
    });

    const enrichedApplication = {
      ...application,
      user: user
        ? {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
          }
        : null,
    };

    return new Application(enrichedApplication);
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
    const db = this.client.db(this.dbName);
    const usersCollection = db.collection("users");

    const applications = await this.collection.find().toArray();

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const user = await usersCollection.findOne({
          _id: new ObjectId(app.userId),
        });
        return {
          ...app,
          user: user
            ? {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
              }
            : null,
        };
      })
    );

    return enrichedApplications;
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
