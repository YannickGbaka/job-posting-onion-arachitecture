class PhoneInterview {
  constructor(id, userId, jobId, transcript, callDuration, transcriptObject) {
    this.id = id;
    this.userId = userId;
    this.jobId = jobId;
    this.transcript = transcript;
    this.callDuration = callDuration;
    this.transcriptObject = transcriptObject;
    this.createdAt = new Date();
  }
}

module.exports = PhoneInterview;
