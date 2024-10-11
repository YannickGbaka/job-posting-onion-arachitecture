const express = require("express");
const InMemoryTodoRepository = require("./infrastructure/database/inMemoryTodoRepository");
const InMemoryUserRepository = require("./infrastructure/database/inMemoryUserRepository");
const TodoUseCases = require("./application/useCases/todoUseCases");
const UserUseCases = require("./application/useCases/userUseCases");
const TodoController = require("./infrastructure/webApi/controllers/todoController");
const UserController = require("./infrastructure/webApi/controllers/userController");
const todoRoutes = require("./infrastructure/webApi/routes/todoRoutes");
const userRoutes = require("./infrastructure/webApi/routes/userRoutes");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Dependency injection
const todoRepository = new InMemoryTodoRepository();
const userRepository = new InMemoryUserRepository();

const todoUseCases = new TodoUseCases(todoRepository);
const userUseCases = new UserUseCases(userRepository);

const todoController = new TodoController(todoUseCases);
const userController = new UserController(userUseCases);

// Routes
app.use("/todos", todoRoutes(todoController));
app.use("/users", userRoutes(userController));

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
