// src/components/Messages/Sent.tsx
import React from 'react';
import { Message } from '../../services/messagesService';

interface SentProps {
  messages: Message[];
}

export default function Sent({ messages }: SentProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sent messages</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-sm text-gray-500">To: </span>
                <span className="font-medium text-gray-900">
                  {message.receiver_first_name} {message.receiver_last_name}
                </span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{message.subject}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {message.content}
              </p>
              <div className="text-sm text-gray-500">
                Sent on {new Date(message.sent_date).toLocaleDateString()} at{' '}
                {new Date(message.sent_date).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}