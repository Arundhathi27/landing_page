const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');

// Roadmap CRUD
router.post('/', roadmapController.createRoadmap);
router.get('/', roadmapController.getRoadmaps);
router.get('/:id', roadmapController.getRoadmapById);
router.put('/:id', roadmapController.updateRoadmap);
router.delete('/:id', roadmapController.deleteRoadmap);

// Nested Step CRUD
router.post('/:id/steps', roadmapController.addStep);
router.put('/:id/steps/reorder', roadmapController.reorderSteps);
router.put('/:roadmapId/steps/:stepId', roadmapController.updateStep);
router.delete('/:roadmapId/steps/:stepId', roadmapController.deleteStep);

module.exports = router;
