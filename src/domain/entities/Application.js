class Application {
  constructor({
    _id,
    userId,
    jobId,
    resumeFile,
    coverLetter,
    status,
    score,
    createdAt,
    updatedAt,
    user,
  }) {
    this._id = _id;
    this.userId = userId;
    this.jobId = jobId;
    this.resumeFile = resumeFile;
    this.coverLetter = coverLetter;
    this.status = status || "pending";
    this.score = score;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.user = user;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}

module.exports = Application;
