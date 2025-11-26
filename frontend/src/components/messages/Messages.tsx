// src/components/Messages/Messages.tsx
import React, { useState, useEffect } from 'react';
import MessagesService, { Message } from '../../services/messagesService';
import Inbox from './Inbox';
import Sent from './Sent';
import ComposeMessage from './ComposeMessage';

export default function Messages() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sent, setSent] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const [inboxResponse, sentResponse] = await Promise.all([
        MessagesService.getInbox(),
        MessagesService.getSent()
      ]);
      setInbox(inboxResponse.messages);
      setSent(sentResponse.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMessageSent = () => {
    setActiveTab('inbox');
    loadMessages(); // Refresh messages
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center p-6">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            <button
              onClick={() => setActiveTab('compose')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Compose Message
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'inbox'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inbox ({inbox.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'sent'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent ({sent.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'inbox' && (
            <Inbox messages={inbox} onRefresh={loadMessages} />
          )}
          {activeTab === 'sent' && (
            <Sent messages={sent} />
          )}
          {activeTab === 'compose' && (
            <ComposeMessage 
              onMessageSent={handleMessageSent}
              onCancel={() => setActiveTab('inbox')}
            />
          )}
        </div>
      </div>
    </div>
  );
}