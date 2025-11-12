import { Router } from "express";
import { health, dbCheck } from "../controllers/health.controller";

const router = Router();
router.get("/health", health);
router.get("/health/db", dbCheck);

export default router;
