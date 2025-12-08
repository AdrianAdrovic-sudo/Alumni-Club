// backend/src/routes/auth.routes.ts
import { Router } from "express";
import { loginUser } from "../services/auth.service";
import { resetCheck, resetConfirm } from "../controllers/auth.controller";

const router = Router();

// User login (ostaje kao što je bio)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

/**
 * STEP 1: provjera korisničkog imena i emaila + slanje koda
 */
router.post("/reset-check", resetCheck);

/**
 * STEP 2: potvrda koda i promjena šifre
 */
router.post("/reset-confirm", resetConfirm);

export default router;
