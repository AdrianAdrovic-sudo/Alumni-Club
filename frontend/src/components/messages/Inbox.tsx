// src/components/Messages/Inbox.tsx
import React, { useEffect, useState } from 'react';
import MessagesService, { Message } from '../../services/messagesService';

interface InboxProps {
  messages: Message[];
  onRefresh: () => void;
  onDeleteLocal: (id: number) => void;
}

export default function Inbox({ messages, onRefresh, onDeleteLocal }: InboxProps) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [readIds, setReadIds] = useState<number[]>([]);

  // Load locally stored "read" messages once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('readMessages') || '[]');
    setReadIds(stored);
  }, []);

  const saveReadIds = (ids: number[]) => {
    setReadIds(ids);
    localStorage.setItem('readMessages', JSON.stringify(ids));
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nemate nijednu poruku u sandučetu.</p>
      </div>
    );
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      setBusyId(id);

      // No backend call anymore, we just mark locally
      if (!readIds.includes(id)) {
        const updated = [...readIds, id];
        saveReadIds(updated);
      }

      // If you still want to refresh from backend for new messages, keep this
      await onRefresh();
    } catch (err) {
      console.error('Greška pri označavanju kao pročitano (lokalno):', err);
      alert('Nije bilo moguće označiti poruku kao pročitanu.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Obrišite ovu poruku')) return;
    onDeleteLocal(id);
  };

  return (
    <div className="space-y-4">
      {messages.map(message => {
        // A message is "unread" if it is not in local readIds
        const isUnread = !readIds.includes(message.id);

        return (
          <div
            key={message.id}
            className={`rounded-xl border p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 transition
              ${isUnread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 opacity-80'}
            `}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`text-base ${
                    isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                  }`}
                >
                  {message.subject}
                </h3>
                {isUnread && (
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    New
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-1">
                Poslato od{' '}
                <span className="font-medium text-gray-700">
                  {message.sender_first_name} {message.sender_last_name}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {message.content}
              </p>

              <div className="text-xs text-gray-400">
                Primljeno{' '}
                {new Date(message.sent_date).toLocaleDateString()} at{' '}
                {new Date(message.sent_date).toLocaleTimeString()}
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 md:items-end">
              {isUnread && (
                <button
                  onClick={() => handleMarkAsRead(message.id)}
                  disabled={busyId === message.id}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {busyId === message.id ? 'Učitavanje...' : 'Označi kao pročitano'}
                </button>
              )}
              <button
                onClick={() => handleDelete(message.id)}
                disabled={busyId === message.id}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
