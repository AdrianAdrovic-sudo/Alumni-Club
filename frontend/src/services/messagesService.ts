// src/services/messagesService.ts
import api from './api';

export interface Message {
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

export interface UserSuggestion {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

// Supports both:
// 1) receiverUsername (single)
// 2) receiverUsernames (multi)
export interface SendMessageData {
  receiverUsername?: string;
  receiverUsernames?: string[];
  subject: string;
  content: string;
}

class MessagesService {
  async getInbox(): Promise<{ messages: Message[] }> {
    const response = await api.get('/messages/inbox');
    return response.data;
  }

  async getSent(): Promise<{ messages: Message[] }> {
    const response = await api.get('/messages/sent');
    return response.data;
  }

  /**
   * POST /api/messages
   * If you send receiverUsernames[], backend will create 1 message per receiver.
   * If you send receiverUsername, backend will create 1 message.
   */
  async sendMessage(
    messageData: SendMessageData
  ): Promise<{ message?: Message; messages?: Message[]; count?: number }> {
    const response = await api.post('/messages', messageData);
    return response.data;
  }

  /**
   * PATCH /api/messages/:id/read
   * Now we store read_at in the database (no more local-only).
   */
  async markAsRead(messageId: number): Promise<{ message: Message }> {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  }

  /**
   * GET /api/messages/users/search?q=...
   * Backend returns { users: [...] }
   */
  async searchUsers(q: string): Promise<{ users: UserSuggestion[] }> {
    const response = await api.get('/messages/users/search', {
      params: { q },
    });
    return response.data;
  }
}

export default new MessagesService();
