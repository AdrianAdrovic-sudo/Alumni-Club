import React, { useEffect, useState } from 'react';
import MessagesService, { UserSuggestion } from '../../services/messagesService';
import { useLocation } from 'react-router-dom';

interface ComposeMessageProps {
  onMessageSent: () => void;
  onCancel: () => void;
}

export default function ComposeMessage({ onMessageSent, onCancel }: ComposeMessageProps) {
  const [toInput, setToInput] = useState('');
  const [selected, setSelected] = useState<UserSuggestion[]>([]);

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
      // Put into input so it triggers search and pick manually if you want
      setToInput(to);
      setShowSuggestions(true);
    }
  }, [location]);

  useEffect(() => {
    const q = toInput.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await MessagesService.searchUsers(q);
        // hide already-selected users from suggestions
        const selectedSet = new Set(selected.map(s => s.username));
        setSuggestions(res.users.filter(u => !selectedSet.has(u.username)));
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error searching users', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [toInput, selected]);

  const handlePickSuggestion = (user: UserSuggestion) => {
    // add chip
    if (!selected.some(s => s.username === user.username)) {
      setSelected([...selected, user]);
    }
    setToInput('');
    setShowSuggestions(false);
  };

  const removeSelected = (username: string) => {
    setSelected(selected.filter(s => s.username !== username));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selected.length === 0 || !subject.trim() || !content.trim()) {
      setError('Morate izabrati bar jednog korisnika i popuniti sva polja.');
      return;
    }

    try {
      setSending(true);
      setError('');

      await MessagesService.sendMessage({
        receiverUsernames: selected.map(s => s.username),
        subject: subject.trim(),
        content: content.trim()
      });

      setToInput('');
      setSelected([]);
      setSubject('');
      setContent('');
      setSuggestions([]);
      setShowSuggestions(false);

      onMessageSent();
    } catch (error: any) {
      console.error('Greška pri slanju poruke:', error);
      setError(
        error.response?.data?.message ||
        'Greška pri slanju poruke. Provjerite korisnike i pokušajte ponovo.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Nova poruka</h2>
        <button
          onClick={onCancel}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Zatvori
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kome šaljete?</label>

          {/* chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selected.map(u => (
                <span
                  key={u.username}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-sm text-blue-900"
                >
                  {u.first_name} {u.last_name} ({u.username})
                  <button
                    type="button"
                    onClick={() => removeSelected(u.username)}
                    className="text-blue-700 hover:text-blue-900"
                    title="Ukloni"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <input
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Kucajte korisničko ime ili ime..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200"
            />

            {showSuggestions && (
              <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
                {searching ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Pretraga...</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Nema rezultata.</div>
                ) : (
                  suggestions.map((u) => (
                    <button
                      type="button"
                      key={u.username}
                      onClick={() => handlePickSuggestion(u)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      <span className="font-medium text-gray-900">
                        {u.first_name} {u.last_name}
                      </span>
                      <span className="text-gray-500"> ({u.username})</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Možete dodati više korisnika. Svako će dobiti privatnu kopiju poruke.
          </p>
        </div>

        {/* SUBJECT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naslov</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Naslov poruke"
          />
        </div>

        {/* CONTENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Poruka</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[140px] rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Napišite poruku..."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Otkaži
          </button>

          <button
            disabled={sending}
            className="rounded-lg px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {sending ? "Slanje..." : "Pošalji"}
          </button>
        </div>
      </form>
    </div>
  );
}
