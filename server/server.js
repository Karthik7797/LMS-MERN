import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Fix: Ensure JSON parsing before using routes
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API Working"));
app.post('/clerk', clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// Connect to database and Cloudinary inside an async function
async function startServer() {
  try {
    await connectDB();
    await connectCloudinary();
    console.log("✅ Connected to DB and Cloudinary");
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
}

// Call the function to start DB connection
startServer();

// Export for Vercel serverless
export default app;
