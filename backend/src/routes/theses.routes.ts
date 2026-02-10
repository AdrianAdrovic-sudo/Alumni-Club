import { Router } from "express";
import { getTheses, deleteThesis, uploadThesisHandler } from "../controllers/theses.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { uploadThesis } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getTheses);
router.delete("/:id", authenticate, requireAdmin, deleteThesis);
router.post("/upload/:id", authenticate, requireAdmin, uploadThesis, uploadThesisHandler);

export default router;
