import express from 'express';
import { json } from 'body-parser';
import { alumniRoutes } from './routes/alumni.routes';
import { authRoutes } from './routes/auth.routes';
import { postRoutes } from './routes/post.routes';
import { profileRoutes } from './routes/profile.routes';
import { healthRoutes } from './routes/health.routes';
import { aboutRoutes } from './routes/about.routes';
import { connectToDatabase } from './prisma';

const app = express();

// Middleware
app.use(json());

// Connect to the database
connectToDatabase();

// Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/about', aboutRoutes);

export default app;