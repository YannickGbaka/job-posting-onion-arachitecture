const express = require("express");
require("../controllers/userController");

function userRoutes(userController) {
  const router = express.Router();

  router.post("/", userController.createUser.bind(userController));
  router.get("/:id", userController.getUserById.bind(userController));
  router.get("/", userController.getAllUsers.bind(userController));
  router.put("/:id", userController.updateUser.bind(userController));
  router.delete("/:id", userController.deleteUser.bind(userController));

  return router;
}

module.exports = userRoutes;
