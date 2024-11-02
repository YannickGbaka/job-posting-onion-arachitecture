const express = require('express');

function applicationRoutes(applicationController) {
    const router = express.Router();

    router.post('/', (req, res) => applicationController.createApplication(req, res));
    router.get('/user/:userId', (req, res) => applicationController.getUserApplications(req, res));
    router.get('/:id', (req, res) => applicationController.getApplicationById(req, res));
    router.put('/:id/status', (req, res) => applicationController.updateApplicationStatus(req, res));
    router.get('/', (req, res) => applicationController.getAllApplications(req, res));

    return router;
}

module.exports = applicationRoutes;
