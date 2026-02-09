// Inbox.tsx (FULL FIXED)
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type Message = {
  id: number;
  subject: string;
  content: string;
  sent_date: string;
  read_at?: string | null;
  sender_id: number;
  receiver_id: number;
};

type Tab = "inbox" | "sent";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_BASE_URL}/api/messages`;

export default function Inbox() {
  const { token } = useAuth();

  const [tab, setTab] = useState<Tab>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadMessages(t: Tab) {
    try {
      if (!API_BASE_URL) throw new Error("VITE_API_URL is not configured.");
      if (!token) throw new Error("Niste prijavljeni.");

      setLoading(true);
      setErrorMsg(null);

      const endpoint = t === "inbox" ? "inbox" : "sent";

      const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Greška pri učitavanju poruka.");
      }

      setMessages(Array.isArray(data) ? data : data.messages ?? []);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Greška");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#294a70]">Inbox</h1>

      <div className="mt-4 flex gap-2">
        <button
          className={`px-3 py-2 rounded-lg border ${tab === "inbox" ? "bg-[#294a70] text-white" : ""}`}
          onClick={() => setTab("inbox")}
        >
          Inbox
        </button>
        <button
          className={`px-3 py-2 rounded-lg border ${tab === "sent" ? "bg-[#294a70] text-white" : ""}`}
          onClick={() => setTab("sent")}
        >
          Sent
        </button>
      </div>

      {loading && <div className="mt-4">Učitavanje...</div>}
      {errorMsg && <div className="mt-4 text-red-600">{errorMsg}</div>}

      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="p-4 border rounded-xl bg-white">
            <div className="font-semibold">{m.subject}</div>
            <div className="text-sm text-gray-600 mt-1">{new Date(m.sent_date).toLocaleString()}</div>
            <div className="mt-2 text-gray-800">{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
