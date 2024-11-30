const express = require("express");

function quizRoutes(quizController) {
  const router = express.Router();

  router.post("/generate", (req, res) => quizController.generateQuiz(req, res));
  router.get("/:id", (req, res) => quizController.getQuiz(req, res));
  router.post("/:quizId/submit", (req, res) =>
    quizController.submitQuizResponse(req, res)
  );
  router.get("/job/:jobId", (req, res) =>
    quizController.getQuizzesByJobId(req, res)
  );

  return router;
}

module.exports = quizRoutes;
