const PhoneInterview = require("../../domain/entities/phoneInterview");
const { MongoClient, ObjectId } = require("mongodb");

class MongoPhoneInterviewRepository {
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

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  async create(phoneInterview) {
    try {
      if (!this.client) {
        await this.connect();
      }

      this.validatePhoneInterview(phoneInterview);

      const result = await this.collection.insertOne(phoneInterview);
      return { ...phoneInterview, id: result.insertedId.toString() };
    } catch (error) {
      console.error("Error creating phone interview:", error);
      throw error;
    }
  }

  validatePhoneInterview(phoneInterview) {
    const requiredFields = [
      "userId",
      "jobId",
      "transcript",
      "callDuration",
      "transcriptObject",
    ];

    for (const field of requiredFields) {
      if (!phoneInterview[field]) {
        throw new Error(
          `Phone interview validation failed: ${field} is required`
        );
      }
    }
  }

  async findById(id) {
    await this.connect();
    const interview = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!interview) return null;

    return new PhoneInterview(
      interview.userId,
      interview.jobId,
      interview.transcript,
      interview.callDuration,
      interview.transcriptObject
    );
  }

  async findByUserId(userId) {
    try {
      if (!this.client) {
        await this.connect();
      }
      const interviews = await this.collection.find({ userId }).toArray();
      return interviews.map(
        (interview) =>
          new PhoneInterview(
            interview.userId,
            interview.jobId,
            interview.transcript,
            interview.callDuration,
            interview.transcriptObject
          )
      );
    } catch (error) {
      console.error("Error finding interviews by userId:", error);
      throw error;
    }
  }

  async findAll() {
    await this.connect();
    const interviews = await this.collection.find().toArray();
    return interviews.map(
      (interview) =>
        new PhoneInterview(
          interview._id.toString(),
          interview.userId,
          interview.jobId,
          interview.transcript,
          interview.callDuration,
          interview.transcriptObject
        )
    );
  }

  async update(id, updatedInterview) {
    const existingInterview = await this.findById(id);
    if (!existingInterview) {
      throw new Error("Phone interview not found");
    }

    const mergedInterview = { ...existingInterview, ...updatedInterview };
    this.validatePhoneInterview(mergedInterview);

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedInterview }
    );
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

module.exports = MongoPhoneInterviewRepository;
