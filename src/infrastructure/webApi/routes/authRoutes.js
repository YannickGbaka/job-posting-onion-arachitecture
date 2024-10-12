const express = require("express");

function authRoutes(authController) {
  const router = express.Router();

  router.post("/login", authController.login.bind(authController));

  return router;
}

module.exports = authRoutes;
