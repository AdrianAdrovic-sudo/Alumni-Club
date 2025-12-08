// backend/src/routes/enroll.routes.ts
import { Router } from "express";
import { sendEnrollApplication } from "../controllers/enroll.controller";

const router = Router();

// POST /api/enroll
router.post("/enroll", sendEnrollApplication);

export default router;
