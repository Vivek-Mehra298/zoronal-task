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

// Debug logging - check env vars (avoid printing secrets)
console.log('=== Environment Variables Debug ===');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', Boolean(process.env.MONGO_URI));
console.log(
  'Env keys:',
  Object.keys(process.env).filter((k) => k.includes('MONGO') || k === 'PORT')
);
console.log('=====================================');

if (!MONGO_URI) {
  console.error('\nERROR: MONGO_URI environment variable is not set!');
  console.error('On Render: Add MONGO_URI to Environment Variables in dashboard');
  console.error('Locally: Add MONGO_URI to backend/.env file');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// If DB is down/unreachable, keep server up and return a clear status for API calls.
app.use((req, res, next) => {
  if (req.path === '/health') return next();
  if (!req.path.startsWith('/api')) return next();

  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Please try again in a moment.',
      dbState: mongoose.connection.readyState,
    });
  }

  next();
});

app.use('/api/companies', companyRoutes);
app.use('/api', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'Company Review Server is active',
    dbState: mongoose.connection.readyState,
  });
});

// Start HTTP server first so the process doesn't "crash" when DB is temporarily unreachable.
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

const connectWithRetry = async (attempt = 0) => {
  const delayMs = Math.min(30_000, 1_000 * 2 ** attempt);

  console.log(`Connecting to MongoDB (attempt ${attempt + 1})...`);
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45_000,
      retryWrites: true,
      w: 'majority',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error(`Retrying in ${Math.round(delayMs / 1000)}s...`);
    setTimeout(() => connectWithRetry(Math.min(attempt + 1, 10)), delayMs);
  }
};

connectWithRetry();

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Disconnected from MongoDB');
  if (mongoose.connection.readyState === 0) {
    connectWithRetry();
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
