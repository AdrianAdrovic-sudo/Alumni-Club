import { Router } from "express";
import { getAllUsers, addUser } from "../repositories/usersRepo";

const router = Router();

// GET /api/users
router.get("/", (_req, res) => {
  res.json(getAllUsers());
});

// POST /api/users
router.post("/", (req, res) => {
  const newUser = addUser(req.body);
  res.status(201).json(newUser);
});

export default router;
