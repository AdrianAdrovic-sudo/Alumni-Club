import React, { useState, useEffect } from 'react';
import MessagesService, { Message } from '../../services/messagesService';
import Inbox from './Inbox';
import Sent from './Sent';
import ComposeMessage from './ComposeMessage';
import { Mail, Send, Edit3, Inbox as InboxIcon, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Messages() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sent, setSent] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletedInboxIds, setDeletedInboxIds] = useState<number[]>([]);
  const [deletedSentIds, setDeletedSentIds] = useState<number[]>([]);

  const location = useLocation();

  useEffect(() => {
    const di = JSON.parse(localStorage.getItem('deletedInboxMessages') || '[]');
    const ds = JSON.parse(localStorage.getItem('deletedSentMessages') || '[]');
    setDeletedInboxIds(di);
    setDeletedSentIds(ds);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const to = params.get('to');
    if (to) {
      setActiveTab('compose');
    }
  }, [location]);

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
      <div className="flex justify-center items-center min-h-screen bg-[#294a70]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-[#ffab1f] mx-auto mb-6"></div>
            <Mail className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" size={32} />
          </div>
          <p className="text-white font-semibold text-lg">Učitavanje poruka...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="relative bg-[#294a70] text-white py-20 md:py-28 px-4">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
            <Mail className="text-white" size={40} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Prepiske
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            Ostani u kontaktu sa alumni zajednicom
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
          <div className="bg-linear-to-r from-white to-gray-50 p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`group relative px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 min-w-40
                    ${activeTab === 'inbox'
                      ? 'bg-linear-to-r from-[#294a70] to-[#324D6B] text-white shadow-xl scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border-2 border-gray-200 hover:border-[#294a70]'
                  }`}
                >
                  <InboxIcon size={18} />
                  <span>Primljene</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                    ${activeTab === 'inbox' ? 'bg-white/20' : 'bg-[#ffab1f] text-white'}
                  `}>
                    {visibleInbox.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('sent')}
                  className={`group px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 min-w-40
                    ${activeTab === 'sent'
                      ? 'bg-linear-to-r from-[#294a70] to-[#324D6B] text-white shadow-xl scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border-2 border-gray-200 hover:border-[#294a70]'
                  }`}
                >
                  <Send size={18} />
                  <span>Poslate</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                    ${activeTab === 'sent' ? 'bg-white/20' : 'bg-gray-200 text-gray-700'}
                  `}>
                    {visibleSent.length}
                  </span>
                </button>
              </div>

              {activeTab !== 'compose' && (
                <button
                  onClick={() => setActiveTab('compose')}
                  className="group relative bg-linear-to-r from-[#ffab1f] to-[#ff9500] hover:from-[#ff9500] hover:to-[#ffab1f]
                  text-white px-5 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl 
                  transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden text-sm"
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <Edit3 size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>Nova poruka</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 md:p-10 min-h-[600px]">
            <div className="mb-8">
              <div className="flex items-center gap-3 text-[#294a70]">
                {activeTab === 'inbox' && (
                  <>
                    <InboxIcon size={24} />
                    <h2 className="text-2xl font-bold">Primljene poruke</h2>
                  </>
                )}
                {activeTab === 'sent' && (
                  <>
                    <Send size={24} />
                    <h2 className="text-2xl font-bold">Poslate poruke</h2>
                  </>
                )}
                {activeTab === 'compose' && (
                  <>
                    <Edit3 size={24} />
                    <h2 className="text-2xl font-bold">Napiši novu poruku</h2>
                  </>
                )}
              </div>
              <div className="mt-3 h-1 w-24 bg-linear-to-r from-[#ffab1f] to-[#ff9500] rounded-full"></div>
            </div>

            <div>
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
      </div>
    </div>
  );
}
