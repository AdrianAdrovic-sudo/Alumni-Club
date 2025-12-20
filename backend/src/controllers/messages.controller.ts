// backend/src/controllers/messages.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import {
  getInboxMessages,
  getSentMessages,
  createPrivateMessage,
  createPrivateMessagesBulk,
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

/**
 * POST /api/messages
 * Supports:
 *  - { receiverUsername: string, subject: string, content: string }
 *  - { receiverUsernames: string[], subject: string, content: string }
 */
export async function sendMessage(req: Request, res: Response) {
  const senderId = req.user!.id;

  const subject = (req.body?.subject || "").trim();
  const content = (req.body?.content || "").trim();

  const single = (req.body?.receiverUsername || "").trim();
  const multiRaw = req.body?.receiverUsernames;

  const receiverUsernames: string[] = [];

  if (Array.isArray(multiRaw)) {
    for (const u of multiRaw) {
      const v = String(u || "").trim();
      if (v) receiverUsernames.push(v);
    }
  } else if (single) {
    receiverUsernames.push(single);
  }

  // Normalize: unique usernames, no blanks
  const unique = Array.from(new Set(receiverUsernames)).filter(Boolean);

  if (unique.length === 0 || !subject || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Find all receivers
  const receivers = await prisma.users.findMany({
    where: { username: { in: unique } },
    select: { id: true, username: true },
  });

  const foundSet = new Set(receivers.map((r) => r.username));
  const missing = unique.filter((u) => !foundSet.has(u));

  if (missing.length > 0) {
    return res.status(404).json({
      message: `User(s) not found: ${missing.join(", ")}`,
      missing,
    });
  }

  // If only 1, use existing flow
  if (receivers.length === 1) {
    const msg = await createPrivateMessage(
      Number(senderId),
      receivers[0].id,
      subject,
      content
    );
    return res.status(201).json({ message: msg });
  }

  // Bulk create: one private_messages per receiver (privacy guaranteed)
  const created = await createPrivateMessagesBulk(
    Number(senderId),
    receivers.map((r) => r.id),
    subject,
    content
  );

  return res.status(201).json({
    messages: created,
    count: created.length,
  });
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

/**
 * Optional helper for your ComposeMessage username dropdown:
 * GET /api/messages/users/search?q=ad
 */
export async function searchUsers(req: Request, res: Response) {
  const q = String(req.query.q || "").trim();
  if (q.length < 2) return res.json({ users: [] });

  const users = await prisma.users.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { first_name: { contains: q, mode: "insensitive" } },
        { last_name: { contains: q, mode: "insensitive" } },
      ],
      is_active: true,
    },
    select: {
      id: true,
      username: true,
      first_name: true,
      last_name: true,
    },
    take: 10,
    orderBy: { username: "asc" },
  });

  return res.json({ users });
}
