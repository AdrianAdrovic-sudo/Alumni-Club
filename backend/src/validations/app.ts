import compression from "compression";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import logger from "../utils/logger";
import router from "../routes"; // health, users, ...
import authRoutes from "../routes/auth";
import { notFound } from "../middlewares/notFound";
import { errorHandler } from "../middlewares/errorHandler";
import { setupSwagger } from "../config/swagger";
import { requestId } from "../middlewares/requestId";
import { authRateLimiter } from "../middlewares/rateLimiter";

const app = express();

// osnovni middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use(requestId);

app.use("/api/auth", authRateLimiter);

//app.get("/api/test-limit", authRateLimiter, (req, res) => {
//  res.json({ message: "✅ Test ruta prošla!" });
//});

app.use((req, _res, next) => {
  console.log("REQ -->", req.method, req.originalUrl);
  next();
});

logger.info("✅ App initialized successfully.");

// Swagger dokumentacija
setupSwagger(app);

// rute
app.use("/api/auth", authRoutes);
app.use("/api", router);

// 404 i globalni error handler ZADNJI
app.use(notFound);
app.use(errorHandler);

export default app;
