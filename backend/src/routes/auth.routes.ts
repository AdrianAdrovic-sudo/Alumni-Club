// backend/src/routes/auth.routes.ts
import { Router } from "express";
import { loginController } from "../controllers/auth.controller";

const router = Router();

// POST /auth/login
router.post("/login", loginController);

export default router;
