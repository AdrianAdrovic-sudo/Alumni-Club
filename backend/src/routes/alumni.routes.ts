import { Router } from "express";
import { getAlumni, getOneAlumni } from "../controllers/alumni.controller";

const router = Router();

router.get("/alumni", getAlumni);
router.get("/alumni/:id", getOneAlumni);

export default router;