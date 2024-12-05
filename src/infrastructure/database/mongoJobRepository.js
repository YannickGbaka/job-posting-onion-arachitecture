const Job = require("../../domain/entities/Job");
const { MongoClient, ObjectId } = require("mongodb");

class MongoJobRepository {
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

  async create(job) {
    try {
      // S'assurer que la connexion est établie
      if (!this.client) {
        await this.connect();
      }

      // Validate that all required fields are present
      this.validateJob(job);

      const result = await this.collection.insertOne(job);
      return { ...job, id: result.insertedId.toString() };
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  }

  validateJob(job) {
    const requiredFields = [
      "title",
      "description",
      "location",
      "requirements",
      "jobType",
      "applicationDeadline",
    ];

    for (const field of requiredFields) {
      if (!job[field]) {
        throw new Error(`Job validation failed: ${field} is required`);
      }
    }

    // Validate deadline is a future date
    const deadline = new Date(job.applicationDeadline);
    if (isNaN(deadline.getTime()) || deadline < new Date()) {
      throw new Error("Application deadline must be a valid future date");
    }
  }

  async findById(id) {
    await this.connect();
    const job = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!job) return null;
    return new Job(
      job._id,
      job.title,
      job.description,
      job.salary,
      job.location,
      job.requirements,
      job.jobType,
      job.applicationDeadline
    );
  }

  async findAll() {
    const jobs = await this.collection.find().toArray();
    return jobs.map(
      (job) =>
        new Job(
          job._id,
          job.title,
          job.description,
          job.salary,
          job.location,
          job.requirements,
          job.jobType,
          job.applicationDeadline
        )
    );
  }

  async update(id, updatedJob) {
    // Fetch the existing job
    const existingJob = await this.findById(id);
    if (!existingJob) {
      throw new Error("Job not found");
    }

    // Merge the existing job with the updates
    const mergedJob = { ...existingJob, ...updatedJob };

    // Validate the merged job
    this.validateJob(mergedJob);

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedJob }
    );
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

module.exports = MongoJobRepository;
