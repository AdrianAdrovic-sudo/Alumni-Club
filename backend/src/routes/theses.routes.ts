import { Router } from "express";
import * as thesisController from "../controllers/theses.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";

const router = Router();

// Public routes
router.get("/", thesisController.getTheses);
router.get("/:id", thesisController.getThesis);

// Admin only routes
router.post("/", authenticate, adminOnly, thesisController.createThesis);
router.put("/:id", authenticate, adminOnly, thesisController.updateThesis);
router.delete("/:id", authenticate, adminOnly, thesisController.deleteThesis);

export default router;
