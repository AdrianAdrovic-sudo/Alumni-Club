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

  const [deletedInboxIds, setDeletedInboxIds] = useState<number[]>([]);
  const [deletedSentIds, setDeletedSentIds] = useState<number[]>([]);

  useEffect(() => {
    const di = JSON.parse(localStorage.getItem('deletedInboxMessages') || '[]');
    const ds = JSON.parse(localStorage.getItem('deletedSentMessages') || '[]');
    setDeletedInboxIds(di);
    setDeletedSentIds(ds);
  }, []);

  const saveDeletedInbox = (ids: number[]) => {
    setDeletedInboxIds(ids);
    localStorage.setItem('deletedInboxMessages', JSON.stringify(ids));
  };

  const saveDeletedSent = (ids: number[]) => {
    setDeletedSentIds(ids);
    localStorage.setItem('deletedSentMessages', JSON.stringify(ids));
  };

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
    loadMessages();
  };

  const handleDeleteInboxLocal = (id: number) => {
    if (!deletedInboxIds.includes(id)) {
      const updated = [...deletedInboxIds, id];
      saveDeletedInbox(updated);
    }
  };

  const handleDeleteSentLocal = (id: number) => {
    if (!deletedSentIds.includes(id)) {
      const updated = [...deletedSentIds, id];
      saveDeletedSent(updated);
    }
  };

  const visibleInbox = inbox.filter(m => !deletedInboxIds.includes(m.id));
  const visibleSent = sent.filter(m => !deletedSentIds.includes(m.id));

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
              Inbox ({visibleInbox.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'sent'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent ({visibleSent.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50">
          {activeTab === 'inbox' && (
            <Inbox
              messages={visibleInbox}
              onRefresh={loadMessages}
              onDeleteLocal={handleDeleteInboxLocal}
            />
          )}
          {activeTab === 'sent' && (
            <Sent
              messages={visibleSent}
              onDeleteLocal={handleDeleteSentLocal}
            />
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
