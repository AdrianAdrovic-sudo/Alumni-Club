import { Router } from "express";
import { getAboutUsContent } from "../aboutus";

const router = Router();

router.get("/aboutus", (req, res) => {
  const content = getAboutUsContent();
  res.json({ content });
});

export default router;