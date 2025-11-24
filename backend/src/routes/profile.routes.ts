// backend/src/routes/profile.routes.ts
import { Router } from "express";
import {
  getProfileController,
  updateProfileController,
} from "../controllers/profile.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, getProfileController);
router.put("/", requireAuth, updateProfileController);

export default router;
