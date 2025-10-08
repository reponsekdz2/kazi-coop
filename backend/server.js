import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './api/routes/authRoutes.js';
import jobRoutes from './api/routes/jobRoutes.js';
import userRoutes from './api/routes/userRoutes.js';
import companyRoutes from './api/routes/companyRoutes.js';
import applicationRoutes from './api/routes/applicationRoutes.js';
import cooperativeRoutes from './api/routes/cooperativeRoutes.js';


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.send('KaziCoop API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/cooperatives', cooperativeRoutes);


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
