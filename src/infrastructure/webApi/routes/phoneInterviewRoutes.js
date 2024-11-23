const express = require("express");
const PhoneInterviewController = require("../controllers/phoneInterviewController");
function phoneInterviewRoutes(phoneInterviewController) {
  const router = express.Router();

  router.post("/", (req, res) =>
    phoneInterviewController.createPhoneInterview(req, res)
  );
  router.get("/:id", (req, res) =>
    phoneInterviewController.getPhoneInterview(req, res)
  );
  router.put("/:id", (req, res) =>
    phoneInterviewController.updatePhoneInterview(req, res)
  );
  router.delete("/:id", (req, res) =>
    phoneInterviewController.deletePhoneInterview(req, res)
  );
  router.get("/", (req, res) =>
    phoneInterviewController.getAllPhoneInterviews(req, res)
  );
  router.post("/save-call", (req, res) =>
    phoneInterviewController.saveInterviewCall(req, res)
  );

  return router;
}

module.exports = phoneInterviewRoutes;
