const Retell = require("retell-sdk");

class RetellService {
  constructor(apiKey) {
    this.client = new Retell({
      apiKey: apiKey,
    });
  }

  async createWebCall(agentId) {
    try {
      const webCallResponse = await this.client.call.createWebCall({
        agent_id: agentId,
      });

      return {
        success: true,
        callId: webCallResponse.call_id,
        agentId: webCallResponse.agent_id,
        webCallUrl: webCallResponse.web_call_url,
        access_token: webCallResponse.access_token,
      };
    } catch (error) {
      console.error("Error creating web call:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async endWebCall(callId) {
    try {
      await this.client.call.endCall(callId);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error ending web call:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getCall(callId) {
    try {
      const response = await this.client.call.retrieve(callId);
      return response;
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }
}

module.exports = RetellService;
