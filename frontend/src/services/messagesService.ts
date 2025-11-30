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

export interface SendMessageData {
  receiverUsername: string;
  subject: string;
  content: string;
}

export interface UserSuggestion {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
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

  async sendMessage(messageData: SendMessageData): Promise<{ message: Message }> {
    const response = await api.post('/messages', messageData);
    return response.data;
  }

 async markAsRead(messageId: number): Promise<void> {
  // Read status is handled locally on the frontend (localStorage).
  // No backend call to avoid Prisma / schema issues.
  return;
}


  async searchUsers(query: string): Promise<{ users: UserSuggestion[] }> {
    const response = await api.get('/users/search', {
      params: { query },
    });
    return response.data;
  }
}

export default new MessagesService();
