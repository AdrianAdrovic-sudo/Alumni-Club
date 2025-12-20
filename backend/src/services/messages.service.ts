// backend/src/services/messages.service.ts
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export interface PrivateMessageRow {
  id: number;
  subject: string;
  content: string;
  sent_date: string;
  read_at: string | null;
  sender_id: number;
  receiver_id: number;
  sender_first_name?: string;
  sender_last_name?: string;
  receiver_first_name?: string;
  receiver_last_name?: string;
}

type PrivateMessageWithUsers = Prisma.private_messagesGetPayload<{
  include: {
    users_private_messages_sender_idTousers: {
      select: { first_name: true; last_name: true };
    };
    users_private_messages_receiver_idTousers: {
      select: { first_name: true; last_name: true };
    };
  };
}>;

function mapMessage(m: PrivateMessageWithUsers): PrivateMessageRow {
  return {
    id: m.id,
    subject: m.subject,
    content: m.content,
    sent_date: m.sent_date ? m.sent_date.toISOString() : new Date().toISOString(),
    read_at: m.read_at ? m.read_at.toISOString() : null,
    sender_id: m.sender_id,
    receiver_id: m.receiver_id,
    sender_first_name: m.users_private_messages_sender_idTousers.first_name,
    sender_last_name: m.users_private_messages_sender_idTousers.last_name,
    receiver_first_name: m.users_private_messages_receiver_idTousers.first_name,
    receiver_last_name: m.users_private_messages_receiver_idTousers.last_name,
  };
}

// Create a new private message
export async function createPrivateMessage(
  senderId: number,
  receiverId: number,
  subject: string,
  content: string
): Promise<PrivateMessageRow> {
  const msg = await prisma.private_messages.create({
    data: {
      subject,
      content,
      sender_id: senderId,
      receiver_id: receiverId,
    },
    include: {
      users_private_messages_sender_idTousers: {
        select: { first_name: true, last_name: true },
      },
      users_private_messages_receiver_idTousers: {
        select: { first_name: true, last_name: true },
      },
    },
  });

  return mapMessage(msg as PrivateMessageWithUsers);
}

// Bulk create: one row per receiver (privacy friendly)
export async function createPrivateMessagesBulk(
  senderId: number,
  receiverIds: number[],
  subject: string,
  content: string
): Promise<PrivateMessageRow[]> {
  const created: PrivateMessageRow[] = [];

  // Simple sequential loop is fine for school project.
  // If you want faster, we can Promise.all, but this is safer for DB load.
  for (const receiverId of receiverIds) {
    const row = await createPrivateMessage(senderId, receiverId, subject, content);
    created.push(row);
  }

  return created;
}

// Inbox: messages received by the current user
export async function getInboxMessages(userId: number): Promise<PrivateMessageRow[]> {
  const msgs: PrivateMessageWithUsers[] = await prisma.private_messages.findMany({
    where: { receiver_id: userId },
    orderBy: { sent_date: "desc" },
    include: {
      users_private_messages_sender_idTousers: {
        select: { first_name: true, last_name: true },
      },
      users_private_messages_receiver_idTousers: {
        select: { first_name: true, last_name: true },
      },
    },
  });

  return msgs.map((m) => mapMessage(m));
}

// Sent messages: messages sent by the current user
export async function getSentMessages(userId: number): Promise<PrivateMessageRow[]> {
  const msgs: PrivateMessageWithUsers[] = await prisma.private_messages.findMany({
    where: { sender_id: userId },
    orderBy: { sent_date: "desc" },
    include: {
      users_private_messages_sender_idTousers: {
        select: { first_name: true, last_name: true },
      },
      users_private_messages_receiver_idTousers: {
        select: { first_name: true, last_name: true },
      },
    },
  });

  return msgs.map((m) => mapMessage(m));
}

// Mark message as read (real DB update now)
export async function markMessageAsRead(
  messageId: number,
  userId: number
): Promise<PrivateMessageRow | null> {
  // Only the receiver can mark it read
  const existing = await prisma.private_messages.findFirst({
    where: { id: messageId, receiver_id: userId },
    include: {
      users_private_messages_sender_idTousers: {
        select: { first_name: true, last_name: true },
      },
      users_private_messages_receiver_idTousers: {
        select: { first_name: true, last_name: true },
      },
    },
  });

  if (!existing) return null;

  // If already read, return as is
  if (existing.read_at) return mapMessage(existing as PrivateMessageWithUsers);

  const updated = await prisma.private_messages.update({
    where: { id: messageId },
    data: { read_at: new Date() },
    include: {
      users_private_messages_sender_idTousers: {
        select: { first_name: true, last_name: true },
      },
      users_private_messages_receiver_idTousers: {
        select: { first_name: true, last_name: true },
      },
    },
  });

  return mapMessage(updated as PrivateMessageWithUsers);
}
