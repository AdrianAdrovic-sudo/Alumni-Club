// src/routes/users.routes.ts
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { searchUsers } from "../controllers/users.controller";

const router = Router();

router.get("/search", authenticate, searchUsers);

export default router;
