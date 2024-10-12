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
    // Validate that all required fields are present
    this.validateJob(job);

    const result = await this.collection.insertOne(job);
    return { ...job, id: result.insertedId.toString() };
  }

  validateJob(job) {
    const requiredFields = [
      "title",
      "description",
      "salary",
      "location",
      "requirements",
      "jobType",
    ];
    for (const field of requiredFields) {
      if (!job[field]) {
        throw new Error(`Job validation failed: ${field} is required`);
      }
    }
  }

  async findById(id) {
    const job = await this.collection.findOne({ _id: id });
    if (!job) return null;
    return new Job(
      job._id,
      job.title,
      job.description,
      job.salary,
      job.location,
      job.requirements,
      job.jobType
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
          job.jobType
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
    const result = await this.database
      .collection("jobs")
      .deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

module.exports = MongoJobRepository;
