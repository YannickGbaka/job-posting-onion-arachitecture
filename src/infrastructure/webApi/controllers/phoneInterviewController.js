class PhoneInterviewController {
  constructor(phoneInterviewUseCase) {
    this.phoneInterviewUseCase = phoneInterviewUseCase;
  }

  async createPhoneInterview(req, res) {
    try {
      const phoneInterview =
        await this.phoneInterviewUseCase.createPhoneInterview(req.body);
      res.status(201).json(phoneInterview);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPhoneInterview(req, res) {
    try {
      const phoneInterview = await this.phoneInterviewUseCase.getPhoneInterview(
        req.params.id
      );
      res.status(200).json(phoneInterview);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updatePhoneInterview(req, res) {
    try {
      const phoneInterview =
        await this.phoneInterviewUseCase.updatePhoneInterview(
          req.params.id,
          req.body
        );
      res.status(200).json(phoneInterview);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePhoneInterview(req, res) {
    try {
      await this.phoneInterviewUseCase.deletePhoneInterview(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllPhoneInterviews(req, res) {
    try {
      const phoneInterviews =
        await this.phoneInterviewUseCase.getAllPhoneInterviews();
      res.status(200).json(phoneInterviews);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async saveInterviewCall(req, res) {
    try {
      const { userId, callId, jobId } = req.body;

      if (!userId || !callId || !jobId) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: userId, callId and jobId are required",
        });
      }

      const result = await this.phoneInterviewUseCase.saveInterviewCall(
        userId,
        callId,
        jobId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getPhoneInterviewByUserAndJob(req, res) {
    try {
      const { userId, jobId } = req.query;

      if (!userId || !jobId) {
        return res.status(400).json({
          error: "Both userId and jobId are required query parameters",
        });
      }

      const phoneInterview =
        await this.phoneInterviewUseCase.getPhoneInterviewByUserAndJob(
          userId,
          jobId
        );
      res.status(200).json(phoneInterview);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = PhoneInterviewController;
