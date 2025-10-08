import express from 'express';
const router = express.Router();
import { createCooperative, getCooperatives, joinCooperative, approveMember } from '../controllers/cooperativeController.js';
import { protect, isEmployer } from '../../middleware/authMiddleware.js';

router.route('/').get(getCooperatives).post(protect, isEmployer, createCooperative);
router.route('/:id/join').post(protect, joinCooperative);
router.route('/:id/members/:memberId/approve').put(protect, isEmployer, approveMember);


export default router;
