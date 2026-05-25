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
console.log('\n🔄 Connecting to MongoDB...');

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Database');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📍 API available at http://localhost:${PORT}/api`);
      console.log('✨ Ready to receive requests!');
    });
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error.message);
    console.error('Troubleshooting:');
    console.error('1. Check if MONGO_URI environment variable is set');
    console.error('2. Verify MongoDB Atlas IP whitelist includes your IP');
    console.error('3. Check if MongoDB Atlas cluster is running');
    console.error('4. Verify network connectivity');
    process.exit(1);
  });

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error after initial setup:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ Reconnected to MongoDB');
});
