import { Router } from "express";
import { getAlumniDirectory, getAlumniProfile } from "../controllers/alumni.controller";

const router = Router();

router.get("/directory", getAlumniDirectory);
router.get("/:id", getAlumniProfile);

export default router;
