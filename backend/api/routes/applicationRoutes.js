import express from 'express';
const router = express.Router();
import { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, isEmployer } from '../../middleware/authMiddleware.js';

router.route('/').post(protect, applyForJob).get(protect, getMyApplications);
router.route('/job/:jobId').get(protect, isEmployer, getJobApplications);
router.route('/:id/status').put(protect, isEmployer, updateApplicationStatus);

export default router;
