import { Router } from "express";
import { registerUser, loginUser } from "../repositories/authRepo";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = registerUser(name, email, password);
    res.status(201).json({ message: "✅ Registracija uspešna", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const result = loginUser(email, password);
    res.json({
      message: "✅ Login uspešan",
      token: result.token,
      user: result.user,
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

// GET /api/auth/me (zaštićeno)
router.get("/me", requireAuth, (req, res) => {
  res.json({ message: "✅ Token validan", user: (req as any).user });
});

export default router;
