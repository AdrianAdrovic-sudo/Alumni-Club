// src/controllers/messages.controller.ts
import { Request, Response } from "express";
import {
  createPrivateMessage,
  getInboxMessages,
  getSentMessages,
  markMessageAsRead,
} from "../services/messages.service";

// POST /api/messages
export async function createMessageHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const senderId = req.user.id;
    const { receiverId, subject, content } = req.body as {
      receiverId?: number;
      subject?: string;
      content?: string;
    };

    if (!receiverId || !subject || !content) {
      return res
        .status(400)
        .json({ message: "receiverId, subject and content are required" });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const msg = await createPrivateMessage(
      senderId,
      receiverId,
      subject.trim(),
      content.trim()
    );

    return res.status(201).json({ message: msg });
  } catch (err) {
    console.error("Error creating private message:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/messages/inbox
export async function getInboxHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const messages = await getInboxMessages(userId);

    return res.json({ messages });
  } catch (err) {
    console.error("Error fetching inbox:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/messages/sent
export async function getSentHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const messages = await getSentMessages(userId);

    return res.json({ messages });
  } catch (err) {
    console.error("Error fetching sent messages:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// PATCH /api/messages/:id/read
export async function markReadHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const messageId = Number(req.params.id);

    if (Number.isNaN(messageId)) {
      return res.status(400).json({ message: "Invalid message id" });
    }

    const updated = await markMessageAsRead(messageId, userId);

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Message not found or already read" });
    }

    return res.json({ message: updated });
  } catch (err) {
    console.error("Error marking message as read:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
