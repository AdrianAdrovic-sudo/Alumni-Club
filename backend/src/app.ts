import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import alumniRoutes from './routes/alumni.routes';
import healthRoutes from './routes/health.routes';
import adminRoutes from './routes/admin.routes';
import messageRoutes from "./routes/messages.routes";
import userRoutes from "./routes/users.routes";


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // ADD PATCH HERE
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Added X-Requested-With
}));

app.options('*', cors()); // Handle preflight requests for all routes
app.use(express.json());

app.use(express.json());
app.use("/api/messages", messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); // add this line
app.use('/api/auth', authRoutes);

export default app;