const PhoneInterview = require("../../domain/entities/phoneInterview");

class PhoneInterviewUseCase {
  constructor(phoneInterviewRepository, retellService) {
    this.phoneInterviewRepository = phoneInterviewRepository;
    this.retellService = retellService;
  }

  async savePhoneInterview(phoneInterviewData) {
    return await this.phoneInterviewRepository.save(phoneInterviewData);
  }

  async getUserPhoneInterviews(userId) {
    return await this.phoneInterviewRepository.findByUserId(userId);
  }

  async saveInterviewCall(userId, callId, jobId) {
    try {
      const callData = await this.retellService.getCall(callId);
      if (!callData.success && callData.error) {
        throw new Error(callData.error);
      }
      const phoneInterview = new PhoneInterview(
        userId,
        jobId,
        callData.transcript,
        callData.duration_ms,
        callData.transcript_object
      );

      const result = await this.phoneInterviewRepository.create(phoneInterview);
      return {
        success: true,
        interviewId: result.id,
      };
    } catch (error) {
      console.error("Error saving interview call:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getAllPhoneInterviews() {
    try {
      const phoneInterviews = await this.phoneInterviewRepository.findAll();
      return phoneInterviews;
    } catch (error) {
      throw new Error(`Error getting all phone interviews: ${error.message}`);
    }
  }
}

module.exports = PhoneInterviewUseCase;
