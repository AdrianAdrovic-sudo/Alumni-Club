// src/services/messages.service.ts
import { pool } from "../db/pool";

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

// Create a new private message
export async function createPrivateMessage(
  senderId: number,
  receiverId: number,
  subject: string,
  content: string
): Promise<PrivateMessageRow> {
  const query = `
    INSERT INTO private_messages (subject, content, sender_id, receiver_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [subject, content, senderId, receiverId];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Inbox: messages received by the current user
export async function getInboxMessages(
  userId: number
): Promise<PrivateMessageRow[]> {
  const query = `
    SELECT 
      pm.*,
      u_sender.first_name AS sender_first_name,
      u_sender.last_name AS sender_last_name
    FROM private_messages pm
    JOIN users u_sender ON u_sender.id = pm.sender_id
    WHERE pm.receiver_id = $1
    ORDER BY pm.sent_date DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Sent messages: messages sent by the current user
export async function getSentMessages(
  userId: number
): Promise<PrivateMessageRow[]> {
  const query = `
    SELECT 
      pm.*,
      u_receiver.first_name AS receiver_first_name,
      u_receiver.last_name AS receiver_last_name
    FROM private_messages pm
    JOIN users u_receiver ON u_receiver.id = pm.receiver_id
    WHERE pm.sender_id = $1
    ORDER BY pm.sent_date DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Mark message as read
export async function markMessageAsRead(
  messageId: number,
  userId: number
): Promise<PrivateMessageRow | null> {
  const query = `
    UPDATE private_messages
    SET read_at = NOW()
    WHERE id = $1
      AND receiver_id = $2
      AND read_at IS NULL
    RETURNING *
  `;

  const values = [messageId, userId];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}
