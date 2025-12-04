import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import alumniRoutes from "./routes/alumni.routes";
import healthRoutes from "./routes/health.routes";
import adminRoutes from "./routes/admin.routes";
import messageRoutes from "./routes/messages.routes";
import userRoutes from "./routes/users.routes";
import postsRoutes from "./routes/posts.routes";
import { getMyProfile, updateMyProfile } from "./controllers/users.controller";
import { authenticate } from "./middlewares/auth.middleware";
import enrollRoutes from "./routes/enroll.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.options("*", cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api", postsRoutes);
app.use("/api", enrollRoutes);
app.get("/api/profile", authenticate, getMyProfile);
app.put("/api/profile", authenticate, updateMyProfile);

export default app;
