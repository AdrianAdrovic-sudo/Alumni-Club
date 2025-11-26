// src/services/messages.service.ts
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

// This matches your schema relation names for private_messages
// and selects only first_name / last_name from users
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

// Helper to map Prisma result → shape expected by frontend
function mapMessage(m: PrivateMessageWithUsers): PrivateMessageRow {
  return {
    id: m.id,
    subject: m.subject,
    content: m.content,
    sent_date: m.sent_date
      ? m.sent_date.toISOString()
      : new Date().toISOString(),
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

// Inbox: messages received by the current user
export async function getInboxMessages(
  userId: number
): Promise<PrivateMessageRow[]> {
  const msgs: PrivateMessageWithUsers[] =
    await prisma.private_messages.findMany({
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
export async function getSentMessages(
  userId: number
): Promise<PrivateMessageRow[]> {
  const msgs: PrivateMessageWithUsers[] =
    await prisma.private_messages.findMany({
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

// Mark message as read
export async function markMessageAsRead(
  messageId: number,
  userId: number
): Promise<PrivateMessageRow | null> {
  // First, update only if this user is the receiver and message is unread
  const updated = await prisma.private_messages.updateMany({
    where: {
      id: messageId,
      receiver_id: userId,
      read_at: null,
    },
    data: {
      read_at: new Date(),
    },
  });

  if (updated.count === 0) {
    // No row matched → either not found, not this user, or already read
    return null;
  }

  // Fetch the updated row with relations
  const msg = await prisma.private_messages.findUnique({
    where: { id: messageId },
    include: {
      users_private_messages_sender_idTousers: {
        select: { first_name: true, last_name: true },
      },
      users_private_messages_receiver_idTousers: {
        select: { first_name: true, last_name: true },
      },
    },
  });

  if (!msg) {
    return null;
  }

  return mapMessage(msg as PrivateMessageWithUsers);
}
