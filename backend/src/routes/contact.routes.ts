import { Router } from "express";
import { submitContact } from "../controllers/contact.controller";

const router = Router();

// Public endpoint (no auth)
router.post("/", submitContact);

export default router;
