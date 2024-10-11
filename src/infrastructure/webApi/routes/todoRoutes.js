const express = require("express");

function todoRoutes(todoController) {
  const router = express.Router();

  router.get("/", todoController.getAllTodos.bind(todoController));
  router.get("/:id", todoController.getTodoById.bind(todoController));
  router.post("/", todoController.createTodo.bind(todoController));
  router.put("/:id", todoController.updateTodo.bind(todoController));
  router.delete("/:id", todoController.deleteTodo.bind(todoController));

  return router;
}

module.exports = todoRoutes;
