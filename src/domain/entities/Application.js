class Application {
  constructor({
    id,
    userId,
    jobId,
    resumeFile,
    coverLetter,
    status,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.jobId = jobId;
    this.resumeFile = resumeFile;
    this.coverLetter = coverLetter;
    this.status = status || "pending";
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}

module.exports = Application;
