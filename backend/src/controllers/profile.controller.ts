// backend/src/controllers/profile.controller.ts
import { Request, Response } from "express";
import {
  getProfileById,
  updateProfileById,
} from "../services/profile.services";

export async function getProfileController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user.id;
    const profile = await getProfileById(userId);

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.error("getProfileController:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateProfileController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user.id;
    const updated = await updateProfileById(userId, req.body);

    return res.json(updated);
  } catch (err) {
    console.error("updateProfileController:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
