require("dotenv").config();
const express = require("express");
const InMemoryTodoRepository = require("./infrastructure/database/inMemoryTodoRepository");
const InMemoryUserRepository = require("./infrastructure/database/inMemoryUserRepository");
const MongoUserRepository = require("./infrastructure/database/mongoUserRepository");
const TodoUseCases = require("./application/useCases/todoUseCases");
const { UserUseCases } = require("./application/useCases/userUseCases");
const TodoController = require("./infrastructure/webApi/controllers/todoController");
const UserController = require("./infrastructure/webApi/controllers/userController");
const todoRoutes = require("./infrastructure/webApi/routes/todoRoutes");
const userRoutes = require("./infrastructure/webApi/routes/userRoutes");
const AuthUseCases = require("./application/useCases/authUseCases");
const AuthController = require("./infrastructure/webApi/controllers/authController");
const authRoutes = require("./infrastructure/webApi/routes/authRoutes");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
const MongoJobRepository = require("./infrastructure/database/mongoJobRepository");
const JobUseCases = require("./application/useCases/jobUseCases");
const JobController = require("./infrastructure/webApi/controllers/jobController");
const jobRoutes = require("./infrastructure/webApi/routes/jobRoutes");

app.use(express.json());
app.use(
  cors({
    origin: "*", // or your frontend's production URL
  })
);

// User repository factory
const createUserRepository = () => {
  const useMongoDb = process.env.USE_MONGODB === "true";
  if (useMongoDb) {
    const mongoRepo = new MongoUserRepository(
      process.env.MONGODB_URL,
      "jobs",
      "users"
    );
    mongoRepo.connect();
    return mongoRepo;
  } else {
    return new InMemoryUserRepository();
  }
};

// Dependency injection
const todoRepository = new InMemoryTodoRepository();
const todoUseCases = new TodoUseCases(todoRepository);

async function initializeApp() {
  const userRepository = createUserRepository();

  if (userRepository instanceof MongoUserRepository) {
    console.log("Connecting to MongoDB...");
    await userRepository.connect();
    console.log("Connected to MongoDB");
  }

  const userUseCases = new UserUseCases(userRepository);
  const userController = new UserController(userUseCases);

  const authUseCases = new AuthUseCases(userRepository);
  const authController = new AuthController(authUseCases);

  const jobRepository = createJobRepository();

  const jobUseCases = new JobUseCases(jobRepository);
  const jobController = new JobController(jobUseCases);

  // Add job routes
  // Routes
  app.use("/api/auth", authRoutes(authController));
  app.use("/api/users", userRoutes(userController));
  app.use("/api/jobs", jobRoutes(jobController));
  //cors
  // app.use(cors({ origin: "*" }));

  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
}

const createJobRepository = () => {
  const useMongoDb = process.env.USE_MONGODB === "true";
  if (useMongoDb) {
    const mongoRepo = new MongoJobRepository(
      process.env.MONGODB_URL,
      "jobs",
      "jobs"
    );
    mongoRepo.connect();
    return mongoRepo;
  }
};

initializeApp().catch(console.error);

// Routes
// app.use("/todos", todoRoutes(todoController));

// Graceful shutdown
process.on("SIGINT", async () => {
  if (userRepository instanceof MongoUserRepository) {
    await userRepository.disconnect();
  }
  process.exit(0);
});
