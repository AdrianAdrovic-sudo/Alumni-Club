import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import aboutRoutes from "./routes/about.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", healthRoutes);
app.use("/api", aboutRoutes);

export default app;
