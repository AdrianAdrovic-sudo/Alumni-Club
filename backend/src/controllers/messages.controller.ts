// src/controllers/messages.controller.ts
import { Request, Response } from "express";
import {
  getInboxMessages,
  getSentMessages,
  createPrivateMessage,
  markMessageAsRead,
} from "../services/messages.service";

export async function getInbox(req: Request, res: Response) {
  const userId = req.user!.id;

  const messages = await getInboxMessages(userId);
  return res.json({ messages });
}

export async function getSent(req: Request, res: Response) {
  const userId = req.user!.id;

  const messages = await getSentMessages(userId);
  return res.json({ messages });
}

export async function sendMessage(req: Request, res: Response) {
  const senderId = req.user!.id;
  const { receiverId, subject, content } = req.body;

  if (!receiverId || !subject || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const message = await createPrivateMessage(
    Number(senderId),
    Number(receiverId),
    subject,
    content
  );

  return res.status(201).json({ message });
}

export async function markAsRead(req: Request, res: Response) {
  const messageId = Number(req.params.id);
  const userId = req.user!.id;

  const message = await markMessageAsRead(messageId, userId);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  return res.json({ message });
}
