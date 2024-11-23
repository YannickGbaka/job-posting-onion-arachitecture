class WebCallController {
  constructor(retellService) {
    this.retellService = retellService;
  }

  async createWebCall(req, res) {
    try {
      const agentId = req.body.agentId || process.env.RETELL_DEFAULT_AGENT_ID;
      const result = await this.retellService.createWebCall(agentId);

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

  async endWebCall(req, res) {
    try {
      const { callId } = req.params;
      const result = await this.retellService.endWebCall(callId);

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

  async getCall(req, res) {
    try {
      const { callId } = req.params;
      const result = await this.retellService.getCall(callId);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = WebCallController;
