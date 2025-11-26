// src/components/Messages/Inbox.tsx
import React from 'react';
import { Message } from '../../services/messagesService';
import MessagesService from '../../services/messagesService';

interface InboxProps {
  messages: Message[];
  onRefresh: () => void;
}

export default function Inbox({ messages, onRefresh }: InboxProps) {
  const handleMarkAsRead = async (messageId: number) => {
    try {
      await MessagesService.markAsRead(messageId);
      onRefresh(); // Refresh to update read status
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No messages in your inbox</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`border rounded-lg p-4 hover:bg-gray-50 transition duration-200 ${
            !message.read_at ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-gray-900">
                  {message.sender_first_name} {message.sender_last_name}
                </span>
                {!message.read_at && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{message.subject}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {message.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {new Date(message.sent_date).toLocaleDateString()} at{' '}
                  {new Date(message.sent_date).toLocaleTimeString()}
                </span>
                {!message.read_at && (
                  <button
                    onClick={() => handleMarkAsRead(message.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}