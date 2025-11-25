import authRoutes from "./routes/auth.routes";
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import aboutRoutes from "./routes/about.routes";
import alumniRoutes from "./routes/alumni.routes";
import profileRoutes from "./routes/profile.routes";
import blogRoutes from "./routes/blog.routes";
import postRoutes from "./routes/post.routes";

const app = express();
app.use(
  cors({
    origin: true, // allow any localhost port during dev
  })
);
app.use(express.json());
app.use("/api", healthRoutes);
app.use("/api", aboutRoutes);
app.use("/api", alumniRoutes);
app.use("/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blog", blogRoutes);

app.use("/api/posts", postRoutes);

export default app;
