// backend/src/routes/messages.routes.ts
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getInbox,
  getSent,
  sendMessage,
  markAsRead,
  searchUsers,
} from "../controllers/messages.controller";

const router = Router();

router.get("/inbox", authenticate, getInbox);
router.get("/sent", authenticate, getSent);

// user search for compose suggestions
router.get("/users/search", authenticate, searchUsers);

router.post("/", authenticate, sendMessage);
router.patch("/:id/read", authenticate, markAsRead);

export default router;
