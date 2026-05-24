import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import companyRoutes from './routes/companyRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Debug logging - check all environment variables
console.log('=== Environment Variables Debug ===');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('MONGO') || k === 'PORT'));
console.log('=====================================');

// Ensure MONGO_URI is set
if (!MONGO_URI) {
  console.error('\n❌ ERROR: MONGO_URI environment variable is not set!');
  console.error('On Render: Add MONGO_URI to Environment Variables in dashboard');
  console.error('Locally: Add MONGO_URI to backend/.env file');
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api', reviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Company Review Server is active' });
});

// Database connection & Server Startup
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Database');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });
