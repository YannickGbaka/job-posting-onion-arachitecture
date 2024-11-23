const express = require("express");
const WebCallController = require("../controllers/webCallController");

const router = express.Router();

function webCallRoutes(retellService) {
  const webCallController = new WebCallController(retellService);

  router.post("/create", (req, res) =>
    webCallController.createWebCall(req, res)
  );
  router.post("/:callId/end", (req, res) =>
    webCallController.endWebCall(req, res)
  );
  router.get("/:callId", (req, res) => webCallController.getCall(req, res));

  return router;
}

module.exports = webCallRoutes;
