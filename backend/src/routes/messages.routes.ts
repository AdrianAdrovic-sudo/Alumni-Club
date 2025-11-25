// src/routes/messages.routes.ts
import express from "express";
import {
  createMessageHandler,
  getInboxHandler,
  getSentHandler,
  markReadHandler,
} from "../controllers/messages.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

// Create new message
router.post("/", requireAuth, createMessageHandler);

// Inbox (received messages)
router.get("/inbox", requireAuth, getInboxHandler);

// Sent messages
router.get("/sent", requireAuth, getSentHandler);

// Mark a message as read
router.patch("/:id/read", requireAuth, markReadHandler);

export default router;
