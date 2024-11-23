class PhoneInterview {
  constructor(userId, jobId, transcript, callDuration, transcriptObject) {
    this.userId = userId;
    this.jobId = jobId;
    this.transcript = transcript;
    this.callDuration = callDuration;
    this.transcriptObject = transcriptObject;
    this.createdAt = new Date();
  }
}

module.exports = PhoneInterview;
