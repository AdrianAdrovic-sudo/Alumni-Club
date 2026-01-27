import { useEffect, useState } from "react";
import AdminService, { ContactInquiry } from "../../services/adminService";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function AdminInquiries() {
  const [items, setItems] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await AdminService.getInquiries();
      setItems(list);
    } catch (e: any) {
      setError(e.message || "Neuspješno učitavanje upita");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: number) => {
    try {
      const updated = await AdminService.markInquiryRead(id);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e: any) {
      alert(e.message || "Neuspješno označavanje kao pročitano");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Obrisati poruku?")) return;
    try {
      await AdminService.deleteInquiry(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      alert(e.message || "Neuspješno brisanje");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Upiti</h2>
        <button
          onClick={load}
         className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 transition text-gray-600"

        >
          Osvježi
        </button>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-600">Učitavanje...</div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-10 text-gray-600">
          Nema upita još uvijek.
        </div>
      )}

      <div className="space-y-4">
        {items.map((x) => {
          const unread = !x.read_at;
          return (
            <div
              key={x.id}
              className={`rounded-xl border p-4 transition ${
                unread ? "border-[#ffab1f] bg-[#fff8ea]" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-lg ${unread ? "font-bold" : "font-semibold"} text-gray-800`}>
                      {x.subject}
                    </h3>
                    {unread ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#ffab1f] text-white">
                        NEW
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                        Read
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">{x.full_name}</span> •{" "}
                    <a className="underline" href={`mailto:${x.email}`}>
                      {x.email}
                    </a>
                    {" • "}
                    {formatDate(x.created_at)}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {unread && (
                    <button
                      onClick={() => markRead(x.id)}
                      className="px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => remove(x.id)}
                    className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Obriši
                  </button>
                </div>
              </div>

              <div className="mt-3 text-gray-800 whitespace-pre-wrap">
                {x.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
