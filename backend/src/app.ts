import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import alumniRoutes from './routes/alumni.routes';
import healthRoutes from './routes/health.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);


export default app;