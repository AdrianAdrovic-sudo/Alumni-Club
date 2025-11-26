// src/controllers/messages.controller.ts
import { Request, Response } from "express";
import {
  getInboxMessages,
  getSentMessages,
  createPrivateMessage,
  markMessageAsRead,
} from "../services/messages.service";
import prisma from "../prisma";

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
  const { receiverUsername, subject, content } = req.body; // Changed from receiverId to receiverUsername

  if (!receiverUsername || !subject || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // First, find the user by username
  const receiver = await prisma.users.findFirst({
    where: { username: receiverUsername }
  });

  if (!receiver) {
    return res.status(404).json({ message: "User not found" });
  }

  const message = await createPrivateMessage(
    Number(senderId),
    receiver.id, // Use the found user's ID
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
