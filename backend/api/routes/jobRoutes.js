import express from 'express';
const router = express.Router();
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, isEmployer } from '../../middleware/authMiddleware.js';

router.route('/').get(getJobs).post(protect, isEmployer, createJob);
router.route('/:id').get(getJobById).put(protect, isEmployer, updateJob).delete(protect, isEmployer, deleteJob);

export default router;
