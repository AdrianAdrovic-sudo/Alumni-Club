import { Router } from "express";
import { getAlumni, getOneAlumni } from "../controllers/alumni.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Only logged-in users can see alumni list
router.get("/alumni", requireAuth, getAlumni);

// Only logged-in users can view a specific alumni profile
router.get("/alumni/:id", requireAuth, getOneAlumni);

// Admin-only example (optional)
router.delete("/alumni/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  return res.json({ message: `Admin deleted alumni with id ${id}` });
});

export default router;
