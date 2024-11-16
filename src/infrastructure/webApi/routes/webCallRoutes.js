const express = require("express");
const WebCallController = require("../controllers/webCallController");

const router = express.Router();
const webCallController = new WebCallController();

router.post("/create", (req, res) => webCallController.createWebCall(req, res));
router.post("/:callId/end", (req, res) =>
  webCallController.endWebCall(req, res)
);

module.exports = router;
