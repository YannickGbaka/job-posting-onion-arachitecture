import express from "express";
import { ApplicationController } from "../controllers/applicationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const applicationController = new ApplicationController();

// Get all applications
router.get("/", authenticateToken, applicationController.getAllApplications);

// Get application by ID
router.get("/:id", authenticateToken, applicationController.getApplicationById);

// Create a new application
router.post("/", authenticateToken, applicationController.createApplication);

// Update an application
router.put("/:id", authenticateToken, applicationController.updateApplication);

// Delete an application
router.delete(
  "/:id",
  authenticateToken,
  applicationController.deleteApplication
);

export default router;
