import React, { useEffect, useState } from 'react';
import MessagesService, { UserSuggestion } from '../../services/messagesService';
import { useLocation } from 'react-router-dom';

interface ComposeMessageProps {
  onMessageSent: () => void;
  onCancel: () => void;
}

export default function ComposeMessage({ onMessageSent, onCancel }: ComposeMessageProps) {
  const [receiverUsername, setReceiverUsername] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  const location = useLocation();

  // Prefill receiver from ?to=username
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const to = params.get('to');
    if (to) {
      setReceiverUsername(to);
      setShowSuggestions(false);
    }
  }, [location]);

  useEffect(() => {
    const q = receiverUsername.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await MessagesService.searchUsers(q);
        setSuggestions(res.users);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error searching users', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [receiverUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiverUsername.trim() || !subject.trim() || !content.trim()) {
      setError('Morate popuniti sva obavezna polja.');
      return;
    }

    try {
      setSending(true);
      setError('');

      await MessagesService.sendMessage({
        receiverUsername: receiverUsername.trim(),
        subject: subject.trim(),
        content: content.trim()
      });

      setReceiverUsername('');
      setSubject('');
      setContent('');
      setSuggestions([]);
      setShowSuggestions(false);

      onMessageSent();
    } catch (error: any) {
      console.error('Greška pri slanju poruke:', error);
      setError(
        error.response?.data?.message ||
        'Greška pri slanju poruke. Provjerite korisničko ime i pokušajte ponovo.'
      );
    } finally {
      setSending(false);
    }
  };

  const handlePickSuggestion = (user: UserSuggestion) => {
    setReceiverUsername(user.username);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Započni novu prepisku</h2>
      <p className="text-gray-600 mb-6">Započnite prepisku sa drugim alumni članom</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Korisničko ime primaoca *
          </label>
          <div className="relative">
            <input
              type="text"
              value={receiverUsername}
              onChange={(e) => {
                setReceiverUsername(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Unesite ime ili korisničko ime primaoca"
              required
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400 text-sm">@</span>
            </div>

            {showSuggestions && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searching && (
                  <div className="px-4 py-2 text-xs text-gray-400">
                    Searching...
                  </div>
                )}
                {!searching && suggestions.length === 0 && receiverUsername.trim().length >= 2 && (
                  <div className="px-4 py-2 text-xs text-gray-400">
                    Korisnik nije pronađen.
                  </div>
                )}
                {suggestions.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handlePickSuggestion(user)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex flex-col"
                  >
                    <span className="font-medium text-gray-800">{user.username}</span>
                    <span className="text-xs text-gray-500">
                      {user.first_name} {user.last_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Na osnovu korisničkog imena, imena ili prezimena izaberite primaoca iz liste.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="O čemu se radi u ovoj prepisci?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poruka *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
            placeholder="Napišite svoju poruku ovdje..."
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition duration-200"
          >
            Poništi
          </button>
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {sending ? 'Slanje...' : 'Pošalji poruku'}
          </button>
        </div>
      </form>
    </div>
  );
}
