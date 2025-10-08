import express from 'express';
const router = express.Router();
import { createCompany, getCompanies } from '../controllers/companyController.js';
import { protect, isEmployer } from '../../middleware/authMiddleware.js';

router.route('/').get(getCompanies).post(protect, isEmployer, createCompany);

export default router;
