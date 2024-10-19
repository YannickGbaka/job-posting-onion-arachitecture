const express = require("express");

function applicationRoutes(applicationController) {
  const router = express.Router();

  // Get all applications
  router.get(
    "/",
    applicationController.getAllApplications.bind(applicationController)
  );

  // Get application by ID
  router.get(
    "/:id",
    applicationController.getApplicationById.bind(applicationController)
  );

  // Create a new application
  router.post(
    "/",
    applicationController.createApplication.bind(applicationController)
  );

  // Update an application
  router.put(
    "/:id",
    applicationController.updateApplication.bind(applicationController)
  );

  // Delete an application
  router.delete(
    "/:id",
    applicationController.deleteApplication.bind(applicationController)
  );

  return router;
}

module.exports = applicationRoutes;
